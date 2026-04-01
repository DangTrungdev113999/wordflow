import { BookOpen, Compass } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useGrammarStore } from '../../../stores/grammarStore';
import { LessonCard } from '../components/LessonCard';
import { GrammarDashboard } from '../components/GrammarDashboard';
import { ReferenceCard } from '../components/ReferenceCard';
import { REFERENCE_CARDS } from '../../../data/reference/cards';
import type { CEFRLevel } from '../../../lib/types';

type Tab = 'lessons' | 'reference';
type LevelFilter = 'all' | CEFRLevel;

const VALID_TABS: Tab[] = ['lessons', 'reference'];
const VALID_LEVELS: LevelFilter[] = ['all', 'A1', 'A2', 'B1', 'B2'];

const TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: 'lessons', label: 'Lessons', icon: BookOpen },
  { id: 'reference', label: 'Reference', icon: Compass },
];

const LEVEL_FILTERS: { id: LevelFilter; label: string; subtitle: string }[] = [
  { id: 'all', label: 'All', subtitle: '' },
  { id: 'A1', label: 'A1', subtitle: 'Beginner' },
  { id: 'A2', label: 'A2', subtitle: 'Elementary' },
  { id: 'B1', label: 'B1', subtitle: 'Intermediate' },
  { id: 'B2', label: 'B2', subtitle: 'Upper-Int' },
];

const LEVEL_META: Record<CEFRLevel, { subtitle: string; delay: number }> = {
  A1: { subtitle: 'Beginner', delay: 0 },
  A2: { subtitle: 'Elementary', delay: 0.1 },
  B1: { subtitle: 'Intermediate', delay: 0.2 },
  B2: { subtitle: 'Upper-Intermediate', delay: 0.3 },
};

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
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeTab = VALID_TABS.includes(rawTab as Tab) ? (rawTab as Tab) : 'lessons';
  const rawLevel = searchParams.get('level');
  const levelFilter = VALID_LEVELS.includes(rawLevel as LevelFilter) ? (rawLevel as LevelFilter) : 'all';

  const setActiveTab = (tab: Tab) => {
    setSearchParams(prev => { prev.set('tab', tab); prev.delete('level'); return prev; }, { replace: true });
  };
  const setLevelFilter = (level: LevelFilter) => {
    setSearchParams(prev => { prev.set('level', level); return prev; }, { replace: true });
  };

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];
  const visibleLevels = levelFilter === 'all' ? levels : [levelFilter];
  const lessonsByLevel = Object.fromEntries(
    levels.map((lv) => [lv, lessons.filter((l) => l.level === lv)])
  ) as Record<CEFRLevel, typeof lessons>;

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
          <p className="text-sm text-gray-700 dark:text-gray-300">
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
                  : 'text-gray-700 dark:text-gray-300'
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

            {/* Level Filter */}
            <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
              {LEVEL_FILTERS.map((lf) => (
                <button
                  key={lf.id}
                  onClick={() => setLevelFilter(lf.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    levelFilter === lf.id
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {lf.label}{lf.subtitle ? ` · ${lf.subtitle}` : ''}
                </button>
              ))}
            </div>

            {/* Lesson sections by level */}
            {visibleLevels.map((lv) => {
              const lvLessons = lessonsByLevel[lv];
              if (lvLessons.length === 0) return null;
              const meta = LEVEL_META[lv];
              return (
                <motion.div
                  key={lv}
                  className="mb-6"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: meta.delay }}
                >
                  <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                    Level {lv} — {meta.subtitle}
                  </h2>
                  <div className="space-y-3">
                    {lvLessons.map((lesson) => (
                      <motion.div key={lesson.id} variants={cardVariants}>
                        <LessonCard lesson={lesson} progress={lessonProgress[lesson.id]} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
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
