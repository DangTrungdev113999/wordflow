import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { MULTI_MEANING_SEEDS } from '../../../data/multiMeaningSeeds';
import { cn } from '../../../lib/utils';

const FREQ_DOT: Record<number, string> = {
  1: 'bg-emerald-500',
  2: 'bg-amber-500',
  3: 'bg-red-400',
};

export function MultiMeaningListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? MULTI_MEANING_SEEDS.filter(w =>
        w.word.toLowerCase().includes(search.toLowerCase()) ||
        w.senses.some(s => s.meaning.toLowerCase().includes(search.toLowerCase()))
      )
    : MULTI_MEANING_SEEDS;

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
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Từ đa nghĩa</h1>
          <p className="text-xs text-gray-400">{MULTI_MEANING_SEEDS.length} từ</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm từ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-gray-400">Phổ biến</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[10px] text-gray-400">Ít phổ biến</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-[10px] text-gray-400">Hiếm</span>
        </div>
      </div>

      {/* Word list */}
      <div className="space-y-2">
        {filtered.map((word, i) => (
          <motion.div
            key={word.word}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
          >
            <Card
              interactive
              onClick={() => navigate(`/word-usage/multi-meaning/${encodeURIComponent(word.word)}`)}
              className="cursor-pointer"
              padding="sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{word.word}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{word.ipa}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Frequency dots for top 3 senses */}
                  <div className="flex gap-0.5">
                    {word.senses.slice(0, 5).map((s, j) => (
                      <div
                        key={j}
                        className={cn('w-1.5 h-1.5 rounded-full', FREQ_DOT[s.frequency] ?? FREQ_DOT[1])}
                        title={`${s.partOfSpeech}: ${s.meaning}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 tabular-nums">{word.totalSenses} nghĩa</span>
                </div>
              </div>

              {/* Quick preview: top 2 meanings */}
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                {word.senses.slice(0, 2).map(s => (
                  <span key={s.id} className="text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="text-indigo-500 font-medium">{s.partOfSpeech}</span> — {s.meaning}
                  </span>
                ))}
                {word.totalSenses > 2 && (
                  <span className="text-[11px] text-gray-400">+{word.totalSenses - 2} nghĩa khác</span>
                )}
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">Không tìm thấy từ nào</p>
        )}
      </div>
    </div>
  );
}
