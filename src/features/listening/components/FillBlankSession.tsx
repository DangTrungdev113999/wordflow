import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Send, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useFillBlank } from '../hooks/useFillBlank';
import { useHints } from '../hooks/useHints';
import { useDictationAudio } from '../hooks/useDictationAudio';
import { HintBar } from './HintBar';
import { DictationSessionSummary } from './DictationSessionSummary';
import { playAudio } from '../../../services/audioService';
import { MODE_HINT_AVAILABILITY } from '../types';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { TOPIC_ICONS } from '../../../lib/constants';

interface FillBlankSessionProps {
  topic: string;
}

export function FillBlankSession({ topic }: FillBlankSessionProps) {
  const navigate = useNavigate();
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
  } = useFillBlank(topic);

  const { playSentence, isPlaying } = useDictationAudio();
  const [hasPlayed, setHasPlayed] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleSlowReplay = useCallback(() => {
    if (!currentItem) return;
    playAudio(currentItem.sentence, { rate: 0.75 });
  }, [currentItem]);

  const {
    hints,
    usedHints,
    revealedValues,
    useHint,
    hintState,
    resetHints,
  } = useHints({
    availableHints: MODE_HINT_AVAILABILITY['fill-blank'],
    currentWord: currentItem?.word ?? null,
    onSlowReplay: handleSlowReplay,
  });

  const topicData = ALL_TOPICS.find(t => t.topic === topic);
  const topicLabel = topicData?.topicLabel ?? topic;
  const topicIcon = TOPIC_ICONS[topic] ?? '📝';

  const handlePlay = useCallback(() => {
    if (!currentItem) return;
    setHasPlayed(true);
    playSentence(currentItem.sentence);
  }, [currentItem, playSentence]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || lastResult) return;
    submitAnswer(inputValue.trim());
    setInputValue('');
  }, [inputValue, lastResult, submitAnswer]);

  const handleNext = useCallback(() => {
    setHasPlayed(false);
    setInputValue('');
    resetHints();
    next();
  }, [next, resetHints]);

  const finalXP = Math.max(0, xpEarned - hintState.xpDeducted);

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

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{topicIcon}</span>
          <h2 className="font-semibold text-gray-900 dark:text-white">{topicLabel}</h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-medium">
            Fill-in-blank
          </span>
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
          <span>Question {currentIndex + 1} of {total}</span>
          <span>{correctCount} correct</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Audio player */}
      <div className="flex justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePlay}
          disabled={isPlaying}
          className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg',
            isPlaying
              ? 'bg-amber-500 text-white scale-105'
              : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/60',
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
      </div>

      {/* Blanked sentence */}
      {currentItem && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-5 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700 text-center"
          >
            <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
              {currentItem.blankedSentence.split(/(_+)/).map((part, i) =>
                /^_+$/.test(part) ? (
                  <span
                    key={i}
                    className="inline-block mx-1 px-3 py-0.5 bg-amber-100 dark:bg-amber-900/40 border-b-2 border-amber-400 dark:border-amber-600 rounded text-amber-600 dark:text-amber-400 font-mono min-w-[80px]"
                  >
                    {lastResult ? lastResult.item.answers[0] : part}
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          </motion.div>
        </AnimatePresence>
      )}

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

      {/* Input or Result */}
      {lastResult ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className={cn(
            'p-4 rounded-2xl border',
            lastResult.correct
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          )}>
            <div className="flex items-center gap-2 mb-2">
              {lastResult.correct ? (
                <CheckCircle2 className="text-green-500" size={22} />
              ) : (
                <XCircle className="text-red-500" size={22} />
              )}
              <span className={cn(
                'font-semibold',
                lastResult.correct ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400',
              )}>
                {lastResult.correct ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {!lastResult.correct && (
              <div className="space-y-1 text-sm mb-2">
                <p className="text-red-600 dark:text-red-400">
                  You typed: <span className="font-medium">{lastResult.userAnswer}</span>
                </p>
                <p className="text-green-600 dark:text-green-400">
                  Correct: <span className="font-medium">{lastResult.item.answers[0]}</span>
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">{currentItem?.word.word}</span>
              {' '}<span className="text-gray-400">{currentItem?.word.ipa}</span>
              {' — '}{currentItem?.word.meaning}
            </p>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
          >
            Next <ArrowRight size={18} />
          </button>
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="flex gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type the missing word..."
            autoFocus
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
          />
          <motion.button
            type="submit"
            disabled={!inputValue.trim()}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </motion.button>
        </motion.form>
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
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Your progress will be lost.</p>
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
