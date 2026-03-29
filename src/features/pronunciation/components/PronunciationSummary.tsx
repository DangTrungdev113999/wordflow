import { motion } from 'framer-motion';
import { Trophy, RotateCcw, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import type { PronunciationScore } from '../hooks/usePronunciationSession';
import type { VocabWord } from '../../../lib/types';

interface PronunciationSummaryProps {
  scores: PronunciationScore[];
  xpEarned: number;
  words: VocabWord[];
  onPracticeAgain: () => void;
  onBack: () => void;
}

export function PronunciationSummary({
  scores,
  xpEarned,
  words,
  onPracticeAgain,
  onBack,
}: PronunciationSummaryProps) {
  const passedCount = scores.filter((s) => s.passed).length;
  const total = scores.length;
  const accuracy = total > 0 ? Math.round((passedCount / total) * 100) : 0;
  const isPerfect = passedCount === total;

  const wordMap = new Map(words.map((w) => [w.word, w]));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="text-5xl">{isPerfect ? '🎉' : accuracy >= 70 ? '👏' : '💪'}</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Session Complete!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {isPerfect
            ? 'Perfect pronunciation!'
            : accuracy >= 70
              ? 'Great job! Keep practicing.'
              : 'Practice makes perfect. Try again!'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{passedCount}/{total}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Passed</p>
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

      {/* Per-word breakdown */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Word Breakdown</h3>
        <div className="space-y-2">
          {scores.map((score) => {
            const vocabWord = wordMap.get(score.word);
            return (
              <div
                key={score.word}
                className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${
                  score.passed
                    ? 'bg-green-50 dark:bg-green-900/15 border-green-100 dark:border-green-800/40'
                    : 'bg-red-50 dark:bg-red-900/15 border-red-100 dark:border-red-800/40'
                }`}
              >
                {score.passed ? (
                  <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                ) : (
                  <XCircle size={18} className="text-red-500 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-900 dark:text-white">{score.word}</span>
                  {vocabWord && (
                    <span className="ml-2 text-gray-400">{vocabWord.ipa}</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 shrink-0">
                  {score.attempts} {score.attempts === 1 ? 'attempt' : 'attempts'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
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
