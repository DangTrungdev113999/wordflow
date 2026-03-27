import { useState } from 'react';
import { cn } from '../../../lib/utils';
import type { ErrorCorrectionExercise } from '../../../lib/types';

interface Props {
  exercise: ErrorCorrectionExercise;
  onAnswer: (correct: boolean, userAnswer: string) => void;
}

export function ErrorCorrection({ exercise, onAnswer }: Props) {
  const words = exercise.sentence.split(' ');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const toggleWord = (index: number) => {
    if (submitted) return;
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = () => {
    if (selectedIndices.length === 0 || submitted) return;
    setSubmitted(true);
    const correct =
      selectedIndices.length === exercise.errorIndex.length &&
      selectedIndices.every((i) => exercise.errorIndex.includes(i));
    setIsCorrect(correct);
    onAnswer(correct, selectedIndices.map((i) => words[i]).join(', '));
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-900 dark:text-white">
        Find the error(s) in this sentence:
      </p>
      <div className="flex flex-wrap gap-2">
        {words.map((word, i) => (
          <button
            key={i}
            onClick={() => toggleWord(i)}
            className={cn(
              'px-3 py-2 rounded-lg border-2 font-medium transition-all',
              !submitted && !selectedIndices.includes(i) && 'border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-gray-400',
              !submitted && selectedIndices.includes(i) && 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
              submitted && exercise.errorIndex.includes(i) && 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
              submitted && selectedIndices.includes(i) && !exercise.errorIndex.includes(i) && 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 line-through',
              submitted && !exercise.errorIndex.includes(i) && !selectedIndices.includes(i) && 'border-gray-200 dark:border-gray-700 opacity-50'
            )}
          >
            {word}
          </button>
        ))}
      </div>
      {submitted && (
        <p className={cn('text-sm', isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
          {isCorrect ? '✅ Correct!' : `Correct sentence: "${exercise.correctSentence}"`}
        </p>
      )}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selectedIndices.length === 0}
          className="w-full py-3 px-6 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
        >
          Check
        </button>
      )}
    </div>
  );
}
