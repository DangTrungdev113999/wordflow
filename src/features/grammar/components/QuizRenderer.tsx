import type { GrammarExercise } from '../../../lib/types';
import { MultipleChoice } from './MultipleChoice';
import { FillBlank } from './FillBlank';
import { ErrorCorrection } from './ErrorCorrection';
import { SentenceOrder } from './SentenceOrder';

interface Props {
  exercise: GrammarExercise;
  onAnswer: (correct: boolean, userAnswer: string) => void;
}

export function QuizRenderer({ exercise, onAnswer }: Props) {
  const typeLabel: Record<string, string> = {
    multiple_choice: 'Multiple Choice',
    fill_blank: 'Fill in the Blank',
    error_correction: 'Error Correction',
    sentence_order: 'Sentence Order',
  };

  return (
    <div className="space-y-3">
      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
        {typeLabel[exercise.type]}
      </span>
      {exercise.type === 'multiple_choice' && (
        <MultipleChoice exercise={exercise} onAnswer={onAnswer} />
      )}
      {exercise.type === 'fill_blank' && (
        <FillBlank exercise={exercise} onAnswer={onAnswer} />
      )}
      {exercise.type === 'error_correction' && (
        <ErrorCorrection exercise={exercise} onAnswer={onAnswer} />
      )}
      {exercise.type === 'sentence_order' && (
        <SentenceOrder exercise={exercise} onAnswer={onAnswer} />
      )}
    </div>
  );
}
