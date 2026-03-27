import { useState } from 'react';
import { cn } from '../../../lib/utils';
import type { SentenceOrderExercise } from '../../../lib/types';

interface Props {
  exercise: SentenceOrderExercise;
  onAnswer: (correct: boolean, userAnswer: string) => void;
}

export function SentenceOrder({ exercise, onAnswer }: Props) {
  // Track words as indexed items to handle duplicates
  const [available, setAvailable] = useState(
    exercise.words.map((word, i) => ({ word, originalIndex: i }))
  );
  const [selected, setSelected] = useState<Array<{ word: string; originalIndex: number }>>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const selectWord = (item: { word: string; originalIndex: number }) => {
    if (submitted) return;
    setSelected([...selected, item]);
    setAvailable(available.filter((a) => a.originalIndex !== item.originalIndex));
  };

  const deselectWord = (item: { word: string; originalIndex: number }) => {
    if (submitted) return;
    // Return to available pool, sorted by original position for consistency
    const newAvailable = [...available, item].sort((a, b) => a.originalIndex - b.originalIndex);
    setAvailable(newAvailable);
    setSelected(selected.filter((s) => s.originalIndex !== item.originalIndex));
  };

  const handleSubmit = () => {
    if (selected.length === 0 || submitted) return;
    setSubmitted(true);
    const userSentence = selected.map((s) => s.word).join(' ');
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

      {/* Selected words (answer area) — tap to remove & reorder */}
      <div className="min-h-[56px] p-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-wrap gap-2">
        {selected.length === 0 && (
          <span className="text-gray-400 text-sm">Tap words below to build the sentence. Tap here to remove.</span>
        )}
        {selected.map((item) => (
          <button
            key={`sel-${item.originalIndex}`}
            onClick={() => deselectWord(item)}
            className={cn(
              'px-3 py-2 rounded-lg font-medium transition-all cursor-pointer',
              !submitted && 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400',
              submitted && isCorrect && 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
              submitted && !isCorrect && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            )}
          >
            {item.word}
          </button>
        ))}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2 min-h-[44px]">
        {available.map((item) => (
          <button
            key={`avail-${item.originalIndex}`}
            onClick={() => selectWord(item)}
            disabled={submitted}
            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white hover:border-indigo-400 transition-all"
          >
            {item.word}
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
