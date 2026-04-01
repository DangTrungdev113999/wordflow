import { StreakFire } from '../../../components/common/StreakFire';
import { Card } from '../../../components/ui/Card';
import { useProgressStore } from '../../../stores/progressStore';

export function StreakWidget() {
  const { currentStreak, longestStreak } = useProgressStore();

  return (
    <Card className="flex items-center gap-4">
      <StreakFire streak={currentStreak} size="lg" />
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Streak</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">Best: {longestStreak} days</p>
      </div>
    </Card>
  );
}
