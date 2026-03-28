import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { RotateCcw, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { WeakWordsList } from './WeakWordsList';
import type { WeakWord } from '../../../services/weakWordsService';
import celebrationAnim from '../../../assets/lottie/celebration.json';

interface SessionSummaryProps {
  correct: number;
  total: number;
  accuracy: number;
  xpEarned: number;
  weakWords: WeakWord[];
  onPracticeWeakWords?: () => void;
  onBack: () => void;
  onRetry: () => void;
  backLabel?: string;
  title?: string;
}

export function SessionSummary({
  correct,
  total,
  accuracy,
  xpEarned,
  weakWords,
  onPracticeWeakWords,
  onBack,
  onRetry,
  backLabel = 'Word List',
  title = 'Session Complete!',
}: SessionSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="px-4 py-10 flex flex-col items-center gap-6 text-center max-w-md mx-auto"
    >
      <Lottie
        animationData={celebrationAnim}
        loop={false}
        className="w-32 h-32"
      />

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {total} cards reviewed
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
          <p className="text-2xl font-bold text-green-600">
            {correct}/{total}
          </p>
          <p className="text-xs text-green-700 dark:text-green-400">Correct</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
          <p className="text-2xl font-bold text-blue-600">{accuracy}%</p>
          <p className="text-xs text-blue-700 dark:text-blue-400">Accuracy</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4">
          <p className="text-2xl font-bold text-indigo-600">+{xpEarned}</p>
          <p className="text-xs text-indigo-700 dark:text-indigo-400">
            XP Earned
          </p>
        </div>
      </div>

      {weakWords.length > 0 && (
        <div className="w-full">
          <WeakWordsList words={weakWords} />
          {onPracticeWeakWords && (
            <Button
              className="w-full mt-3"
              onClick={onPracticeWeakWords}
            >
              <Zap size={18} />
              Practice Weak Words
            </Button>
          )}
        </div>
      )}

      <div className="flex gap-3 w-full">
        <Button variant="secondary" className="flex-1" onClick={onBack}>
          {backLabel}
        </Button>
        <Button className="flex-1" onClick={onRetry}>
          <RotateCcw size={18} />
          Study Again
        </Button>
      </div>
    </motion.div>
  );
}
