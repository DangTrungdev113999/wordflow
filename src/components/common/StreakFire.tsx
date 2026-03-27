import { Flame } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StreakFireProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StreakFire({ streak, size = 'md', className }: StreakFireProps) {
  const isActive = streak > 0;
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Flame
        className={cn(
          'transition-colors',
          isActive ? 'text-orange-500' : 'text-gray-300 dark:text-gray-700',
          { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }[size]
        )}
        fill={isActive ? 'currentColor' : 'none'}
      />
      <span
        className={cn(
          'font-bold tabular-nums',
          isActive ? 'text-orange-500' : 'text-gray-400 dark:text-gray-600',
          { sm: 'text-sm', md: 'text-base', lg: 'text-lg' }[size]
        )}
      >
        {streak}
      </span>
    </div>
  );
}
