import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, X as XIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import type { ReadingQuestion } from '../data/passages';

interface Props {
  questions: ReadingQuestion[];
  currentIndex: number;
  onAnswer: (correct: boolean, userAnswer: string) => void;
  onNext: () => void;
}

const optionLabels = ['A', 'B', 'C', 'D'];

export function ComprehensionQuiz({ questions, currentIndex, onAnswer, onNext }: Props) {
  const question = questions[currentIndex];
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [fillAnswer, setFillAnswer] = useState('');

  // Reset state when question changes
  useEffect(() => {
    setSubmitted(false);
    setIsCorrect(false);
    setSelectedIndex(null);
    setFillAnswer('');
  }, [currentIndex]);

  if (!question) return null;

  const handleMCSelect = (index: number) => {
    if (submitted) return;
    setSelectedIndex(index);
    setSubmitted(true);
    const correct = index === question.answer;
    setIsCorrect(correct);
    onAnswer(correct, question.options?.[index] ?? '');
  };

  const handleTFSelect = (value: boolean) => {
    if (submitted) return;
    setSelectedIndex(value ? 1 : 0);
    setSubmitted(true);
    const correct = value === question.answer;
    setIsCorrect(correct);
    onAnswer(correct, String(value));
  };

  const handleFillSubmit = () => {
    if (submitted || !fillAnswer.trim()) return;
    setSubmitted(true);
    const correct = fillAnswer.trim().toLowerCase() === (question.answer as string).toLowerCase();
    setIsCorrect(correct);
    onAnswer(correct, fillAnswer.trim());
  };

  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{question.type === 'multiple_choice' ? 'Multiple Choice' : question.type === 'true_false' ? 'True / False' : 'Fill in the Blank'}</span>
        </div>
        <ProgressBar value={currentIndex + 1} max={questions.length} />
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <p className="text-lg font-medium text-gray-900 dark:text-white">{question.question}</p>
      </div>

      {/* Multiple Choice */}
      {question.type === 'multiple_choice' && question.options && (
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, i) => {
            const isThisCorrect = i === question.answer;
            const isThisSelected = selectedIndex === i;

            return (
              <motion.button
                key={i}
                onClick={() => handleMCSelect(i)}
                disabled={submitted}
                whileTap={!submitted ? { scale: 0.98 } : undefined}
                className={cn(
                  'w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3',
                  !submitted && 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700',
                  submitted && isThisCorrect && 'border-green-500 bg-green-50 dark:bg-green-900/20',
                  submitted && isThisSelected && !isThisCorrect && 'border-red-500 bg-red-50 dark:bg-red-900/20',
                  submitted && !isThisCorrect && !isThisSelected && 'border-gray-200 dark:border-gray-700 opacity-40',
                )}
              >
                <span
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0',
                    !submitted && 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                    submitted && isThisCorrect && 'bg-green-500 text-white',
                    submitted && isThisSelected && !isThisCorrect && 'bg-red-500 text-white',
                    submitted && !isThisCorrect && !isThisSelected && 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
                  )}
                >
                  {optionLabels[i]}
                </span>
                <span
                  className={cn(
                    'font-medium text-base',
                    !submitted && 'text-gray-900 dark:text-white',
                    submitted && isThisCorrect && 'text-green-700 dark:text-green-400',
                    submitted && isThisSelected && !isThisCorrect && 'text-red-700 dark:text-red-400',
                    submitted && !isThisCorrect && !isThisSelected && 'text-gray-600 dark:text-gray-400',
                  )}
                >
                  {option}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* True / False */}
      {question.type === 'true_false' && (
        <div className="grid grid-cols-2 gap-3">
          {[true, false].map(value => {
            const isThisCorrect = value === question.answer;
            const isThisSelected = selectedIndex === (value ? 1 : 0);

            return (
              <motion.button
                key={String(value)}
                onClick={() => handleTFSelect(value)}
                disabled={submitted}
                whileTap={!submitted ? { scale: 0.98 } : undefined}
                className={cn(
                  'p-4 rounded-2xl border-2 transition-all font-semibold text-lg',
                  !submitted && 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-900 dark:text-white',
                  submitted && isThisCorrect && 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
                  submitted && isThisSelected && !isThisCorrect && 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
                  submitted && !isThisCorrect && !isThisSelected && 'border-gray-200 dark:border-gray-700 opacity-40 text-gray-600 dark:text-gray-400',
                )}
              >
                {value ? 'True' : 'False'}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Fill in the Blank */}
      {question.type === 'fill_blank' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={fillAnswer}
              onChange={e => setFillAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFillSubmit()}
              disabled={submitted}
              placeholder="Type your answer..."
              className={cn(
                'flex-1 px-4 py-3 rounded-xl border-2 text-base transition-all outline-none',
                !submitted && 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500',
                submitted && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
                submitted && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
              )}
            />
            {!submitted && (
              <motion.button
                onClick={handleFillSubmit}
                whileTap={{ scale: 0.95 }}
                disabled={!fillAnswer.trim()}
                className="px-5 py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check
              </motion.button>
            )}
          </div>
          {submitted && !isCorrect && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Correct answer: <span className="font-semibold">{question.answer as string}</span>
            </p>
          )}
        </div>
      )}

      {/* Feedback + Next */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div
              className={cn(
                'p-4 rounded-2xl border flex items-start gap-3',
                isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/40'
                  : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40',
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                  isCorrect ? 'bg-green-500' : 'bg-red-500',
                )}
              >
                {isCorrect ? <Check size={14} className="text-white" /> : <XIcon size={14} className="text-white" />}
              </div>
              <div>
                <p
                  className={cn(
                    'font-medium text-sm',
                    isCorrect ? 'text-green-800 dark:text-green-300' : 'text-amber-800 dark:text-amber-300',
                  )}
                >
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </p>
                <p
                  className={cn(
                    'text-sm mt-1',
                    isCorrect ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400',
                  )}
                >
                  {question.explanation}
                </p>
              </div>
            </div>

            <button
              onClick={onNext}
              className="w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
            >
              {currentIndex + 1 < questions.length ? 'Next' : 'See Results'}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
