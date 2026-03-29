import { motion, AnimatePresence } from 'framer-motion';
import { QuizOption } from './QuizOption';
import type { EnrichedExample } from '../../../db/models';
import { cn } from '../../../lib/utils';

const CONTEXT_ICONS: Record<EnrichedExample['context'], string> = {
  daily: '\u{1F3E0}',
  work: '\u{1F4BC}',
  social: '\u{1F4AC}',
  formal: '\u{1F4F0}',
  dialogue: '\u{1F5E3}\uFE0F',
};

const CONTEXT_LABELS: Record<EnrichedExample['context'], string> = {
  daily: 'Daily life',
  work: 'Work',
  social: 'Social',
  formal: 'Formal',
  dialogue: 'Dialogue',
};

interface ContextFillSessionProps {
  /** Sentence with _____ blank replacing the target word */
  sentence: string;
  /** Context tag for the current example */
  context: EnrichedExample['context'];
  /** Vietnamese translation hint (shown below sentence) */
  translation?: string;
  currentIndex: number;
  total: number;
  options: string[];
  selectedOption: string | null;
  showFeedback: boolean;
  correctAnswer: string;
  onSelect: (option: string) => void;
}

export function ContextFillSession({
  sentence,
  context,
  translation,
  currentIndex,
  total,
  options,
  selectedOption,
  showFeedback,
  correctAnswer,
  onSelect,
}: ContextFillSessionProps) {
  const progress = (currentIndex / total) * 100;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{currentIndex + 1} / {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-400 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* Sentence card with blank */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950/40 dark:via-indigo-950/30 dark:to-blue-950/20 border border-violet-100 dark:border-violet-900/50 p-6"
        >
          {/* Context tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">{CONTEXT_ICONS[context]}</span>
            <span className={cn(
              'px-2.5 py-0.5 text-xs font-semibold rounded-full',
              'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
              'border border-violet-200 dark:border-violet-800',
            )}>
              {CONTEXT_LABELS[context]}
            </span>
          </div>

          {/* Instruction */}
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
            Fill in the blank
          </p>

          {/* Sentence with blank highlighted */}
          <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
            {sentence.split('_____').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="inline-block mx-1 px-3 py-0.5 rounded-lg bg-white/80 dark:bg-gray-800/80 border-2 border-dashed border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 font-bold min-w-[4rem] text-center">
                    {showFeedback ? correctAnswer : '?'}
                  </span>
                )}
              </span>
            ))}
          </p>

          {/* Translation hint */}
          {translation && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-3 italic">
              {translation}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2.5">
        {options.map((option, i) => (
          <QuizOption
            key={`${currentIndex}-${i}`}
            text={option}
            index={i}
            selected={selectedOption === option}
            isCorrect={selectedOption === correctAnswer}
            showFeedback={showFeedback}
            correctAnswer={correctAnswer}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Feedback flash */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-center text-sm font-semibold py-2 rounded-xl ${
              selectedOption === correctAnswer
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
            }`}
          >
            {selectedOption === correctAnswer ? 'Chính xác!' : `Đáp án: ${correctAnswer}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
