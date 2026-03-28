import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { VocabPopup } from './VocabPopup';
import type { ReadingPassage } from '../data/passages';

interface Props {
  passage: ReadingPassage;
  onStartQuiz: () => void;
}

export function PassageReader({ passage, onStartQuiz }: Props) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const highlighted = new Set(passage.highlightedWords.map(w => w.toLowerCase()));

  const renderWord = useCallback(
    (word: string, index: number) => {
      const stripped = word.replace(/[.,!?;:'"()]/g, '');
      const isHighlighted = highlighted.has(stripped.toLowerCase());

      if (isHighlighted) {
        return (
          <span
            key={index}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedWord(stripped)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setSelectedWord(stripped);
            }}
            className="underline decoration-indigo-400 decoration-2 underline-offset-2 text-indigo-700 dark:text-indigo-300 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded px-0.5 transition-colors"
          >
            {word}
          </span>
        );
      }

      return <span key={index}>{word}</span>;
    },
    [highlighted],
  );

  const paragraphs = passage.text.split('\n\n');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Title & Meta */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{passage.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {passage.level} · {passage.wordCount} words · {passage.questions.length} questions
        </p>
      </div>

      {/* Passage Text */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
        {paragraphs.map((paragraph, pIdx) => (
          <p key={pIdx} className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
            {paragraph.split(/(\s+)/).map((token, wIdx) => {
              if (/^\s+$/.test(token)) return <span key={`s-${pIdx}-${wIdx}`}> </span>;
              return renderWord(token, pIdx * 1000 + wIdx);
            })}
          </p>
        ))}
      </div>

      {/* Hint */}
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
        Tap highlighted words to see their meaning
      </p>

      {/* Start Quiz Button */}
      <button
        onClick={onStartQuiz}
        className="w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
      >
        Start Quiz
        <ArrowRight size={18} />
      </button>

      {/* Vocab Popup */}
      {selectedWord && (
        <VocabPopup word={selectedWord} onClose={() => setSelectedWord(null)} />
      )}
    </motion.div>
  );
}
