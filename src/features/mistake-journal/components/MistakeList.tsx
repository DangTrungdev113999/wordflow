import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc } from 'lucide-react';
import { useMistakeStore } from '../../../stores/mistakeStore';
import { MistakeCard } from './MistakeCard';
import type { MistakeType, MistakeSource } from '../../../models/Mistake';

type SortBy = 'newest' | 'oldest' | 'due_first' | 'most_reviewed';

const TYPE_OPTIONS: { value: MistakeType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'vocabulary', label: 'Vocabulary' },
  { value: 'grammar', label: 'Grammar' },
  { value: 'spelling', label: 'Spelling' },
  { value: 'sentence_order', label: 'Sentence Order' },
  { value: 'listening', label: 'Listening' },
  { value: 'reading', label: 'Reading' },
  { value: 'writing', label: 'Writing' },
];

const SOURCE_OPTIONS: { value: MistakeSource | 'all'; label: string }[] = [
  { value: 'all', label: 'All Sources' },
  { value: 'quiz', label: 'Vocab Quiz' },
  { value: 'grammar-quiz', label: 'Grammar Quiz' },
  { value: 'dictation', label: 'Dictation' },
  { value: 'listening-quiz', label: 'Listening Quiz' },
  { value: 'sentence-building', label: 'Sentence Building' },
  { value: 'writing', label: 'Writing' },
  { value: 'media-quiz', label: 'Media Quiz' },
  { value: 'reading', label: 'Reading' },
];

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'due_first', label: 'Due First' },
  { value: 'most_reviewed', label: 'Most Reviewed' },
];

export function MistakeList() {
  const { mistakes, deleteMistake } = useMistakeStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<MistakeType | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<MistakeSource | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...mistakes];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.question.toLowerCase().includes(q) ||
        m.userAnswer.toLowerCase().includes(q) ||
        m.correctAnswer.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter(m => m.type === typeFilter);
    }

    if (sourceFilter !== 'all') {
      result = result.filter(m => m.source === sourceFilter);
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        break;
      case 'due_first':
        result.sort((a, b) => a.nextReview.localeCompare(b.nextReview));
        break;
      case 'most_reviewed':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [mistakes, search, typeFilter, sourceFilter, sortBy]);

  if (mistakes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📝</p>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">No mistakes yet</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">Complete quizzes and practice sessions to start tracking your mistakes.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search + Filter bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search mistakes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl border transition-colors ${showFilters ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          <Filter size={16} />
        </button>
      </div>

      {/* Filter dropdowns */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as MistakeType | 'all')}
            className="text-xs rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-gray-700 dark:text-gray-300"
          >
            {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value as MistakeSource | 'all')}
            className="text-xs rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-gray-700 dark:text-gray-300"
          >
            {SOURCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="flex items-center gap-1">
            <SortAsc size={14} className="text-gray-600 dark:text-gray-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortBy)}
              className="text-xs rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-gray-700 dark:text-gray-300"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{filtered.length} {filtered.length === 1 ? 'mistake' : 'mistakes'}</p>

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map(m => (
            <MistakeCard key={m.id} mistake={m} onDelete={deleteMistake} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && mistakes.length > 0 && (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 py-8">No mistakes match your filters.</p>
      )}
    </div>
  );
}
