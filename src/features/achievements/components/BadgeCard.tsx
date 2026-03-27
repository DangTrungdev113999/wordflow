import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import type { AchievementDefinition } from '../../../lib/types';

interface Props {
  achievement: AchievementDefinition;
  earned: boolean;
}

export function BadgeCard({ achievement, earned }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-2xl border transition-all',
        earned
          ? 'bg-white dark:bg-gray-900 border-amber-200 dark:border-amber-800'
          : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-50'
      )}
    >
      <div className={cn(
        'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
        earned ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-100 dark:bg-gray-800 grayscale'
      )}>
        {achievement.badge}
      </div>
      <div className="flex-1">
        <h3 className={cn(
          'font-semibold',
          earned ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
        )}>
          {achievement.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
      </div>
      {earned && <span className="text-green-500 text-lg">✓</span>}
    </motion.div>
  );
}
