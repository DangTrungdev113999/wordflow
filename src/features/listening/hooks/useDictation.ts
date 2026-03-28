import { useState, useMemo, useCallback, useRef } from 'react';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { eventBus } from '../../../services/eventBus';
import { XP_VALUES } from '../../../lib/constants';
import type { DictationMode, VocabWord } from '../../../lib/types';

interface DictationItem {
  word: VocabWord;
  target: string;
}

interface AnswerResult {
  item: DictationItem;
  userAnswer: string;
  correct: boolean;
}

function extractPhrase(example: string, targetWord: string): string {
  const words = example.replace(/[.,!?;:'"]/g, '').split(/\s+/);
  const idx = words.findIndex(w => w.toLowerCase() === targetWord.toLowerCase());
  if (idx === -1) return targetWord;
  const start = Math.max(0, idx - 1);
  const end = Math.min(words.length, idx + 2);
  return words.slice(start, end).join(' ');
}

function checkAnswer(input: string, target: string): boolean {
  const normalized = input.toLowerCase().trim().replace(/\s+/g, ' ');
  const expected = target.toLowerCase().trim().replace(/\s+/g, ' ');
  return normalized === expected;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useDictation(topic: string, mode: DictationMode) {
  const items = useMemo<DictationItem[]>(() => {
    const topicData = ALL_TOPICS.find(t => t.topic === topic);
    if (!topicData) return [];
    const selected = shuffle(topicData.words).slice(0, 10);
    return selected.map(word => {
      let target: string;
      switch (mode) {
        case 'phrase':
          target = extractPhrase(word.example, word.word);
          break;
        case 'sentence':
          target = word.example;
          break;
        default:
          target = word.word;
      }
      return { word, target };
    });
  }, [topic, mode]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const answersRef = useRef<AnswerResult[]>([]);
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const currentItem = items[currentIndex] ?? null;
  const total = items.length;

  const submitAnswer = useCallback((input: string) => {
    if (!currentItem) return;
    const correct = checkAnswer(input, currentItem.target);
    const result: AnswerResult = { item: currentItem, userAnswer: input, correct };
    setLastResult(result);
    answersRef.current = [...answersRef.current, result];
    setAnswers(prev => [...prev, result]);

    const wordId = `${topic}:${currentItem.word.word}`;

    if (correct) {
      eventBus.emit('dictation:correct', { wordId, mode });
    } else {
      eventBus.emit('dictation:incorrect', { wordId, mode });
    }
  }, [currentItem, topic, mode]);

  const next = useCallback(() => {
    setLastResult(null);
    if (currentIndex + 1 >= total) {
      setIsComplete(true);
      const finalCorrect = answersRef.current.filter(a => a.correct).length;
      eventBus.emit('dictation:session_complete', { correct: finalCorrect, total, mode });

      // Emit mistakes for incorrect answers
      const incorrect = answersRef.current.filter(a => !a.correct);
      if (incorrect.length > 0) {
        eventBus.emit('mistakes:collected', {
          source: 'dictation',
          mistakes: incorrect.map(a => ({
            type: 'listening' as const,
            question: `Listen and type: "${a.item.target}"`,
            userAnswer: a.userAnswer,
            correctAnswer: a.item.target,
          })),
        });
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, total, mode]);

  const correctCount = answers.filter(a => a.correct).length;
  const xpEarned = correctCount * XP_VALUES.dictation_correct + (isComplete && correctCount === total ? XP_VALUES.dictation_session_perfect : 0);
  const incorrectAnswers = answers.filter(a => !a.correct);

  return {
    currentItem,
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
