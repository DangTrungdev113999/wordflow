import { useState, useMemo } from 'react';
import { Trophy, Filter } from 'lucide-react';
import { getAllAchievements } from '../../../services/achievementEngine';
import { useProgressStore } from '../../../stores/progressStore';
import { cn } from '../../../lib/utils';
import { BadgeCard } from '../components/BadgeCard';
import { LevelProgress } from '../components/LevelProgress';
import { AchievementShareModal } from '../components/AchievementShareModal';
import type { AchievementDefinition, AchievementCategory, AchievementTier } from '../../../lib/types';

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  vocabulary: 'Vocabulary',
  streak: 'Streaks',
  grammar: 'Grammar',
  writing: 'Writing',
  sentence_building: 'Sentence Building',
  media: 'Media Learning',
  daily_challenge: 'Daily Challenge',
  study_planner: 'Study Planner',
  mistake_journal: 'Mistake Journal',
  tier: 'Scholar Tiers',
  general: 'General',
};

const CATEGORY_ORDER: AchievementCategory[] = [
  'tier',
  'vocabulary',
  'streak',
  'grammar',
  'writing',
  'sentence_building',
  'media',
  'daily_challenge',
  'study_planner',
  'mistake_journal',
  'general',
];

type TierFilter = 'all' | AchievementTier;

export function AchievementsPage() {
  const { badges } = useProgressStore();
  const allAchievements = getAllAchievements();
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [shareTarget, setShareTarget] = useState<AchievementDefinition | null>(null);

  const filteredAchievements = useMemo(() => {
    if (tierFilter === 'all') return allAchievements;
    return allAchievements.filter((a) => a.tier === tierFilter);
  }, [allAchievements, tierFilter]);

  const earnedCount = allAchievements.filter((a) => badges.includes(a.id)).length;

  // Group by category
  const grouped = useMemo(() => {
    const groups = new Map<AchievementCategory, AchievementDefinition[]>();
    for (const a of filteredAchievements) {
      const cat = a.category || 'general';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(a);
    }
    return CATEGORY_ORDER
      .filter((cat) => groups.has(cat))
      .map((cat) => ({
        category: cat,
        label: CATEGORY_LABELS[cat],
        achievements: groups.get(cat)!,
        earnedInGroup: groups.get(cat)!.filter((a) => badges.includes(a.id)).length,
      }));
  }, [filteredAchievements, badges]);

  const tierFilters: { value: TierFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'bronze', label: '🥉 Bronze' },
    { value: 'silver', label: '🥈 Silver' },
    { value: 'gold', label: '🥇 Gold' },
  ];

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
          <Trophy size={22} className="text-amber-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {earnedCount}/{allAchievements.length} unlocked
          </p>
        </div>
      </div>

      <LevelProgress />

      {/* Progress Overview */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 text-center">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{earnedCount}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Earned</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 text-center">
          <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">{allAchievements.length - earnedCount}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Locked</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 text-center">
          <div className="text-2xl font-bold text-amber-500">
            {allAchievements.length > 0 ? Math.round((earnedCount / allAchievements.length) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Complete</div>
        </div>
      </div>

      {/* Tier Filter */}
      <div className="mt-5 flex items-center gap-2">
        <Filter size={14} className="text-gray-400 shrink-0" />
        <div className="flex gap-1.5 overflow-x-auto">
          {tierFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setTierFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                tierFilter === f.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Achievements */}
      {grouped.map(({ category, label, achievements, earnedInGroup }) => (
        <div key={category} className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {label}
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {earnedInGroup}/{achievements.length}
            </span>
          </div>
          {/* Category progress bar */}
          <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${achievements.length > 0 ? (earnedInGroup / achievements.length) * 100 : 0}%` }}
            />
          </div>
          <div className="space-y-2">
            {achievements.map((a) => (
              <BadgeCard
                key={a.id}
                achievement={a}
                earned={badges.includes(a.id)}
                onShare={badges.includes(a.id) ? setShareTarget : undefined}
              />
            ))}
          </div>
        </div>
      ))}

      {filteredAchievements.length === 0 && (
        <div className="mt-12 text-center text-gray-400 dark:text-gray-500">
          <p>No achievements match this filter.</p>
        </div>
      )}

      {/* Share Modal */}
      <AchievementShareModal
        achievement={shareTarget}
        onClose={() => setShareTarget(null)}
      />
    </div>
  );
}
