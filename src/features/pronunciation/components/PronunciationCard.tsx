import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, Loader2, RotateCcw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAudio } from '../../../hooks/useAudio';
import { cn } from '../../../lib/utils';
import type { VocabWord } from '../../../lib/types';
import type { AttemptResult } from '../hooks/usePronunciationSession';

interface PronunciationCardProps {
  word: VocabWord;
  audioUrl: string | null;
  attempt: number;
  maxAttempts: number;
  isListening: boolean;
  lastResult: { result: AttemptResult; transcript: string; confidence: number } | null;
  isWordDone: boolean;
  onRecord: () => void;
  onNext: () => void;
}

const resultConfig = {
  exact: {
    icon: CheckCircle2,
    label: 'Correct!',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50',
  },
  close: {
    icon: AlertCircle,
    label: 'Close! Try again',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50',
  },
  miss: {
    icon: XCircle,
    label: 'Not quite',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50',
  },
};

export function PronunciationCard({
  word,
  audioUrl,
  attempt,
  maxAttempts,
  isListening,
  lastResult,
  isWordDone,
  onRecord,
  onNext,
}: PronunciationCardProps) {
  const { isPlaying, play } = useAudio();

  const handlePlayAudio = () => {
    play(word.word, audioUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Word display card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {word.word}
        </h2>
        <p className="text-lg text-indigo-500 dark:text-indigo-400 font-mono">{word.ipa}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{word.meaning}</p>

        {/* Play sample audio */}
        <button
          onClick={handlePlayAudio}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
          {isPlaying ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Volume2 size={16} />
          )}
          Listen to pronunciation
        </button>
      </div>

      {/* Attempt dots */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: maxAttempts }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-colors',
              i < attempt
                ? lastResult?.result === 'exact' && i === attempt - 1
                  ? 'bg-green-500'
                  : 'bg-red-300 dark:bg-red-700'
                : 'bg-gray-200 dark:bg-gray-700',
            )}
          />
        ))}
        <span className="ml-2 text-xs text-gray-400">
          {attempt}/{maxAttempts} attempts
        </span>
      </div>

      {/* Result feedback */}
      <AnimatePresence mode="wait">
        {lastResult && (
          <motion.div
            key={`${lastResult.result}-${attempt}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={cn('rounded-xl border p-4 text-center', resultConfig[lastResult.result].bg)}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              {(() => {
                const Icon = resultConfig[lastResult.result].icon;
                return <Icon size={20} className={resultConfig[lastResult.result].color} />;
              })()}
              <span className={cn('font-semibold', resultConfig[lastResult.result].color)}>
                {resultConfig[lastResult.result].label}
              </span>
            </div>
            {lastResult.transcript && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You said: "<span className="font-medium text-gray-700 dark:text-gray-300">{lastResult.transcript}</span>"
              </p>
            )}
            {lastResult.result === 'miss' && isWordDone && (
              <p className="text-xs text-gray-400 mt-1">Listen to the correct pronunciation above</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex justify-center">
        {isWordDone ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="px-8 py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors shadow-sm shadow-indigo-200 dark:shadow-indigo-900"
          >
            Next Word
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            animate={isListening ? { scale: [1, 1.08, 1] } : {}}
            transition={isListening ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : {}}
            onClick={onRecord}
            disabled={isListening}
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg',
              isListening
                ? 'bg-red-500 text-white shadow-red-200 dark:shadow-red-900'
                : 'bg-indigo-500 text-white shadow-indigo-200 dark:shadow-indigo-900 hover:bg-indigo-600 active:bg-indigo-700',
            )}
          >
            {isListening ? (
              <div className="relative">
                <Mic size={28} />
                <motion.span
                  className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            ) : lastResult && !isWordDone ? (
              <RotateCcw size={28} />
            ) : (
              <Mic size={28} />
            )}
          </motion.button>
        )}
      </div>

      {!isWordDone && !isListening && (
        <p className="text-center text-xs text-gray-400">
          {lastResult ? 'Tap to try again' : 'Tap the microphone and say the word'}
        </p>
      )}
    </motion.div>
  );
}
