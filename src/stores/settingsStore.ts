import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, FontScale } from '../lib/types';
import { DEFAULT_DAILY_GOAL } from '../lib/constants';

interface SettingsState {
  theme: Theme;
  dailyGoal: number;
  fontScale: FontScale;
  setTheme: (theme: Theme) => void;
  setDailyGoal: (goal: number) => void;
  setFontScale: (scale: FontScale) => void;
}

const FONT_SCALE_VALUES: Record<FontScale, number> = {
  small: 0.875,
  normal: 1,
  large: 1.125,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      dailyGoal: DEFAULT_DAILY_GOAL,
      fontScale: 'normal',
      setTheme: (theme) => set({ theme }),
      setDailyGoal: (dailyGoal) => set({ dailyGoal }),
      setFontScale: (fontScale) => {
        document.documentElement.style.setProperty(
          '--font-scale',
          String(FONT_SCALE_VALUES[fontScale])
        );
        set({ fontScale });
      },
    }),
    { name: 'wordflow-settings' }
  )
);

// Apply font scale on load
export function initFontScale() {
  const stored = JSON.parse(localStorage.getItem('wordflow-settings') || '{}');
  const scale: FontScale = stored?.state?.fontScale || 'normal';
  document.documentElement.style.setProperty(
    '--font-scale',
    String(FONT_SCALE_VALUES[scale])
  );
}
