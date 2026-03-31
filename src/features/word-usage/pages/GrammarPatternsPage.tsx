import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { GRAMMAR_PATTERNS, GRAMMAR_CATEGORIES } from '../../../data/grammarPatterns';
import { GrammarCompareCard } from '../components/GrammarCompareCard';
import { useUsageSearch } from '../hooks/useUsageSearch';
import { cn } from '../../../lib/utils';
import type { GrammarPattern, GrammarCategory } from '../models';

type FilterCategory = GrammarCategory | 'all';

// Precomputed counts — static data, no need to recalculate per render
const COUNTS: Record<string, number> = { all: GRAMMAR_PATTERNS.length };
for (const cat of GRAMMAR_CATEGORIES) {
  if (cat.value !== 'all') {
    COUNTS[cat.value] = GRAMMAR_PATTERNS.filter(p => p.category === cat.value).length;
  }
}

export function GrammarPatternsPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<FilterCategory>('all');

  const itemsByCat = category === 'all'
    ? GRAMMAR_PATTERNS
    : GRAMMAR_PATTERNS.filter(p => p.category === category);

  const getSearchable = useCallback(
    (p: GrammarPattern) =>
      `${p.pattern} ${p.forms.map(f => `${f.structure} ${f.meaning}`).join(' ')} ${p.commonMistake}`,
    [],
  );
  const { search, setSearch, filtered } = useUsageSearch(itemsByCat, getSearchable);

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
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Grammar Patterns</h1>
          <p className="text-xs text-gray-400">{GRAMMAR_PATTERNS.length} mẫu ngữ pháp</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm grammar pattern..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
        />
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {GRAMMAR_CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              category === cat.value
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
            )}
          >
            {cat.label}
            <span className="ml-1 opacity-60">{COUNTS[cat.value]}</span>
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
            <GrammarCompareCard pattern={item} />
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">Không tìm thấy grammar pattern nào</p>
        )}
      </div>
    </div>
  );
}
