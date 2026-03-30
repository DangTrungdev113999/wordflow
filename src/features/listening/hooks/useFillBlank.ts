import { useState, useMemo, useCallback, useRef } from 'react';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { eventBus } from '../../../services/eventBus';
import { XP_VALUES } from '../../../lib/constants';
import type { VocabWord } from '../../../lib/types';

export interface FillBlankItem {
  word: VocabWord;
  sentence: string;
  blankedSentence: string;
  answers: string[];
}

interface FillBlankAnswerResult {
  item: FillBlankItem;
  userAnswer: string;
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

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function blankWord(sentence: string, word: string): { blanked: string; found: boolean } {
  const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'i');
  if (!regex.test(sentence)) return { blanked: sentence, found: false };
  const blanked = sentence.replace(regex, '_'.repeat(Math.max(word.length, 5)));
  return { blanked, found: true };
}

export function useFillBlank(topic: string) {
  const items = useMemo<FillBlankItem[]>(() => {
    const topicData = ALL_TOPICS.find(t => t.topic === topic);
    if (!topicData) return [];

    const wordsWithExamples = topicData.words.filter(w => {
      const regex = new RegExp(`\\b${escapeRegex(w.word)}\\b`, 'i');
      return regex.test(w.example);
    });

    const pool = wordsWithExamples.length >= 10 ? wordsWithExamples : topicData.words;
    const selected = shuffle(pool).slice(0, 10);

    return selected.map(word => {
      const { blanked, found } = blankWord(word.example, word.word);
      return {
        word,
        sentence: word.example,
        blankedSentence: found ? blanked : word.example.replace(word.word, '_'.repeat(Math.max(word.word.length, 5))),
        answers: [word.word],
      };
    });
  }, [topic]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<FillBlankAnswerResult[]>([]);
  const answersRef = useRef<FillBlankAnswerResult[]>([]);
  const [lastResult, setLastResult] = useState<FillBlankAnswerResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const currentItem = items[currentIndex] ?? null;
  const total = items.length;

  const submitAnswer = useCallback((input: string) => {
    if (!currentItem) return;
    const normalized = input.toLowerCase().trim();
    const correct = currentItem.answers.some(a => a.toLowerCase().trim() === normalized);
    const result: FillBlankAnswerResult = { item: currentItem, userAnswer: input, correct };

    setLastResult(result);
    answersRef.current = [...answersRef.current, result];
    setAnswers(prev => [...prev, result]);

    const wordId = `${topic}:${currentItem.word.word}`;
    eventBus.emit(correct ? 'dictation:correct' : 'dictation:incorrect', { wordId, mode: 'fill-blank' });
  }, [currentItem, topic]);

  const next = useCallback(() => {
    setLastResult(null);
    if (currentIndex + 1 >= total) {
      setIsComplete(true);
      const finalCorrect = answersRef.current.filter(a => a.correct).length;
      eventBus.emit('dictation:session_complete', { correct: finalCorrect, total, mode: 'fill-blank' });

      const incorrect = answersRef.current.filter(a => !a.correct);
      if (incorrect.length > 0) {
        eventBus.emit('mistakes:collected', {
          source: 'fill-blank',
          mistakes: incorrect.map(a => ({
            type: 'listening' as const,
            question: `Fill in the blank: "${a.item.blankedSentence}"`,
            userAnswer: a.userAnswer,
            correctAnswer: a.item.answers[0],
          })),
        });
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, total]);

  const correctCount = answers.filter(a => a.correct).length;
  const xpEarned = correctCount * XP_VALUES.dictation_correct
    + (isComplete && correctCount === total ? XP_VALUES.dictation_session_perfect : 0);
  const incorrectAnswers = answers.filter(a => !a.correct).map(a => ({
    item: { word: a.item.word, target: a.item.answers[0] },
    userAnswer: a.userAnswer,
    correct: false,
  }));

  return {
    currentItem,
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
