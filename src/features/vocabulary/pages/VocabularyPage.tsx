import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { BookOpen, Plus, ChevronRight } from 'lucide-react';
import { useVocabularyStore } from '../../../stores/vocabularyStore';
import { TopicList } from '../components/TopicList';
import { getTopics, getWords } from '../../../services/customTopicService';
import type { CustomTopic } from '../../../db/models';

interface TopicWithCount extends CustomTopic {
  wordCount: number;
}

export function VocabularyPage() {
  const { topics } = useVocabularyStore();
  const [customTopics, setCustomTopics] = useState<TopicWithCount[]>([]);

  useEffect(() => {
    getTopics().then(async (all) => {
      const withCounts = await Promise.all(
        all.map(async (t) => {
          const words = await getWords(t.id!);
          return { ...t, wordCount: words.length };
        }),
      );
      setCustomTopics(withCounts);
    });
  }, []);

  return (
    <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="text-indigo-500" size={24} />
          Vocabulary
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Choose a topic to start learning</p>
      </div>

      <TopicList topics={topics} />

      {/* Custom Word Lists Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Word Lists</h2>
          <Link
            to="/vocabulary/custom"
            className="text-sm text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
          >
            View all
            <ChevronRight size={14} />
          </Link>
        </div>

        {customTopics.length > 0 ? (
          <div className="grid gap-3">
            {customTopics.slice(0, 3).map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/vocabulary/custom/${topic.id}`}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-md group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-2xl shadow-sm">
                    {topic.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{topic.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{topic.wordCount} words</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Link
            to="/vocabulary/custom"
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center">
              <Plus size={22} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Create Custom Topic</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Build your own word lists</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
