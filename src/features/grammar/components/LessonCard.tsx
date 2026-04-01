import { Link } from 'react-router';
import { BookOpen, CheckCircle, ChevronRight } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import type { GrammarLessonData } from '../../../lib/types';

interface LessonCardProps {
  lesson: GrammarLessonData;
  progress?: { completed: boolean; bestScore: number; attempts: number };
}

export function LessonCard({ lesson, progress }: LessonCardProps) {
  return (
    <Link
      to={`/grammar/${lesson.id}`}
      className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all active:scale-[0.98]"
    >
      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
        {progress?.completed ? (
          <CheckCircle size={24} className="text-green-500" />
        ) : (
          <BookOpen size={24} className="text-indigo-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{lesson.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={lesson.level === 'A1' ? 'cefr' : 'default'}>{lesson.level}</Badge>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {lesson.exercises.length} questions
          </span>
          {progress && (
            <span className="text-sm text-green-600 dark:text-green-400">
              Best: {progress.bestScore}%
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={20} className="text-gray-600 dark:text-gray-400 flex-shrink-0" />
    </Link>
  );
}
