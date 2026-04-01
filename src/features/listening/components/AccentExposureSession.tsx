import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Play, ArrowRight, Trophy, RotateCcw, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useAccentExposure } from '../hooks/useAccentExposure';
import { useHints } from '../hooks/useHints';
import { HintBar } from './HintBar';
import { MODE_HINT_AVAILABILITY } from '../types';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { TOPIC_ICONS } from '../../../lib/constants';

interface AccentExposureSessionProps {
  topic: string;
}

export function AccentExposureSession({ topic }: AccentExposureSessionProps) {
  const navigate = useNavigate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    currentItem,
    currentIndex,
    total,
    lastResult,
    isComplete,
    answers,
    correctCount,
    xpEarned,
    incorrectAnswers,
    submitAnswer,
    next,
    showCompare,
    playWord,
    playWordWithAccent,
    isPlaying,
    currentAccent,
    currentAccentIndex,
    indexInRound,
    itemsPerAccent,
    accents,
  } = useAccentExposure(topic);

  const {
    hints,
    usedHints,
    revealedValues,
    useHint,
    hintState,
    resetHints,
  } = useHints({
    availableHints: MODE_HINT_AVAILABILITY['accent'],
    currentWord: currentItem?.word ?? null,
    onSlowReplay: () => currentItem && playWord(),
  });

  const topicData = ALL_TOPICS.find(t => t.topic === topic);
  const topicLabel = topicData?.topicLabel ?? topic;
  const topicIcon = TOPIC_ICONS[topic] ?? '📝';

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || lastResult) return;
    submitAnswer(inputValue.trim());
  }, [inputValue, lastResult, submitAnswer]);

  const handleNext = useCallback(() => {
    setInputValue('');
    resetHints();
    next();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [next, resetHints]);

  const handleBack = useCallback(() => navigate('/listening'), [navigate]);
  const handlePracticeAgain = useCallback(() => navigate(0), [navigate]);

  // Auto-focus input
  useEffect(() => {
    if (!isComplete && !showCompare) {
      inputRef.current?.focus();
    }
  }, [currentIndex, isComplete, showCompare]);

  // Summary screen
  if (isComplete) {
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const isPerfect = correctCount === total;

    return (
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="text-center space-y-3">
            <div className="text-5xl">{isPerfect ? '🎉' : accuracy >= 70 ? '👏' : '💪'}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Accent Practice Complete!</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
              <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{correctCount}/{total}</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">Correct</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
              <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{accuracy}%</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">Accuracy</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Trophy size={16} className="text-amber-500" />
                <p className="text-2xl font-bold text-amber-500">+{xpEarned}</p>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">XP Earned</p>
            </div>
          </div>

          {hintState.xpDeducted > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/40 text-sm text-center">
              <span className="text-amber-700 dark:text-amber-300">Hints used (-{hintState.xpDeducted} XP)</span>
            </div>
          )}

          {/* Accent breakdown */}
          <div className="grid grid-cols-3 gap-2">
            {accents.map(a => {
              const accentAnswers = answers.filter(ans => ans.question.accent === a.id);
              const accentCorrect = accentAnswers.filter(ans => ans.correct).length;
              return (
                <div key={a.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-center">
                  <p className="text-lg">{a.flag}</p>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">{a.label}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{accentCorrect}/{accentAnswers.length}</p>
                </div>
              );
            })}
          </div>

          {/* Review wrong answers */}
          {incorrectAnswers.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">Review</h3>
              <div className="space-y-2">
                {incorrectAnswers.map((a, i) => (
                  <div key={i} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/40 text-sm">
                    <div className="flex items-center gap-2">
                      <span>{a.question.accentFlag}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{a.question.word.word}</span>
                      <span className="text-gray-600 dark:text-gray-400 text-xs">{a.question.word.ipa}</span>
                    </div>
                    <p className="text-red-600 dark:text-red-400 mt-1">Your answer: {a.userAnswer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleBack} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={18} /> Back
            </button>
            <button onClick={handlePracticeAgain} className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors flex items-center justify-center gap-2">
              <RotateCcw size={18} /> Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentItem || !currentAccent) return null;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{topicIcon}</span>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Accent Exposure</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-700 dark:text-gray-300">{topicLabel}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-medium">
                {currentAccent.flag} {currentAccent.label}
              </span>
            </div>
          </div>
        </div>
        <button onClick={() => setShowExitConfirm(true)} className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
          <X size={22} />
        </button>
      </div>

      {/* Round indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">
            Round {currentAccentIndex + 1}/3 — {currentAccent.flag} {currentAccent.label}
          </span>
          <span className="text-gray-700 dark:text-gray-300">
            {currentIndex + 1} of {total}
          </span>
        </div>

        {/* Progress per accent with dots */}
        <div className="flex gap-1.5">
          {accents.map((a, ai) => (
            <div key={a.id} className="flex gap-0.5 flex-1">
              {Array.from({ length: itemsPerAccent }).map((_, di) => {
                const globalIdx = ai * itemsPerAccent + di;
                const isAnswered = globalIdx < answers.length;
                const isCurrent = globalIdx === currentIndex;
                const wasCorrect = isAnswered && answers[globalIdx]?.correct;
                return (
                  <div
                    key={di}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-colors',
                      isCurrent && 'bg-sky-500 ring-1 ring-sky-300 dark:ring-sky-700',
                      isAnswered && wasCorrect && 'bg-green-400 dark:bg-green-600',
                      isAnswered && !wasCorrect && 'bg-red-400 dark:bg-red-600',
                      !isAnswered && !isCurrent && 'bg-gray-200 dark:bg-gray-700',
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Accent labels under dots */}
        <div className="flex gap-1.5">
          {accents.map(a => (
            <div key={a.id} className="flex-1 text-center">
              <span className={cn(
                'text-[10px] font-medium',
                a.id === currentItem.accent ? 'text-sky-600 dark:text-sky-400' : 'text-gray-600 dark:text-gray-400',
              )}>
                {a.flag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Play button */}
      <div className="flex flex-col items-center py-6">
        <motion.button
          onClick={() => playWord()}
          whileTap={{ scale: 0.9 }}
          className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors',
            isPlaying
              ? 'bg-sky-500 text-white'
              : 'bg-white dark:bg-gray-800 text-sky-600 dark:text-sky-400 border-2 border-sky-200 dark:border-sky-800 hover:border-sky-400',
          )}
        >
          {isPlaying ? (
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              <Volume2 size={32} />
            </motion.div>
          ) : (
            <Volume2 size={32} />
          )}
        </motion.button>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Tap to listen</p>
      </div>

      {/* Input form */}
      {!showCompare && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type what you hear..."
            autoComplete="off"
            autoCapitalize="off"
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-sky-400 dark:focus:border-sky-600 focus:outline-none transition-colors text-lg"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-5 py-3 bg-sky-500 text-white rounded-xl font-medium hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
        </form>
      )}

      {/* Result feedback */}
      <AnimatePresence>
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'p-4 rounded-2xl border-2 flex items-center gap-3',
              lastResult.correct
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
            )}
          >
            {lastResult.correct ? (
              <CheckCircle2 size={22} className="text-green-500 shrink-0" />
            ) : (
              <XCircle size={22} className="text-red-500 shrink-0" />
            )}
            <div>
              <p className={cn(
                'font-semibold',
                lastResult.correct ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400',
              )}>
                {lastResult.correct ? 'Correct!' : 'Not quite'}
              </p>
              {!lastResult.correct && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  Answer: <span className="font-medium text-gray-900 dark:text-white">{currentItem.word.word}</span>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare accents panel */}
      <AnimatePresence>
        {showCompare && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Compare accents:</p>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
              {accents.map(a => (
                <button
                  key={a.id}
                  onClick={() => playWordWithAccent(currentItem.word.word, a.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                    a.id === currentItem.accent && 'bg-sky-50/50 dark:bg-sky-900/10',
                  )}
                >
                  <span className="text-lg">{a.flag}</span>
                  <Play size={16} className="text-sky-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{a.label}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-auto">{currentItem.word.ipa}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
            >
              {currentIndex + 1 >= total ? 'Finish' : 'Next'} <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hints */}
      {!showCompare && (
        <HintBar
          hints={hints}
          usedHints={usedHints}
          onUseHint={useHint}
          revealedValues={revealedValues}
          disabled={!!lastResult}
        />
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
