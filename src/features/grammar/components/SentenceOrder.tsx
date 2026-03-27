import { useState } from 'react';
import { cn } from '../../../lib/utils';
import type { SentenceOrderExercise } from '../../../lib/types';

interface Props {
  exercise: SentenceOrderExercise;
  onAnswer: (correct: boolean, userAnswer: string) => void;
}

export function SentenceOrder({ exercise, onAnswer }: Props) {
  const [available, setAvailable] = useState([...exercise.words]);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const selectWord = (word: string, index: number) => {
    if (submitted) return;
    setSelected([...selected, word]);
    setAvailable(available.filter((_, i) => i !== index));
  };

  const deselectWord = (word: string, index: number) => {
    if (submitted) return;
    setAvailable([...available, word]);
    setSelected(selected.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (selected.length === 0 || submitted) return;
    setSubmitted(true);
    const userSentence = selected.join(' ');
    // Normalize: trim, lowercase, handle punctuation
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim().replace(/\s([?.!,])/g, '$1');
    const correct = normalize(userSentence) === normalize(exercise.answer);
    setIsCorrect(correct);
    onAnswer(correct, userSentence);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-900 dark:text-white">
        Arrange the words to make a correct sentence:
      </p>

      {/* Selected words (answer area) */}
      <div className="min-h-[56px] p-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-wrap gap-2">
        {selected.length === 0 && (
          <span className="text-gray-400 text-sm">Tap words below to build the sentence...</span>
        )}
        {selected.map((word, i) => (
          <button
            key={`sel-${i}`}
            onClick={() => deselectWord(word, i)}
            className={cn(
              'px-3 py-2 rounded-lg font-medium transition-all',
              !submitted && 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200',
              submitted && isCorrect && 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
              submitted && !isCorrect && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            )}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2">
        {available.map((word, i) => (
          <button
            key={`avail-${i}`}
            onClick={() => selectWord(word, i)}
            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white hover:border-indigo-400 transition-all"
          >
            {word}
          </button>
        ))}
      </div>

      {submitted && !isCorrect && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Correct answer: <strong>{exercise.answer}</strong>
        </p>
      )}
      {submitted && isCorrect && (
        <p className="text-sm text-green-600 dark:text-green-400">✅ Correct!</p>
      )}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="w-full py-3 px-6 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
        >
          Check
        </button>
      )}
    </div>
  );
}
