import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Play, Clock, AlertTriangle, Dices, LayoutList, Layers, HelpCircle, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import type { MixedReviewConfig, MixedSourceFilter, MixedMode, MixedReviewStats } from '../hooks/useMixedReview';

interface MixedReviewPickerProps {
  stats: MixedReviewStats;
  loading: boolean;
  initialFilter?: MixedSourceFilter;
  onStart: (config: MixedReviewConfig) => void;
}

const WORD_COUNTS = [10, 15, 20, 30] as const;

const SOURCE_FILTERS: { key: MixedSourceFilter; label: string; icon: React.ReactNode; color: string; activeColor: string }[] = [
  { key: 'due', label: 'Due', icon: <Clock size={16} />, color: 'text-red-500', activeColor: 'bg-red-500 text-white shadow-red-200 dark:shadow-red-900/50' },
  { key: 'weak', label: 'Weak', icon: <AlertTriangle size={16} />, color: 'text-amber-500', activeColor: 'bg-amber-500 text-white shadow-amber-200 dark:shadow-amber-900/50' },
  { key: 'random', label: 'Random', icon: <Dices size={16} />, color: 'text-violet-500', activeColor: 'bg-violet-500 text-white shadow-violet-200 dark:shadow-violet-900/50' },
  { key: 'all', label: 'All', icon: <LayoutList size={16} />, color: 'text-blue-500', activeColor: 'bg-blue-500 text-white shadow-blue-200 dark:shadow-blue-900/50' },
];

const MODES: { key: MixedMode; label: string; icon: React.ReactNode; color: string; activeColor: string }[] = [
  { key: 'flashcard', label: 'Flashcard', icon: <Layers size={16} />, color: 'text-indigo-500', activeColor: 'bg-indigo-500 text-white shadow-indigo-200 dark:shadow-indigo-900/50' },
  { key: 'quiz', label: 'Quiz', icon: <HelpCircle size={16} />, color: 'text-emerald-500', activeColor: 'bg-emerald-500 text-white shadow-emerald-200 dark:shadow-emerald-900/50' },
  { key: 'context', label: 'Context', icon: <FileText size={16} />, color: 'text-orange-500', activeColor: 'bg-orange-500 text-white shadow-orange-200 dark:shadow-orange-900/50' },
];

export function MixedReviewPicker({ stats, loading, initialFilter, onStart }: MixedReviewPickerProps) {
  const [wordCount, setWordCount] = useState<MixedReviewConfig['wordCount']>(15);
  const [sourceFilter, setSourceFilter] = useState<MixedSourceFilter>(initialFilter ?? 'all');
  const [mode, setMode] = useState<MixedMode>('flashcard');

  const handleStart = () => {
    onStart({ wordCount, mode, sourceFilter });
  };

  const canStart = !loading && stats.totalCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 mb-3">
          <Shuffle size={26} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mixed Review</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review words across all topics with interleaving
        </p>
      </div>

      {/* Word Count */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Words
        </label>
        <div className="grid grid-cols-4 gap-2">
          {WORD_COUNTS.map((count) => (
            <button
              key={count}
              onClick={() => setWordCount(count)}
              className={cn(
                'py-2.5 rounded-xl text-sm font-bold transition-all',
                wordCount === count
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
              )}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Source Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Source
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SOURCE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setSourceFilter(f.key)}
              className={cn(
                'flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                sourceFilter === f.key
                  ? `${f.activeColor} shadow-md`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
              )}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={cn(
                'flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                mode === m.key
                  ? `${m.activeColor} shadow-md`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
              )}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-2">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Stats
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className={cn('text-lg font-bold', stats.dueCount > 0 ? 'text-red-500' : 'text-gray-400')}>
              {loading ? '—' : stats.dueCount}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Due today</p>
          </div>
          <div>
            <p className={cn('text-lg font-bold', stats.weakCount > 0 ? 'text-amber-500' : 'text-gray-400')}>
              {loading ? '—' : stats.weakCount}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Weak words</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
              {loading ? '—' : stats.totalCount}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Total words</p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <Button
        size="lg"
        className="w-full"
        disabled={!canStart}
        onClick={handleStart}
      >
        <Play size={18} />
        Start Review
      </Button>
    </motion.div>
  );
}
