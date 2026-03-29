import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useReadingSession } from '../hooks/useReadingSession';
import { PassageReader } from '../components/PassageReader';
import { ComprehensionQuiz } from '../components/ComprehensionQuiz';
import { ReadingSummary } from '../components/ReadingSummary';

export function ReadingSessionPage() {
  const { passageId } = useParams<{ passageId: string }>();
  const navigate = useNavigate();
  const {
    phase,
    passage,
    currentQuestionIndex,
    results,
    correctCount,
    xpEarned,
    startQuiz,
    submitAnswer,
    nextQuestion,
  } = useReadingSession(passageId ?? '');

  if (!passage) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500 dark:text-gray-400">Passage not found.</p>
        <button
          onClick={() => navigate('/reading')}
          className="text-indigo-500 font-medium hover:underline"
        >
          Back to Reading
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/reading')}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Reading
      </button>

      {/* Phase: Reading */}
      {phase === 'reading' && (
        <PassageReader passage={passage} onStartQuiz={startQuiz} />
      )}

      {/* Phase: Quiz */}
      {phase === 'quiz' && (
        <ComprehensionQuiz
          questions={passage.questions}
          currentIndex={currentQuestionIndex}
          onAnswer={submitAnswer}
          onNext={nextQuestion}
        />
      )}

      {/* Phase: Summary */}
      {phase === 'summary' && (
        <ReadingSummary
          passage={passage}
          results={results}
          correctCount={correctCount}
          xpEarned={xpEarned}
          onBack={() => navigate('/reading')}
          onRetry={startQuiz}
        />
      )}
    </div>
  );
}
