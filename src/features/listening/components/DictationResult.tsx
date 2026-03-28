import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { VocabWord } from '../../../lib/types';

interface DictationResultProps {
  correct: boolean;
  userAnswer: string;
  target: string;
  word: VocabWord;
  onNext: () => void;
}

export function DictationResult({ correct, userAnswer, target, word, onNext }: DictationResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className={`p-4 rounded-2xl border ${correct ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
        <div className="flex items-center gap-2 mb-2">
          {correct ? (
            <CheckCircle2 className="text-green-500" size={22} />
          ) : (
            <XCircle className="text-red-500" size={22} />
          )}
          <span className={`font-semibold ${correct ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
            {correct ? 'Correct!' : 'Incorrect'}
          </span>
        </div>

        {!correct && (
          <div className="space-y-1 text-sm mb-3">
            <p className="text-red-600 dark:text-red-400">
              You typed: <span className="font-medium">{userAnswer}</span>
            </p>
            <p className="text-green-600 dark:text-green-400">
              Correct: <span className="font-medium">{target}</span>
            </p>
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <p><span className="font-medium">{word.word}</span> <span className="text-gray-400">{word.ipa}</span></p>
          <p className="text-gray-500 dark:text-gray-400">{word.meaning}</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors"
      >
        Next
      </button>
    </motion.div>
  );
}
