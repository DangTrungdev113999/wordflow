import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PenLine, Check, XIcon as XMark, Trophy, RotateCcw, ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useNoteTaking } from '../hooks/useNoteTaking';
import { useHints } from '../hooks/useHints';
import { HintBar } from './HintBar';
import { PlaybackControls } from './PlaybackControls';
import { MODE_HINT_AVAILABILITY } from '../types';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { TOPIC_ICONS } from '../../../lib/constants';

interface NoteTakingSessionProps {
  topic: string;
}

export function NoteTakingSession({ topic }: NoteTakingSessionProps) {
  const navigate = useNavigate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

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
    userNotes,
    setUserNotes,
    submitNotes,
    keyPointResults,
    matchedCount,
    totalPoints,
    xpEarned,
  } = useNoteTaking(topic);

  // Build a "dummy" word for hints (meaning hint uses translation)
  const hintWord = content ? {
    word: content.title,
    meaning: content.translation?.[currentParagraphIndex] ?? '',
    ipa: '',
    example: '',
    audioUrl: null,
  } : null;

  const {
    hints,
    usedHints,
    revealedValues,
    useHint,
    hintState,
  } = useHints({
    availableHints: MODE_HINT_AVAILABILITY['note-taking'],
    currentWord: hintWord,
    onSlowReplay: () => {
      if (currentParagraphIndex >= 0) {
        playParagraph(currentParagraphIndex);
      } else {
        playAll();
      }
    },
  });

  const topicData = ALL_TOPICS.find(t => t.topic === topic);
  const topicLabel = topicData?.topicLabel ?? topic;
  const topicIcon = TOPIC_ICONS[topic] ?? '📝';

  const handleBack = useCallback(() => navigate('/listening'), [navigate]);
  const handlePracticeAgain = useCallback(() => navigate(0), [navigate]);

  // Loading
  if (loading) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
              <PenLine size={28} className="text-violet-500" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-violet-400 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
          </div>
          <div className="text-center">
            <p className="text-gray-900 dark:text-white font-medium">Preparing content...</p>
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

  // Results phase
  if (phase === 'results') {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          {/* Score header */}
          <div className="text-center space-y-3">
            <div className="text-5xl">{matchedCount === totalPoints ? '🎉' : matchedCount >= 3 ? '👏' : '💪'}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notes Evaluated!</h2>
            <p className="text-gray-700 dark:text-gray-300">
              You captured <span className="font-semibold text-violet-600 dark:text-violet-400">{matchedCount}</span> of <span className="font-semibold">{totalPoints}</span> key points
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{matchedCount}/{totalPoints}</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">Key Points</p>
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

          {/* Key points breakdown */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">Key Points</h3>
            <div className="space-y-2">
              {keyPointResults.map((kp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    'p-3 rounded-xl border flex items-start gap-3',
                    kp.matched
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50',
                  )}
                >
                  {kp.matched ? (
                    <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <XMark size={18} className="text-red-500 shrink-0 mt-0.5" />
                  )}
                  <p className={cn(
                    'text-sm',
                    kp.matched ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300',
                  )}>
                    {kp.point}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User's notes */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Your Notes</h3>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {userNotes}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleBack} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={18} /> Back
            </button>
            <button onClick={handlePracticeAgain} className="flex-1 py-3 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors flex items-center justify-center gap-2">
              <RotateCcw size={18} /> Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Scoring phase (loading)
  if (phase === 'scoring') {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
              <Loader2 size={28} className="text-violet-500 animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-900 dark:text-white font-medium">Evaluating your notes...</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">AI is comparing your notes with key points</p>
          </div>
        </div>
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
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-medium">
                Note-taking
              </span>
            </div>
          </div>
        </div>
        <button onClick={() => setShowExitConfirm(true)} className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
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
                  ? 'bg-violet-500'
                  : i < currentParagraphIndex
                    ? 'bg-violet-300 dark:bg-violet-700'
                    : 'bg-gray-200 dark:bg-gray-700',
              )}
            />
          ))}
        </div>
      </div>

      {/* Paragraphs (scrollable) */}
      <div className="space-y-3 max-h-[30vh] overflow-y-auto">
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
                  isCurrent && 'bg-white dark:bg-gray-900 border-violet-200 dark:border-violet-800 shadow-sm ring-1 ring-violet-100 dark:ring-violet-900/40',
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

      {/* Notes textarea */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <PenLine size={14} />
          Your notes
        </label>
        <textarea
          value={userNotes}
          onChange={e => setUserNotes(e.target.value)}
          placeholder="Type your notes while listening... (English or Vietnamese)"
          rows={4}
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-violet-400 dark:focus:border-violet-600 focus:outline-none transition-colors resize-none text-sm leading-relaxed"
        />
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-colors',
            showTranslation
              ? 'border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
          )}
        >
          {showTranslation ? <EyeOff size={16} /> : <Eye size={16} />}
          {showTranslation ? 'Hide Translation' : 'Translation'}
        </button>
        <button
          onClick={submitNotes}
          disabled={!userNotes.trim()}
          className="flex-1 py-3 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          Submit Notes <ArrowRight size={16} />
        </button>
      </div>

      {/* Hints */}
      <HintBar
        hints={hints}
        usedHints={usedHints}
        onUseHint={useHint}
        revealedValues={revealedValues}
      />

      {/* Key vocab */}
      {content.keyVocab.length > 0 && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Key Vocabulary</p>
          <div className="flex flex-wrap gap-1.5">
            {content.keyVocab.map((word, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-medium">
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
