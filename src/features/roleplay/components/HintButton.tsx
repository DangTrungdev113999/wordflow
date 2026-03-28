import { useState } from 'react';
import { Lightbulb } from 'lucide-react';

interface HintButtonProps {
  onReveal: () => string | null;
  totalHints: number;
  usedHints: number;
}

export function HintButton({ onReveal, totalHints, usedHints }: HintButtonProps) {
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const allUsed = usedHints >= totalHints;

  const handleClick = () => {
    const hint = onReveal();
    if (hint) setCurrentHint(hint);
  };

  return (
    <div className="px-4">
      {currentHint && (
        <div className="mb-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800/30">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            <span className="font-semibold">Gợi ý:</span> "{currentHint}"
          </p>
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={allUsed}
        className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Lightbulb size={14} />
        {allUsed ? 'Hết gợi ý' : `Gợi ý (${usedHints}/${totalHints})`}
      </button>
    </div>
  );
}
