import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { COLLOCATIONS, COLLOCATION_CATEGORIES } from '../../../data/collocations';
import { CollocationItem } from '../components/CollocationItem';
import { useUsageSearch } from '../hooks/useUsageSearch';
import { cn } from '../../../lib/utils';
import type { Collocation, CollocationCategory } from '../models';

type FilterCategory = CollocationCategory | 'all';

export function CollocationsPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<FilterCategory>('all');

  const itemsByCat = category === 'all'
    ? COLLOCATIONS
    : COLLOCATIONS.filter(c => c.category === category);

  const getSearchable = useCallback(
    (c: Collocation) => `${c.collocation} ${c.meaning} ${c.correct} ${c.incorrect}`,
    [],
  );
  const { search, setSearch, filtered } = useUsageSearch(itemsByCat, getSearchable);

  const counts: Record<string, number> = { all: COLLOCATIONS.length };
  for (const cat of COLLOCATION_CATEGORIES) {
    if (cat.value !== 'all') {
      counts[cat.value] = COLLOCATIONS.filter(c => c.category === cat.value).length;
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/word-usage')}
          className="p-2 -ml-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Collocations</h1>
          <p className="text-xs text-gray-400">{COLLOCATIONS.length} cụm từ kết hợp</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm collocation..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
        />
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {COLLOCATION_CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              category === cat.value
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
            )}
          >
            {cat.label}
            <span className="ml-1 opacity-60">{counts[cat.value]}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.5), duration: 0.2 }}
          >
            <CollocationItem item={item} />
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">Không tìm thấy collocation nào</p>
        )}
      </div>
    </div>
  );
}
