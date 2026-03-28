import { useState, useRef, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import type { CEFRLevel, MediaVocabWord, GrammarExercise } from '../../lib/types';
import type { MediaSession } from '../../db/models';
import { db } from '../../db/database';
import { aiService } from '../../services/ai/aiService';
import { mediaVocabExtractionPrompt, mediaQuizGenerationPrompt } from '../../services/ai/promptTemplates';
import { extractFromUrl, processDirectText } from '../../services/contentExtractor';
import { useProgressStore } from '../../stores/progressStore';
import * as customTopicService from '../../services/customTopicService';

export type MediaStep = 'input' | 'extracting' | 'vocab' | 'quiz' | 'complete';

interface MediaLearningState {
  step: MediaStep;
  title: string;
  originalText: string;
  sourceType: 'url' | 'text';
  sourceUrl?: string;
  vocab: MediaVocabWord[];
  quizExercises: GrammarExercise[];
  quizIndex: number;
  quizResults: { correct: boolean; userAnswer: string }[];
  error: string | null;
  loading: boolean;
}

const initialState: MediaLearningState = {
  step: 'input',
  title: '',
  originalText: '',
  sourceType: 'text',
  vocab: [],
  quizExercises: [],
  quizIndex: 0,
  quizResults: [],
  error: null,
  loading: false,
};

export function useMediaLearning() {
  const [state, setState] = useState<MediaLearningState>(initialState);
  const [sessionVersion, setSessionVersion] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const levelRef = useRef<CEFRLevel>('A2');
  const sessionIdRef = useRef<string>('');
  const stateRef = useRef(state);
  stateRef.current = state;
  const { addXP } = useProgressStore();

  // Load user level
  useEffect(() => {
    db.userProfile.get('default').then(p => {
      if (p?.placementLevel) levelRef.current = p.placementLevel;
    });
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState(initialState);
    sessionIdRef.current = '';
  }, []);

  const processContent = useCallback(async (input: string, mode: 'url' | 'text') => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState(s => ({ ...s, step: 'extracting', loading: true, error: null, sourceType: mode, sourceUrl: mode === 'url' ? input : undefined }));

    try {
      // Step 1: Extract content
      const { title, text } = mode === 'url'
        ? await extractFromUrl(input)
        : processDirectText(input);

      if (controller.signal.aborted) return;
      setState(s => ({ ...s, title, originalText: text }));

      // Step 2: AI extract vocab
      const vocabResponse = await aiService.chat(
        [{ role: 'user', content: mediaVocabExtractionPrompt(text, levelRef.current) }],
        { feature: 'media', maxTokens: 2000, temperature: 0.7, signal: controller.signal },
      );

      if (controller.signal.aborted) return;
      const vocab = await parseAIJson<MediaVocabWord[]>(
        async () => {
          const r = await aiService.chat(
            [{ role: 'user', content: mediaVocabExtractionPrompt(text, levelRef.current) }],
            { feature: 'media', maxTokens: 2000, temperature: 0.7, signal: controller.signal },
          );
          return r.text;
        },
        vocabResponse.text,
        'vocabulary',
      );

      if (!Array.isArray(vocab) || vocab.length === 0) {
        throw new Error('AI returned invalid vocabulary data. Please try again.');
      }

      setState(s => ({ ...s, vocab, step: 'vocab', loading: false }));
    } catch (e) {
      if (controller.signal.aborted) return;
      setState(s => ({
        ...s,
        step: 'input',
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to process content. Please try again.',
      }));
    }
  }, []);

  const generateQuiz = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const quizResponse = await aiService.chat(
        [{ role: 'user', content: mediaQuizGenerationPrompt(state.vocab, levelRef.current) }],
        { feature: 'media', maxTokens: 2000, temperature: 0.7, signal: controller.signal },
      );

      if (controller.signal.aborted) return;
      const exercises = await parseAIJson<GrammarExercise[]>(
        async () => {
          const r = await aiService.chat(
            [{ role: 'user', content: mediaQuizGenerationPrompt(state.vocab, levelRef.current) }],
            { feature: 'media', maxTokens: 2000, temperature: 0.7, signal: controller.signal },
          );
          return r.text;
        },
        quizResponse.text,
        'quiz',
      );

      if (!Array.isArray(exercises) || exercises.length === 0) {
        throw new Error('AI returned invalid quiz data. Please try again.');
      }

      setState(s => ({ ...s, quizExercises: exercises, step: 'quiz', quizIndex: 0, quizResults: [], loading: false }));
    } catch (e) {
      if (controller.signal.aborted) return;
      setState(s => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to generate quiz. Please try again.',
      }));
    }
  }, [state.vocab]);

  const answerQuiz = useCallback((correct: boolean, userAnswer: string) => {
    const s = stateRef.current;
    const newResults = [...s.quizResults, { correct, userAnswer }];
    const nextIndex = s.quizIndex + 1;
    const isComplete = nextIndex >= s.quizExercises.length;

    if (isComplete) {
      const correctCount = newResults.filter(r => r.correct).length;
      const score = Math.round((correctCount / newResults.length) * 100);

      setState(prev => ({ ...prev, quizResults: newResults, quizIndex: nextIndex, step: 'complete' as MediaStep }));

      // Side effects AFTER setState
      if (correct) addXP(10);
      addXP(20);

      const sessionId = nanoid();
      sessionIdRef.current = sessionId;
      const session: MediaSession = {
        id: sessionId,
        createdAt: new Date().toISOString(),
        sourceType: s.sourceType,
        sourceUrl: s.sourceUrl,
        title: s.title,
        originalText: s.originalText,
        extractedVocab: s.vocab,
        quizExercises: s.quizExercises,
        quizScore: score,
        completed: true,
      };
      db.mediaSessions.add(session);
      setSessionVersion(v => v + 1);
    } else {
      setState(prev => ({ ...prev, quizResults: newResults, quizIndex: nextIndex }));

      // Side effect AFTER setState
      if (correct) addXP(10);
    }
  }, [addXP]);

  const saveToMyWords = useCallback(async (words: MediaVocabWord[]) => {
    // Find or create "Media Vocab" topic
    const topics = await customTopicService.getTopics();
    let topic = topics.find(t => t.name === 'Media Vocab');
    let topicId: number;

    if (topic?.id) {
      topicId = topic.id;
    } else {
      topicId = await customTopicService.createTopic('Media Vocab', '📰');
    }

    // Add each word
    for (const w of words) {
      await customTopicService.addWord(topicId, {
        word: w.word,
        ipa: w.ipa,
        meaning: w.meaning,
        example: w.example,
        audioUrl: null,
      });
    }
  }, []);

  const quizScore = state.quizResults.length > 0
    ? Math.round((state.quizResults.filter(r => r.correct).length / state.quizResults.length) * 100)
    : 0;

  return {
    ...state,
    quizScore,
    sessionVersion,
    processContent,
    generateQuiz,
    answerQuiz,
    saveToMyWords,
    reset,
  };
}

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  return cleaned.trim();
}

async function parseAIJson<T>(retry: () => Promise<string>, firstResponse: string, label: string): Promise<T> {
  try {
    return JSON.parse(cleanJsonResponse(firstResponse));
  } catch {
    const retryText = await retry();
    try {
      return JSON.parse(cleanJsonResponse(retryText));
    } catch {
      throw new Error(`Failed to parse ${label} after retry`);
    }
  }
}
