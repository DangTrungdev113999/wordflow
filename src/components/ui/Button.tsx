import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950',
        {
          primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm shadow-indigo-200 dark:shadow-indigo-900 ring-[var(--color-primary)]',
          secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ring-[var(--color-primary)]',
          ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ring-[var(--color-primary)]',
          danger: 'bg-danger text-white hover:bg-danger-hover ring-[var(--color-danger)]',
        }[variant],
        {
          sm: 'px-3 py-1.5 text-sm gap-1.5',
          md: 'px-4 py-2.5 text-sm gap-2',
          lg: 'px-6 py-3 text-base gap-2',
        }[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
