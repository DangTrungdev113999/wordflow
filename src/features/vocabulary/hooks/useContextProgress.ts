import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { db } from '../../../db/database';
import type { ContextProgressEntry, EnrichedExample } from '../../../db/models';

const MASTERY_THRESHOLD = 3;

export interface ContextMastery {
  contextsCorrect: string[];
  contextMastered: boolean;
  total: number;
  progress: number; // 0–1
}

export function useContextProgress(wordId: string) {
  const entry = useLiveQuery(
    () => db.contextProgress.get(wordId),
    [wordId]
  );

  const mastery: ContextMastery = {
    contextsCorrect: entry?.contextsCorrect ?? [],
    contextMastered: entry?.contextMastered ?? false,
    total: MASTERY_THRESHOLD,
    progress: Math.min((entry?.contextsCorrect.length ?? 0) / MASTERY_THRESHOLD, 1),
  };

  const recordContextCorrect = useCallback(
    async (context: EnrichedExample['context']) => {
      const existing = await db.contextProgress.get(wordId);
      const current = existing?.contextsCorrect ?? [];
      if (current.includes(context)) return; // already recorded

      const updated = [...current, context];
      const mastered = updated.length >= MASTERY_THRESHOLD;

      await db.contextProgress.put({
        wordId,
        contextsCorrect: updated,
        contextMastered: mastered,
        lastUpdated: Date.now(),
      });
    },
    [wordId]
  );

  return { mastery, recordContextCorrect };
}

/** Batch query: get context mastery for multiple words at once. */
export async function getContextMasteryBatch(
  wordIds: string[]
): Promise<Map<string, ContextProgressEntry>> {
  const entries = await db.contextProgress
    .where('wordId')
    .anyOf(wordIds)
    .toArray();
  return new Map(entries.map((e) => [e.wordId, e]));
}
