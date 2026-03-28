import { cn } from '../../lib/utils';

interface BadgeProps {
  label?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'cefr';
  className?: string;
}

export function Badge({ label, children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        {
          default: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
          success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
          warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
          info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
          cefr: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
        }[variant],
        className
      )}
    >
      {label || children}
    </span>
  );
}
