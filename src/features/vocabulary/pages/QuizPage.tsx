import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuizSession } from '../hooks/useQuizSession';
import { QuizSession } from '../components/QuizSession';
import { SessionSummary } from '../components/SessionSummary';
import { StreakIndicator } from '../components/StreakIndicator';
import { TimerBar } from '../components/TimerBar';
import { getWeakWords, getSessionWeakWords, type WeakWord } from '../../../services/weakWordsService';

export function QuizPage() {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const {
    topic: topicData,
    currentWord,
    currentIndex,
    isLoading,
    isSessionComplete,
    direction,
    options,
    selectedOption,
    showFeedback,
    correctAnswer,
    handleSelect,
    handleTimeout,
    results,
    accuracy,
    xpEarned,
    xpBreakdown,
    words,
    streak,
    multiplier,
    bestStreak,
    isTimed,
    timerDuration,
  } = useQuizSession(topic ?? '');

  const [weakWords, setWeakWords] = useState<WeakWord[]>([]);

  useEffect(() => {
    if (!isSessionComplete) return;
    getWeakWords().then(allWeak => {
      setWeakWords(getSessionWeakWords(
        results.map(r => ({ wordId: r.wordId, correct: r.correct })),
        allWeak,
      ));
    });
  }, [isSessionComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return <div className="p-6 text-center text-gray-700 dark:text-gray-300">Loading...</div>;
  }

  if (!topicData) {
    return (
      <div className="px-4 py-6 text-center text-gray-700 dark:text-gray-300">
        Topic not found.{' '}
        <Link to="/vocabulary" className="text-indigo-500">Go back</Link>
      </div>
    );
  }

  if (isSessionComplete) {
    const correct = results.filter(r => r.correct).length;
    return (
      <SessionSummary
        correct={correct}
        total={results.length}
        accuracy={accuracy}
        xpEarned={xpEarned}
        weakWords={weakWords}
        bestStreak={bestStreak}
        xpBreakdown={xpBreakdown}
        onPracticeWeakWords={
          weakWords.length > 0
            ? () => navigate(`/vocabulary/${topic}/learn?weak=true`)
            : undefined
        }
        onBack={() => navigate(`/vocabulary/${topic}`)}
        onRetry={() => navigate(0)}
        title="Quiz Complete!"
      />
    );
  }

  if (!currentWord) {
    return <div className="p-6 text-center text-gray-600 dark:text-gray-400">No words available.</div>;
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to={`/vocabulary/${topic}`}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <h1 className="flex-1 font-semibold text-gray-900 dark:text-white">
          {topicData.topicLabel}
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
            Quiz{isTimed ? ' ⏱' : ''}
          </span>
        </h1>
        <StreakIndicator streak={streak} multiplier={multiplier} />
      </div>

      {isTimed && (
        <TimerBar
          duration={timerDuration}
          onTimeout={handleTimeout}
          resetKey={currentIndex}
          paused={showFeedback}
          className="mb-4"
        />
      )}

      <QuizSession
        currentWord={currentWord}
        currentIndex={currentIndex}
        total={words.length}
        direction={direction}
        options={options}
        selectedOption={selectedOption}
        showFeedback={showFeedback}
        correctAnswer={correctAnswer}
        onSelect={handleSelect}
      />
    </div>
  );
}
