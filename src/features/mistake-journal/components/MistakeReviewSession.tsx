import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { useMistakeStore } from '../../../stores/mistakeStore';
import type { Mistake, ReviewResult } from '../../../models/Mistake';

const RATING_BUTTONS: { result: ReviewResult; label: string; sublabel: string; color: string }[] = [
  { result: 'forgot', label: 'Forgot', sublabel: 'Review again soon', color: 'bg-red-500 hover:bg-red-600 text-white' },
  { result: 'hard', label: 'Hard', sublabel: 'Remembered with difficulty', color: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { result: 'good', label: 'Good', sublabel: 'Remembered correctly', color: 'bg-blue-500 hover:bg-blue-600 text-white' },
  { result: 'easy', label: 'Easy', sublabel: 'Too easy', color: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
];

interface Props {
  onComplete: () => void;
}

export function MistakeReviewSession({ onComplete }: Props) {
  const { getDueForReview, reviewMistake } = useMistakeStore();
  const dueItems = useMemo(() => getDueForReview(), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const current: Mistake | undefined = dueItems[currentIndex];
  const total = dueItems.length;

  const handleFlip = useCallback(() => {
    setIsFlipped(true);
  }, []);

  const handleRate = useCallback((result: ReviewResult) => {
    if (!current) return;
    reviewMistake(current.id, result);
    setReviewedCount(prev => prev + 1);
    setIsFlipped(false);

    if (currentIndex + 1 >= total) {
      // Session complete
      setTimeout(onComplete, 300);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [current, currentIndex, total, reviewMistake, onComplete]);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 size={48} className="text-emerald-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">All caught up!</h3>
        <p className="text-sm text-gray-500">No mistakes due for review right now. Come back later.</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 size={48} className="text-emerald-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Session Complete!</h3>
        <p className="text-sm text-gray-500 mb-4">You reviewed {reviewedCount} {reviewedCount === 1 ? 'mistake' : 'mistakes'}.</p>
        <Button onClick={onComplete}>Done</Button>
      </div>
    );
  }

  const progress = ((currentIndex) / total) * 100;

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentIndex + 1} / {total}
        </span>
        <span className="text-xs text-gray-400">
          {reviewedCount} reviewed
        </span>
      </div>
      <ProgressBar value={progress} className="mb-6" />

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          {/* 3D Flip Card */}
          <div
            className="relative cursor-pointer"
            style={{ perspective: 1000 }}
            onClick={!isFlipped ? handleFlip : undefined}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative min-h-[280px]"
            >
              {/* Front face */}
              <div
                className="absolute inset-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-medium text-gray-400 capitalize">{current.type.replace('_', ' ')}</span>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[280px] p-8 text-center">
                  <p className="text-base font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-6">
                    {current.question}
                  </p>
                  <p className="text-sm text-red-500 dark:text-red-400 mb-4">
                    Your answer: <span className="font-medium line-through">{current.userAnswer}</span>
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <RotateCcw size={14} />
                    <span>Tap to reveal answer</span>
                  </div>
                </div>
              </div>

              {/* Back face */}
              <div
                className="absolute inset-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-medium text-gray-400 capitalize">{current.type.replace('_', ' ')}</span>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[280px] p-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{current.question}</p>
                  <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">{current.correctAnswer}</p>
                  {current.explanation && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-2 max-w-xs">{current.explanation}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Rating buttons */}
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2"
            >
              {RATING_BUTTONS.map(({ result, label, sublabel, color }) => (
                <button
                  key={result}
                  onClick={() => handleRate(result)}
                  className={`${color} rounded-xl py-3 px-2 text-center transition-all active:scale-95`}
                >
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs opacity-80 mt-0.5 leading-tight">{sublabel}</span>
                </button>
              ))}
            </motion.div>
          )}

          {!isFlipped && (
            <div className="mt-4 flex justify-center">
              <Button onClick={handleFlip} className="gap-2">
                Show Answer <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
