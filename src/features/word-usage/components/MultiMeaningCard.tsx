import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { getMultiMeaning } from '../../../services/multiMeaningService';
import type { MultiMeaningWord, WordSense } from '../models';
import { cn } from '../../../lib/utils';

interface MultiMeaningCardProps {
  word: string;
  compact?: boolean;
}

const FREQ_INDICATOR: Record<number, { dot: string; label: string }> = {
  1: { dot: 'bg-emerald-500', label: 'Phổ biến' },
  2: { dot: 'bg-amber-500', label: 'Ít phổ biến' },
  3: { dot: 'bg-red-400', label: 'Hiếm' },
};

const REGISTER_BADGE: Record<string, string> = {
  formal: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  informal: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  slang: 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800',
  technical: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800',
};

export function MultiMeaningCard({ word, compact = false }: MultiMeaningCardProps) {
  const [data, setData] = useState<MultiMeaningWord | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePos, setActivePos] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(!compact);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setActivePos(null);

    getMultiMeaning(word).then(result => {
      if (cancelled) return;
      setData(result);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [word]);

  if (loading) return <Skeleton className="h-32" />;
  if (!data || data.senses.length < 2) return null;

  const partsOfSpeech = [...new Set(data.senses.map(s => s.partOfSpeech))];
  const filteredSenses = activePos
    ? data.senses.filter(s => s.partOfSpeech === activePos)
    : data.senses;

  const displaySenses = compact && !expanded
    ? filteredSenses.slice(0, 3)
    : filteredSenses;

  const hasMore = compact && !expanded && filteredSenses.length > 3;

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
            Nghĩa của từ
          </h2>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">{data.ipa}</span>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
          {data.totalSenses} nghĩa
        </span>
      </div>

      {/* Tab Chips — Part of Speech filter */}
      {partsOfSpeech.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          <button
            onClick={() => setActivePos(null)}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
              activePos === null
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            Tất cả
          </button>
          {partsOfSpeech.map(pos => (
            <button
              key={pos}
              onClick={() => setActivePos(activePos === pos ? null : pos)}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                activePos === pos
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {pos}
            </button>
          ))}
        </div>
      )}

      {/* Senses List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displaySenses.map((sense, i) => (
            <SenseItem key={sense.id} sense={sense} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Show more */}
      {hasMore && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 w-full text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
        >
          Xem thêm {filteredSenses.length - 3} nghĩa khác
        </button>
      )}

      {/* Tips */}
      {data.tips && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{data.tips}</p>
        </div>
      )}
    </Card>
  );
}

function SenseItem({ sense, index }: { sense: WordSense; index: number }) {
  const freq = FREQ_INDICATOR[sense.frequency] ?? FREQ_INDICATOR[1];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="relative pl-4"
    >
      {/* Frequency dot */}
      <div
        className={cn('absolute left-0 top-[7px] w-2 h-2 rounded-full', freq.dot)}
        title={freq.label}
      />

      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-indigo-500 uppercase">{sense.partOfSpeech}</span>
        {sense.register && (
          <span className={cn('px-1.5 py-0.5 text-[10px] font-medium rounded-full border', REGISTER_BADGE[sense.register] ?? '')}>
            {sense.register}
          </span>
        )}
      </div>

      {/* Meaning */}
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">{sense.meaning}</p>
      {sense.meaning !== sense.meaningEn && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{sense.meaningEn}</p>
      )}

      {/* Examples */}
      {sense.examples.length > 0 && (
        <div className="mt-1.5 space-y-1">
          {sense.examples.slice(0, 2).map((ex, i) => (
            <div key={i}>
              <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                &quot;{ex.sentence}&quot;
              </p>
              {ex.translation && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">→ {ex.translation}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Collocations */}
      {sense.collocations && sense.collocations.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {sense.collocations.map(c => (
            <span key={c} className="text-[10px] px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
              {c}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
