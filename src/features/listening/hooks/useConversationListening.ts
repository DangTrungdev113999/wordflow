import { useState, useEffect, useCallback, useRef } from 'react';
import { generateConversation } from '../../../services/listeningContentService';
import { playAudio, stopAudio } from '../../../services/audioService';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import type { ConversationContent, ComprehensionQuestion } from '../../../db/models';
import { eventBus } from '../../../services/eventBus';

interface QuizAnswer {
  questionIndex: number;
  selectedIndex: number;
  correct: boolean;
}

interface UseConversationListeningReturn {
  // State
  content: ConversationContent | null;
  loading: boolean;
  error: string | null;
  // Playback
  phase: 'listening' | 'quiz';
  currentLineIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  // Playback controls
  playAll: () => void;
  pause: () => void;
  playLine: (index: number) => void;
  prevLine: () => void;
  nextLine: () => void;
  // Quiz
  startQuiz: () => void;
  currentQuestionIndex: number;
  quizAnswers: QuizAnswer[];
  submitQuizAnswer: (selectedIndex: number) => void;
  nextQuestion: () => void;
  isQuizComplete: boolean;
  correctCount: number;
  xpEarned: number;
  // Translation toggle
  showTranslation: boolean;
  toggleTranslation: () => void;
}

const XP_PER_CORRECT = 15;
const PERFECT_BONUS = 20;

export function useConversationListening(topic: string): UseConversationListeningReturn {
  const [content, setContent] = useState<ConversationContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [phase, setPhase] = useState<'listening' | 'quiz'>('listening');
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [showTranslation, setShowTranslation] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const playingRef = useRef(false);

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

    generateConversation(topic, topicData.words, topicData.cefrLevel)
      .then(result => {
        if (!cancelled) {
          setContent(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to generate conversation. Please check your AI API key in Settings.');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [topic]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopAudio();
    };
  }, []);

  const getVoice = useCallback((speaker: string): string => {
    if (!content) return 'female';
    const s = content.speakers.find(sp => sp.name === speaker);
    return s?.voice ?? 'female';
  }, [content]);

  const playLine = useCallback(async (index: number) => {
    if (!content || index < 0 || index >= content.lines.length) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setCurrentLineIndex(index);
    setIsPlaying(true);
    playingRef.current = true;

    const line = content.lines[index];
    await playAudio(line.text, {
      rate: playbackSpeed,
      voice: getVoice(line.speaker),
      signal: ac.signal,
      onEnd: () => {
        setIsPlaying(false);
        playingRef.current = false;
      },
    });
  }, [content, playbackSpeed, getVoice]);

  const playAll = useCallback(async () => {
    if (!content) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    playingRef.current = true;
    setIsPlaying(true);

    for (let i = 0; i < content.lines.length; i++) {
      if (ac.signal.aborted) break;

      setCurrentLineIndex(i);
      const line = content.lines[i];

      await playAudio(line.text, {
        rate: playbackSpeed,
        voice: getVoice(line.speaker),
        signal: ac.signal,
      });

      if (ac.signal.aborted) break;
      // Pause between lines
      await new Promise<void>(resolve => {
        const timer = setTimeout(resolve, 800);
        ac.signal.addEventListener('abort', () => { clearTimeout(timer); resolve(); }, { once: true });
      });
    }

    if (!ac.signal.aborted) {
      setIsPlaying(false);
      playingRef.current = false;
    }
  }, [content, playbackSpeed, getVoice]);

  const pause = useCallback(() => {
    abortRef.current?.abort();
    setIsPlaying(false);
    playingRef.current = false;
    stopAudio();
  }, []);

  const prevLine = useCallback(() => {
    if (!content) return;
    const newIndex = Math.max(0, currentLineIndex - 1);
    playLine(newIndex);
  }, [content, currentLineIndex, playLine]);

  const nextLine = useCallback(() => {
    if (!content) return;
    const newIndex = Math.min(content.lines.length - 1, currentLineIndex + 1);
    playLine(newIndex);
  }, [content, currentLineIndex, playLine]);

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

  // Emit event on quiz complete
  useEffect(() => {
    if (isQuizComplete) {
      eventBus.emit('listening:conversation', { topic, questionsCorrect: correctCount, totalQuestions });
    }
  }, [isQuizComplete, topic, correctCount]);

  const toggleTranslation = useCallback(() => {
    setShowTranslation(prev => !prev);
  }, []);

  const currentQuestion: ComprehensionQuestion | undefined = content?.questions[currentQuestionIndex];
  const currentAnswer = quizAnswers.find(a => a.questionIndex === currentQuestionIndex);

  return {
    content,
    loading,
    error,
    phase,
    currentLineIndex,
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    playAll,
    pause,
    playLine,
    prevLine,
    nextLine,
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
