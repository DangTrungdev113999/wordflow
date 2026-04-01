import { motion } from 'framer-motion';
import { X, Mic } from 'lucide-react';
import { useState } from 'react';
import { PronunciationCard } from './PronunciationCard';
import { PronunciationSummary } from './PronunciationSummary';
import type { VocabWord } from '../../../lib/types';
import { usePronunciationSession } from '../hooks/usePronunciationSession';

interface PronunciationSessionProps {
  words: VocabWord[];
  topicLabel: string;
  topicIcon: string;
  onExit: () => void;
}

export function PronunciationSession({ words, topicLabel, topicIcon, onExit }: PronunciationSessionProps) {
  const {
    isSupported,
    isStarted,
    isListening,
    isComplete,
    currentWord,
    currentIndex,
    total,
    currentAttempt,
    maxAttempts,
    lastAttemptInfo,
    isWordDone,
    scores,
    xpEarned,
    audioUrls,
    startSession,
    attemptPronunciation,
    nextWord,
  } = usePronunciationSession(words);

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  if (!isSupported) {
    return (
      <div className="px-4 py-12 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mx-auto">
          <Mic size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Speech Recognition Not Available</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Your browser doesn't support speech recognition. Please try Chrome or Edge.
        </p>
        <button
          onClick={onExit}
          className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!isStarted) {
    // Auto-start the session
    startSession();
    return null;
  }

  if (isComplete) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <PronunciationSummary
          scores={scores}
          xpEarned={xpEarned}
          words={words}
          onPracticeAgain={startSession}
          onBack={onExit}
        />
      </div>
    );
  }

  if (!currentWord) return null;

  const progress = total > 0 ? (currentIndex / total) * 100 : 0;
  const wordAudioUrl = audioUrls.get(currentWord.word.toLowerCase()) ?? currentWord.audioUrl;

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
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
        >
          <X size={22} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
          <span>Word {currentIndex + 1} of {total}</span>
          <span>Pronunciation</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card */}
      <PronunciationCard
        key={currentWord.word}
        word={currentWord}
        audioUrl={wordAudioUrl}
        attempt={currentAttempt}
        maxAttempts={maxAttempts}
        isListening={isListening}
        lastResult={lastAttemptInfo}
        isWordDone={isWordDone}
        onRecord={attemptPronunciation}
        onNext={nextWord}
      />

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quit session?</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
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
                onClick={onExit}
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
