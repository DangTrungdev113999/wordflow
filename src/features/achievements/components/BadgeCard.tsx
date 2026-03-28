import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { TierBadge, getTierBorderClass } from './TierBadge';
import type { AchievementDefinition } from '../../../lib/types';

interface Props {
  achievement: AchievementDefinition;
  earned: boolean;
  onShare?: (achievement: AchievementDefinition) => void;
}

export function BadgeCard({ achievement, earned, onShare }: Props) {
  const tierBorder = earned && achievement.tier
    ? getTierBorderClass(achievement.tier)
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-2xl border transition-all',
        earned
          ? cn('bg-white dark:bg-gray-900', tierBorder || 'border-amber-200 dark:border-amber-800')
          : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-50'
      )}
    >
      <div className={cn(
        'w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0',
        earned ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-100 dark:bg-gray-800 grayscale'
      )}>
        {achievement.badge}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            'font-semibold truncate',
            earned ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
          )}>
            {achievement.title}
          </h3>
          {achievement.tier && <TierBadge tier={achievement.tier} />}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{achievement.description}</p>
      </div>
      {earned && (
        <div className="flex items-center gap-2 shrink-0">
          {onShare && (
            <button
              onClick={(e) => { e.stopPropagation(); onShare(achievement); }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-indigo-500 transition-colors"
              aria-label="Share achievement"
            >
              <Share2 size={16} />
            </button>
          )}
          <span className="text-green-500 text-lg">✓</span>
        </div>
      )}
    </motion.div>
  );
}
