import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ className, children, padding = 'md', ...props }: CardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800',
        { sm: 'p-3', md: 'p-4', lg: 'p-6', none: '' }[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
