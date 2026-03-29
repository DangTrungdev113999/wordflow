import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpenText } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { PassageCard } from '../components/PassageCard';
import { READING_PASSAGES } from '../data/passages';
import type { CEFRLevel } from '../data/passages';

const LEVELS: Array<CEFRLevel | 'All'> = ['All', 'A1', 'A2', 'B1', 'B2'];

export function ReadingPage() {
  const [filter, setFilter] = useState<CEFRLevel | 'All'>('All');

  const filtered = useMemo(
    () => (filter === 'All' ? READING_PASSAGES : READING_PASSAGES.filter(p => p.level === filter)),
    [filter],
  );

  return (
    <div className="px-4 py-6 space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
          <BookOpenText size={22} className="text-indigo-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reading</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {READING_PASSAGES.length} passages available
          </p>
        </div>
      </div>

      {/* Level Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {LEVELS.map(level => (
          <motion.button
            key={level}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(level)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
              filter === level
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
            )}
          >
            {level}
          </motion.button>
        ))}
      </div>

      {/* Passage Grid */}
      <div className="space-y-3">
        {filtered.map((passage, i) => (
          <PassageCard key={passage.id} passage={passage} index={i} />
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">
            No passages for this level yet.
          </p>
        )}
      </div>
    </div>
  );
}
