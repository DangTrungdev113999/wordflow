import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { PHRASAL_VERBS, PHRASAL_VERB_BASE_VERBS } from '../../../data/phrasalVerbs';
import { PhrasalVerbItem } from '../components/PhrasalVerbItem';
import { useUsageSearch } from '../hooks/useUsageSearch';
import { cn } from '../../../lib/utils';
import type { PhrasalVerb } from '../models';

export function PhrasalVerbsPage() {
  const navigate = useNavigate();
  const [baseVerb, setBaseVerb] = useState<string>('all');

  const itemsByBase = baseVerb === 'all'
    ? PHRASAL_VERBS
    : PHRASAL_VERBS.filter(pv => pv.baseVerb === baseVerb);

  const getSearchable = useCallback(
    (pv: PhrasalVerb) => `${pv.verb} ${pv.meaning} ${pv.meaningEn} ${pv.synonyms?.join(' ') ?? ''}`,
    [],
  );
  const { search, setSearch, filtered } = useUsageSearch(itemsByBase, getSearchable);

  const counts: Record<string, number> = { all: PHRASAL_VERBS.length };
  for (const v of PHRASAL_VERB_BASE_VERBS) {
    counts[v] = PHRASAL_VERBS.filter(pv => pv.baseVerb === v).length;
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
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Phrasal Verbs</h1>
          <p className="text-xs text-gray-400">{PHRASAL_VERBS.length} cụm động từ</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm phrasal verb..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
        />
      </div>

      {/* Base verb filter chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setBaseVerb('all')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
            baseVerb === 'all'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
          )}
        >
          All
          <span className="ml-1 opacity-60">{counts.all}</span>
        </button>
        {PHRASAL_VERB_BASE_VERBS.map(v => (
          <button
            key={v}
            onClick={() => setBaseVerb(v)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize',
              baseVerb === v
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
            )}
          >
            {v}
            <span className="ml-1 opacity-60">{counts[v]}</span>
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
            <PhrasalVerbItem item={item} />
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">Không tìm thấy phrasal verb nào</p>
        )}
      </div>
    </div>
  );
}
