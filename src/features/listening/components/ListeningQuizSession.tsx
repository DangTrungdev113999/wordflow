import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Headphones } from 'lucide-react';
import { useListeningQuiz } from '../hooks/useListeningQuiz';
import { ListeningQuiz } from './ListeningQuiz';
import { DictationSessionSummary } from './DictationSessionSummary';
import { TOPIC_ICONS } from '../../../lib/constants';

interface ListeningQuizSessionProps {
  topic: string;
  topicLabel: string;
}

export function ListeningQuizSession({ topic, topicLabel }: ListeningQuizSessionProps) {
  const navigate = useNavigate();
  const {
    currentQuestion,
    currentIndex,
    total,
    isComplete,
    correctCount,
    xpEarned,
    incorrectAnswers,
    submitAnswer,
    next,
  } = useListeningQuiz(topic);

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const topicIcon = TOPIC_ICONS[topic] ?? '📝';

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  if (total === 0) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Topic not found</p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <DictationSessionSummary
          correctCount={correctCount}
          total={total}
          xpEarned={xpEarned}
          incorrectAnswers={incorrectAnswers}
          onPracticeAgain={() => navigate(0)}
          onBack={() => navigate('/listening')}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{topicIcon}</span>
          <h2 className="font-semibold text-gray-900 dark:text-white">{topicLabel}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
            <Headphones size={12} />
            Quiz
          </span>
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Question {currentIndex + 1} of {total}</span>
          <span>{correctCount} correct</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Quiz question */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <ListeningQuiz
            key={currentIndex}
            question={currentQuestion}
            onAnswer={submitAnswer}
            onNext={handleNext}
            questionNumber={currentIndex}
          />
        )}
      </AnimatePresence>

      {/* Exit confirmation */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quit session?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Your progress in this session will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Continue
              </button>
              <button
                onClick={() => navigate('/listening')}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Quit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
