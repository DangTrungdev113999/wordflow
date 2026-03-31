import { useState, useEffect, useCallback, useRef } from 'react';
import { generateStory } from '../../../services/listeningContentService';
import { playAudio, stopAudio } from '../../../services/audioService';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import type { StoryContent } from '../../../db/models';
import { eventBus } from '../../../services/eventBus';

interface QuizAnswer {
  questionIndex: number;
  selectedIndex: number;
  correct: boolean;
}

interface UseStoryListeningReturn {
  content: StoryContent | null;
  loading: boolean;
  error: string | null;
  // Playback
  phase: 'listening' | 'quiz';
  currentParagraphIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  // Controls
  playAll: () => void;
  pause: () => void;
  playParagraph: (index: number) => void;
  prevParagraph: () => void;
  nextParagraph: () => void;
  // Quiz
  startQuiz: () => void;
  currentQuestionIndex: number;
  quizAnswers: QuizAnswer[];
  submitQuizAnswer: (selectedIndex: number) => void;
  nextQuestion: () => void;
  isQuizComplete: boolean;
  correctCount: number;
  xpEarned: number;
  // Translation
  showTranslation: boolean;
  toggleTranslation: () => void;
}

const XP_PER_CORRECT = 15;
const PERFECT_BONUS = 20;

export function useStoryListening(topic: string): UseStoryListeningReturn {
  const [content, setContent] = useState<StoryContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [phase, setPhase] = useState<'listening' | 'quiz'>('listening');
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [showTranslation, setShowTranslation] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // Load content
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const topicData = ALL_TOPICS.find(t => t.topic === topic);
    if (!topicData) {
      setError('Topic not found');
      setLoading(false);
      return;
    }

    generateStory(topic, topicData.words, topicData.cefrLevel)
      .then(result => {
        if (!cancelled) {
          setContent(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to generate story. Please check your AI API key in Settings.');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [topic]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopAudio();
    };
  }, []);

  const playParagraph = useCallback(async (index: number) => {
    if (!content || index < 0 || index >= content.paragraphs.length) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setCurrentParagraphIndex(index);
    setIsPlaying(true);

    await playAudio(content.paragraphs[index], {
      rate: playbackSpeed,
      voice: 'female',
      signal: ac.signal,
      onEnd: () => setIsPlaying(false),
    });
  }, [content, playbackSpeed]);

  const playAll = useCallback(async () => {
    if (!content) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setIsPlaying(true);

    for (let i = 0; i < content.paragraphs.length; i++) {
      if (ac.signal.aborted) break;

      setCurrentParagraphIndex(i);

      await playAudio(content.paragraphs[i], {
        rate: playbackSpeed,
        voice: 'female',
        signal: ac.signal,
      });

      if (ac.signal.aborted) break;
      // Pause between paragraphs
      await new Promise<void>(resolve => {
        const timer = setTimeout(resolve, 1200);
        ac.signal.addEventListener('abort', () => { clearTimeout(timer); resolve(); }, { once: true });
      });
    }

    if (!ac.signal.aborted) {
      setIsPlaying(false);
    }
  }, [content, playbackSpeed]);

  const pause = useCallback(() => {
    abortRef.current?.abort();
    setIsPlaying(false);
    stopAudio();
  }, []);

  const prevParagraph = useCallback(() => {
    if (!content) return;
    const idx = Math.max(0, currentParagraphIndex - 1);
    playParagraph(idx);
  }, [content, currentParagraphIndex, playParagraph]);

  const nextParagraph = useCallback(() => {
    if (!content) return;
    const idx = Math.min(content.paragraphs.length - 1, currentParagraphIndex + 1);
    playParagraph(idx);
  }, [content, currentParagraphIndex, playParagraph]);

  const startQuiz = useCallback(() => {
    pause();
    setPhase('quiz');
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
  }, [pause]);

  const submitQuizAnswer = useCallback((selectedIndex: number) => {
    if (!content) return;
    const q = content.questions[currentQuestionIndex];
    if (!q) return;

    const correct = selectedIndex === q.correctIndex;
    setQuizAnswers(prev => [...prev, {
      questionIndex: currentQuestionIndex,
      selectedIndex,
      correct,
    }]);
  }, [content, currentQuestionIndex]);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

  const totalQuestions = content?.questions.length ?? 0;
  const isQuizComplete = quizAnswers.length === totalQuestions && totalQuestions > 0;
  const correctCount = quizAnswers.filter(a => a.correct).length;
  const xpEarned = correctCount * XP_PER_CORRECT + (correctCount === totalQuestions ? PERFECT_BONUS : 0);

  useEffect(() => {
    if (isQuizComplete) {
      eventBus.emit('listening:story', { topic, questionsCorrect: correctCount, totalQuestions });
    }
  }, [isQuizComplete, topic, correctCount]);

  const toggleTranslation = useCallback(() => {
    setShowTranslation(prev => !prev);
  }, []);

  return {
    content,
    loading,
    error,
    phase,
    currentParagraphIndex,
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    playAll,
    pause,
    playParagraph,
    prevParagraph,
    nextParagraph,
    startQuiz,
    currentQuestionIndex,
    quizAnswers,
    submitQuizAnswer,
    nextQuestion,
    isQuizComplete,
    correctCount,
    xpEarned,
    showTranslation,
    toggleTranslation,
  };
}
