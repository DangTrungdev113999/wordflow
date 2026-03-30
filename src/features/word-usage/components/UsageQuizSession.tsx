import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';
import { useProgressStore } from '../../../stores/progressStore';
import { XP_VALUES } from '../../../lib/constants';
import type { GrammarQuizItem } from '../models';

interface UsageQuizSessionProps {
  items: GrammarQuizItem[];
  title?: string;
  onClose: () => void;
}

export function UsageQuizSession({ items, title, onClose }: UsageQuizSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const addXP = useProgressStore(s => s.addXP);

  const isComplete = results.length === items.length;
  const item = items[currentIndex];
  const isAnswered = selected !== null;
  const isCorrect = selected === item?.correct;

  const handleSelect = useCallback((idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
    if (idx === item?.correct) {
      addXP(XP_VALUES.usage_quiz_correct);
    }
  }, [isAnswered, item?.correct, addXP]);

  const handleNext = useCallback(() => {
    setResults(prev => [...prev, isCorrect]);
    setSelected(null);
    setCurrentIndex(prev => prev + 1);
  }, [isCorrect]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setSelected(null);
    setResults([]);
  }, []);

  if (!item && !isComplete) return null;

  if (isComplete) {
    const score = results.filter(Boolean).length;
    const total = results.length;
    const pct = Math.round((score / total) * 100);
    const xpEarned = score * XP_VALUES.usage_quiz_correct;

    return (
      <Card>
        <div className="text-center py-4 space-y-3">
          <div className="text-4xl">
            {pct === 100 ? '🎯' : pct >= 70 ? '🌟' : '💪'}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {score}/{total}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {pct === 100 ? 'Hoàn hảo!' : pct >= 70 ? 'Rất tốt!' : 'Hãy ôn lại và thử lại nhé.'}
            </p>
          </div>

          {xpEarned > 0 && (
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              +{xpEarned} XP
            </p>
          )}

          {/* Result dots */}
          <div className="flex justify-center gap-1.5">
            {results.map((r, i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full',
                  r ? 'bg-emerald-500' : 'bg-red-400',
                )}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
            >
              Thử lại
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Xong
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Title + progress */}
      <div className="flex items-center justify-between mb-3">
        <div>
          {title && (
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">{title}</p>
          )}
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Câu {currentIndex + 1}/{items.length}
          </span>
        </div>
        <div className="flex gap-1">
          {items.map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                i < results.length
                  ? results[i] ? 'bg-emerald-500' : 'bg-red-400'
                  : i === currentIndex ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700',
              )}
            />
          ))}
        </div>
      </div>

      {/* Sentence */}
      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mb-4 font-medium">
        {item.sentence}
      </p>

      {/* Options */}
      <div className="space-y-2 mb-3">
        {item.options.map((opt, i) => {
          const isThis = selected === i;
          const isCorrectOpt = i === item.correct;

          let style = 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600';
          if (isAnswered) {
            if (isCorrectOpt) {
              style = 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700';
            } else if (isThis) {
              style = 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700';
            } else {
              style = 'opacity-40 bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={isAnswered}
              className={cn(
                'w-full py-2.5 px-4 rounded-xl text-sm font-medium border text-left transition-all',
                style,
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className={cn(
              'text-xs font-medium',
              isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400',
            )}>
              {isCorrect
                ? `Chính xác! +${XP_VALUES.usage_quiz_correct} XP`
                : `Sai rồi! Đáp án: ${item.options[item.correct]}`}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {item.explanation}
            </p>

            <button
              onClick={handleNext}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 pt-1"
            >
              {currentIndex < items.length - 1 ? 'Câu tiếp →' : 'Xem kết quả'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
