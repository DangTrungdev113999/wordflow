import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '../lib/types';
import { DEFAULT_DAILY_GOAL } from '../lib/constants';

interface SettingsState {
  theme: Theme;
  dailyGoal: number;
  setTheme: (theme: Theme) => void;
  setDailyGoal: (goal: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      dailyGoal: DEFAULT_DAILY_GOAL,
      setTheme: (theme) => set({ theme }),
      setDailyGoal: (dailyGoal) => set({ dailyGoal }),
    }),
    { name: 'wordflow-settings' }
  )
);
