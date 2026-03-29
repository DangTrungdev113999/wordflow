import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface QuizOptionProps {
  text: string;
  index: number;
  selected: boolean;
  isCorrect: boolean;
  showFeedback: boolean;
  correctAnswer: string;
  onSelect: (text: string) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function QuizOption({
  text,
  index,
  selected,
  isCorrect,
  showFeedback,
  correctAnswer,
  onSelect,
}: QuizOptionProps) {
  const isThisCorrect = text === correctAnswer;
  const isWrongSelected = showFeedback && selected && !isCorrect;
  const isCorrectRevealed = showFeedback && isThisCorrect;

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
      whileTap={!showFeedback ? { scale: 0.97 } : undefined}
      onClick={() => onSelect(text)}
      disabled={showFeedback}
      className={cn(
        'relative w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-colors duration-200',
        // Default state
        !showFeedback && !selected && 'bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800',
        // Correct answer revealed (green)
        isCorrectRevealed && 'bg-emerald-50 dark:bg-emerald-900/30 ring-2 ring-emerald-500',
        // Wrong answer selected (red)
        isWrongSelected && 'bg-red-50 dark:bg-red-900/20 ring-2 ring-red-400',
        // Not involved in feedback
        showFeedback && !isCorrectRevealed && !isWrongSelected && 'opacity-50',
      )}
    >
      {/* Letter badge */}
      <div className={cn(
        'flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shrink-0 transition-colors duration-200',
        isCorrectRevealed
          ? 'bg-emerald-500 text-white'
          : isWrongSelected
            ? 'bg-red-400 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
      )}>
        {showFeedback && isCorrectRevealed ? (
          <Check size={16} />
        ) : showFeedback && isWrongSelected ? (
          <X size={16} />
        ) : (
          OPTION_LETTERS[index]
        )}
      </div>

      {/* Text */}
      <span className={cn(
        'text-sm font-medium leading-snug',
        isCorrectRevealed
          ? 'text-emerald-700 dark:text-emerald-300'
          : isWrongSelected
            ? 'text-red-700 dark:text-red-300'
            : 'text-gray-800 dark:text-gray-200',
      )}>
        {text}
      </span>
    </motion.button>
  );
}
