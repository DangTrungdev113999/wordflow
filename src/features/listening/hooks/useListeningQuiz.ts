import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { eventBus } from '../../../services/eventBus';
import { XP_VALUES } from '../../../lib/constants';
import type { VocabWord } from '../../../lib/types';

export interface QuizQuestion {
  word: VocabWord;
  options: string[];
  correctIndex: number;
}

export interface QuizAnswerResult {
  question: QuizQuestion;
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

function generateDistractors(
  correctWord: VocabWord,
_topicWords: VocabWord[],
  cefrLevel: string,
  count: number,
): string[] {
  // First: try words from the same CEFR level (excluding current topic words to add variety)
  const sameLevelWords = ALL_TOPICS
    .filter(t => t.cefrLevel === cefrLevel)
    .flatMap(t => t.words)
    .filter(w => w.word !== correctWord.word);

  // Fallback: all words from all topics
  const allWords = ALL_TOPICS
    .flatMap(t => t.words)
    .filter(w => w.word !== correctWord.word);

  const pool = sameLevelWords.length >= count ? sameLevelWords : allWords;

  const uniqueWords = new Map<string, string>();
  for (const w of shuffle(pool)) {
    if (!uniqueWords.has(w.word.toLowerCase()) && w.word.toLowerCase() !== correctWord.word.toLowerCase()) {
      uniqueWords.set(w.word.toLowerCase(), w.word);
    }
    if (uniqueWords.size >= count) break;
  }

  return Array.from(uniqueWords.values()).slice(0, count);
}

export function useListeningQuiz(topic: string) {
  const questions = useMemo<QuizQuestion[]>(() => {
    const topicData = ALL_TOPICS.find(t => t.topic === topic);
    if (!topicData) return [];

    const cefrLevel = topicData.cefrLevel;
    const selected = shuffle(topicData.words).slice(0, 10);

    return selected.map(word => {
      const distractors = generateDistractors(word, topicData.words, cefrLevel, 3);
      const options = shuffle([word.word, ...distractors]);
      const correctIndex = options.indexOf(word.word);
      return { word, options, correctIndex };
    });
  }, [topic]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerResult[]>([]);
  const answersRef = useRef<QuizAnswerResult[]>([]);
  const [lastResult, setLastResult] = useState<QuizAnswerResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex] ?? null;
  const total = questions.length;

  const submitAnswer = useCallback((selectedIndex: number) => {
    if (!currentQuestion) return;
    const correct = selectedIndex === currentQuestion.correctIndex;
    const result: QuizAnswerResult = { question: currentQuestion, selectedIndex, correct };

    setLastResult(result);
    answersRef.current = [...answersRef.current, result];
    setAnswers(prev => [...prev, result]);

    const wordId = `${topic}:${currentQuestion.word.word}`;

    if (correct) {
      eventBus.emit('dictation:correct', { wordId, mode: 'quiz' });
    } else {
      eventBus.emit('dictation:incorrect', { wordId, mode: 'quiz' });
    }
  }, [currentQuestion, topic]);

  const next = useCallback(() => {
    setLastResult(null);
    if (currentIndex + 1 >= total) {
      setIsComplete(true);
      const finalCorrect = answersRef.current.filter(a => a.correct).length;
      eventBus.emit('dictation:session_complete', { correct: finalCorrect, total, mode: 'quiz' });
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, total]);

  const correctCount = answers.filter(a => a.correct).length;
  const xpEarned = correctCount * XP_VALUES.dictation_correct
    + (isComplete && correctCount === total ? XP_VALUES.dictation_session_perfect : 0);

  const incorrectAnswers = answers
    .filter(a => !a.correct)
    .map(a => ({
      item: { word: a.question.word, target: a.question.word.word },
      userAnswer: a.question.options[a.selectedIndex],
      correct: false,
    }));

  // Emit mistakes when session completes
  const mistakeEmittedRef = useRef(false);
  useEffect(() => {
    if (!isComplete || mistakeEmittedRef.current) return;
    if (incorrectAnswers.length === 0) return;
    mistakeEmittedRef.current = true;
    eventBus.emit('mistakes:collected', {
      source: 'listening-quiz',
      mistakes: incorrectAnswers.map(a => ({
        type: 'listening' as const,
        question: `What word did you hear? (${a.item.word.meaning})`,
        userAnswer: a.userAnswer,
        correctAnswer: a.item.target,
      })),
    });
  }, [isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    currentQuestion,
    currentIndex,
    total,
    lastResult,
    isComplete,
    answers,
    correctCount,
    xpEarned,
    incorrectAnswers,
    submitAnswer,
    next,
  };
}
