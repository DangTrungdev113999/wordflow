import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onStart, onSkip }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center text-center px-6 py-12 max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="text-7xl mb-6"
      >
        🎓
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
      >
        Welcome to WordFlow!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-700 dark:text-gray-300 mb-10 leading-relaxed"
      >
        Let's find your English level with a quick 10-question quiz.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3 w-full"
      >
        <Button size="lg" className="w-full" onClick={onStart}>
          Let's Go! →
        </Button>
        <button
          onClick={onSkip}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 transition-colors py-2"
        >
          Skip — I'll start at A1
        </button>
      </motion.div>
    </motion.div>
  );
}
