import { XP_VALUES } from '../lib/constants';

export type XPAction =
  | 'flashcard_correct'
  | 'flashcard_easy'
  | 'flashcard_hard'
  | 'quiz_correct'
  | 'quiz_perfect_score'
  | 'lesson_complete'
  | 'daily_goal_met';

export function calculateXP(action: XPAction): number {
  return XP_VALUES[action];
}

export function calculateQuizXP(correctCount: number, totalCount: number): {
  baseXP: number;
  perfectBonus: number;
  lessonBonus: number;
  totalXP: number;
} {
  const baseXP = correctCount * XP_VALUES.quiz_correct;
  const isPerfect = correctCount === totalCount && totalCount > 0;
  const perfectBonus = isPerfect ? XP_VALUES.quiz_perfect_score : 0;
  const lessonBonus = XP_VALUES.lesson_complete;
  const totalXP = baseXP + perfectBonus + lessonBonus;

  return { baseXP, perfectBonus, lessonBonus, totalXP };
}

export function calculateStreakBonus(streak: number): number {
  return XP_VALUES.streak_bonus(streak);
}
