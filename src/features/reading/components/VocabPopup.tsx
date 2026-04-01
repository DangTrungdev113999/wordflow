import { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, X } from 'lucide-react';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';

interface Props {
  word: string;
  onClose: () => void;
}

function lookupWord(word: string) {
  const lower = word.toLowerCase();
  for (const topic of ALL_TOPICS) {
    const found = topic.words.find(w => w.word.toLowerCase() === lower);
    if (found) return found;
  }
  return null;
}

export function VocabPopup({ word, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const entry = useMemo(() => lookupWord(word), [word]);

  // Close on backdrop click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target === backdropRef.current) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handlePlayAudio = () => {
    if (!entry) return;
    const url = entry.audioUrl ?? `https://api.dictionaryapi.dev/media/pronunciations/en/${entry.word}-us.mp3`;
    const audio = new Audio(url);
    audio.play().catch(() => {
      // fallback: try TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(entry.word);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
      }
    });
  };

  return (
    <AnimatePresence>
      <div
        ref={backdropRef}
        className="fixed inset-0 z-50 bg-black/30"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl border-t border-gray-200 dark:border-gray-700 p-5 pb-[calc(2rem+env(safe-area-inset-bottom))]"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{entry?.word ?? word}</h3>
              {entry?.ipa && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{entry.ipa}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayAudio}
                className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <Volume2 size={20} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {entry ? (
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Meaning:</span> {entry.meaning}
              </p>
              {entry.example && (
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  "{entry.example}"
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">
              Definition not found in vocabulary data.
            </p>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
