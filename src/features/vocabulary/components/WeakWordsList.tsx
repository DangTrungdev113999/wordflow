import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import type { WeakWord } from '../../../services/weakWordsService';

interface WeakWordsListProps {
  words: WeakWord[];
  maxShow?: number;
}

export function WeakWordsList({ words, maxShow = 5 }: WeakWordsListProps) {
  const [expanded, setExpanded] = useState(false);

  if (words.length === 0) return null;

  const visible = expanded ? words : words.slice(0, maxShow);
  const hasMore = words.length > maxShow;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <AlertTriangle size={16} className="text-amber-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          Words to Review
        </h3>
        <span className="text-xs text-gray-400">({words.length})</span>
      </div>

      <div className="space-y-1.5">
        {visible.map((w) => (
          <div
            key={w.wordId}
            className="flex items-baseline gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/15 border-l-2 border-amber-400 dark:border-amber-500"
          >
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {w.word}
            </span>
            <span className="text-xs text-gray-400">{w.ipa}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
              {w.meaning}
            </span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 transition-colors mx-auto"
        >
          {expanded ? (
            <>
              Show less <ChevronUp size={14} />
            </>
          ) : (
            <>
              Show all {words.length} words <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
