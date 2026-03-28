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
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
      {modes.map(m => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={cn(
            'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
            mode === m.value
              ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
