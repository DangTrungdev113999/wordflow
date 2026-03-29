import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BeforeAfter } from '../../../lib/types';

interface BeforeAfterCardProps {
  items: BeforeAfter[];
  animate?: boolean;
}

function HighlightedSentence({ text, highlights, variant }: {
  text: string;
  highlights: number[];
  variant: 'wrong' | 'correct';
}) {
  const words = text.split(/\s+/);
  const highlightClass = variant === 'wrong'
    ? 'bg-red-200 dark:bg-red-800/60 text-red-800 dark:text-red-200 rounded px-1 font-semibold'
    : 'bg-green-200 dark:bg-green-800/60 text-green-800 dark:text-green-200 rounded px-1 font-semibold';

  return (
    <p className="text-sm leading-relaxed">
      {words.map((word, i) => (
        <span key={i}>
          {i > 0 && ' '}
          {highlights.includes(i) ? (
            <span className={highlightClass}>{word}</span>
          ) : (
            <span className="text-gray-700 dark:text-gray-300">{word}</span>
          )}
        </span>
      ))}
    </p>
  );
}

export function BeforeAfterCard({ items, animate = true }: BeforeAfterCardProps) {
  const [current, setCurrent] = useState(0);

  const item = items[current];
  if (!item) return null;

  const hasPagination = items.length > 1;

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={animate ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={animate ? { opacity: 0, y: -8 } : undefined}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="space-y-3"
        >
          {/* Side-by-side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Wrong */}
            <motion.div
              initial={animate ? { opacity: 0, x: -16 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="rounded-xl border border-red-200 dark:border-red-800/60 bg-red-50/50 dark:bg-red-950/20 p-3.5"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-red-500">❌</span>
                <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">Sai</span>
              </div>
              <HighlightedSentence text={item.wrong} highlights={item.wrongHighlight} variant="wrong" />
            </motion.div>

            {/* Correct */}
            <motion.div
              initial={animate ? { opacity: 0, x: 16 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="rounded-xl border border-green-200 dark:border-green-800/60 bg-green-50/50 dark:bg-green-950/20 p-3.5"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-green-500">✅</span>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Đúng</span>
              </div>
              <HighlightedSentence text={item.correct} highlights={item.correctHighlight} variant="correct" />
            </motion.div>
          </div>

          {/* Explanation */}
          <motion.div
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40"
          >
            <span className="text-amber-500 shrink-0">💡</span>
            <p className="text-sm text-amber-800 dark:text-amber-300">{item.explanation}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {hasPagination && (
        <div className="flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`
                w-2 h-2 rounded-full transition-all duration-200
                ${i === current
                  ? 'bg-indigo-500 dark:bg-indigo-400 w-5'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}
