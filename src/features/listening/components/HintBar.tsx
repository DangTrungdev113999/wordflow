import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { HintType, HintConfig } from '../types';

interface HintBarProps {
  hints: HintConfig[];
  usedHints: HintType[];
  onUseHint: (type: HintType) => string | undefined;
  revealedValues: Partial<Record<HintType, string>>;
  disabled?: boolean;
}

const HINT_COLORS: Record<HintType, { bg: string; border: string; text: string; activeBg: string }> = {
  'first-letter': {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'border-violet-200 dark:border-violet-800/60',
    text: 'text-violet-700 dark:text-violet-300',
    activeBg: 'bg-violet-100 dark:bg-violet-900/50',
  },
  'ipa': {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-200 dark:border-sky-800/60',
    text: 'text-sky-700 dark:text-sky-300',
    activeBg: 'bg-sky-100 dark:bg-sky-900/50',
  },
  'meaning': {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800/60',
    text: 'text-amber-700 dark:text-amber-300',
    activeBg: 'bg-amber-100 dark:bg-amber-900/50',
  },
  'slow-replay': {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    activeBg: 'bg-emerald-100 dark:bg-emerald-900/50',
  },
};

export function HintBar({ hints, usedHints, onUseHint, revealedValues, disabled }: HintBarProps) {
  const availableHints = hints.filter(h => h.available);
  if (availableHints.length === 0) return null;

  const hasRevealed = Object.keys(revealedValues).length > 0;

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <Lightbulb size={14} className="text-gray-400 dark:text-gray-500" />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Gợi ý
        </span>
      </div>

      {/* Hint buttons */}
      <div className="flex flex-wrap gap-2">
        {availableHints.map(hint => {
          const isUsed = usedHints.includes(hint.type);
          const colors = HINT_COLORS[hint.type];

          return (
            <motion.button
              key={hint.type}
              whileTap={!isUsed && !disabled ? { scale: 0.96 } : undefined}
              onClick={() => !isUsed && !disabled && onUseHint(hint.type)}
              disabled={isUsed || disabled}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                isUsed
                  ? `${colors.activeBg} ${colors.border} ${colors.text} opacity-70`
                  : disabled
                    ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : `${colors.bg} ${colors.border} ${colors.text} hover:${colors.activeBg} cursor-pointer`,
              )}
            >
              <span className="text-base leading-none">{hint.icon}</span>
              <span>{hint.label}</span>
              <span className={cn(
                'text-xs font-normal',
                isUsed ? 'line-through opacity-60' : 'opacity-70',
              )}>
                -{hint.xpPenalty}XP
              </span>
              {isUsed && (
                <span className="ml-0.5 text-xs opacity-60">{'\u2713'}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Revealed values */}
      <AnimatePresence>
        {hasRevealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5 overflow-hidden"
          >
            {(Object.entries(revealedValues) as [HintType, string | undefined][]).map(([type, value]) => {
              if (!value) return null;
              const colors = HINT_COLORS[type];
              const config = hints.find(h => h.type === type);

              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border',
                    colors.bg, colors.border,
                  )}
                >
                  <span className="text-sm leading-none">{config?.icon}</span>
                  <span className={cn('text-sm font-medium', colors.text)}>
                    {value}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
