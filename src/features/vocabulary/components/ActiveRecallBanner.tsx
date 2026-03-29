import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../../db/database';
import { calculateSM2, createInitialProgress } from '../../../services/spacedRepetition';
import type { FlashcardRating } from '../../../lib/types';
import { cn } from '../../../lib/utils';

interface ActiveRecallBannerProps {
  wordId: string;
  word: string;
  onReveal: () => void;
}

const SELF_RATINGS = [
  {
    rating: 0 as FlashcardRating,
    label: 'Không nhớ',
    icon: '😕',
    color: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40',
  },
  {
    rating: 3 as FlashcardRating,
    label: 'Mang máng',
    icon: '🤔',
    color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40',
  },
  {
    rating: 5 as FlashcardRating,
    label: 'Nhớ rõ',
    icon: '😎',
    color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
  },
] as const;

type Phase = 'prompt' | 'rating' | 'done';

export function ActiveRecallBanner({ wordId, word, onReveal }: ActiveRecallBannerProps) {
  const [phase, setPhase] = useState<Phase>('prompt');

  const handleReveal = useCallback(() => {
    setPhase('rating');
    onReveal();
  }, [onReveal]);

  const handleRate = useCallback(
    async (quality: FlashcardRating) => {
      // Update SM-2 for this word
      const existing = await db.wordProgress.get(wordId);
      const current = existing ?? createInitialProgress(wordId);
      const result = calculateSM2(quality, current);

      await db.wordProgress.put({
        wordId,
        easeFactor: result.easeFactor,
        interval: result.interval,
        repetitions: result.repetitions,
        nextReview: result.nextReview,
        lastReview: Date.now(),
        status: result.status,
      });

      setPhase('done');
    },
    [wordId]
  );

  return (
    <AnimatePresence mode="wait">
      {phase === 'prompt' && (
        <motion.div
          key="prompt"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-950/50 dark:via-violet-950/40 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 p-5"
        >
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-indigo-200/30 dark:bg-indigo-800/20 blur-sm" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-purple-200/30 dark:bg-purple-800/20 blur-sm" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🧠</span>
              <h3 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 tracking-wide uppercase">
                Quick recall
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Bạn nhớ nghĩa của <strong className="text-indigo-700 dark:text-indigo-300">{word}</strong> không?
              Tự nhớ trước rồi check!
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReveal}
              className="w-full py-3 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-200 dark:shadow-indigo-900/50 transition-colors hover:bg-indigo-700 dark:hover:bg-indigo-400"
            >
              Hiện nghĩa
            </motion.button>
          </div>
        </motion.div>
      )}

      {phase === 'rating' && (
        <motion.div
          key="rating"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center">
            Bạn nhớ được bao nhiêu?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {SELF_RATINGS.map(({ rating, label, icon, color }) => (
              <motion.button
                key={rating}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRate(rating)}
                className={cn(
                  'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-xs font-semibold transition-colors',
                  color
                )}
              >
                <span className="text-xl leading-none">{icon}</span>
                <span>{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'done' && (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-4 text-center"
        >
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            ✓ Đã ghi nhận! Lịch ôn tập đã cập nhật.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
