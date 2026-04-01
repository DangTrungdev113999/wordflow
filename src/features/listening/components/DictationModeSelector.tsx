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
];

const interactiveModes: { value: ListeningMode; label: string; color: string }[] = [
  { value: 'quiz', label: 'Quiz', color: 'text-amber-600 dark:text-amber-400' },
  { value: 'fill-blank', label: 'Fill-blank', color: 'text-amber-600 dark:text-amber-400' },
  { value: 'listen-choose', label: 'Choose', color: 'text-amber-600 dark:text-amber-400' },
];

const challengeModes: { value: ListeningMode; label: string; color: string }[] = [
  { value: 'speed', label: 'Speed', color: 'text-orange-600 dark:text-orange-400' },
  { value: 'accent', label: 'Accent', color: 'text-sky-600 dark:text-sky-400' },
];

const comprehensionModes: { value: ListeningMode; label: string; color: string }[] = [
  { value: 'conversation', label: 'Conversation', color: 'text-teal-600 dark:text-teal-400' },
  { value: 'story', label: 'Story', color: 'text-emerald-600 dark:text-emerald-400' },
  { value: 'note-taking', label: 'Notes', color: 'text-violet-600 dark:text-violet-400' },
];

type ModeRow = 'dictation' | 'interactive' | 'challenge' | 'comprehension';

function getModeRow(m: ListeningMode): ModeRow {
  if (dictationModes.some(dm => dm.value === m)) return 'dictation';
  if (interactiveModes.some(am => am.value === m)) return 'interactive';
  if (challengeModes.some(cm => cm.value === m)) return 'challenge';
  return 'comprehension';
}

export function DictationModeSelector({ mode, onChange }: DictationModeSelectorProps) {
  const activeRow = getModeRow(mode);

  const renderRow = (
    modes: { value: ListeningMode; label: string; color?: string }[],
    rowId: ModeRow,
  ) => (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 relative">
      {modes.map(m => {
        const isActive = mode === m.value;
        const activeColor = 'color' in m && m.color ? m.color : 'text-indigo-600 dark:text-indigo-400';
        return (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            className={cn(
              'flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-colors relative z-10',
              isActive
                ? activeColor
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400',
            )}
          >
            {isActive && activeRow === rowId && (
              <motion.div
                layoutId="listening-mode-indicator"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 text-xs sm:text-sm">{m.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-2"
    >
      {renderRow(dictationModes, 'dictation')}
      {renderRow(interactiveModes, 'interactive')}
      {renderRow(challengeModes, 'challenge')}
      {renderRow(comprehensionModes, 'comprehension')}
    </motion.div>
  );
}
