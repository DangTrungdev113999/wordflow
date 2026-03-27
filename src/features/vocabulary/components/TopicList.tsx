import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import type { VocabTopic } from '../../../lib/types';
import { Badge } from '../../../components/ui/Badge';
import { TOPIC_ICONS, TOPIC_COLORS } from '../../../lib/constants';

interface TopicListProps {
  topics: VocabTopic[];
}

export function TopicList({ topics }: TopicListProps) {
  return (
    <div className="grid gap-3">
      {topics.map((topic, i) => (
        <motion.div
          key={topic.topic}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
        >
          <Link
            to={`/vocabulary/${topic.topic}`}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-md group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${TOPIC_COLORS[topic.topic] ?? 'from-indigo-400 to-indigo-600'} flex items-center justify-center text-2xl shadow-sm`}>
              {TOPIC_ICONS[topic.topic] ?? '📝'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white">{topic.topicLabel}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{topic.words.length} words</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge label={topic.cefrLevel} variant="cefr" />
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
