export interface StreakMilestone {
  days: number;
  xpBonus: number;
  badgeId: string;
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, xpBonus: 50, badgeId: 'streak_3' },
  { days: 7, xpBonus: 100, badgeId: 'streak_7' },
  { days: 14, xpBonus: 200, badgeId: 'streak_14' },
  { days: 30, xpBonus: 500, badgeId: 'streak_30' },
  { days: 100, xpBonus: 2000, badgeId: 'streak_100' },
];

export function checkStreakMilestone(streak: number): StreakMilestone | null {
  // Return the milestone that was just hit (exact match only)
  return STREAK_MILESTONES.find(m => m.days === streak) ?? null;
}
