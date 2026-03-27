import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLevelFromXP } from '../lib/utils';

interface ProgressState {
  xp: number;
  level: number;
  levelTitle: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  todayWordsLearned: number;
  todayWordsReviewed: number;
  todayXP: number;
  addXP: (amount: number) => void;
  setStreak: (streak: number) => void;
  setLastActiveDate: (date: string) => void;
  incrementWordsLearned: () => void;
  incrementWordsReviewed: () => void;
  resetDailyCounters: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      levelTitle: 'Beginner',
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      todayWordsLearned: 0,
      todayWordsReviewed: 0,
      todayXP: 0,
      addXP: (amount) => {
        const newXP = get().xp + amount;
        const { level, title } = getLevelFromXP(newXP);
        set({ xp: newXP, level, levelTitle: title, todayXP: get().todayXP + amount });
      },
      setStreak: (streak) =>
        set((s) => ({
          currentStreak: streak,
          longestStreak: Math.max(s.longestStreak, streak),
        })),
      setLastActiveDate: (date) => set({ lastActiveDate: date }),
      incrementWordsLearned: () => set((s) => ({ todayWordsLearned: s.todayWordsLearned + 1 })),
      incrementWordsReviewed: () => set((s) => ({ todayWordsReviewed: s.todayWordsReviewed + 1 })),
      resetDailyCounters: () => set({ todayWordsLearned: 0, todayWordsReviewed: 0, todayXP: 0 }),
    }),
    { name: 'wordflow-progress' }
  )
);
