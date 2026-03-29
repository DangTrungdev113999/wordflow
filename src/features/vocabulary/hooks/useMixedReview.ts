import { useState, useEffect, useCallback } from 'react';
import { db } from '../../../db/database';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import type { VocabWord, VocabTopic } from '../../../lib/types';
import type { WordProgress } from '../../../db/models';

export type MixedSourceFilter = 'due' | 'weak' | 'random' | 'all';
export type MixedMode = 'flashcard' | 'quiz' | 'context';

export interface MixedReviewConfig {
  wordCount: 10 | 15 | 20 | 30;
  mode: MixedMode;
  sourceFilter: MixedSourceFilter;
}

export interface MixedWord extends VocabWord {
  topicId: string;
  topicLabel: string;
}

export interface MixedReviewStats {
  dueCount: number;
  weakCount: number;
  totalCount: number;
  topicsWithProgress: number;
}

/**
 * Interleave shuffle: ensures no two consecutive words share the same topic.
 * Uses round-robin pick across topic buckets, scattering overflow.
 */
function interleaveShuffle(words: MixedWord[]): MixedWord[] {
  if (words.length <= 1) return words;

  // Group by topic
  const buckets = new Map<string, MixedWord[]>();
  for (const w of words) {
    const list = buckets.get(w.topicId) ?? [];
    list.push(w);
    buckets.set(w.topicId, list);
  }

  // Shuffle within each bucket
  for (const list of buckets.values()) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
  }

  // Sort bucket keys by size descending (biggest first → spread evenly)
  const keys = [...buckets.keys()].sort(
    (a, b) => (buckets.get(b)?.length ?? 0) - (buckets.get(a)?.length ?? 0),
  );

  const result: MixedWord[] = [];
  let lastTopic = '';

  // Round-robin pick
  while (keys.some((k) => (buckets.get(k)?.length ?? 0) > 0)) {
    let picked = false;
    for (const key of keys) {
      const list = buckets.get(key)!;
      if (list.length === 0) continue;
      if (key === lastTopic && keys.filter((k) => (buckets.get(k)?.length ?? 0) > 0).length > 1) {
        continue; // skip if would repeat topic and alternatives exist
      }
      result.push(list.shift()!);
      lastTopic = key;
      picked = true;
      break;
    }

    // Fallback: if only one topic has remaining words (best effort)
    if (!picked) {
      for (const key of keys) {
        const list = buckets.get(key)!;
        if (list.length > 0) {
          result.push(list.shift()!);
          lastTopic = key;
          break;
        }
      }
    }
  }

  return result;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build a flat list of all words across all built-in topics */
function getAllWords(): MixedWord[] {
  const result: MixedWord[] = [];
  for (const topic of ALL_TOPICS) {
    for (const w of topic.words) {
      result.push({ ...w, topicId: topic.topic, topicLabel: topic.topicLabel });
    }
  }
  return result;
}

export function useMixedReview() {
  const [stats, setStats] = useState<MixedReviewStats>({ dueCount: 0, weakCount: 0, totalCount: 0, topicsWithProgress: 0 });
  const [loading, setLoading] = useState(true);
  const [progressMap, setProgressMap] = useState<Record<string, WordProgress>>({});

  // Load all word progress once
  useEffect(() => {
    db.wordProgress.toArray().then((all) => {
      const map: Record<string, WordProgress> = {};
      for (const p of all) {
        map[p.wordId] = p;
      }
      setProgressMap(map);

      const now = Date.now();
      const dueCount = all.filter((p) => p.nextReview <= now).length;
      const weakCount = all.filter((p) => p.easeFactor < 2.0).length;
      const totalCount = ALL_TOPICS.reduce((sum, t) => sum + t.words.length, 0);
      const topicsWithProgress = new Set(all.map((p) => p.wordId.split(':')[0])).size;

      setStats({ dueCount, weakCount, totalCount, topicsWithProgress });
      setLoading(false);
    });
  }, []);

  const selectWords = useCallback(
    (config: MixedReviewConfig): MixedWord[] => {
      const allWords = getAllWords();
      const now = Date.now();

      const getDueWords = (): MixedWord[] => {
        return allWords
          .filter((w) => {
            const prog = progressMap[`${w.topicId}:${w.word}`];
            if (!prog) return false;
            return prog.nextReview <= now;
          })
          .sort((a, b) => {
            const pa = progressMap[`${a.topicId}:${a.word}`]!;
            const pb = progressMap[`${b.topicId}:${b.word}`]!;
            return pa.nextReview - pb.nextReview; // most overdue first
          });
      };

      const getWeakWords = (): MixedWord[] => {
        return allWords
          .filter((w) => {
            const prog = progressMap[`${w.topicId}:${w.word}`];
            if (!prog) return false;
            return prog.easeFactor < 2.0;
          })
          .sort((a, b) => {
            const pa = progressMap[`${a.topicId}:${a.word}`]!;
            const pb = progressMap[`${b.topicId}:${b.word}`]!;
            return pa.easeFactor - pb.easeFactor; // weakest first
          });
      };

      const getRandomWords = (count: number): MixedWord[] => {
        // Max 3 per topic for diversity
        const shuffled = shuffle(allWords);
        const topicCounts = new Map<string, number>();
        const result: MixedWord[] = [];

        for (const w of shuffled) {
          const c = topicCounts.get(w.topicId) ?? 0;
          if (c >= 3) continue;
          topicCounts.set(w.topicId, c + 1);
          result.push(w);
          if (result.length >= count) break;
        }
        return result;
      };

      let selected: MixedWord[];

      switch (config.sourceFilter) {
        case 'due':
          selected = getDueWords().slice(0, config.wordCount);
          break;
        case 'weak':
          selected = getWeakWords().slice(0, config.wordCount);
          break;
        case 'random':
          selected = getRandomWords(config.wordCount);
          break;
        case 'all': {
          // 40% due + 30% weak + 30% random, deduplicate
          const dueTarget = Math.ceil(config.wordCount * 0.4);
          const weakTarget = Math.ceil(config.wordCount * 0.3);

          const due = getDueWords().slice(0, dueTarget);
          const seen = new Set(due.map((w) => `${w.topicId}:${w.word}`));

          const weak = getWeakWords()
            .filter((w) => !seen.has(`${w.topicId}:${w.word}`))
            .slice(0, weakTarget);
          for (const w of weak) seen.add(`${w.topicId}:${w.word}`);

          const remaining = config.wordCount - due.length - weak.length;
          const random = getRandomWords(remaining * 2)
            .filter((w) => !seen.has(`${w.topicId}:${w.word}`))
            .slice(0, remaining);

          selected = [...due, ...weak, ...random];
          break;
        }
      }

      // Fallback: if not enough words, fill with random
      if (selected.length < config.wordCount) {
        const seen = new Set(selected.map((w) => `${w.topicId}:${w.word}`));
        const extras = shuffle(allWords)
          .filter((w) => !seen.has(`${w.topicId}:${w.word}`))
          .slice(0, config.wordCount - selected.length);
        selected = [...selected, ...extras];
      }

      return interleaveShuffle(selected);
    },
    [progressMap],
  );

  return { stats, loading, selectWords, progressMap };
}
