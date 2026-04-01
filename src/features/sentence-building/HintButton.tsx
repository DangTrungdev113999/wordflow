import { Lightbulb } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HintButtonProps {
  hintsUsed: number;
  maxHints: number;
  onHint: () => void;
  disabled?: boolean;
}

export function HintButton({ hintsUsed, maxHints, onHint, disabled }: HintButtonProps) {
  const remaining = maxHints - hintsUsed;

  return (
    <button
      onClick={onHint}
      disabled={disabled || remaining <= 0}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
        remaining > 0 && !disabled
          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
      )}
    >
      <Lightbulb size={16} />
      <span>Hint ({remaining})</span>
    </button>
  );
}
