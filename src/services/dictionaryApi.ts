import { db } from '../db/database';
import { DICTIONARY_API_BASE } from '../lib/constants';
import type { DictionaryEntry } from '../lib/types';

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function lookupWord(word: string): Promise<DictionaryEntry[] | null> {
  const cached = await db.dictionaryCache.get(word.toLowerCase());
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
    return cached.data as DictionaryEntry[];
  }

  try {
    const res = await fetch(`${DICTIONARY_API_BASE}/${encodeURIComponent(word.toLowerCase())}`);
    if (!res.ok) return null;

    const data: DictionaryEntry[] = await res.json();

    await db.dictionaryCache.put({
      word: word.toLowerCase(),
      data,
      cachedAt: Date.now(),
    });

    return data;
  } catch {
    return null;
  }
}

export function getAudioUrl(entries: DictionaryEntry[]): string | null {
  for (const entry of entries) {
    for (const phonetic of entry.phonetics) {
      if (phonetic.audio) return phonetic.audio;
    }
  }
  return null;
}

export function getIPA(entries: DictionaryEntry[]): string | null {
  for (const entry of entries) {
    if (entry.phonetic) return entry.phonetic;
    for (const phonetic of entry.phonetics) {
      if (phonetic.text) return phonetic.text;
    }
  }
  return null;
}
