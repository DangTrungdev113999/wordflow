import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useConversationListening } from '../hooks/useConversationListening';
import { PlaybackControls } from './PlaybackControls';
import { ComprehensionQuiz } from './ComprehensionQuiz';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { TOPIC_ICONS } from '../../../lib/constants';

interface ConversationSessionProps {
  topic: string;
}

export function ConversationSession({ topic }: ConversationSessionProps) {
  const navigate = useNavigate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const {
    content,
    loading,
    error,
    phase,
    currentLineIndex,
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    playAll,
    pause,
    playLine,
    prevLine,
    nextLine,
    startQuiz,
    currentQuestionIndex,
    quizAnswers,
    submitQuizAnswer,
    nextQuestion,
    isQuizComplete,
    correctCount,
    xpEarned,
    showTranslation,
    toggleTranslation,
  } = useConversationListening(topic);

  const topicData = ALL_TOPICS.find(t => t.topic === topic);
  const topicLabel = topicData?.topicLabel ?? topic;
  const topicIcon = TOPIC_ICONS[topic] ?? '📝';

  const handlePracticeAgain = useCallback(() => navigate(0), [navigate]);
  const handleBack = useCallback(() => navigate('/listening'), [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
              <MessageCircle size={28} className="text-teal-500" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-teal-400 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
          </div>
          <div className="text-center">
            <p className="text-gray-900 dark:text-white font-medium">Generating conversation...</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">This may take a few seconds</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !content) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-3xl">!</div>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">{error ?? 'Something went wrong'}</p>
          <button onClick={handleBack} className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Back to Listening
          </button>
        </div>
      </div>
    );
  }

  // Quiz phase
  if (phase === 'quiz') {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
            <MessageCircle size={20} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 dark:text-white truncate">{content.title}</h2>
            <p className="text-xs text-gray-700 dark:text-gray-300">Comprehension Quiz</p>
          </div>
        </div>

        <ComprehensionQuiz
          questions={content.questions}
          currentIndex={currentQuestionIndex}
          answers={quizAnswers}
          onAnswer={submitQuizAnswer}
          onNext={nextQuestion}
          isComplete={isQuizComplete}
          correctCount={correctCount}
          xpEarned={xpEarned}
          onPracticeAgain={handlePracticeAgain}
          onBack={handleBack}
          accentColor="teal"
        />
      </div>
    );
  }

  // Listening phase
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{topicIcon}</span>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">{content.title}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-700 dark:text-gray-300">{topicLabel}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-medium">
                Conversation
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
        >
          <X size={22} />
        </button>
      </div>

      {/* Speakers */}
      <div className="flex items-center gap-3">
        {content.speakers.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
            <span>{s.voice === 'female' ? '👩' : '👨'}</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{s.name}</span>
          </div>
        ))}
      </div>

      {/* Conversation lines */}
      <div className="space-y-2 max-h-[40vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4">
        {content.lines.map((line, i) => {
          const isCurrent = i === currentLineIndex;
          const isPast = i < currentLineIndex;
          const speaker = content.speakers.find(s => s.name === line.speaker);

          return (
            <motion.button
              key={i}
              onClick={() => playLine(i)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                'w-full text-left p-3 rounded-xl transition-all flex gap-3 group',
                isCurrent && 'bg-teal-50 dark:bg-teal-900/20 ring-1 ring-teal-200 dark:ring-teal-800',
                isPast && !isCurrent && 'opacity-70',
                !isCurrent && !isPast && 'opacity-50',
                !isCurrent && 'hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:opacity-100',
              )}
            >
              <span className="text-lg shrink-0 mt-0.5">
                {speaker?.voice === 'female' ? '👩' : '👨'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">{line.speaker}</p>
                <p className={cn(
                  'text-sm leading-relaxed',
                  isCurrent ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300',
                )}>
                  {line.text}
                  {line.highlightWords && line.highlightWords.length > 0 && isCurrent && (
                    <span className="ml-1.5 text-xs text-teal-500">
                      ({line.highlightWords.join(', ')})
                    </span>
                  )}
                </p>
                {showTranslation && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic"
                  >
                    {line.translation}
                  </motion.p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Playback controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        onPlayPause={() => isPlaying ? pause() : playAll()}
        onPrev={prevLine}
        onNext={nextLine}
        speed={playbackSpeed}
        onSpeedChange={setPlaybackSpeed}
        disablePrev={currentLineIndex <= 0}
        disableNext={!content || currentLineIndex >= content.lines.length - 1}
      />

      {/* Translation toggle + Start Quiz */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTranslation}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-colors',
            showTranslation
              ? 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
          )}
        >
          {showTranslation ? <EyeOff size={16} /> : <Eye size={16} />}
          {showTranslation ? 'Hide Translation' : 'Show Translation'}
        </button>
        <button
          onClick={startQuiz}
          className="flex-1 py-3 rounded-xl bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          Start Quiz <ArrowRight size={16} />
        </button>
      </div>

      {/* Key vocab */}
      {content.keyVocab.length > 0 && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Key Vocabulary</p>
          <div className="flex flex-wrap gap-1.5">
            {content.keyVocab.map((word, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-medium">
                {word}
              </span>
            ))}
          </div>
        </div>
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
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">Your progress will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Continue
              </button>
              <button onClick={handleBack} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">
                Quit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
