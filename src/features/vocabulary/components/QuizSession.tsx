import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { QuizOption } from './QuizOption';
import type { VocabWord } from '../../../lib/types';

interface QuizSessionProps {
  currentWord: VocabWord;
  currentIndex: number;
  total: number;
  direction: 'en-to-vi' | 'vi-to-en';
  options: string[];
  selectedOption: string | null;
  showFeedback: boolean;
  correctAnswer: string;
  onSelect: (option: string) => void;
}

export function QuizSession({
  currentWord,
  currentIndex,
  total,
  direction,
  options,
  selectedOption,
  showFeedback,
  correctAnswer,
  onSelect,
}: QuizSessionProps) {
  const progress = ((currentIndex) / total) * 100;
  const questionText = direction === 'en-to-vi' ? currentWord.word : currentWord.meaning;
  const subtitle = direction === 'en-to-vi'
    ? 'What does this word mean?'
    : 'Which English word matches?';

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
          <span>{currentIndex + 1} / {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-900 rounded-3xl p-6 text-center border border-gray-100 dark:border-gray-800"
        >
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">
            {subtitle}
          </p>

          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {questionText}
            </h2>
            {direction === 'en-to-vi' && (
              <button
                onClick={handleSpeak}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Volume2 size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>

          {direction === 'en-to-vi' && currentWord.ipa && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {currentWord.ipa}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2.5">
        {options.map((option, i) => (
          <QuizOption
            key={`${currentIndex}-${i}`}
            text={option}
            index={i}
            selected={selectedOption === option}
            isCorrect={selectedOption === correctAnswer}
            showFeedback={showFeedback}
            correctAnswer={correctAnswer}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Feedback flash */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-center text-sm font-semibold py-2 rounded-xl ${
              selectedOption === correctAnswer
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
            }`}
          >
            {selectedOption === correctAnswer ? 'Correct!' : `Answer: ${correctAnswer}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
