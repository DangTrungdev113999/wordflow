import { Trophy } from 'lucide-react';
import { getAllAchievements } from '../../../services/achievementEngine';
import { useProgressStore } from '../../../stores/progressStore';
import { BadgeCard } from '../components/BadgeCard';
import { LevelProgress } from '../components/LevelProgress';

export function AchievementsPage() {
  const { badges } = useProgressStore();
  const allAchievements = getAllAchievements();
  const earned = allAchievements.filter((a) => badges.includes(a.id));
  const locked = allAchievements.filter((a) => !badges.includes(a.id));

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
          <Trophy size={22} className="text-amber-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {earned.length}/{allAchievements.length} unlocked
          </p>
        </div>
      </div>

      <LevelProgress />

      {earned.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Earned
          </h2>
          <div className="space-y-2">
            {earned.map((a) => (
              <BadgeCard key={a.id} achievement={a} earned />
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Locked
          </h2>
          <div className="space-y-2">
            {locked.map((a) => (
              <BadgeCard key={a.id} achievement={a} earned={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
