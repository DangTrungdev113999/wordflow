import { useState } from 'react';
import { Headphones, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { TOPIC_ICONS, TOPIC_COLORS } from '../../../lib/constants';
import { Badge } from '../../../components/ui/Badge';
import { DictationModeSelector } from '../components/DictationModeSelector';
import type { DictationMode } from '../../../lib/types';

export function ListeningPage() {
  const [mode, setMode] = useState<DictationMode>('word');

  return (
    <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Headphones className="text-indigo-500" size={24} />
          Listening Practice
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Listen and type what you hear</p>
      </div>

      <DictationModeSelector mode={mode} onChange={setMode} />

      <div className="grid gap-3">
        {ALL_TOPICS.map((topic, i) => (
          <motion.div
            key={topic.topic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              to={`/listening/${topic.topic}/practice?mode=${mode}`}
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
    </div>
  );
}
