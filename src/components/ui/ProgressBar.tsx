import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: 'indigo' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({ value, max = 100, color = 'indigo', size = 'md', showLabel, className, barClassName }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden', { sm: 'h-1.5', md: 'h-2.5' }[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            barClassName ?? {
              indigo: 'bg-indigo-500',
              green: 'bg-green-500',
              yellow: 'bg-yellow-400',
              red: 'bg-red-500',
            }[color]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
