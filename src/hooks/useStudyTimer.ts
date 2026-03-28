import { useCallback, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { useLocation } from 'react-router';
import { logStudyMinutes } from '../services/dailyLogService';

// Learning route prefixes that auto-trigger the timer
const LEARNING_ROUTES = [
  '/vocabulary',
  '/grammar',
  '/listening',
  '/reading',
  '/pronunciation',
  '/sentence-building',
  '/learn-media',
  '/daily-challenge',
  '/writing',
  '/roleplay',
  '/ai-chat',
];

interface TimerState {
  isRunning: boolean;
  elapsedMs: number;
  isManual: boolean; // user started manually via widget
  setRunning: (running: boolean) => void;
  setElapsed: (ms: number) => void;
  addElapsed: (ms: number) => void;
  setManual: (manual: boolean) => void;
  reset: () => void;
}

const SESSION_KEY = 'wordflow-timer-elapsed';

function loadElapsed(): number {
  try {
    return Number(sessionStorage.getItem(SESSION_KEY)) || 0;
  } catch {
    return 0;
  }
}

export const useTimerStore = create<TimerState>()((set) => ({
  isRunning: false,
  elapsedMs: loadElapsed(),
  isManual: false,
  setRunning: (running) => set({ isRunning: running }),
  setElapsed: (ms) => {
    sessionStorage.setItem(SESSION_KEY, String(ms));
    set({ elapsedMs: ms });
  },
  addElapsed: (ms) =>
    set((s) => {
      const next = s.elapsedMs + ms;
      sessionStorage.setItem(SESSION_KEY, String(next));
      return { elapsedMs: next };
    }),
  setManual: (manual) => set({ isManual: manual }),
  reset: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ elapsedMs: 0, isRunning: false, isManual: false });
  },
}));

function isLearningRoute(pathname: string): boolean {
  return LEARNING_ROUTES.some((prefix) => pathname.startsWith(prefix));
}

export function useStudyTimer() {
  const location = useLocation();
  const { isRunning, elapsedMs, isManual, setRunning, addElapsed, setManual, reset } =
    useTimerStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastFlushRef = useRef(elapsedMs);

  // Tick every second when running
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        addElapsed(1000);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, addElapsed]);

  // Auto-detect: start when on learning page, pause when leaving
  useEffect(() => {
    if (isManual) return; // manual mode overrides auto-detect
    const onLearning = isLearningRoute(location.pathname);
    setRunning(onLearning);
  }, [location.pathname, isManual, setRunning]);

  // Visibility change: pause when tab hidden
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) {
        if (isRunning) setRunning(false);
      } else {
        // Resume only if on a learning page or manual mode
        if (isManual || isLearningRoute(location.pathname)) {
          setRunning(true);
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isRunning, isManual, location.pathname, setRunning]);

  // Flush accumulated minutes to dailyLog every 60 seconds
  useEffect(() => {
    const newMinutes = Math.floor(elapsedMs / 60000);
    const lastMinutes = Math.floor(lastFlushRef.current / 60000);
    if (newMinutes > lastMinutes) {
      const delta = newMinutes - lastMinutes;
      lastFlushRef.current = elapsedMs;
      logStudyMinutes(delta);
    }
  }, [elapsedMs]);

  const startManual = useCallback(() => {
    setManual(true);
    setRunning(true);
  }, [setManual, setRunning]);

  const pauseManual = useCallback(() => {
    setRunning(false);
  }, [setRunning]);

  const resumeManual = useCallback(() => {
    setRunning(true);
  }, [setRunning]);

  const stopAndReset = useCallback(() => {
    // Flush remaining before reset
    const totalMinutes = Math.floor(elapsedMs / 60000);
    const lastMinutes = Math.floor(lastFlushRef.current / 60000);
    if (totalMinutes > lastMinutes) {
      logStudyMinutes(totalMinutes - lastMinutes);
    }
    lastFlushRef.current = 0;
    reset();
  }, [elapsedMs, reset]);

  return {
    isRunning,
    elapsedMs,
    isManual,
    startManual,
    pauseManual,
    resumeManual,
    stopAndReset,
    formattedTime: formatTime(elapsedMs),
  };
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
