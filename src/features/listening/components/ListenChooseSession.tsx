import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, ArrowRight, Headphones } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useListenChoose } from '../hooks/useListenChoose';
import { useHints } from '../hooks/useHints';
import { HintBar } from './HintBar';
import { DictationSessionSummary } from './DictationSessionSummary';
import { playAudio } from '../../../services/audioService';
import { MODE_HINT_AVAILABILITY } from '../types';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { TOPIC_ICONS } from '../../../lib/constants';

interface ListenChooseSessionProps {
  topic: string;
}

export function ListenChooseSession({ topic }: ListenChooseSessionProps) {
  const navigate = useNavigate();
  const {
    currentQuestion,
    currentIndex,
    total,
    lastResult,
    isComplete,
    correctCount,
    xpEarned,
    incorrectAnswers,
    submitAnswer,
    next,
  } = useListenChoose(topic);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleSlowReplay = useCallback(() => {
    if (!currentQuestion) return;
    playAudio(currentQuestion.audio, { rate: 0.75 });
  }, [currentQuestion]);

  const {
    hints,
    usedHints,
    revealedValues,
    useHint,
    hintState,
    resetHints,
  } = useHints({
    availableHints: MODE_HINT_AVAILABILITY['listen-choose'],
    currentWord: currentQuestion?.word ?? null,
    onSlowReplay: handleSlowReplay,
  });

  const topicData = ALL_TOPICS.find(t => t.topic === topic);
  const topicLabel = topicData?.topicLabel ?? topic;
  const topicIcon = TOPIC_ICONS[topic] ?? '📝';

  const handlePlay = useCallback(async () => {
    if (!currentQuestion) return;
    setHasPlayed(true);
    setIsPlaying(true);
    await playAudio(currentQuestion.audio, {
      rate: currentQuestion.audioRate,
      onEnd: () => setIsPlaying(false),
    });
  }, [currentQuestion]);

  // Auto-play audio when question appears
  useEffect(() => {
    if (!currentQuestion) return;
    const timer = setTimeout(() => {
      handlePlay();
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = useCallback((index: number) => {
    if (lastResult) return;
    submitAnswer(index);
  }, [lastResult, submitAnswer]);

  const handleNext = useCallback(() => {
    setHasPlayed(false);
    resetHints();
    next();
  }, [next, resetHints]);

  // Auto-advance on correct after 1.5s
  useEffect(() => {
    if (lastResult?.correct) {
      const timer = setTimeout(handleNext, 1500);
      return () => clearTimeout(timer);
    }
  }, [lastResult, handleNext]);

  const finalXP = Math.max(0, xpEarned - hintState.xpDeducted);
  const isCorrect = lastResult?.correct;

  if (!topicData || total === 0) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-gray-700 dark:text-gray-300">Topic not found</p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <DictationSessionSummary
          correctCount={correctCount}
          total={total}
          xpEarned={finalXP}
          incorrectAnswers={incorrectAnswers}
          onPracticeAgain={() => navigate(0)}
          onBack={() => navigate('/listening')}
          hintsUsed={hintState.totalHintsUsed}
          hintXpDeducted={hintState.xpDeducted}
        />
      </div>
    );
  }

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{topicIcon}</span>
          <h2 className="font-semibold text-gray-900 dark:text-white">{topicLabel}</h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-medium">
            <Headphones size={12} />
            Listen & Choose
          </span>
        </div>
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
        >
          <X size={22} />
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
          <span>Question {currentIndex + 1} of {total}</span>
          <span>{correctCount} correct</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Audio player + question */}
      <div className="flex flex-col items-center gap-3">
        <motion.button
          onClick={handlePlay}
          disabled={isPlaying}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg',
            isPlaying
              ? 'bg-violet-500 text-white'
              : 'bg-white dark:bg-gray-800 text-violet-500 border-2 border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-600',
          )}
        >
          {isPlaying ? (
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              <Volume2 size={32} />
            </motion.div>
          ) : (
            <Volume2 size={32} />
          )}
        </motion.button>
        {currentQuestion && (
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium text-center">
            {currentQuestion.question}
          </p>
        )}
      </div>

      {/* Hint Bar */}
      {!lastResult && (
        <HintBar
          hints={hints}
          usedHints={usedHints}
          onUseHint={useHint}
          revealedValues={revealedValues}
          disabled={!hasPlayed}
        />
      )}

      {/* Options */}
      {currentQuestion && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="grid grid-cols-1 gap-3"
          >
            {currentQuestion.options.map((option, i) => {
              const isThisCorrect = i === currentQuestion.correctIndex;
              const isThisSelected = lastResult && lastResult.selectedIndex === i;
              const submitted = !!lastResult;

              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={submitted}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={!submitted ? { scale: 0.98 } : undefined}
                  className={cn(
                    'w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3',
                    !submitted && 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-900/10',
                    submitted && isThisCorrect && 'border-green-500 bg-green-50 dark:bg-green-900/20',
                    submitted && isThisSelected && !isThisCorrect && 'border-red-500 bg-red-50 dark:bg-red-900/20',
                    submitted && !isThisCorrect && !isThisSelected && 'border-gray-200 dark:border-gray-700 opacity-40',
                  )}
                >
                  <span className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 mt-0.5',
                    !submitted && 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                    submitted && isThisCorrect && 'bg-green-500 text-white',
                    submitted && isThisSelected && !isThisCorrect && 'bg-red-500 text-white',
                    submitted && !isThisCorrect && !isThisSelected && 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
                  )}>
                    {optionLabels[i]}
                  </span>
                  <span className={cn(
                    'font-medium text-sm leading-relaxed',
                    !submitted && 'text-gray-900 dark:text-white',
                    submitted && isThisCorrect && 'text-green-700 dark:text-green-400',
                    submitted && isThisSelected && !isThisCorrect && 'text-red-700 dark:text-red-400',
                    submitted && !isThisCorrect && !isThisSelected && 'text-gray-600 dark:text-gray-400',
                  )}>
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Feedback for incorrect */}
      <AnimatePresence>
        {lastResult && !isCorrect && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/40">
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                The answer was: <span className="font-bold">{currentQuestion.word.word}</span>
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                {currentQuestion.word.ipa} — {currentQuestion.word.meaning}
              </p>
            </div>
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-violet-500 text-white font-semibold hover:bg-violet-600 transition-colors flex items-center justify-center gap-2"
            >
              Next <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-advance indicator for correct */}
      <AnimatePresence>
        {lastResult && isCorrect && currentQuestion && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-green-600 dark:text-green-400"
          >
            {currentQuestion.word.meaning} — continuing...
          </motion.p>
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
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">Your progress will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Continue
              </button>
              <button onClick={() => navigate('/listening')} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">
                Quit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
