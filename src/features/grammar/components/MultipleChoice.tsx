import { useState } from 'react';
import Lottie from 'lottie-react';
import { cn } from '../../../lib/utils';
import type { MultipleChoiceExercise } from '../../../lib/types';
import correctAnim from '../../../assets/lottie/correct-check.json';
import wrongAnim from '../../../assets/lottie/wrong-shake.json';

interface Props {
  exercise: MultipleChoiceExercise;
  onAnswer: (correct: boolean, userAnswer: string) => void;
}

export function MultipleChoice({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (index: number) => {
    if (submitted) return;
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    const correct = selected === exercise.answer;
    onAnswer(correct, exercise.options[selected]);
  };

  const isCorrectAnswer = submitted && selected === exercise.answer;

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-900 dark:text-white">{exercise.question}</p>

      {submitted && (
        <div className="flex justify-center">
          <Lottie
            animationData={isCorrectAnswer ? correctAnim : wrongAnim}
            loop={false}
            className="w-20 h-20"
          />
        </div>
      )}

      <div className="space-y-2">
        {exercise.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={cn(
              'w-full text-left p-4 rounded-xl border-2 transition-all',
              !submitted && selected === i && 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
              !submitted && selected !== i && 'border-gray-200 dark:border-gray-700 hover:border-gray-300',
              submitted && i === exercise.answer && 'border-green-500 bg-green-50 dark:bg-green-900/20',
              submitted && selected === i && i !== exercise.answer && 'border-red-500 bg-red-50 dark:bg-red-900/20',
              submitted && i !== exercise.answer && selected !== i && 'border-gray-200 dark:border-gray-700 opacity-50'
            )}
          >
            <span className={cn(
              'font-medium',
              submitted && i === exercise.answer && 'text-green-700 dark:text-green-400',
              submitted && selected === i && i !== exercise.answer && 'text-red-700 dark:text-red-400',
              !submitted && 'text-gray-900 dark:text-white'
            )}>
              {option}
            </span>
          </button>
        ))}
      </div>
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full py-3 px-6 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
        >
          Check
        </button>
      )}
    </div>
  );
}
