import { motion } from 'framer-motion';
import type { CEFRLevel } from '../../../lib/types';
import { Button } from '../../../components/ui/Button';

interface PlacementResultProps {
  level: CEFRLevel;
  score: number;
  totalQuestions: number;
  onStartLearning: () => void;
  onRedoTest: () => void;
}

const LEVEL_MESSAGES: Record<string, string> = {
  A1: "You're just getting started! We'll build your foundation.",
  A2: 'Great! You have a solid base. Let\'s level up!',
};

export function PlacementResult({ level, score, totalQuestions, onStartLearning, onRedoTest }: PlacementResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center px-6 py-12 max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="text-6xl mb-4"
      >
        🎉
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 mb-4"
      >
        <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{level}</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
      >
        Your Level: {level}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-lg text-gray-500 dark:text-gray-400 mb-2"
      >
        {score}/{totalQuestions} correct
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed"
      >
        {LEVEL_MESSAGES[level] ?? 'Great job! Let\'s continue learning.'}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3 w-full"
      >
        <Button size="lg" className="w-full" onClick={onStartLearning}>
          Start Learning →
        </Button>
        <button
          onClick={onRedoTest}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-2"
        >
          Redo Test
        </button>
      </motion.div>
    </motion.div>
  );
}
