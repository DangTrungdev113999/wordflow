import { CheckCircle2, XCircle, Trophy, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { SentenceBuildingResult, SentenceBuildingExercise } from '../../lib/types';

interface SentenceBuildingSummaryProps {
  results: SentenceBuildingResult[];
  exercises: SentenceBuildingExercise[];
  totalScore: number;
  totalXP: number;
  onBack: () => void;
}

export function SentenceBuildingSummary({
  results,
  exercises,
  totalScore,
  totalXP,
  onBack,
}: SentenceBuildingSummaryProps) {
  const correctCount = results.filter((r) => r.correct).length;
  const totalCount = results.length;
  const avgScore = totalCount > 0 ? Math.round(totalScore / totalCount) : 0;

  return (
    <div className="space-y-6">
      {/* Summary header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
          <Trophy size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Session Complete!</h2>
        <p className="text-gray-500 dark:text-gray-400">
          {correctCount === totalCount
            ? 'Perfect score! Amazing work!'
            : correctCount >= totalCount * 0.7
            ? 'Great job! Keep it up!'
            : 'Good effort! Practice makes perfect.'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {correctCount}/{totalCount}
          </p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">Correct</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{avgScore}</p>
          <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-1">Avg Score</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">+{totalXP}</p>
          <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">XP Earned</p>
        </div>
      </div>

      {/* Results list */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Review
        </h3>
        <div className="space-y-2">
          {results.map((result, i) => {
            const exercise = exercises.find((e) => e.id === result.exerciseId);
            if (!exercise) return null;

            return (
              <div
                key={result.exerciseId}
                className={cn(
                  'rounded-xl border p-3',
                  result.correct
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10'
                    : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {result.correct ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <XCircle size={18} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {exercise.sentence}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {exercise.translation}
                    </p>
                    {!result.correct && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        Your answer: {result.userAnswer}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        result.score >= 80
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : result.score >= 50
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                      )}
                    >
                      {result.score}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 w-full justify-center px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <ArrowLeft size={16} /> Back to Topics
      </button>
    </div>
  );
}
