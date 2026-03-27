import { useState } from 'react';
import { cn } from '../../../lib/utils';
import type { FillBlankExercise } from '../../../lib/types';

interface Props {
  exercise: FillBlankExercise;
  onAnswer: (correct: boolean, userAnswer: string) => void;
}

export function FillBlank({ exercise, onAnswer }: Props) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!input.trim() || submitted) return;
    setSubmitted(true);
    const trimmed = input.trim().toLowerCase();
    const correct = exercise.acceptedAnswers.some(
      (a) => a.toLowerCase() === trimmed
    );
    setIsCorrect(correct);
    onAnswer(correct, input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-900 dark:text-white">{exercise.question}</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={submitted}
        placeholder="Type your answer..."
        className={cn(
          'w-full p-4 rounded-xl border-2 text-lg outline-none transition-colors bg-white dark:bg-gray-900',
          !submitted && 'border-gray-200 dark:border-gray-700 focus:border-indigo-500',
          submitted && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-900/20',
          submitted && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-900/20'
        )}
        autoFocus
      />
      {submitted && !isCorrect && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Correct answer: <strong>{exercise.acceptedAnswers[0]}</strong>
        </p>
      )}
      {submitted && isCorrect && (
        <p className="text-sm text-green-600 dark:text-green-400">✅ Correct!</p>
      )}
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
