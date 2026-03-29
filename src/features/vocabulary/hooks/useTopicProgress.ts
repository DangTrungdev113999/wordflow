import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/database';
import type { WordStatus } from '../../../lib/types';

export interface TopicProgress {
  total: number;
  new: number;
  learning: number;
  review: number;
  mastered: number;
  percentMastered: number;
}

const EMPTY_PROGRESS: TopicProgress = {
  total: 0,
  new: 0,
  learning: 0,
  review: 0,
  mastered: 0,
  percentMastered: 0,
};

function buildProgress(
  total: number,
  statusCounts: Record<WordStatus, number>,
): TopicProgress {
  const mastered = statusCounts.mastered;
  return {
    total,
    new: total - statusCounts.learning - statusCounts.review - mastered,
    learning: statusCounts.learning,
    review: statusCounts.review,
    mastered,
    percentMastered: total > 0 ? Math.round((mastered / total) * 100) : 0,
  };
}

/**
 * Live-query progress for a single topic.
 */
export function useTopicProgress(
  topicId: string,
  wordKeys: string[],
): TopicProgress {
  const progress = useLiveQuery(async () => {
    if (wordKeys.length === 0) return EMPTY_PROGRESS;

    const rows = await db.wordProgress
      .where('wordId')
      .anyOf(wordKeys)
      .toArray();

    const counts: Record<WordStatus, number> = {
      new: 0,
      learning: 0,
      review: 0,
      mastered: 0,
    };
    for (const r of rows) {
      counts[r.status] = (counts[r.status] ?? 0) + 1;
    }

    return buildProgress(wordKeys.length, counts);
  }, [topicId, wordKeys.length]);

  return progress ?? EMPTY_PROGRESS;
}

/**
 * Live-query progress for all topics at once (for TopicList).
 * Returns a map of topicId → TopicProgress.
 */
export function useAllTopicProgress(
  topicWordKeys: Map<string, string[]>,
): Map<string, TopicProgress> {
  const result = useLiveQuery(async () => {
    // Collect all word IDs
    const allKeys: string[] = [];
    for (const keys of topicWordKeys.values()) {
      allKeys.push(...keys);
    }
    if (allKeys.length === 0) return new Map<string, TopicProgress>();

    const rows = await db.wordProgress
      .where('wordId')
      .anyOf(allKeys)
      .toArray();

    // Build a lookup: wordId → status
    const statusMap = new Map<string, WordStatus>();
    for (const r of rows) {
      statusMap.set(r.wordId, r.status);
    }

    // Build progress per topic
    const map = new Map<string, TopicProgress>();
    for (const [topicId, keys] of topicWordKeys.entries()) {
      const counts: Record<WordStatus, number> = {
        new: 0,
        learning: 0,
        review: 0,
        mastered: 0,
      };
      for (const k of keys) {
        const status = statusMap.get(k) ?? 'new';
        counts[status]++;
      }
      map.set(topicId, buildProgress(keys.length, counts));
    }

    return map;
  }, [topicWordKeys]);

  return result ?? new Map<string, TopicProgress>();
}
