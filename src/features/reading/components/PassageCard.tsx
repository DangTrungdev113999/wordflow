import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ChevronRight, FileText } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { TOPIC_ICONS, TOPIC_COLORS } from '../../../lib/constants';
import type { ReadingPassage } from '../data/passages';

interface Props {
  passage: ReadingPassage;
  index: number;
}

export function PassageCard({ passage, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link
        to={`/reading/${passage.id}`}
        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-md group"
      >
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${TOPIC_COLORS[passage.topic] ?? 'from-indigo-400 to-indigo-600'} flex items-center justify-center text-2xl shadow-sm`}
        >
          {TOPIC_ICONS[passage.topic] ?? '📝'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{passage.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            <FileText size={14} />
            <span>{passage.wordCount} words</span>
            <span>·</span>
            <span>{passage.questions.length} questions</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge label={passage.level} variant="cefr" />
          <ChevronRight
            size={18}
            className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors"
          />
        </div>
      </Link>
    </motion.div>
  );
}
