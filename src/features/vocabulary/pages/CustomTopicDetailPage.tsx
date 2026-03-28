import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Trash2, Volume2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { WordSearch } from '../components/WordSearch';
import {
  getTopicById,
  getWords,
  addWord,
  removeWord,
  type DictionarySearchResult,
} from '../../../services/customTopicService';
import type { CustomTopic, CustomWord } from '../../../db/models';
import type { WordStatus } from '../../../lib/types';
import { db } from '../../../db/database';

const STATUS_VARIANT: Record<WordStatus, 'default' | 'success' | 'warning' | 'info'> = {
  new: 'default',
  learning: 'warning',
  review: 'info',
  mastered: 'success',
};

export function CustomTopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const numericId = Number(topicId);

  const [topic, setTopic] = useState<CustomTopic | null>(null);
  const [words, setWords] = useState<CustomWord[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, WordStatus>>({});
  const [loading, setLoading] = useState(true);

  const existingWords = useMemo(
    () => new Set(words.map((w) => w.word.toLowerCase())),
    [words],
  );

  async function loadData() {
    const [t, w] = await Promise.all([getTopicById(numericId), getWords(numericId)]);
    setTopic(t ?? null);
    setWords(w);

    // Load progress
    const progressIds = w.map((word) => `custom-${numericId}:${word.word}`);
    if (progressIds.length > 0) {
      const progresses = await db.wordProgress.where('wordId').anyOf(progressIds).toArray();
      const map: Record<string, WordStatus> = {};
      progresses.forEach((p) => { map[p.wordId] = p.status; });
      setProgressMap(map);
    }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, [numericId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAddWord(result: DictionarySearchResult) {
    await addWord(numericId, result);
    loadData();
  }

  async function handleRemoveWord(wordId: number, wordText: string) {
    await removeWord(wordId);
    setWords((prev) => prev.filter((w) => w.id !== wordId));
    setProgressMap((prev) => {
      const next = { ...prev };
      delete next[`custom-${numericId}:${wordText}`];
      return next;
    });
  }

  function playAudio(url: string) {
    const audio = new Audio(url);
    audio.play().catch(() => {});
  }

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
        <div className="h-10 w-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="px-4 py-6 text-center text-gray-500">
        Topic not found.{' '}
        <Link to="/vocabulary/custom" className="text-indigo-500">Go back</Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/vocabulary/custom" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{topic.icon}</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{topic.name}</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{words.length} words</p>
        </div>
      </div>

      {/* Start Flashcards button */}
      {words.length > 0 && (
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={() => navigate(`/vocabulary/custom/${topicId}/learn`)}
        >
          <Play size={18} />
          Start Flashcards
        </Button>
      )}

      {/* Word search */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Add Words
        </h2>
        <WordSearch existingWords={existingWords} onAdd={handleAddWord} />
      </div>

      {/* Word list */}
      {words.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Word List
          </h2>
          <div className="space-y-2">
            {words.map((w) => {
              const progressKey = `custom-${numericId}:${w.word}`;
              const status = progressMap[progressKey] ?? 'new';
              return (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 group"
                >
                  {w.audioUrl && (
                    <button
                      onClick={() => playAudio(w.audioUrl!)}
                      className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors mt-0.5"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 dark:text-white">{w.word}</span>
                      {w.ipa && <span className="text-xs text-gray-400 font-mono">{w.ipa}</span>}
                    </div>
                    {w.meaning && (
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{w.meaning}</p>
                    )}
                    {w.example && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">{w.example}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge label={status} variant={STATUS_VARIANT[status]} />
                    <button
                      onClick={() => handleRemoveWord(w.id!, w.word)}
                      className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
