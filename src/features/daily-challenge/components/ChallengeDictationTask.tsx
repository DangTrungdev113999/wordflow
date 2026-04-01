import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { playWordAudio } from '../../../services/audioService';
import { Card } from '../../../components/ui/Card';
import type { VocabWord } from '../../../lib/types';

interface Props {
  word: VocabWord;
  done: boolean;
  onComplete: () => void;
}

export function ChallengeDictationTask({ word, done, onComplete }: Props) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = input.trim().toLowerCase() === word.word.toLowerCase();

  if (done) {
    return (
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
        <p className="text-green-600 dark:text-green-400 font-medium text-sm">✅ Dictation completed</p>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">🎧 Listen & Type</h3>
        <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">Listen to the word and type what you hear.</p>
        <button
          onClick={() => playWordAudio(word.word, word.audioUrl)}
          className="w-full flex items-center justify-center gap-2 py-3 mb-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
        >
          <Volume2 size={20} />
          <span className="font-medium text-sm">Play Audio</span>
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => !submitted && setInput(e.target.value)}
          disabled={submitted}
          placeholder="Type the word..."
          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim() && !submitted) setSubmitted(true);
          }}
        />
        {submitted ? (
          <div className="space-y-2">
            <p className={`text-sm font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isCorrect ? '🎉 Correct!' : `❌ The word was: "${word.word}"`}
            </p>
            <button onClick={onComplete} className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors">
              Continue
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!input.trim()}
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl font-medium text-sm transition-colors"
          >
            Check
          </button>
        )}
      </Card>
    </motion.div>
  );
}
