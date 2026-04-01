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

export function ChallengeWordTask({ word, done, onComplete }: Props) {
  if (done) {
    return (
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
        <p className="text-green-600 dark:text-green-400 font-medium text-sm">✅ Word learned: <span className="font-bold">{word.word}</span></p>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">📖 Learn Today's Word</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{word.word}</span>
            <button
              onClick={() => playWordAudio(word.word, word.audioUrl)}
              className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
            >
              <Volume2 size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">{word.ipa}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{word.meaning}</p>
          <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-xs text-gray-700 dark:text-gray-300 italic">"{word.example}"</p>
          </div>
          <button
            onClick={onComplete}
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors"
          >
            I've learned this word
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
