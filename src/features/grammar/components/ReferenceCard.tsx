import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

const hoverBorderByColor: Record<string, string> = {
  violet: 'group-hover:border-violet-200 dark:group-hover:border-violet-800',
  indigo: 'group-hover:border-indigo-200 dark:group-hover:border-indigo-800',
  emerald: 'group-hover:border-emerald-200 dark:group-hover:border-emerald-800',
  amber: 'group-hover:border-amber-200 dark:group-hover:border-amber-800',
  sky: 'group-hover:border-sky-200 dark:group-hover:border-sky-800',
  teal: 'group-hover:border-teal-200 dark:group-hover:border-teal-800',
  rose: 'group-hover:border-rose-200 dark:group-hover:border-rose-800',
  orange: 'group-hover:border-orange-200 dark:group-hover:border-orange-800',
  fuchsia: 'group-hover:border-fuchsia-200 dark:group-hover:border-fuchsia-800',
  cyan: 'group-hover:border-cyan-200 dark:group-hover:border-cyan-800',
};

interface ReferenceCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  count: string;
  accentColor: string;
  accentBg: string;
  accentText: string;
}

export function ReferenceCard({
  to,
  icon: Icon,
  title,
  description,
  count,
  accentColor,
  accentBg,
  accentText,
}: ReferenceCardProps) {
  return (
    <Link to={to} className="block group" aria-label={`${title} — ${description}`}>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className={`flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 ${hoverBorderByColor[accentColor] ?? ''} transition-colors`}
      >
        <div
          className={`w-11 h-11 rounded-xl ${accentBg} flex items-center justify-center flex-shrink-0`}
        >
          <Icon size={22} className={accentText} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-[15px] leading-snug">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
            {description}
          </p>
          <span className="inline-block mt-1.5 text-xs font-medium text-gray-400 dark:text-gray-500">
            {count}
          </span>
        </div>
        <ChevronRight
          size={18}
          className="text-gray-300 dark:text-gray-600 mt-1 flex-shrink-0 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors"
        />
      </motion.div>
    </Link>
  );
}
