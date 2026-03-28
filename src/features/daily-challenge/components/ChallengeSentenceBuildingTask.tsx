import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import type { SentenceBuildingExercise } from '../../../lib/types';

interface WordToken {
  id: number;
  word: string;
}

interface Props {
  sentence: SentenceBuildingExercise;
  done: boolean;
  onComplete: (score: number) => void;
}

export function ChallengeSentenceBuildingTask({ sentence, done, onComplete }: Props) {
  const allTokens = useMemo(() => {
    const words = [...sentence.words];
    if (sentence.distractors) words.push(...sentence.distractors);
    return words.map((word, i) => ({ id: i, word }));
  }, [sentence]);

  const [bankWords, setBankWords] = useState<WordToken[]>(() => allTokens);
  const [placedWords, setPlacedWords] = useState<WordToken[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  if (done) {
    return (
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
        <p className="text-green-600 dark:text-green-400 font-medium text-sm">✅ Sentence building completed</p>
      </Card>
    );
  }

  const handleWordTap = (token: WordToken, fromBank: boolean) => {
    if (submitted && isCorrect) return;
    if (fromBank) {
      setBankWords(bankWords.filter(t => t.id !== token.id));
      setPlacedWords([...placedWords, token]);
    } else {
      setPlacedWords(placedWords.filter(t => t.id !== token.id));
      setBankWords([...bankWords, token]);
    }
    // Reset submission state on rearrange
    if (submitted) setSubmitted(false);
  };

  const handleCheck = () => {
    const normalize = (s: string) => s.toLowerCase().replace(/[.,!?;:'"]/g, '').replace(/\s+/g, ' ').trim();
    const userSentence = normalize(placedWords.map(t => t.word).join(' '));
    const correctSentence = normalize(sentence.sentence);
    const correct = userSentence === correctSentence;
    setIsCorrect(correct);
    setSubmitted(true);
    if (!correct) setWrongAttempts(prev => prev + 1);
  };

  const handleContinue = () => {
    const score = Math.max(0, 100 - wrongAttempts * 20);
    onComplete(score);
  };

  const handleRetry = () => {
    setSubmitted(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">🧩 Build a Sentence</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {sentence.translation}
        </p>

        {/* Drop zone */}
        <div className="min-h-[52px] p-3 mb-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-wrap gap-1.5 items-start">
          {placedWords.length === 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500 italic">Tap words below to build the sentence...</span>
          )}
          <AnimatePresence mode="popLayout">
            {placedWords.map((token) => (
              <motion.button
                key={`placed-${token.id}`}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleWordTap(token, false)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  submitted && isCorrect
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
                    : submitted && !isCorrect
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700 cursor-pointer'
                    : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-800 cursor-pointer'
                }`}
              >
                {token.word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Word bank */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <AnimatePresence mode="popLayout">
            {bankWords.map((token) => (
              <motion.button
                key={`bank-${token.id}`}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleWordTap(token, true)}
                disabled={submitted && isCorrect}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer disabled:opacity-40"
              >
                {token.word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Feedback & actions */}
        {submitted && isCorrect && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">🎉 Correct!</p>
            <button
              onClick={handleContinue}
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Continue
            </button>
          </div>
        )}
        {submitted && !isCorrect && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              ❌ Not quite right. Try again!
            </p>
            <button
              onClick={handleRetry}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        {!submitted && (
          <button
            onClick={handleCheck}
            disabled={placedWords.length === 0}
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl font-medium text-sm transition-colors"
          >
            Check Answer
          </button>
        )}
      </Card>
    </motion.div>
  );
}
