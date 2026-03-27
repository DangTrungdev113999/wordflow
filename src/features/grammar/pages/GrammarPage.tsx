import { BookOpen } from 'lucide-react';
import { useGrammarStore } from '../../../stores/grammarStore';
import { LessonCard } from '../components/LessonCard';

export function GrammarPage() {
  const { lessons, lessonProgress } = useGrammarStore();

  const a1Lessons = lessons.filter((l) => l.level === 'A1');
  const a2Lessons = lessons.filter((l) => l.level === 'A2');

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <BookOpen size={22} className="text-indigo-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Grammar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {lessons.length} lessons available
          </p>
        </div>
      </div>

      {a1Lessons.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Level A1 — Beginner
          </h2>
          <div className="space-y-3">
            {a1Lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={lessonProgress[lesson.id]}
              />
            ))}
          </div>
        </div>
      )}

      {a2Lessons.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Level A2 — Elementary
          </h2>
          <div className="space-y-3">
            {a2Lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={lessonProgress[lesson.id]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
