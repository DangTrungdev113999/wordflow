import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { WordStatus } from '../../../lib/types';
import { cn } from '../../../lib/utils';

export type WordFilter = 'all' | WordStatus;
export type WordSort = 'alpha' | 'mastery' | 'frequency';

interface WordFilterBarProps {
  filter: WordFilter;
  sort: WordSort;
  onFilterChange: (filter: WordFilter) => void;
  onSortChange: (sort: WordSort) => void;
  counts: Record<WordFilter, number>;
}

const FILTERS: Array<{ value: WordFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'learning', label: 'Learning' },
  { value: 'review', label: 'Review' },
  { value: 'mastered', label: 'Mastered' },
];

const SORT_OPTIONS: Array<{ value: WordSort; label: string }> = [
  { value: 'alpha', label: 'A → Z' },
  { value: 'mastery', label: 'Mastery' },
  { value: 'frequency', label: 'Last seen' },
];

export function WordFilterBar({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  counts,
}: WordFilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {FILTERS.map(({ value, label }) => {
          const isActive = filter === value;
          const count = counts[value];
          return (
            <button
              key={value}
              onClick={() => onFilterChange(value)}
              className={cn(
                'relative shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="wordFilterActive"
                  className="absolute inset-0 bg-indigo-500 dark:bg-indigo-600 rounded-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {label}
                {count > 0 && (
                  <span className={cn(
                    'ml-1.5 tabular-nums',
                    isActive ? 'text-indigo-200' : 'text-gray-600 dark:text-gray-400',
                  )}>
                    {count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center justify-end">
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as WordSort)}
            className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
