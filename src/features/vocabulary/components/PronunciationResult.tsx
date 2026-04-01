import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PronunciationResultProps {
  isCorrect: boolean;
  spokenText: string;
  targetWord: string;
  onDismiss: () => void;
}

export function PronunciationResult({ isCorrect, spokenText, targetWord, onDismiss }: PronunciationResultProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      onClick={onDismiss}
      className="cursor-pointer"
    >
      {isCorrect ? (
        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Check size={16} />
          </motion.div>
          <span className="text-sm font-medium">Great pronunciation!</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400">
            <X size={16} />
            <span className="text-sm font-medium">Try again</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            You said: &ldquo;{spokenText}&rdquo; &middot; Expected: &ldquo;{targetWord}&rdquo;
          </p>
        </div>
      )}
    </motion.div>
  );
}
