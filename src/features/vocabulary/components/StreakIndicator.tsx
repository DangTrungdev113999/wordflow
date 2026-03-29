import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface StreakIndicatorProps {
  streak: number;
  multiplier: number;
  className?: string;
}

/**
 * Displays the current answer streak with a fire icon and XP multiplier.
 * Only visible when streak >= 3.
 */
export function StreakIndicator({ streak, multiplier, className }: StreakIndicatorProps) {
  return (
    <AnimatePresence>
      {streak >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
            streak >= 10
              ? 'bg-gradient-to-r from-amber-500 to-red-500 shadow-lg shadow-amber-300/40 dark:shadow-amber-700/30'
              : streak >= 5
                ? 'bg-gradient-to-r from-orange-400 to-amber-500 shadow-md shadow-orange-200/40 dark:shadow-orange-800/20'
                : 'bg-gradient-to-r from-amber-400 to-orange-400 shadow-sm',
            className,
          )}
        >
          <motion.span
            key={streak}
            initial={{ scale: 1.5, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            className="text-base leading-none"
          >
            {streak >= 10 ? '💥' : streak >= 5 ? '🔥' : '⚡'}
          </motion.span>

          <motion.span
            key={`count-${streak}`}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold text-white tabular-nums"
          >
            {streak}
          </motion.span>

          {multiplier > 1 && (
            <span className="text-[11px] font-semibold text-white/80 ml-0.5">
              {multiplier}x
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
