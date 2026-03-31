import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trophy, RotateCcw, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { ComprehensionQuestion } from '../../../db/models';

interface QuizAnswer {
  questionIndex: number;
  selectedIndex: number;
  correct: boolean;
}

interface ComprehensionQuizProps {
  questions: ComprehensionQuestion[];
  currentIndex: number;
  answers: QuizAnswer[];
  onAnswer: (selectedIndex: number) => void;
  onNext: () => void;
  isComplete: boolean;
  correctCount: number;
  xpEarned: number;
  hintXpDeducted?: number;
  onPracticeAgain: () => void;
  onBack: () => void;
  accentColor?: string; // 'teal' | 'emerald' etc.
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function ComprehensionQuiz({
  questions,
  currentIndex,
  answers,
  onAnswer,
  onNext,
  isComplete,
  correctCount,
  xpEarned,
  hintXpDeducted,
  onPracticeAgain,
  onBack,
  accentColor = 'teal',
}: ComprehensionQuizProps) {
  const question = questions[currentIndex];
  const currentAnswer = answers.find(a => a.questionIndex === currentIndex);
  const hasAnswered = !!currentAnswer;

  // Auto-advance on correct after 1.5s
  useEffect(() => {
    if (currentAnswer?.correct && !isComplete) {
      const timer = setTimeout(onNext, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentAnswer, isComplete, onNext]);

  if (isComplete) {
    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const isPerfect = correctCount === questions.length;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="text-5xl">{isPerfect ? '🎉' : accuracy >= 70 ? '👏' : '💪'}</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Complete!</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
            <p className={cn('text-2xl font-bold', `text-${accentColor}-600 dark:text-${accentColor}-400`)}>{correctCount}/{questions.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Correct</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
            <p className={cn('text-2xl font-bold', `text-${accentColor}-600 dark:text-${accentColor}-400`)}>{accuracy}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Accuracy</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Trophy size={16} className="text-amber-500" />
              <p className="text-2xl font-bold text-amber-500">+{xpEarned}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">XP Earned</p>
          </div>
        </div>

        {hintXpDeducted != null && hintXpDeducted > 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/40 text-sm text-center">
            <span className="text-amber-700 dark:text-amber-300">Hints used (−{hintXpDeducted} XP)</span>
          </div>
        )}

        {/* Review wrong answers */}
        {answers.filter(a => !a.correct).length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">Review</h3>
            <div className="space-y-2">
              {answers.filter(a => !a.correct).map(a => {
                const q = questions[a.questionIndex];
                if (!q) return null;
                return (
                  <div key={a.questionIndex} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/40 text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">{q.question}</p>
                    <p className="text-red-600 dark:text-red-400 mt-1">
                      Your answer: {q.options[a.selectedIndex]}
                    </p>
                    <p className="text-green-600 dark:text-green-400">
                      Correct: {q.options[q.correctIndex]}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <button
            onClick={onPracticeAgain}
            className={cn(
              'flex-1 py-3 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2',
              `bg-${accentColor}-500 hover:bg-${accentColor}-600`,
            )}
          >
            <RotateCcw size={18} /> Again
          </button>
        </div>
      </motion.div>
    );
  }

  if (!question) return null;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{answers.filter(a => a.correct).length} correct</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', `bg-${accentColor}-500`)}
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <p className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
        {question.question}
      </p>

      {/* Options */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="grid grid-cols-1 gap-3"
        >
          {question.options.map((option, i) => {
            const isThisCorrect = i === question.correctIndex;
            const isThisSelected = currentAnswer?.selectedIndex === i;
            const submitted = hasAnswered;

            return (
              <motion.button
                key={i}
                onClick={() => !hasAnswered && onAnswer(i)}
                disabled={submitted}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={!submitted ? { scale: 0.98 } : undefined}
                className={cn(
                  'w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3',
                  !submitted && `border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-${accentColor}-300 dark:hover:border-${accentColor}-700 hover:bg-${accentColor}-50/50 dark:hover:bg-${accentColor}-900/10`,
                  submitted && isThisCorrect && 'border-green-500 bg-green-50 dark:bg-green-900/20',
                  submitted && isThisSelected && !isThisCorrect && 'border-red-500 bg-red-50 dark:bg-red-900/20',
                  submitted && !isThisCorrect && !isThisSelected && 'border-gray-200 dark:border-gray-700 opacity-40',
                )}
              >
                <span className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 mt-0.5',
                  !submitted && 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
                  submitted && isThisCorrect && 'bg-green-500 text-white',
                  submitted && isThisSelected && !isThisCorrect && 'bg-red-500 text-white',
                  submitted && !isThisCorrect && !isThisSelected && 'bg-gray-100 dark:bg-gray-800 text-gray-400',
                )}>
                  {OPTION_LABELS[i]}
                </span>
                <span className={cn(
                  'font-medium text-sm leading-relaxed',
                  !submitted && 'text-gray-900 dark:text-white',
                  submitted && isThisCorrect && 'text-green-700 dark:text-green-400',
                  submitted && isThisSelected && !isThisCorrect && 'text-red-700 dark:text-red-400',
                  submitted && !isThisCorrect && !isThisSelected && 'text-gray-400 dark:text-gray-500',
                )}>
                  {option}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Feedback + Next */}
      <AnimatePresence>
        {hasAnswered && !currentAnswer?.correct && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/40">
              <p className="text-sm text-amber-800 dark:text-amber-300">{question.explanation}</p>
            </div>
            <button
              onClick={onNext}
              className={cn(
                'w-full py-3 rounded-xl text-white font-semibold transition-colors flex items-center justify-center gap-2',
                `bg-${accentColor}-500 hover:bg-${accentColor}-600`,
              )}
            >
              Next <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Correct auto-advance indicator */}
      <AnimatePresence>
        {currentAnswer?.correct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
          >
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">Correct!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
