import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import type { ListeningMode } from '../../../lib/types';

interface DictationModeSelectorProps {
  mode: ListeningMode;
  onChange: (mode: ListeningMode) => void;
}

const dictationModes: { value: ListeningMode; label: string }[] = [
  { value: 'word', label: 'Word' },
  { value: 'phrase', label: 'Phrase' },
  { value: 'sentence', label: 'Sentence' },
  { value: 'quiz', label: 'Quiz' },
];

const advancedModes: { value: ListeningMode; label: string; color: string }[] = [
  { value: 'fill-blank', label: 'Fill-blank', color: 'text-amber-600 dark:text-amber-400' },
  { value: 'speed', label: 'Speed', color: 'text-orange-600 dark:text-orange-400' },
  { value: 'listen-choose', label: 'Listen & Choose', color: 'text-violet-600 dark:text-violet-400' },
];

const comprehensionModes: { value: ListeningMode; label: string; color: string }[] = [
  { value: 'conversation', label: 'Conversation', color: 'text-teal-600 dark:text-teal-400' },
  { value: 'story', label: 'News/Story', color: 'text-emerald-600 dark:text-emerald-400' },
];

type ModeRow = 'dictation' | 'advanced' | 'comprehension';

function getModeRow(m: ListeningMode): ModeRow {
  if (dictationModes.some(dm => dm.value === m)) return 'dictation';
  if (advancedModes.some(am => am.value === m)) return 'advanced';
  return 'comprehension';
}

export function DictationModeSelector({ mode, onChange }: DictationModeSelectorProps) {
  const activeRow = getModeRow(mode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-2"
    >
      {/* Row 1: Dictation modes */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 relative">
        {dictationModes.map(m => (
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
            {mode === m.value && activeRow === 'dictation' && (
              <motion.div
                layoutId="listening-mode-indicator"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Row 2: Advanced modes */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 relative">
        {advancedModes.map(m => (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            className={cn(
              'flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-colors relative z-10',
              mode === m.value
                ? m.color
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            {mode === m.value && activeRow === 'advanced' && (
              <motion.div
                layoutId="listening-mode-indicator"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 text-xs sm:text-sm">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Row 3: Comprehension modes (AI content) */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 relative">
        {comprehensionModes.map(m => (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            className={cn(
              'flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-colors relative z-10',
              mode === m.value
                ? m.color
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            {mode === m.value && activeRow === 'comprehension' && (
              <motion.div
                layoutId="listening-mode-indicator"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 text-xs sm:text-sm">{m.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
