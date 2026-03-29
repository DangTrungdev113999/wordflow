import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import type { DictationMode } from '../../../lib/types';

interface DictationModeSelectorProps {
  mode: DictationMode;
  onChange: (mode: DictationMode) => void;
}

const modes: { value: DictationMode; label: string }[] = [
  { value: 'word', label: 'Word' },
  { value: 'phrase', label: 'Phrase' },
  { value: 'sentence', label: 'Sentence' },
  { value: 'quiz', label: 'Quiz' },
];

export function DictationModeSelector({ mode, onChange }: DictationModeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 relative"
    >
      {modes.map(m => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={cn(
            'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors relative z-10',
            mode === m.value
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          {mode === m.value && (
            <motion.div
              layoutId="dictation-mode-indicator"
              className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{m.label}</span>
        </button>
      ))}
    </motion.div>
  );
}
