import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface DictationPlayerProps {
  onPlay: () => void;
  isPlaying: boolean;
  hasPlayed: boolean;
  disabled?: boolean;
}

export function DictationPlayer({ onPlay, isPlaying, hasPlayed, disabled }: DictationPlayerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onPlay}
        disabled={disabled || isPlaying}
        className={cn(
          'w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg',
          isPlaying
            ? 'bg-indigo-500 text-white scale-105'
            : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isPlaying ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Volume2 size={40} />
          </motion.div>
        ) : (
          <Volume2 size={40} />
        )}
      </motion.button>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {hasPlayed ? 'Tap to listen again' : 'Tap to listen'}
      </p>
    </div>
  );
}
