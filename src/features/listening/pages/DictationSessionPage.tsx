import { useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useDictation } from '../hooks/useDictation';
import { useDictationAudio } from '../hooks/useDictationAudio';
import { DictationPlayer } from '../components/DictationPlayer';
import { DictationInput } from '../components/DictationInput';
import { DictationResult } from '../components/DictationResult';
import { DictationSessionSummary } from '../components/DictationSessionSummary';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { TOPIC_ICONS } from '../../../lib/constants';
import type { DictationMode } from '../../../lib/types';

export function DictationSessionPage() {
  const { topic } = useParams<{ topic: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = (searchParams.get('mode') as DictationMode) || 'word';

  const {
    currentItem,
    currentIndex,
    total,
    lastResult,
    isComplete,
    correctCount,
    xpEarned,
    incorrectAnswers,
    submitAnswer,
    next,
  } = useDictation(topic!, mode);

  const { play, playSentence, isPlaying } = useDictationAudio();
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const topicData = ALL_TOPICS.find(t => t.topic === topic);
  const topicLabel = topicData?.topicLabel ?? topic;
  const topicIcon = TOPIC_ICONS[topic!] ?? '📝';

  const handlePlay = useCallback(() => {
    if (!currentItem) return;
    setHasPlayed(true);
    if (mode === 'sentence') {
      playSentence(currentItem.target);
    } else if (mode === 'phrase') {
      playSentence(currentItem.target);
    } else {
      play(currentItem.word.word, currentItem.word.audioUrl);
    }
  }, [currentItem, mode, play, playSentence]);

  const handleNext = useCallback(() => {
    setHasPlayed(false);
    next();
  }, [next]);

  if (!topicData || total === 0) {
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
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={22} />
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Word {currentIndex + 1} of {total}</span>
          <span className="capitalize">{mode} mode</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex) / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Player */}
      <div className="py-6">
        <DictationPlayer
          onPlay={handlePlay}
          isPlaying={isPlaying}
          hasPlayed={hasPlayed}
          disabled={!!lastResult}
        />
      </div>

      {/* Input or Result */}
      {lastResult ? (
        <DictationResult
          correct={lastResult.correct}
          userAnswer={lastResult.userAnswer}
          target={lastResult.item.target}
          word={lastResult.item.word}
          onNext={handleNext}
        />
      ) : (
        <DictationInput onSubmit={submitAnswer} />
      )}

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
