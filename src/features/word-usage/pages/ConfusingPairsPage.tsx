import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { CONFUSING_PAIRS } from '../../../data/confusingPairs';
import { cn } from '../../../lib/utils';

type Category = 'all' | 'spelling' | 'meaning' | 'grammar' | 'usage';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'spelling', label: 'Chính tả' },
  { value: 'meaning', label: 'Nghĩa' },
  { value: 'grammar', label: 'Ngữ pháp' },
  { value: 'usage', label: 'Cách dùng' },
];

const CAT_COLOR: Record<string, string> = {
  spelling: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  meaning: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  grammar: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
  usage: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
};

export function ConfusingPairsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');

  const filtered = CONFUSING_PAIRS.filter(p => {
    if (category !== 'all' && p.category !== category) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.word1.toLowerCase().includes(q) ||
             p.word2.toLowerCase().includes(q) ||
             p.comparison.some(c => c.meaning.toLowerCase().includes(q));
    }
    return true;
  });

  const counts: Record<string, number> = {
    all: CONFUSING_PAIRS.length,
    spelling: CONFUSING_PAIRS.filter(p => p.category === 'spelling').length,
    meaning: CONFUSING_PAIRS.filter(p => p.category === 'meaning').length,
    grammar: CONFUSING_PAIRS.filter(p => p.category === 'grammar').length,
    usage: CONFUSING_PAIRS.filter(p => p.category === 'usage').length,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/word-usage')}
          className="p-2 -ml-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Cặp từ dễ nhầm</h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">{CONFUSING_PAIRS.length} cặp từ</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Tìm cặp từ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              category === cat.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {cat.label}
            <span className="ml-1 opacity-60">{counts[cat.value]}</span>
          </button>
        ))}
      </div>

      {/* Pair list */}
      <div className="space-y-2">
        {filtered.map((pair, i) => (
          <motion.div
            key={pair.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02, duration: 0.2 }}
          >
            <Card
              interactive
              onClick={() => navigate(`/word-usage/confusing-pairs/${pair.id}`)}
              className="cursor-pointer"
              padding="sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{pair.word1}</span>
                  <span className="text-gray-600 dark:text-gray-400 text-xs">vs</span>
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{pair.word2}</span>
                </div>
                <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', CAT_COLOR[pair.category])}>
                  {CATEGORIES.find(c => c.value === pair.category)?.label}
                </span>
              </div>
              <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-1 line-clamp-1">
                {pair.comparison.map(c => c.meaning).join(' / ')}
              </p>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 py-8">Không tìm thấy cặp từ nào</p>
        )}
      </div>
    </div>
  );
}
