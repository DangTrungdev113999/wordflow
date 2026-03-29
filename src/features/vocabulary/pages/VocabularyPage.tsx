import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { BookOpen, Plus, ChevronRight, Search, X, Shuffle, Bell } from 'lucide-react';
import { useVocabularyStore } from '../../../stores/vocabularyStore';
import { TopicList } from '../components/TopicList';
import { getTopics, getWords } from '../../../services/customTopicService';
import { db } from '../../../db/database';
import { cn } from '../../../lib/utils';
import type { CustomTopic } from '../../../db/models';

interface TopicWithCount extends CustomTopic {
  wordCount: number;
}

type Filter = 'all' | 'built-in' | 'custom';

export function VocabularyPage() {
  const { topics } = useVocabularyStore();
  const [customTopics, setCustomTopics] = useState<TopicWithCount[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [dueCount, setDueCount] = useState(0);

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

    // Count due words for banner
    db.wordProgress
      .where('nextReview')
      .belowOrEqual(Date.now())
      .count()
      .then(setDueCount);
  }, []);

  const query = search.toLowerCase().trim();

  const filteredBuiltIn = useMemo(
    () => topics.filter((t) => t.topicLabel.toLowerCase().includes(query)),
    [topics, query],
  );

  const filteredCustom = useMemo(
    () => customTopics.filter((t) => t.name.toLowerCase().includes(query)),
    [customTopics, query],
  );

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'built-in', label: 'Built-in' },
    { key: 'custom', label: 'My Lists' },
  ];

  return (
    <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-indigo-500" size={24} />
            Vocabulary
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Choose a topic to start learning</p>
        </div>
        <Link
          to="/vocabulary/mixed-review"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 dark:shadow-indigo-900/50 hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Shuffle size={16} />
          Mixed Review
        </Link>
      </div>

      {/* Due Review Banner */}
      {dueCount >= 5 && (
        <Link
          to="/vocabulary/mixed-review?source=due"
          className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-200 dark:border-red-800/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <Bell size={20} className="text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {dueCount} words due for review today!
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Spaced repetition keeps your memory strong
            </p>
          </div>
          <span className="text-sm font-semibold text-red-500 group-hover:text-red-600 dark:text-red-400 shrink-0">
            Review now
            <ChevronRight size={14} className="inline ml-0.5" />
          </span>
        </Link>
      )}

      {/* Search + Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all',
                filter === f.key
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filter !== 'custom' && <TopicList topics={filteredBuiltIn} />}

      {/* Custom Word Lists Section */}
      {filter !== 'built-in' && (
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

        {filteredCustom.length > 0 ? (
          <div className="grid gap-3">
            {filteredCustom.slice(0, 3).map((topic, i) => (
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
      )}

      {/* Empty search state */}
      {query && filteredBuiltIn.length === 0 && filteredCustom.length === 0 && (
        <div className="text-center py-12">
          <Search size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No topics found for "{search}"
          </p>
        </div>
      )}
    </div>
  );
}
