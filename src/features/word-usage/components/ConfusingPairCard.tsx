import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { PairQuizInline } from './PairQuizInline';
import type { ConfusingPair } from '../models';
import { cn } from '../../../lib/utils';

interface ConfusingPairCardProps {
  pair: ConfusingPair;
  showQuiz?: boolean;
}

const CATEGORY_LABEL: Record<string, { label: string; color: string }> = {
  spelling: { label: 'Chính tả', color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' },
  meaning: { label: 'Nghĩa', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
  grammar: { label: 'Ngữ pháp', color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' },
  usage: { label: 'Cách dùng', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
};

export function ConfusingPairCard({ pair, showQuiz = false }: ConfusingPairCardProps) {
  const [quizOpen, setQuizOpen] = useState(showQuiz);
  const cat = CATEGORY_LABEL[pair.category] ?? CATEGORY_LABEL.spelling;

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">{pair.word1}</span>
          <span className="text-gray-300 dark:text-gray-600">vs</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{pair.word2}</span>
        </div>
        <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', cat.color)}>
          {cat.label}
        </span>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {pair.comparison.map((comp, i) => (
          <motion.div
            key={comp.word}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              'rounded-xl p-3 border',
              i === 0
                ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30'
                : 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900/30'
            )}
          >
            <p className="font-bold text-sm text-gray-900 dark:text-white">{comp.word}</p>
            <p className="text-[10px] text-gray-400 uppercase font-medium mt-0.5">{comp.partOfSpeech}</p>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1.5">{comp.meaning}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1.5 leading-relaxed">
              &quot;{comp.example}&quot;
            </p>
            <p className="text-[10px] text-gray-400 mt-1">→ {comp.translation}</p>
          </motion.div>
        ))}
      </div>

      {/* Common mistake + memory tip */}
      <div className="space-y-2 mb-3">
        <div className="flex gap-2 items-start">
          <span className="shrink-0 text-sm mt-0.5">⚠️</span>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{pair.commonMistake}</p>
        </div>
        <div className="flex gap-2 items-start">
          <span className="shrink-0 text-sm mt-0.5">💡</span>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{pair.memoryTip}</p>
        </div>
      </div>

      {/* Quiz toggle */}
      {pair.quiz && (
        <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
          {!quizOpen ? (
            <button
              onClick={() => setQuizOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
            >
              <span>🧩</span> Thử quiz
            </button>
          ) : (
            <PairQuizInline quiz={pair.quiz} word1={pair.word1} word2={pair.word2} />
          )}
        </div>
      )}
    </Card>
  );
}
