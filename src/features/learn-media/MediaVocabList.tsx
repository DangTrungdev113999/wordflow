import { useState } from 'react';
import { BookOpen, Plus, Check, ArrowRight, Loader2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MediaVocabWord } from '../../lib/types';
import { cn } from '../../lib/utils';

interface Props {
  vocab: MediaVocabWord[];
  onStartQuiz: () => void;
  onSaveToMyWords: (words: MediaVocabWord[]) => Promise<void>;
  loading: boolean;
}

export function MediaVocabList({ vocab, onStartQuiz, onSaveToMyWords, loading }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSaveToMyWords(vocab);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  function speakWord(word: string) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-indigo-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {vocab.length} words extracted
          </h3>
        </div>
        <span className="text-xs text-gray-400">Tap a word to expand</span>
      </div>

      <div className="space-y-2">
        {vocab.map((word, i) => (
          <motion.div
            key={word.word + i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <button
              type="button"
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="w-full text-left"
            >
              <div className={cn(
                'rounded-xl border transition-all',
                expandedIndex === i
                  ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10'
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700',
              )}>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-gray-400 w-5 text-right flex-shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{word.word}</span>
                        <span className="text-xs text-gray-400 font-mono">{word.ipa}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); speakWord(word.word); }}
                          className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Volume2 size={12} className="text-gray-400" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{word.meaning}</p>
                    </div>
                  </div>
                  <span className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0',
                    word.cefrLevel === 'A1' && 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
                    word.cefrLevel === 'A2' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
                    word.cefrLevel === 'B1' && 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
                    word.cefrLevel === 'B2' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
                  )}>
                    {word.cefrLevel}
                  </span>
                </div>

                <AnimatePresence>
                  {expandedIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 pt-1 space-y-2 border-t border-gray-100 dark:border-gray-800">
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Context from text</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{word.contextSentence}"</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Example</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{word.example}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saved || saving}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all border',
            saved
              ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
          )}
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <>
              <Check size={16} />
              Saved
            </>
          ) : (
            <>
              <Plus size={16} />
              Save to My Words
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onStartQuiz}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Start Quiz
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
