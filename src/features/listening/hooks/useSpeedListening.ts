import { useState, useMemo, useCallback, useRef } from 'react';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { eventBus } from '../../../services/eventBus';
import { XP_VALUES } from '../../../lib/constants';
import type { VocabWord } from '../../../lib/types';

export interface SpeedItem {
  word: VocabWord;
  target: string;
}

interface SpeedAnswerResult {
  item: SpeedItem;
  userAnswer: string;
  correct: boolean;
  round: number;
}

export const SPEED_LEVELS = [
  { speed: 0.75, label: 'Chậm', bonusXP: 0 },
  { speed: 1.0,  label: 'Bình thường', bonusXP: 2 },
  { speed: 1.25, label: 'Nhanh', bonusXP: 5 },
  { speed: 1.5,  label: 'Rất nhanh', bonusXP: 8 },
] as const;

const ITEMS_PER_ROUND = 3;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useSpeedListening(topic: string) {
  const items = useMemo<SpeedItem[]>(() => {
    const topicData = ALL_TOPICS.find(t => t.topic === topic);
    if (!topicData) return [];
    const selected = shuffle(topicData.words).slice(0, 12);
    return selected.map(word => ({ word, target: word.word }));
  }, [topic]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<SpeedAnswerResult[]>([]);
  const answersRef = useRef<SpeedAnswerResult[]>([]);
  const [lastResult, setLastResult] = useState<SpeedAnswerResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [showSlowDownOffer, setShowSlowDownOffer] = useState(false);
  const [speedOverride, setSpeedOverride] = useState<number | null>(null);

  const total = items.length;
  const currentItem = items[currentIndex] ?? null;
  const currentRound = Math.floor(currentIndex / ITEMS_PER_ROUND);
  const itemInRound = currentIndex % ITEMS_PER_ROUND;

  const currentLevel = SPEED_LEVELS[Math.min(currentRound, SPEED_LEVELS.length - 1)];
  const currentSpeed = speedOverride ?? currentLevel.speed;

  const submitAnswer = useCallback((input: string) => {
    if (!currentItem) return;
    const normalized = input.toLowerCase().trim().replace(/\s+/g, ' ');
    const expected = currentItem.target.toLowerCase().trim().replace(/\s+/g, ' ');
    const correct = normalized === expected;
    const result: SpeedAnswerResult = { item: currentItem, userAnswer: input, correct, round: currentRound };

    setLastResult(result);
    answersRef.current = [...answersRef.current, result];
    setAnswers(prev => [...prev, result]);

    const wordId = `${topic}:${currentItem.word.word}`;
    eventBus.emit(correct ? 'dictation:correct' : 'dictation:incorrect', { wordId, mode: 'speed' });

    if (correct) {
      setConsecutiveWrong(0);
      setShowSlowDownOffer(false);
    } else {
      setConsecutiveWrong(prev => {
        const next = prev + 1;
        if (next >= 3) setShowSlowDownOffer(true);
        return next;
      });
    }
  }, [currentItem, topic, currentRound]);

  const acceptSlowDown = useCallback(() => {
    const prevLevelIdx = Math.max(0, currentRound - 1);
    setSpeedOverride(SPEED_LEVELS[prevLevelIdx].speed);
    setConsecutiveWrong(0);
    setShowSlowDownOffer(false);
  }, [currentRound]);

  const dismissSlowDown = useCallback(() => {
    setConsecutiveWrong(0);
    setShowSlowDownOffer(false);
  }, []);

  const next = useCallback(() => {
    setLastResult(null);
    if (currentIndex + 1 >= total) {
      setIsComplete(true);
      const finalCorrect = answersRef.current.filter(a => a.correct).length;
      eventBus.emit('dictation:session_complete', { correct: finalCorrect, total, mode: 'speed' });

      const incorrect = answersRef.current.filter(a => !a.correct);
      if (incorrect.length > 0) {
        eventBus.emit('mistakes:collected', {
          source: 'speed-listening',
          mistakes: incorrect.map(a => ({
            type: 'listening' as const,
            question: `Speed listening (${SPEED_LEVELS[a.round]?.speed ?? 1}x): "${a.item.target}"`,
            userAnswer: a.userAnswer,
            correctAnswer: a.item.target,
          })),
        });
      }
    } else {
      // Reset speed override when entering new round
      if ((currentIndex + 1) % ITEMS_PER_ROUND === 0) {
        setSpeedOverride(null);
      }
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, total]);

  // XP: base 10 + speed bonus for each correct answer
  const xpEarned = useMemo(() => {
    let xp = 0;
    for (const a of answers) {
      if (a.correct) {
        xp += XP_VALUES.dictation_correct + SPEED_LEVELS[Math.min(a.round, SPEED_LEVELS.length - 1)].bonusXP;
      }
    }
    if (isComplete && answers.every(a => a.correct) && answers.length === total) {
      xp += XP_VALUES.dictation_session_perfect;
    }
    return xp;
  }, [answers, isComplete, total]);

  const correctCount = answers.filter(a => a.correct).length;
  const incorrectAnswers = answers.filter(a => !a.correct).map(a => ({
    item: { word: a.item.word, target: a.item.target },
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
    // Speed-specific
    currentRound,
    itemInRound,
    currentSpeed,
    currentLevel,
    showSlowDownOffer,
    acceptSlowDown,
    dismissSlowDown,
  };
}
