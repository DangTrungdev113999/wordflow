import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { eventBus } from '../../../services/eventBus';
import { XP_VALUES } from '../../../lib/constants';
import type { VocabWord } from '../../../lib/types';

export type ListenChooseVariant = 'word-to-sentence' | 'sentence-to-word';

export interface ListenChooseQuestion {
  audio: string;
  audioRate: number;
  question: string;
  options: string[];
  correctIndex: number;
  word: VocabWord;
  variant: ListenChooseVariant;
}

interface ChooseAnswerResult {
  question: ListenChooseQuestion;
  selectedIndex: number;
  correct: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateSentenceDistractors(
  correctWord: VocabWord,
  allWords: VocabWord[],
  count: number,
): string[] {
  const pool = allWords.filter(w => w.word !== correctWord.word && w.example !== correctWord.example);
  const shuffled = shuffle(pool);
  const sentences = new Set<string>();
  for (const w of shuffled) {
    if (w.example && !sentences.has(w.example)) {
      sentences.add(w.example);
    }
    if (sentences.size >= count) break;
  }
  return Array.from(sentences).slice(0, count);
}

function generateWordDistractors(
  correctWord: VocabWord,
  topicWords: VocabWord[],
  cefrLevel: string,
  count: number,
): string[] {
  const sameLevelWords = ALL_TOPICS
    .filter(t => t.cefrLevel === cefrLevel)
    .flatMap(t => t.words)
    .filter(w => w.word !== correctWord.word);

  const pool = sameLevelWords.length >= count ? sameLevelWords : topicWords.filter(w => w.word !== correctWord.word);
  const unique = new Map<string, string>();
  for (const w of shuffle(pool)) {
    if (!unique.has(w.word.toLowerCase())) {
      unique.set(w.word.toLowerCase(), w.word);
    }
    if (unique.size >= count) break;
  }
  return Array.from(unique.values()).slice(0, count);
}

export function useListenChoose(topic: string) {
  const questions = useMemo<ListenChooseQuestion[]>(() => {
    const topicData = ALL_TOPICS.find(t => t.topic === topic);
    if (!topicData) return [];

    const cefrLevel = topicData.cefrLevel;
    const allTopicWords = topicData.words;
    const allWords = ALL_TOPICS.flatMap(t => t.words);
    const selected = shuffle(allTopicWords).slice(0, 10);

    return selected.map((word, i) => {
      const variant: ListenChooseVariant = i % 2 === 0 ? 'word-to-sentence' : 'sentence-to-word';

      if (variant === 'word-to-sentence') {
        const distractors = generateSentenceDistractors(word, allWords, 3);
        const options = shuffle([word.example, ...distractors]);
        return {
          audio: word.word,
          audioRate: 1.0,
          question: 'Câu nào chứa từ bạn vừa nghe?',
          options,
          correctIndex: options.indexOf(word.example),
          word,
          variant,
        };
      } else {
        const distractors = generateWordDistractors(word, allTopicWords, cefrLevel, 3);
        const options = shuffle([word.word, ...distractors]);
        return {
          audio: word.example,
          audioRate: 0.9,
          question: 'Bạn vừa nghe từ nào trong câu?',
          options,
          correctIndex: options.indexOf(word.word),
          word,
          variant,
        };
      }
    });
  }, [topic]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ChooseAnswerResult[]>([]);
  const answersRef = useRef<ChooseAnswerResult[]>([]);
  const [lastResult, setLastResult] = useState<ChooseAnswerResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex] ?? null;
  const total = questions.length;

  const submitAnswer = useCallback((selectedIndex: number) => {
    if (!currentQuestion) return;
    const correct = selectedIndex === currentQuestion.correctIndex;
    const result: ChooseAnswerResult = { question: currentQuestion, selectedIndex, correct };

    setLastResult(result);
    answersRef.current = [...answersRef.current, result];
    setAnswers(prev => [...prev, result]);

    const wordId = `${topic}:${currentQuestion.word.word}`;
    eventBus.emit(correct ? 'dictation:correct' : 'dictation:incorrect', { wordId, mode: 'listen-choose' });
  }, [currentQuestion, topic]);

  const next = useCallback(() => {
    setLastResult(null);
    if (currentIndex + 1 >= total) {
      setIsComplete(true);
      const finalCorrect = answersRef.current.filter(a => a.correct).length;
      eventBus.emit('dictation:session_complete', { correct: finalCorrect, total, mode: 'listen-choose' });
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, total]);

  // Emit mistakes when complete
  const mistakeEmittedRef = useRef(false);
  useEffect(() => {
    if (!isComplete || mistakeEmittedRef.current) return;
    const incorrect = answersRef.current.filter(a => !a.correct);
    if (incorrect.length === 0) return;
    mistakeEmittedRef.current = true;
    eventBus.emit('mistakes:collected', {
      source: 'listen-choose',
      mistakes: incorrect.map(a => ({
        type: 'listening' as const,
        question: `${a.question.question} (${a.question.word.word})`,
        userAnswer: a.question.options[a.selectedIndex],
        correctAnswer: a.question.variant === 'word-to-sentence'
          ? a.question.word.example
          : a.question.word.word,
      })),
    });
  }, [isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  const correctCount = answers.filter(a => a.correct).length;
  const xpEarned = correctCount * XP_VALUES.dictation_correct
    + (isComplete && correctCount === total ? XP_VALUES.dictation_session_perfect : 0);

  const incorrectAnswers = answers.filter(a => !a.correct).map(a => ({
    item: { word: a.question.word, target: a.question.word.word },
    userAnswer: a.question.options[a.selectedIndex],
    correct: false,
  }));

  return {
    currentQuestion,
    currentIndex,
    total,
    lastResult,
    isComplete,
    correctCount,
    xpEarned,
    incorrectAnswers,
    submitAnswer,
    next,
  };
}
