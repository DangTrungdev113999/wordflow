import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { ArrowLeft, RotateCcw, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import celebrationAnim from '../../../assets/lottie/celebration.json';

interface IncorrectQuestion {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

interface QuizSummaryProps {
  lessonTitle: string;
  correctCount: number;
  totalQuestions: number;
  score: number;
  xp: { totalXP: number; perfectBonus: number; lessonBonus: number };
  incorrectQuestions: IncorrectQuestion[];
  onRetry: () => void;
  onBack: () => void;
}

export function QuizSummary({
  lessonTitle,
  correctCount,
  totalQuestions,
  score,
  xp,
  incorrectQuestions,
  onRetry,
  onBack,
}: QuizSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="px-4 py-10 flex flex-col items-center gap-6 text-center max-w-md mx-auto"
    >
      <Lottie
        animationData={celebrationAnim}
        loop={false}
        className="w-32 h-32"
      />

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quiz Complete!
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mt-1">{lessonTitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
          <p className="text-2xl font-bold text-green-600">{score}%</p>
          <p className="text-sm text-green-700 dark:text-green-400">Score</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4">
          <p className="text-2xl font-bold text-indigo-600">+{xp.totalXP}xp</p>
          <p className="text-sm text-indigo-700 dark:text-indigo-400">
            XP Earned
          </p>
        </div>
      </div>

      <div className="w-full text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <p>
          ✅ Correct: {correctCount}/{totalQuestions}
        </p>
        {xp.perfectBonus > 0 && (
          <p>🎯 Perfect Score Bonus: +{xp.perfectBonus}xp</p>
        )}
        <p>📖 Lesson Complete: +{xp.lessonBonus}xp</p>
      </div>

      {incorrectQuestions.length > 0 && (
        <div className="w-full space-y-2 text-left">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
            <XCircle size={16} className="text-red-500" />
            Review Incorrect Answers
          </h3>
          <div className="space-y-2">
            {incorrectQuestions.map((q, i) => (
              <div
                key={i}
                className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/40 text-sm"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {q.question}
                </p>
                <p className="text-red-600 dark:text-red-400 mt-1">
                  Your answer: {q.userAnswer}
                </p>
                <p className="text-green-600 dark:text-green-400">
                  Correct: {q.correctAnswer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 w-full">
        <Button variant="secondary" className="flex-1" onClick={onBack}>
          <ArrowLeft size={18} />
          Review
        </Button>
        <Button className="flex-1" onClick={onRetry}>
          <RotateCcw size={18} />
          Retry
        </Button>
      </div>
    </motion.div>
  );
}
