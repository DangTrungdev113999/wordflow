import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { useGrammarStore } from '../../../stores/grammarStore';
import { useEffect, type ReactNode } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

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

  if (!currentLesson) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  const progress = lessonProgress[currentLesson.id];

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
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
      </div>

      {/* Theory sections */}
      <div className="space-y-6 mb-8">
        {currentLesson.theory.sections.map((section, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white mb-3">{section.heading}</h2>
            <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-4">
              {renderBold(section.content)}
            </div>
            <div className="space-y-2">
              {section.examples.map((ex, j) => (
                <div key={j} className="pl-3 border-l-2 border-indigo-200 dark:border-indigo-800">
                  <p className="text-sm text-gray-900 dark:text-white">{renderBold(ex.en)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">{ex.vi}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Start Quiz button */}
      <Button
        className="w-full py-4 text-lg"
        onClick={() => navigate(`/grammar/${currentLesson.id}/quiz`)}
      >
        <PlayCircle size={22} className="mr-2" />
        Start Quiz ({currentLesson.exercises.length} questions)
      </Button>
    </div>
  );
}
