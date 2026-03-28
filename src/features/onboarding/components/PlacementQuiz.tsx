import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLACEMENT_QUESTIONS } from '../data/placement-questions';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

interface PlacementQuizProps {
  onComplete: (correctCount: number, totalQuestions: number) => void;
}

export function PlacementQuiz({ onComplete }: PlacementQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const question = PLACEMENT_QUESTIONS[currentIndex];
  const total = PLACEMENT_QUESTIONS.length;
  const isLast = currentIndex === total - 1;

  function handleNext() {
    if (selectedOption === null) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    if (isLast) {
      const correctCount = newAnswers.reduce(
        (count, ans, i) => (ans === PLACEMENT_QUESTIONS[i].answer ? count + 1 : count),
        0,
      );
      onComplete(correctCount, total);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
    }
  }

  return (
    <div className="flex flex-col px-6 py-8 max-w-md mx-auto w-full">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>Question {currentIndex + 1}/{total}</span>
          <span>{question.level}</span>
        </div>
        <ProgressBar value={currentIndex + 1} max={total} color="indigo" size="sm" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {question.question}
          </h2>

          <div className="flex flex-col gap-3 mb-8">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(i)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all',
                  selectedOption === i
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <Button
        size="lg"
        className="w-full"
        disabled={selectedOption === null}
        onClick={handleNext}
      >
        {isLast ? 'Finish' : 'Next →'}
      </Button>
    </div>
  );
}
