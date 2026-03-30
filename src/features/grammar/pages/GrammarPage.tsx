import { useState } from 'react';
import { BookOpen, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGrammarStore } from '../../../stores/grammarStore';
import { LessonCard } from '../components/LessonCard';
import { GrammarDashboard } from '../components/GrammarDashboard';
import { ReferenceCard } from '../components/ReferenceCard';
import { REFERENCE_CARDS } from '../../../data/reference/cards';

type Tab = 'lessons' | 'reference';

const TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: 'lessons', label: 'Lessons', icon: BookOpen },
  { id: 'reference', label: 'Reference', icon: Compass },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const, staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export function GrammarPage() {
  const { lessons, lessonProgress } = useGrammarStore();
  const [activeTab, setActiveTab] = useState<Tab>('lessons');

  const a1Lessons = lessons.filter((l) => l.level === 'A1');
  const a2Lessons = lessons.filter((l) => l.level === 'A2');

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
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

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl mb-6" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors"
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="grammarActiveTab"
                className="absolute inset-0 bg-white dark:bg-gray-900 rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'lessons' && (
          <motion.div
            key="lessons"
            role="tabpanel"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
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
                      <LessonCard lesson={lesson} progress={lessonProgress[lesson.id]} />
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
                      <LessonCard lesson={lesson} progress={lessonProgress[lesson.id]} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'reference' && (
          <motion.div
            key="reference"
            role="tabpanel"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              }}
              className="space-y-2.5"
            >
              {REFERENCE_CARDS.map((card) => (
                <motion.div key={card.to} variants={cardVariants}>
                  <ReferenceCard {...card} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
