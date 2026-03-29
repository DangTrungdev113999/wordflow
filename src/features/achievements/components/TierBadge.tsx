import { cn } from '../../../lib/utils';
import type { AchievementTier } from '../../../lib/types';

interface Props {
  tier: AchievementTier;
  size?: 'sm' | 'md';
}

const TIER_CONFIG: Record<AchievementTier, { label: string; bg: string; text: string; ring: string }> = {
  bronze: {
    label: 'Bronze',
    bg: 'bg-amber-700/10 dark:bg-amber-700/20',
    text: 'text-amber-700 dark:text-amber-500',
    ring: 'ring-amber-600/40',
  },
  silver: {
    label: 'Silver',
    bg: 'bg-slate-400/10 dark:bg-slate-400/20',
    text: 'text-slate-500 dark:text-slate-300',
    ring: 'ring-slate-400/40',
  },
  gold: {
    label: 'Gold',
    bg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    ring: 'ring-yellow-500/40',
  },
};

export function TierBadge({ tier, size = 'sm' }: Props) {
  const config = TIER_CONFIG[tier];

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold uppercase tracking-wider ring-1',
        config.bg,
        config.text,
        config.ring,
        size === 'sm' ? 'text-xs px-1.5 py-0.5 rounded' : 'text-xs px-2 py-0.5 rounded-md'
      )}
    >
      {config.label}
    </span>
  );
}

export function getTierBorderClass(tier?: AchievementTier): string {
  if (!tier) return '';
  const borders: Record<AchievementTier, string> = {
    bronze: 'border-amber-600/50 dark:border-amber-600/40',
    silver: 'border-slate-400/60 dark:border-slate-400/40',
    gold: 'border-yellow-500/60 dark:border-yellow-400/50',
  };
  return borders[tier];
}
