import { motion } from 'framer-motion';
import { Plus, Check, Volume2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import type { DictionarySearchResult } from '../../../services/customTopicService';

interface AddWordCardProps {
  result: DictionarySearchResult;
  alreadyAdded: boolean;
  onAdd: (result: DictionarySearchResult) => void;
}

export function AddWordCard({ result, alreadyAdded, onAdd }: AddWordCardProps) {
  const [added, setAdded] = useState(alreadyAdded);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function handleAdd() {
    onAdd(result);
    setAdded(true);
  }

  function playAudio() {
    if (!result.audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(result.audioUrl);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{result.word}</span>
            {result.ipa && (
              <span className="text-sm text-gray-400 font-mono">{result.ipa}</span>
            )}
            {result.audioUrl && (
              <button
                onClick={playAudio}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-indigo-500"
              >
                <Volume2 size={16} />
              </button>
            )}
          </div>
          {result.meaning && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{result.meaning}</p>
          )}
          {result.example && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 italic leading-relaxed">
              "{result.example}"
            </p>
          )}
        </div>

        {added ? (
          <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium shrink-0 mt-1">
            <Check size={16} />
            Added
          </span>
        ) : (
          <Button size="sm" onClick={handleAdd} className="shrink-0 mt-1">
            <Plus size={14} />
            Add
          </Button>
        )}
      </div>
    </motion.div>
  );
}
