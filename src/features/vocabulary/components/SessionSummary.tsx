import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { RotateCcw, Zap, Flame, Timer, Shuffle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { WeakWordsList } from './WeakWordsList';
import type { WeakWord } from '../../../services/weakWordsService';
import celebrationAnim from '../../../assets/lottie/celebration.json';

export interface XPBreakdown {
  base: number;
  streakBonus: number;
  mixedBonus?: number;
  speedBonus?: number;
}

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
  bestStreak?: number;
  xpBreakdown?: XPBreakdown;
}

function XPBreakdownCard({ breakdown, totalXP }: { breakdown: XPBreakdown; totalXP: number }) {
  const lines: Array<{ label: string; value: number; icon: React.ReactNode; color: string }> = [
    { label: 'Base XP', value: breakdown.base, icon: <Zap size={14} />, color: 'text-indigo-500' },
  ];

  if (breakdown.streakBonus > 0) {
    lines.push({ label: 'Streak Bonus', value: breakdown.streakBonus, icon: <Flame size={14} />, color: 'text-amber-500' });
  }
  if (breakdown.mixedBonus && breakdown.mixedBonus > 0) {
    lines.push({ label: 'Mixed 1.5x', value: breakdown.mixedBonus, icon: <Shuffle size={14} />, color: 'text-violet-500' });
  }
  if (breakdown.speedBonus && breakdown.speedBonus > 0) {
    lines.push({ label: 'Speed Bonus', value: breakdown.speedBonus, icon: <Timer size={14} />, color: 'text-emerald-500' });
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 space-y-2">
      {lines.map((line) => (
        <div key={line.label} className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span className={line.color}>{line.icon}</span>
            {line.label}
          </span>
          <span className="font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
            +{line.value}
          </span>
        </div>
      ))}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">Total</span>
        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
          +{totalXP}
        </span>
      </div>
    </div>
  );
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
  bestStreak,
  xpBreakdown,
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

      {/* Stats grid — show best streak if available */}
      <div className={`grid gap-3 w-full ${bestStreak && bestStreak >= 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
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
        {bestStreak != null && bestStreak >= 3 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
            <p className="text-2xl font-bold text-amber-600">
              {bestStreak}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">Best Streak</p>
          </div>
        )}
      </div>

      {/* XP Breakdown */}
      {xpBreakdown && (
        <XPBreakdownCard breakdown={xpBreakdown} totalXP={xpEarned} />
      )}

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
