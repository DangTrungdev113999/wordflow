import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Send, CheckCircle2, XCircle, ArrowRight, Zap } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useSpeedListening, SPEED_LEVELS } from '../hooks/useSpeedListening';
import { useHints } from '../hooks/useHints';
import { HintBar } from './HintBar';
import { DictationSessionSummary } from './DictationSessionSummary';
import { playAudio } from '../../../services/audioService';
import { MODE_HINT_AVAILABILITY } from '../types';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { TOPIC_ICONS } from '../../../lib/constants';

interface SpeedListeningSessionProps {
  topic: string;
}

export function SpeedListeningSession({ topic }: SpeedListeningSessionProps) {
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
    currentRound,
    itemInRound,
    currentSpeed,
    currentLevel,
    showSlowDownOffer,
    acceptSlowDown,
    dismissSlowDown,
  } = useSpeedListening(topic);

  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const {
    hints,
    usedHints,
    revealedValues,
    useHint,
    hintState,
    resetHints,
  } = useHints({
    availableHints: MODE_HINT_AVAILABILITY['speed'],
    currentWord: currentItem?.word ?? null,
  });

  const topicData = ALL_TOPICS.find(t => t.topic === topic);
  const topicLabel = topicData?.topicLabel ?? topic;
  const topicIcon = TOPIC_ICONS[topic] ?? '📝';

  const handlePlay = useCallback(async () => {
    if (!currentItem) return;
    setHasPlayed(true);
    setIsPlaying(true);
    try {
      await playAudio(currentItem.word.word, {
        rate: currentSpeed,
        onEnd: () => setIsPlaying(false),
      });
    } finally {
      setTimeout(() => setIsPlaying(false), 500);
    }
  }, [currentItem, currentSpeed]);

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

  const speedPercent = ((currentSpeed - 0.5) / 1.5) * 100;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{topicIcon}</span>
          <h2 className="font-semibold text-gray-900 dark:text-white">{topicLabel}</h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium">
            <Zap size={12} />
            Speed
          </span>
        </div>
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={22} />
        </button>
      </div>

      {/* Round indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Round {currentRound + 1}/4 — {currentLevel.label}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {correctCount} correct
          </span>
        </div>

        {/* Round progress dots */}
        <div className="flex gap-1.5">
          {SPEED_LEVELS.map((level, ri) => (
            <div key={ri} className="flex gap-0.5 flex-1">
              {[0, 1, 2].map(ii => {
                const globalIdx = ri * 3 + ii;
                const isDone = globalIdx < currentIndex;
                const isCurrent = globalIdx === currentIndex;
                return (
                  <div
                    key={ii}
                    className={cn(
                      'h-2 flex-1 rounded-full transition-all',
                      isDone ? 'bg-orange-500' : isCurrent ? 'bg-orange-400 animate-pulse' : 'bg-gray-200 dark:bg-gray-700',
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Speed bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 w-12">Speed</span>
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 via-orange-400 to-red-500 rounded-full"
              animate={{ width: `${speedPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-sm font-mono font-bold text-orange-600 dark:text-orange-400 w-12 text-right">
            {currentSpeed}x
          </span>
        </div>
      </div>

      {/* Audio player */}
      <div className="flex justify-center py-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePlay}
          disabled={isPlaying}
          className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg',
            isPlaying
              ? 'bg-orange-500 text-white scale-105'
              : 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/60',
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

      {/* Slow down offer */}
      <AnimatePresence>
        {showSlowDownOffer && !lastResult && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
              Có vẻ hơi nhanh? Bạn muốn giảm tốc độ không?
            </p>
            <div className="flex gap-2">
              <button
                onClick={acceptSlowDown}
                className="flex-1 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Giảm tốc độ
              </button>
              <button
                onClick={dismissSlowDown}
                className="flex-1 py-2 rounded-xl border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                Tiếp tục
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {lastResult.correct && currentLevel.bonusXP > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium">
                  +{currentLevel.bonusXP} speed bonus
                </span>
              )}
            </div>
            {!lastResult.correct && (
              <div className="space-y-1 text-sm mb-2">
                <p className="text-red-600 dark:text-red-400">
                  You typed: <span className="font-medium">{lastResult.userAnswer}</span>
                </p>
                <p className="text-green-600 dark:text-green-400">
                  Correct: <span className="font-medium">{lastResult.item.target}</span>
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
            className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
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
            placeholder="Type what you hear..."
            autoFocus
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
          />
          <motion.button
            type="submit"
            disabled={!inputValue.trim()}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
