import { motion } from 'framer-motion';
import { Trophy, RotateCcw, BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import type { GrammarExercise } from '../../lib/types';
import { QuizRenderer } from '../grammar/components/QuizRenderer';
import { cn } from '../../lib/utils';

interface QuizProps {
  exercises: GrammarExercise[];
  currentIndex: number;
  onAnswer: (correct: boolean, userAnswer: string) => void;
}

export function MediaQuiz({ exercises, currentIndex, onAnswer }: QuizProps) {
  if (currentIndex >= exercises.length) return null;

  const exercise = exercises[currentIndex];
  const progress = ((currentIndex) / exercises.length) * 100;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
          <span>Question {currentIndex + 1} of {exercises.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Quiz content */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <QuizRenderer exercise={exercise} onAnswer={onAnswer} />
      </motion.div>
    </div>
  );
}

interface SummaryProps {
  score: number;
  results: { correct: boolean; userAnswer: string }[];
  exercises: GrammarExercise[];
  onReset: () => void;
}

export function MediaQuizSummary({ score, results, exercises, onReset }: SummaryProps) {
  const correctCount = results.filter(r => r.correct).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Score card */}
      <div className={cn(
        'rounded-2xl p-6 text-center',
        score >= 80
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30'
          : score >= 50
            ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30',
      )}>
        <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm">
          <Trophy size={28} className={
            score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'
          } />
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{score}%</div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {correctCount}/{results.length} correct
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {score >= 80 ? 'Excellent work!' : score >= 50 ? 'Good effort, keep practicing!' : 'Keep learning, you\'ll improve!'}
        </p>
      </div>

      {/* Results breakdown */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen size={16} />
          Results
        </h4>
        {results.map((result, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900/50"
          >
            {result.correct ? (
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
            ) : (
              <XCircle size={16} className="text-red-500 flex-shrink-0" />
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
              Q{i + 1}: {'question' in exercises[i] ? (exercises[i] as { question: string }).question : 'sentence' in exercises[i] ? (exercises[i] as { sentence: string }).sentence : `Question ${i + 1}`}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <button
        type="button"
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
      >
        <RotateCcw size={16} />
        Learn from new content
      </button>
    </motion.div>
  );
}
