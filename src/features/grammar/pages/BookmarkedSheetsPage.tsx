import { Link } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, BookmarkX } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../../../db/database';
import { ALL_GRAMMAR_LESSONS } from '../../../data/grammar/_index';
import { CheatSheetCard } from '../components/CheatSheetCard';
import { PageTransition } from '../../../components/common/PageTransition';

export function BookmarkedSheetsPage() {
  const bookmarks = useLiveQuery(() =>
    db.grammarBookmarks.orderBy('createdAt').reverse().toArray()
  );

  const toggleBookmark = async (lessonId: string) => {
    const existing = await db.grammarBookmarks.get(lessonId);
    if (existing) {
      await db.grammarBookmarks.delete(lessonId);
    } else {
      await db.grammarBookmarks.put({ lessonId, createdAt: Date.now() });
    }
  };

  const bookmarkedLessons = (bookmarks ?? [])
    .map(b => ALL_GRAMMAR_LESSONS.find(l => l.id === b.lessonId))
    .filter((l): l is NonNullable<typeof l> => l != null && l.cheatSheet != null);

  return (
    <PageTransition>
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-6"
        >
          <Link to="/grammar" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">Cheat Sheets đã lưu</h1>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {bookmarkedLessons.length} cheat sheet{bookmarkedLessons.length !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>

        {bookmarkedLessons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 space-y-3"
          >
            <BookmarkX size={48} className="mx-auto text-gray-600 dark:text-gray-400" />
            <p className="text-gray-700 dark:text-gray-300">Chưa có cheat sheet nào được lưu</p>
            <Link
              to="/grammar"
              className="inline-block text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Khám phá Grammar Lessons →
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {bookmarkedLessons.map(lesson => (
              <div key={lesson.id} className="space-y-2">
                <Link
                  to={`/grammar/${lesson.id}`}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  {lesson.title} →
                </Link>
                <CheatSheetCard
                  sheet={lesson.cheatSheet!}
                  lessonId={lesson.id}
                  bookmarked
                  onBookmark={() => toggleBookmark(lesson.id)}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
