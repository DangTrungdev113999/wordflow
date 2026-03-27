import { cn } from '../../lib/utils';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ className, children, padding = 'md', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800',
        { sm: 'p-3', md: 'p-4', lg: 'p-6', none: '' }[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
