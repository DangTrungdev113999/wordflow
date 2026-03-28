import { useState, useCallback } from 'react';
import { Mic } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { PronunciationResult } from './PronunciationResult';
import { eventBus } from '../../../services/eventBus';
import { cn } from '../../../lib/utils';

interface PronunciationButtonProps {
  word: string;
  wordId: string;
}

export function PronunciationButton({ word, wordId }: PronunciationButtonProps) {
  const { isSupported, isListening, startListening } = useSpeechRecognition();
  const [result, setResult] = useState<{ isCorrect: boolean; spokenText: string } | null>(null);

  const handleSpeak = useCallback(async () => {
    if (isListening) return;
    setResult(null);

    try {
      const { alternatives, transcript } = await startListening('en-US');
      const target = word.toLowerCase().trim();
      const isCorrect = alternatives.some((alt) => alt === target);

      setResult({ isCorrect, spokenText: transcript });

      if (isCorrect) {
        eventBus.emit('pronunciation:correct', { wordId });
      } else {
        eventBus.emit('pronunciation:incorrect', { wordId });
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'no-speech') {
        setResult({ isCorrect: false, spokenText: "Didn't hear anything, try again" });
      }
      // Other speech recognition errors — silently ignore (button returns to idle)
    }
  }, [isListening, startListening, word, wordId]);

  const handleDismiss = useCallback(() => setResult(null), []);

  if (!isSupported) return null;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={handleSpeak}
        className={cn(
          'flex items-center justify-center rounded-full transition-all duration-200 active:scale-95 w-9 h-9',
          isListening
            ? 'text-red-500 bg-red-50 dark:bg-red-900/30'
            : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
        )}
        title={`Pronounce "${word}"`}
      >
        {isListening ? (
          <span className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-50" />
            <Mic size={18} />
          </span>
        ) : (
          <Mic size={18} />
        )}
      </button>

      {isListening && (
        <span className="text-xs text-gray-400 animate-pulse">Listening...</span>
      )}

      <AnimatePresence>
        {result && (
          <PronunciationResult
            isCorrect={result.isCorrect}
            spokenText={result.spokenText}
            targetWord={word}
            onDismiss={handleDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
