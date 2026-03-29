import { useState, useCallback, useRef } from 'react';

export interface StreakState {
  /** Current consecutive correct answers */
  streak: number;
  /** Best streak this session */
  bestStreak: number;
  /** XP multiplier based on current streak */
  multiplier: number;
  /** Total bonus XP earned from streaks this session */
  totalStreakBonus: number;
}

function getMultiplier(streak: number): number {
  if (streak >= 10) return 2;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.2;
  return 1;
}

/**
 * Shared hook for tracking answer streaks across ALL vocab sessions.
 * Works with flashcard, quiz, context, mixed review — any mode that
 * reports correct/incorrect per word.
 */
export function useSessionStreak() {
  const [state, setState] = useState<StreakState>({
    streak: 0,
    bestStreak: 0,
    multiplier: 1,
    totalStreakBonus: 0,
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  /**
   * Call after each answer. Returns the bonus XP earned from streak
   * (caller adds this on top of base XP).
   */
  const recordAnswer = useCallback((correct: boolean, baseXP: number): number => {
    if (!correct) {
      setState(prev => ({
        ...prev,
        streak: 0,
        multiplier: 1,
      }));
      return 0;
    }

    const newStreak = stateRef.current.streak + 1;
    const mult = getMultiplier(newStreak);
    const bonusXP = Math.round(baseXP * (mult - 1));

    setState(prev => ({
      streak: newStreak,
      bestStreak: Math.max(prev.bestStreak, newStreak),
      multiplier: mult,
      totalStreakBonus: prev.totalStreakBonus + bonusXP,
    }));

    return bonusXP;
  }, []);

  const reset = useCallback(() => {
    setState({ streak: 0, bestStreak: 0, multiplier: 1, totalStreakBonus: 0 });
  }, []);

  return { ...state, recordAnswer, reset };
}
