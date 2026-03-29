import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { useGrammarStore } from '../../../stores/grammarStore';
import { useEffect, useCallback, type ReactNode } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { PageTransition } from '../../../components/common/PageTransition';
import { ColoredSentence } from '../components/ColoredSentence';
import { ConjugationGrid } from '../components/ConjugationGrid';
import { BeforeAfterCard } from '../components/BeforeAfterCard';
import { StepByStep } from '../components/StepByStep';
import { CheatSheetCard } from '../components/CheatSheetCard';
import { db } from '../../../db/database';

function renderBold(text: string): ReactNode[] {
  return text.split(/(\*\*.*?\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="text-indigo-600 dark:text-indigo-400">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { lessons, setCurrentLesson, currentLesson, lessonProgress } = useGrammarStore();

  useEffect(() => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (lesson) setCurrentLesson(lesson);
    return () => setCurrentLesson(null);
  }, [lessonId, lessons, setCurrentLesson]);

  const bookmark = useLiveQuery(
    () => lessonId ? db.grammarBookmarks.get(lessonId) : undefined,
    [lessonId]
  );

  const toggleBookmark = useCallback(async () => {
    if (!lessonId) return;
    const existing = await db.grammarBookmarks.get(lessonId);
    if (existing) {
      await db.grammarBookmarks.delete(lessonId);
    } else {
      await db.grammarBookmarks.put({ lessonId, createdAt: Date.now() });
    }
  }, [lessonId]);

  if (!currentLesson) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  const progress = lessonProgress[currentLesson.id];

  const sectionStagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const sectionItem = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  };

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
          <div className="flex-1">
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">{currentLesson.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={currentLesson.level === 'A1' ? 'cefr' : 'default'}>
                {currentLesson.level}
              </Badge>
              {progress && (
                <span className="text-sm text-green-600 dark:text-green-400">
                  Best: {progress.bestScore}% · {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Theory sections — steps sections get StepByStep, others render traditionally */}
        <motion.div
          className="space-y-6 mb-8"
          variants={sectionStagger}
          initial="hidden"
          animate="visible"
        >
          {currentLesson.theory.sections.map((section, i) =>
            section.steps && section.steps.length > 0 ? (
              <motion.div key={i} variants={sectionItem}>
                <StepByStep steps={section.steps} lessonId={currentLesson.id} />
              </motion.div>
            ) : (
              <motion.div key={i} variants={sectionItem} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4">
                <h2 className="font-bold text-gray-900 dark:text-white mb-3">{section.heading}</h2>
                <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {renderBold(section.content)}
                </div>

                {/* Plain examples */}
                {section.examples.length > 0 && (
                  <div className="space-y-2">
                    {section.examples.map((ex, j) => (
                      <div key={j} className="pl-3 border-l-2 border-indigo-200 dark:border-indigo-800">
                        <p className="text-sm text-gray-900 dark:text-white">{renderBold(ex.en)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">{ex.vi}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Colored examples */}
                {section.coloredExamples && section.coloredExamples.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phân tích câu</div>
                    {section.coloredExamples.map((ce, j) => (
                      <ColoredSentence key={j} parts={ce.parts} vi={ce.vi} size="sm" />
                    ))}
                  </div>
                )}

                {/* Conjugation table */}
                {section.conjugation && (
                  <div className="pt-2">
                    <ConjugationGrid table={section.conjugation} />
                  </div>
                )}

                {/* Before/After */}
                {section.beforeAfter && section.beforeAfter.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Sai vs Đúng</div>
                    <BeforeAfterCard items={section.beforeAfter} />
                  </div>
                )}
              </motion.div>
            )
          )}
        </motion.div>

        {/* Cheat Sheet */}
        {currentLesson.cheatSheet && (
          <div className="mb-6">
            <CheatSheetCard
              sheet={currentLesson.cheatSheet}
              bookmarked={!!bookmark}
              onBookmark={toggleBookmark}
            />
          </div>
        )}

        {/* Start Quiz button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
        >
          <Button
            className="w-full py-4 text-lg"
            onClick={() => navigate(`/grammar/${currentLesson.id}/quiz`)}
          >
            <PlayCircle size={22} className="mr-2" />
            Start Quiz ({currentLesson.exercises.length} questions)
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
