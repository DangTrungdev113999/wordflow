import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PairQuiz } from '../models';
import { cn } from '../../../lib/utils';

interface PairQuizInlineProps {
  quiz: PairQuiz;
  word1: string;
  word2: string;
}

export function PairQuizInline({ quiz, word1, word2 }: PairQuizInlineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  const item = quiz.sentences[currentIndex];
  if (!item) return null;

  const isAnswered = selected !== null;
  const isCorrect = selected === item.correct;
  const isComplete = results.length === quiz.sentences.length;

  const handleSelect = (word: string) => {
    if (isAnswered) return;
    setSelected(word);
  };

  const handleNext = () => {
    setResults(prev => [...prev, isCorrect]);
    setSelected(null);
    setCurrentIndex(prev => prev + 1);
  };

  if (isComplete) {
    const score = results.filter(Boolean).length;
    return (
      <div className="text-center py-3">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Kết quả: {score}/{results.length}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {score === results.length ? 'Tuyệt vời! Bạn đã phân biệt đúng!' : 'Hãy xem lại phần so sánh phía trên nhé.'}
        </p>
        <button
          onClick={() => { setCurrentIndex(0); setSelected(null); setResults([]); }}
          className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Collect all unique choice words across the quiz
  const choices = [word1, word2];
  // Also include the correct answer and other common forms
  if (!choices.includes(item.correct)) {
    choices.push(item.correct);
  }

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Câu {currentIndex + 1}/{quiz.sentences.length}</span>
        <div className="flex gap-1">
          {quiz.sentences.map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                i < results.length
                  ? results[i] ? 'bg-emerald-500' : 'bg-red-400'
                  : i === currentIndex ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
              )}
            />
          ))}
        </div>
      </div>

      {/* Sentence */}
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {item.sentence}
      </p>

      {/* Choices */}
      <div className="flex gap-2">
        {choices.map(word => {
          const isThis = selected === word;
          const isCorrectWord = word === item.correct;

          let style = 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700';
          if (isAnswered) {
            if (isCorrectWord) {
              style = 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700';
            } else if (isThis && !isCorrectWord) {
              style = 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700';
            } else {
              style = 'opacity-40 bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700';
            }
          }

          return (
            <button
              key={word}
              onClick={() => handleSelect(word)}
              disabled={isAnswered}
              className={cn(
                'flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-all',
                style
              )}
            >
              {word}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className={cn(
              'text-xs font-medium',
              isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            )}>
              {isCorrect ? 'Chính xác!' : `Sai rồi! Đáp án đúng: ${item.correct}`}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.explanation}</p>

            {currentIndex < quiz.sentences.length - 1 && (
              <button
                onClick={handleNext}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                Câu tiếp →
              </button>
            )}
            {currentIndex === quiz.sentences.length - 1 && (
              <button
                onClick={handleNext}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                Xem kết quả
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
