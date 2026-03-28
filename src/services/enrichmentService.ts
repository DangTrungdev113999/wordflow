import { db } from '../db/database';
import { DICTIONARY_API_BASE, DATAMUSE_API_BASE } from '../lib/constants';
import type { DictionaryEntry } from '../lib/types';

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
const FETCH_TIMEOUT = 5000; // 5s

export interface EnrichedWordData {
  audioUrl: string | null;
  definitions: Array<{
    partOfSpeech: string;
    definition: string;
    example?: string;
  }>;
  synonyms: string[];
}

interface DatamuseWord {
  word: string;
  score?: number;
}

// --- Debounce map to avoid duplicate concurrent fetches for same word ---
const inflightRequests = new Map<string, Promise<EnrichedWordData>>();

/**
 * Enrich a word with audio, definitions, and synonyms.
 * Cache-first strategy with 7-day TTL.
 * Graceful fallback: API fail → return empty enrichment, never throws.
 */
export async function enrichWord(word: string): Promise<EnrichedWordData> {
  const key = word.toLowerCase();

  // Deduplicate concurrent requests for the same word
  const inflight = inflightRequests.get(key);
  if (inflight) return inflight;

  const promise = doEnrichWord(key);
  inflightRequests.set(key, promise);
  promise.finally(() => inflightRequests.delete(key));

  return promise;
}

async function doEnrichWord(word: string): Promise<EnrichedWordData> {
  // 1. Check cache
  const cached = await getCachedEnrichment(word);
  if (cached) return cached;

  // 2. Parallel fetch
  const [dictResult, synonymsResult] = await Promise.all([
    fetchDictionary(word),
    fetchSynonyms(word),
  ]);

  const enriched: EnrichedWordData = {
    audioUrl: extractAudioUrl(dictResult),
    definitions: extractDefinitions(dictResult),
    synonyms: synonymsResult,
  };

  // 3. Cache result
  await cacheEnrichment(word, enriched);

  return enriched;
}

// --- Cache helpers ---

const ENRICHMENT_CACHE_PREFIX = 'enrichment:';

async function getCachedEnrichment(word: string): Promise<EnrichedWordData | null> {
  try {
    const cached = await db.dictionaryCache.get(ENRICHMENT_CACHE_PREFIX + word);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
      return cached.data as unknown as EnrichedWordData;
    }
    return null;
  } catch {
    return null;
  }
}

async function cacheEnrichment(word: string, data: EnrichedWordData): Promise<void> {
  try {
    await db.dictionaryCache.put({
      word: ENRICHMENT_CACHE_PREFIX + word,
      data: data as unknown as DictionaryEntry[],
      cachedAt: Date.now(),
    });
  } catch {
    // Cache write failure is non-critical
  }
}

// --- API fetchers ---

async function fetchDictionary(word: string): Promise<DictionaryEntry[] | null> {
  try {
    const res = await fetch(
      `${DICTIONARY_API_BASE}/${encodeURIComponent(word)}`,
      { signal: AbortSignal.timeout(FETCH_TIMEOUT) },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchSynonyms(word: string): Promise<string[]> {
  try {
    const res = await fetch(
      `${DATAMUSE_API_BASE}?rel_syn=${encodeURIComponent(word)}&max=10`,
      { signal: AbortSignal.timeout(FETCH_TIMEOUT) },
    );
    if (!res.ok) return [];
    const data: DatamuseWord[] = await res.json();
    return data.map((d) => d.word);
  } catch {
    return [];
  }
}

// --- Data extractors ---

function extractAudioUrl(entries: DictionaryEntry[] | null): string | null {
  if (!entries) return null;
  for (const entry of entries) {
    for (const phonetic of entry.phonetics) {
      if (phonetic.audio) return phonetic.audio;
    }
  }
  return null;
}

function extractDefinitions(
  entries: DictionaryEntry[] | null,
): EnrichedWordData['definitions'] {
  if (!entries) return [];
  const defs: EnrichedWordData['definitions'] = [];
  for (const entry of entries) {
    for (const meaning of entry.meanings) {
      for (const def of meaning.definitions.slice(0, 2)) {
        defs.push({
          partOfSpeech: meaning.partOfSpeech,
          definition: def.definition,
          example: def.example,
        });
      }
      if (defs.length >= 6) return defs;
    }
  }
  return defs;
}

// --- Audio preloading ---

const preloadedAudio = new Set<string>();

/**
 * Preload audio URLs so playback starts instantly.
 * Skips URLs that have already been preloaded this session.
 */
export function preloadAudio(urls: (string | null | undefined)[]): void {
  for (const url of urls) {
    if (!url || preloadedAudio.has(url)) continue;
    preloadedAudio.add(url);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = url;
  }
}

/**
 * Enrich multiple words and return a map of word → audioUrl.
 * Used for batch audio URL resolution in flashcard sessions.
 */
export async function enrichWordsForAudio(
  words: string[],
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();
  const promises = words.map(async (w) => {
    const enriched = await enrichWord(w);
    results.set(w.toLowerCase(), enriched.audioUrl);
  });
  await Promise.all(promises);
  return results;
}
