import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { Volume2, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useDictationAudio } from '../hooks/useDictationAudio';
import type { QuizQuestion } from '../hooks/useListeningQuiz';
import correctAnim from '../../../assets/lottie/correct-check.json';
import wrongAnim from '../../../assets/lottie/wrong-shake.json';

interface ListeningQuizProps {
  question: QuizQuestion;
  onAnswer: (selectedIndex: number) => void;
  onNext: () => void;
  questionNumber: number;
}

export function ListeningQuiz({ question, onAnswer, onNext, questionNumber }: ListeningQuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { play, isPlaying } = useDictationAudio();

  const isCorrect = submitted && selected === question.correctIndex;

  const handlePlay = useCallback(() => {
    play(question.word.word, question.word.audioUrl);
  }, [play, question.word]);

  // Auto-play audio when question appears
  useEffect(() => {
    const timer = setTimeout(() => {
      play(question.word.word, question.word.audioUrl);
    }, 300);
    return () => clearTimeout(timer);
  }, [questionNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance after 1.5s when correct
  useEffect(() => {
    if (submitted && isCorrect) {
      const timer = setTimeout(onNext, 1500);
      return () => clearTimeout(timer);
    }
  }, [submitted, isCorrect, onNext]);

  const handleSelect = (index: number) => {
    if (submitted) return;
    setSelected(index);
    setSubmitted(true);
    onAnswer(index);
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Audio player */}
      <div className="flex flex-col items-center gap-3">
        <motion.button
          onClick={handlePlay}
          disabled={isPlaying}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg',
            isPlaying
              ? 'bg-indigo-500 text-white'
              : 'bg-white dark:bg-gray-800 text-indigo-500 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600'
          )}
        >
          {isPlaying ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Volume2 size={36} />
            </motion.div>
          ) : (
            <Volume2 size={36} />
          )}
        </motion.button>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {submitted ? '' : 'Tap to listen, then choose the word you hear'}
        </p>
      </div>

      {/* Lottie feedback */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <Lottie
              animationData={isCorrect ? correctAnim : wrongAnim}
              loop={false}
              className="w-20 h-20"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options grid */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, i) => {
          const isThisCorrect = i === question.correctIndex;
          const isThisSelected = selected === i;

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={submitted}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={!submitted ? { scale: 0.98 } : undefined}
              className={cn(
                'w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3',
                // Default state
                !submitted && 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10',
                // Correct answer highlight
                submitted && isThisCorrect && 'border-green-500 bg-green-50 dark:bg-green-900/20',
                // Wrong selected
                submitted && isThisSelected && !isThisCorrect && 'border-red-500 bg-red-50 dark:bg-red-900/20',
                // Dimmed non-selected, non-correct
                submitted && !isThisCorrect && !isThisSelected && 'border-gray-200 dark:border-gray-700 opacity-40',
              )}
            >
              <span className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0',
                !submitted && 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
                submitted && isThisCorrect && 'bg-green-500 text-white',
                submitted && isThisSelected && !isThisCorrect && 'bg-red-500 text-white',
                submitted && !isThisCorrect && !isThisSelected && 'bg-gray-100 dark:bg-gray-800 text-gray-400',
              )}>
                {optionLabels[i]}
              </span>
              <span className={cn(
                'font-medium text-base',
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
      </div>

      {/* Show word info + Next button when incorrect */}
      <AnimatePresence>
        {submitted && !isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/40">
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                The correct answer is: <span className="font-bold">{question.word.word}</span>
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                {question.word.ipa} — {question.word.meaning}
              </p>
            </div>
            <button
              onClick={onNext}
              className="w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
            >
              Next
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle auto-advance indicator for correct */}
      <AnimatePresence>
        {submitted && isCorrect && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-green-600 dark:text-green-400"
          >
            {question.word.meaning} — continuing...
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
