import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface TimerBarProps {
  /** Total time in seconds for this question */
  duration: number;
  /** Fires when time runs out */
  onTimeout: () => void;
  /** Reset key — change to restart timer for next question */
  resetKey: number | string;
  /** Pause the timer (e.g. while showing feedback) */
  paused?: boolean;
  className?: string;
}

/**
 * Countdown bar with smooth color transition:
 * green → amber → red as time runs out.
 */
export function TimerBar({ duration, onTimeout, resetKey, paused = false, className }: TimerBarProps) {
  const [remaining, setRemaining] = useState(duration);
  const rafRef = useRef<number>(0);
  const startRef = useRef(0);
  const pausedAtRef = useRef<number | null>(null);
  const calledTimeoutRef = useRef(false);

  const pct = Math.max(0, (remaining / duration) * 100);

  // Color based on percentage
  const barColor = pct > 60
    ? 'bg-emerald-500'
    : pct > 30
      ? 'bg-amber-500'
      : 'bg-red-500';

  const glowColor = pct > 60
    ? 'shadow-emerald-400/30'
    : pct > 30
      ? 'shadow-amber-400/30'
      : 'shadow-red-400/40';

  const tick = useCallback(() => {
    const elapsed = (performance.now() - startRef.current) / 1000;
    const left = Math.max(0, duration - elapsed);
    setRemaining(left);

    if (left <= 0) {
      if (!calledTimeoutRef.current) {
        calledTimeoutRef.current = true;
        onTimeout();
      }
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [duration, onTimeout]);

  // Reset when question changes
  useEffect(() => {
    setRemaining(duration);
    startRef.current = performance.now();
    calledTimeoutRef.current = false;
    pausedAtRef.current = null;

    if (!paused) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [resetKey, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle pause/resume
  useEffect(() => {
    if (paused) {
      cancelAnimationFrame(rafRef.current);
      pausedAtRef.current = performance.now();
    } else if (pausedAtRef.current !== null) {
      // Adjust start time to account for pause duration
      const pauseDuration = performance.now() - pausedAtRef.current;
      startRef.current += pauseDuration;
      pausedAtRef.current = null;
      if (!calledTimeoutRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
  }, [paused, tick]);

  return (
    <div className={cn('w-full', className)}>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full transition-colors duration-500 shadow-sm', barColor, glowColor)}
          style={{ width: `${pct}%` }}
          initial={false}
        />
      </div>
      {pct <= 30 && pct > 0 && (
        <p className="text-[11px] font-medium text-red-500 dark:text-red-400 mt-1 text-right tabular-nums">
          {Math.ceil(remaining)}s
        </p>
      )}
    </div>
  );
}
