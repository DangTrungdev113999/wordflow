import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { cn } from '../../../lib/utils';
import type { TransformExercise as TransformExerciseType } from '../../../lib/types';
import correctAnim from '../../../assets/lottie/correct-check.json';
import wrongAnim from '../../../assets/lottie/wrong-shake.json';

interface Props {
  exercise: TransformExerciseType;
  onAnswer: (correct: boolean, userAnswer: string) => void;
}

/** Simple word-level diff between original and answer */
function computeDiff(original: string, answer: string) {
  const origWords = original.replace(/[.!?]$/, '').split(/\s+/);
  const ansWords = answer.replace(/[.!?]$/, '').split(/\s+/);

  // Build a set of original words (lowercase) for quick lookup
  const origSet = new Set(origWords.map((w) => w.toLowerCase()));

  return ansWords.map((word) => ({
    word,
    changed: !origSet.has(word.toLowerCase()),
  }));
}

export function TransformExercise({ exercise, onAnswer }: Props) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [matchedAnswer, setMatchedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (!input.trim() || submitted) return;
    setSubmitted(true);
    const trimmed = input.trim();
    // Normalize: lowercase, strip trailing punctuation for comparison
    const normalize = (s: string) => s.toLowerCase().replace(/[.!?]+$/, '').trim();
    const correct = exercise.acceptedAnswers.some(
      (a) => normalize(a) === normalize(trimmed)
    );
    setIsCorrect(correct);
    // Find the closest accepted answer for diff display
    const matched = exercise.acceptedAnswers.find(
      (a) => normalize(a) === normalize(trimmed)
    ) ?? exercise.acceptedAnswers[0];
    setMatchedAnswer(matched);
    onAnswer(correct, trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  // Diff between original and the correct answer
  const diffWords = useMemo(() => {
    if (!submitted || !matchedAnswer) return null;
    const answerToShow = isCorrect ? matchedAnswer : exercise.acceptedAnswers[0];
    return computeDiff(exercise.original, answerToShow);
  }, [submitted, matchedAnswer, isCorrect, exercise]);

  return (
    <div className="space-y-4">
      {/* Instruction */}
      <p className="text-lg font-medium text-gray-900 dark:text-white">
        {exercise.instruction}
      </p>

      {/* Original sentence card */}
      <div className="relative px-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/60 dark:from-gray-800/60 dark:to-gray-900/40 border border-gray-200 dark:border-gray-700">
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
          Original
        </div>
        <p className="text-base text-gray-900 dark:text-white font-medium">
          {exercise.original}
        </p>
      </div>

      {/* Hint toggle */}
      {exercise.hint && !submitted && (
        showHint ? (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800">
            Hint: {exercise.hint}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
          >
            Show hint
          </button>
        )
      )}

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={submitted}
        placeholder="Type the transformed sentence..."
        className={cn(
          'w-full p-4 rounded-xl border-2 text-lg outline-none transition-colors bg-white dark:bg-gray-900',
          !submitted && 'border-gray-200 dark:border-gray-700 focus:border-indigo-500',
          submitted && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-900/20',
          submitted && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-900/20'
        )}
        autoFocus
      />

      {/* Feedback animation */}
      {submitted && (
        <div className="flex justify-center">
          <Lottie
            animationData={isCorrect ? correctAnim : wrongAnim}
            loop={false}
            className="w-20 h-20"
          />
        </div>
      )}

      {/* Diff highlight */}
      {submitted && diffWords && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
        >
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
            {isCorrect ? 'Changes made' : 'Correct answer'}
          </div>
          <div className="flex flex-wrap gap-1">
            {diffWords.map((dw, i) => (
              <span
                key={i}
                className={cn(
                  'px-1.5 py-0.5 rounded text-sm font-medium transition-colors',
                  dw.changed
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'text-gray-600 dark:text-gray-400'
                )}
              >
                {dw.word}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Incorrect message */}
      {submitted && !isCorrect && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Correct answer: <strong>{exercise.acceptedAnswers[0]}</strong>
        </p>
      )}

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full py-3 px-6 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
        >
          Check
        </button>
      )}
    </div>
  );
}
