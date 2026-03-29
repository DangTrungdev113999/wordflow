import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGrammarStore } from '../../../stores/grammarStore';
import { LessonCard } from '../components/LessonCard';
import { PageTransition } from '../../../components/common/PageTransition';
import { GrammarDashboard } from '../components/GrammarDashboard';

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const, staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export function GrammarPage() {
  const { lessons, lessonProgress } = useGrammarStore();

  const a1Lessons = lessons.filter((l) => l.level === 'A1');
  const a2Lessons = lessons.filter((l) => l.level === 'A2');

  return (
    <PageTransition>
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <BookOpen size={22} className="text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Grammar</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {lessons.length} lessons available
            </p>
          </div>
        </motion.div>

        {/* Dashboard */}
        <div className="mb-6">
          <GrammarDashboard />
        </div>

        {a1Lessons.length > 0 && (
          <motion.div
            className="mb-6"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Level A1 — Beginner
            </h2>
            <div className="space-y-3">
              {a1Lessons.map((lesson) => (
                <motion.div key={lesson.id} variants={cardVariants}>
                  <LessonCard
                    lesson={lesson}
                    progress={lessonProgress[lesson.id]}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {a2Lessons.length > 0 && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Level A2 — Elementary
            </h2>
            <div className="space-y-3">
              {a2Lessons.map((lesson) => (
                <motion.div key={lesson.id} variants={cardVariants}>
                  <LessonCard
                    lesson={lesson}
                    progress={lessonProgress[lesson.id]}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
