import { Flame } from 'lucide-react';
import Lottie from 'lottie-react';
import { cn } from '../../lib/utils';
import fireAnim from '../../assets/lottie/fire.json';

interface StreakFireProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-8 h-8' } as const;
const iconSizeClasses = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' } as const;

export function StreakFire({ streak, size = 'md', className }: StreakFireProps) {
  const isActive = streak > 0;
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {isActive ? (
        <Lottie
          animationData={fireAnim}
          loop={true}
          className={sizeClasses[size]}
        />
      ) : (
        <Flame
          className={cn(
            'transition-colors text-gray-600 dark:text-gray-400',
            iconSizeClasses[size]
          )}
        />
      )}
      <span
        className={cn(
          'font-bold tabular-nums',
          isActive ? 'text-orange-500' : 'text-gray-600 dark:text-gray-400',
          { sm: 'text-sm', md: 'text-base', lg: 'text-lg' }[size]
        )}
      >
        {streak}
      </span>
    </div>
  );
}
