import { motion } from 'framer-motion';
import { Trophy, RotateCcw, ArrowLeft } from 'lucide-react';
import type { VocabWord } from '../../../lib/types';

interface IncorrectAnswer {
  item: { word: VocabWord; target: string };
  userAnswer: string;
  correct: boolean;
}

interface DictationSessionSummaryProps {
  correctCount: number;
  total: number;
  xpEarned: number;
  incorrectAnswers: IncorrectAnswer[];
  onPracticeAgain: () => void;
  onBack: () => void;
}

export function DictationSessionSummary({
  correctCount,
  total,
  xpEarned,
  incorrectAnswers,
  onPracticeAgain,
  onBack,
}: DictationSessionSummaryProps) {
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const isPerfect = correctCount === total;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <div className="text-5xl">{isPerfect ? '🎉' : accuracy >= 70 ? '👏' : '💪'}</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Session Complete!</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{correctCount}/{total}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Correct</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{accuracy}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Accuracy</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <Trophy size={16} className="text-amber-500" />
            <p className="text-2xl font-bold text-amber-500">+{xpEarned}</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">XP Earned</p>
        </div>
      </div>

      {incorrectAnswers.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">Review</h3>
          <div className="space-y-2">
            {incorrectAnswers.map((a, i) => (
              <div key={i} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/40 text-sm">
                <p className="font-medium text-gray-900 dark:text-white">{a.item.word.word} <span className="text-gray-400">{a.item.word.ipa}</span></p>
                <p className="text-red-600 dark:text-red-400 mt-1">Your answer: {a.userAnswer}</p>
                <p className="text-green-600 dark:text-green-400">Correct: {a.item.target}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Listening
        </button>
        <button
          onClick={onPracticeAgain}
          className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Practice Again
        </button>
      </div>
    </motion.div>
  );
}
