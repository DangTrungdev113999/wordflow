import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import type { VocabWord } from '../../../lib/types';

interface Props {
  word: VocabWord;
  options: string[];
  done: boolean;
  onComplete: (score: number) => void;
}

export function ChallengeMediaTask({ word, options, done, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correctIdx = options.indexOf(word.meaning);

  if (done) {
    return (
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
        <p className="text-green-600 dark:text-green-400 font-medium text-sm">✅ Vocab quiz completed</p>
      </Card>
    );
  }

  const isCorrect = selected === correctIdx;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">📰 Vocab Quiz</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          What does this word mean?
        </p>

        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50">
          <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400 text-center">{word.word}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-mono text-center mt-1">{word.ipa}</p>
        </div>

        <div className="space-y-2 mb-3">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm border transition-colors ${
                submitted && i === correctIdx
                  ? 'border-green-400 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                  : submitted && i === selected && !isCorrect
                  ? 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                  : selected === i
                  ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {submitted ? (
          <div className="space-y-2">
            <p className={`text-sm font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isCorrect ? '🎉 Correct!' : `❌ The meaning is: "${word.meaning}"`}
            </p>
            <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">"{word.example}"</p>
            </div>
            <button
              onClick={() => onComplete(isCorrect ? 100 : 0)}
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Continue
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            disabled={selected === null}
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl font-medium text-sm transition-colors"
          >
            Check Answer
          </button>
        )}
      </Card>
    </motion.div>
  );
}
