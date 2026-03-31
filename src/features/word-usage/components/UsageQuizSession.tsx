import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { useProgressStore } from '../../../stores/progressStore';
import { cn } from '../../../lib/utils';

const XP_PER_CORRECT = 10;

export interface UsageQuizItem {
  id: string;
  sentence: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source: string; // pattern label for display
}

interface UsageQuizSessionProps {
  items: UsageQuizItem[];
  title?: string;
  onClose: () => void;
}

export function UsageQuizSession({ items, title = 'Grammar Quiz', onClose }: UsageQuizSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const addXP = useProgressStore(s => s.addXP);

  const isComplete = results.length === items.length;
  const item = items[currentIndex];

  const isAnswered = selected !== null;
  const isCorrect = item ? selected === item.correctIndex : false;

  const handleSelect = useCallback((optIndex: number) => {
    if (isAnswered) return;
    setSelected(optIndex);
    if (optIndex === items[currentIndex]?.correctIndex) {
      addXP(XP_PER_CORRECT);
    }
  }, [isAnswered, currentIndex, items, addXP]);

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

  // ── Result screen ──
  if (isComplete) {
    const score = results.filter(Boolean).length;
    const xpEarned = score * XP_PER_CORRECT;
    const pct = Math.round((score / results.length) * 100);

    return (
      <Card className="text-center space-y-4">
        <div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl mb-2"
          >
            {pct === 100 ? '🏆' : pct >= 70 ? '🎯' : '📖'}
          </motion.div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kết quả</p>
        </div>

        {/* Score ring */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-800" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                strokeWidth="6" strokeLinecap="round"
                className={pct >= 70 ? 'text-emerald-500' : 'text-amber-500'}
                stroke="currentColor"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - pct / 100) }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">{score}/{results.length}</span>
            </div>
          </div>
        </div>

        {/* XP earned */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            +{xpEarned} XP
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5">
          {results.map((correct, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full',
                correct ? 'bg-emerald-500' : 'bg-red-400'
              )}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-center pt-1">
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
      </Card>
    );
  }

  // ── Quiz question ──
  if (!item) return null;

  return (
    <Card className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-[10px] text-gray-400 mt-0.5">{item.source}</p>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Đóng
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1">
        {items.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 rounded-full flex-1 transition-colors',
              i < results.length
                ? results[i] ? 'bg-emerald-500' : 'bg-red-400'
                : i === currentIndex ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
            )}
          />
        ))}
      </div>

      {/* Question */}
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {item.sentence}
      </p>

      {/* Options */}
      <div className="space-y-2">
        {item.options.map((opt, oi) => {
          const isThis = selected === oi;
          const isCorrectOpt = oi === item.correctIndex;

          let style = 'bg-gray-50 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700';
          if (isAnswered) {
            if (isCorrectOpt) {
              style = 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700';
            } else if (isThis) {
              style = 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700';
            } else {
              style = 'opacity-40 bg-gray-50 dark:bg-gray-800/70 text-gray-400 border-gray-200 dark:border-gray-700';
            }
          }

          return (
            <button
              key={oi}
              onClick={() => handleSelect(oi)}
              disabled={isAnswered}
              className={cn(
                'w-full py-2.5 px-4 rounded-xl text-sm font-medium border transition-all text-left',
                style
              )}
            >
              <span className="text-[10px] text-gray-400 mr-2 font-mono">
                {String.fromCharCode(65 + oi)}.
              </span>
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
            <div className="flex items-center gap-2">
              <p className={cn(
                'text-xs font-semibold',
                isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              )}>
                {isCorrect ? 'Chính xác! +10 XP' : `Sai rồi! Đáp án: ${item.options[item.correctIndex]}`}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.explanation}</p>

            <button
              onClick={handleNext}
              className="w-full py-2 rounded-xl text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors mt-1"
            >
              {currentIndex < items.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
