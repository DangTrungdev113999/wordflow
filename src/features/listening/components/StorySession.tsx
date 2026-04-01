import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useStoryListening } from '../hooks/useStoryListening';
import { PlaybackControls } from './PlaybackControls';
import { ComprehensionQuiz } from './ComprehensionQuiz';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { TOPIC_ICONS } from '../../../lib/constants';

interface StorySessionProps {
  topic: string;
}

export function StorySession({ topic }: StorySessionProps) {
  const navigate = useNavigate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const {
    content,
    loading,
    error,
    phase,
    currentParagraphIndex,
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    playAll,
    pause,
    playParagraph,
    prevParagraph,
    nextParagraph,
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
  } = useStoryListening(topic);

  const topicData = ALL_TOPICS.find(t => t.topic === topic);
  const topicLabel = topicData?.topicLabel ?? topic;
  const topicIcon = TOPIC_ICONS[topic] ?? '📝';

  const handlePracticeAgain = useCallback(() => navigate(0), [navigate]);
  const handleBack = useCallback(() => navigate('/listening'), [navigate]);

  // Loading
  if (loading) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <BookOpen size={28} className="text-emerald-500" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
          </div>
          <div className="text-center">
            <p className="text-gray-900 dark:text-white font-medium">Generating story...</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">This may take a few seconds</p>
          </div>
        </div>
      </div>
    );
  }

  // Error
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <BookOpen size={20} className="text-emerald-600 dark:text-emerald-400" />
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
          accentColor="emerald"
        />
      </div>
    );
  }

  // Listening phase
  const totalParagraphs = content.paragraphs.length;

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
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                Story
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

      {/* Paragraph indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Paragraph {Math.max(1, currentParagraphIndex + 1)} of {totalParagraphs}
        </span>
        <div className="flex gap-1 flex-1">
          {content.paragraphs.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                i === currentParagraphIndex
                  ? 'bg-emerald-500'
                  : i < currentParagraphIndex
                    ? 'bg-emerald-300 dark:bg-emerald-700'
                    : 'bg-gray-200 dark:bg-gray-700',
              )}
            />
          ))}
        </div>
      </div>

      {/* Paragraphs */}
      <div className="space-y-3 max-h-[45vh] overflow-y-auto">
        <AnimatePresence>
          {content.paragraphs.map((paragraph, i) => {
            const isCurrent = i === currentParagraphIndex;
            const isPast = i < currentParagraphIndex;

            return (
              <motion.button
                key={i}
                onClick={() => playParagraph(i)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  'w-full text-left p-4 rounded-2xl transition-all border',
                  isCurrent && 'bg-white dark:bg-gray-900 border-emerald-200 dark:border-emerald-800 shadow-sm ring-1 ring-emerald-100 dark:ring-emerald-900/40',
                  isPast && !isCurrent && 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-70',
                  !isCurrent && !isPast && 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 opacity-40',
                  !isCurrent && 'hover:opacity-100',
                )}
              >
                <p className={cn(
                  'text-sm leading-relaxed',
                  isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400',
                )}>
                  {paragraph}
                </p>
                {showTranslation && content.translation[i] && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic border-t border-gray-100 dark:border-gray-700 pt-2"
                  >
                    {content.translation[i]}
                  </motion.p>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Playback controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        onPlayPause={() => isPlaying ? pause() : playAll()}
        onPrev={prevParagraph}
        onNext={nextParagraph}
        speed={playbackSpeed}
        onSpeedChange={setPlaybackSpeed}
        disablePrev={currentParagraphIndex <= 0}
        disableNext={currentParagraphIndex >= totalParagraphs - 1}
      />

      {/* Translation toggle + Start Quiz */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTranslation}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-colors',
            showTranslation
              ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
          )}
        >
          {showTranslation ? <EyeOff size={16} /> : <Eye size={16} />}
          {showTranslation ? 'Hide Translation' : 'Show Translation'}
        </button>
        <button
          onClick={startQuiz}
          className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
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
              <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
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
