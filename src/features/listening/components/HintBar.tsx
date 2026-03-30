import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import type { HintType, HintConfig } from '../types';

interface HintBarProps {
  hints: HintConfig[];
  usedHints: HintType[];
  onUseHint: (type: HintType) => void;
  revealedValues: Record<HintType, string | null>;
  disabled?: boolean;
}

export function HintBar({ hints, usedHints, onUseHint, revealedValues, disabled }: HintBarProps) {
  if (hints.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {hints.map(hint => {
          const isUsed = usedHints.includes(hint.type);
          return (
            <button
              key={hint.type}
              onClick={() => onUseHint(hint.type)}
              disabled={disabled}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border',
                isUsed
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700',
                disabled && !isUsed && 'opacity-50 cursor-not-allowed',
              )}
            >
              <span>{hint.icon}</span>
              <span>{hint.label}</span>
              {!isUsed && <span className="text-[10px] text-gray-400">−{hint.xpPenalty}xp</span>}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {usedHints.map(type => {
          const value = revealedValues[type];
          if (!value || type === 'slow-replay') return null;
          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm text-indigo-700 dark:text-indigo-300"
            >
              {value}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
