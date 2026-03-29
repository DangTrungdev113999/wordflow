import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
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
  const [showFeedback, setShowFeedback] = useState(false);

  const question = PLACEMENT_QUESTIONS[currentIndex];
  const total = PLACEMENT_QUESTIONS.length;
  const isLast = currentIndex === total - 1;

  const isCorrect = selectedOption === question.answer;

  const advance = useCallback((newAnswers: number[]) => {
    if (currentIndex === total - 1) {
      const correctCount = newAnswers.reduce(
        (count, ans, i) => (ans === PLACEMENT_QUESTIONS[i].answer ? count + 1 : count),
        0,
      );
      onComplete(correctCount, total);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  }, [currentIndex, total, onComplete]);

  function handleNext() {
    if (selectedOption === null) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setShowFeedback(true);

    setTimeout(() => advance(newAnswers), 700);
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
            {question.options.map((option, i) => {
              const isAnswer = i === question.answer;
              const isSelected = selectedOption === i;

              let optionStyle = 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600';
              if (showFeedback) {
                if (isAnswer) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
                } else {
                  optionStyle = 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500';
                }
              } else if (isSelected) {
                optionStyle = 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300';
              }

              return (
                <button
                  key={i}
                  onClick={() => !showFeedback && setSelectedOption(i)}
                  disabled={showFeedback}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all flex items-center justify-between',
                    optionStyle,
                  )}
                >
                  <span>{option}</span>
                  {showFeedback && isAnswer && (
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  )}
                  {showFeedback && isSelected && !isCorrect && (
                    <XCircle size={18} className="text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <Button
        size="lg"
        className="w-full"
        disabled={selectedOption === null || showFeedback}
        onClick={handleNext}
      >
        {isLast ? 'Finish' : 'Next →'}
      </Button>
    </div>
  );
}
