import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import type { VocabTopic } from '../../../lib/types';
import { Badge } from '../../../components/ui/Badge';
import { TOPIC_ICONS, TOPIC_COLORS } from '../../../lib/constants';
import { useAllTopicProgress, type TopicProgress } from '../hooks/useTopicProgress';

interface TopicListProps {
  topics: VocabTopic[];
}

const EMPTY_PROGRESS: TopicProgress = {
  total: 0, new: 0, learning: 0, review: 0, mastered: 0, percentMastered: 0,
};

export function TopicList({ topics }: TopicListProps) {
  const topicWordKeys = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const t of topics) {
      map.set(t.topic, t.words.map((w) => `${t.topic}:${w.word}`));
    }
    return map;
  }, [topics]);

  const progressMap = useAllTopicProgress(topicWordKeys);

  return (
    <div className="grid gap-3">
      {topics.map((topic, i) => {
        const prog = progressMap.get(topic.topic) ?? EMPTY_PROGRESS;
        const studied = prog.learning + prog.review + prog.mastered;

        return (
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
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {topic.topicLabel}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {topic.words.length} words
                </p>

                {studied > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${prog.percentMastered}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex gap-2.5 text-[10px] leading-tight">
                      {prog.mastered > 0 && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {prog.mastered}
                        </span>
                      )}
                      {prog.review > 0 && (
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {prog.review}
                        </span>
                      )}
                      {prog.learning > 0 && (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          {prog.learning}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge label={topic.cefrLevel} variant="cefr" />
                <ChevronRight size={18} className="text-gray-600 dark:text-gray-400 group-hover:text-indigo-400 transition-colors" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
