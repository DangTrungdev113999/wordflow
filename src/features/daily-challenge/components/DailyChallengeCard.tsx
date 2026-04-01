import { Link } from 'react-router';
import { ChevronRight, Flame } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import { useProgressStore } from '../../../stores/progressStore';

function DailyChallengeCardSkeleton() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
    </Card>
  );
}

export function DailyChallengeCard() {
  const { content, tasks, completed, xpEarned, loading } = useDailyChallenge();
  const currentStreak = useProgressStore(s => s.currentStreak);

  if (loading) return <DailyChallengeCardSkeleton />;

  const doneCount = tasks.filter(t => t.completed).length;
  const started = doneCount > 0;

  return (
    <Link to="/daily-challenge" className="block">
      <Card interactive className="group hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
        {completed ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">✅ Challenge Complete!</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
                Earned {xpEarned} XP today
                {currentStreak > 1 && (
                  <span className="inline-flex items-center gap-0.5 ml-1.5 text-amber-600 dark:text-amber-400">
                    <Flame size={10} /> {currentStreak}-day streak
                  </span>
                )}
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-600 dark:text-gray-400 group-hover:text-indigo-400" />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">🎯 Today's Challenge</p>
              {started ? (
                <p className="text-xs text-indigo-500 mt-0.5">{doneCount}/5 tasks done — Continue</p>
              ) : (
                <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
                  Word: <span className="font-medium text-indigo-600 dark:text-indigo-400">{content.word.word}</span>
                  <span className="text-gray-600 dark:text-gray-400 mx-1">·</span>
                  5 tasks
                </p>
              )}
            </div>
            <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full group-hover:bg-indigo-600 transition-colors">
              {started ? 'Continue' : 'Start'}
            </span>
          </div>
        )}
      </Card>
    </Link>
  );
}
