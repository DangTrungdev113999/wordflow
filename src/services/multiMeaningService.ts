import { db } from '../db/database';
import { MULTI_MEANING_SEEDS } from '../data/multiMeaningSeeds';
import { DICTIONARY_API_BASE } from '../lib/constants';
import { aiService } from './ai/aiService';
import type { MultiMeaningWord, WordSense, SenseExample } from '../features/word-usage/models';

const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
const FETCH_TIMEOUT = 5000;

const inflightRequests = new Map<string, Promise<MultiMeaningWord | null>>();

export async function getMultiMeaning(word: string): Promise<MultiMeaningWord | null> {
  const key = word.toLowerCase().trim();
  if (!key) return null;

  const inflight = inflightRequests.get(key);
  if (inflight) return inflight;

  const promise = doGetMultiMeaning(key);
  inflightRequests.set(key, promise);
  promise.finally(() => inflightRequests.delete(key));

  return promise;
}

async function doGetMultiMeaning(word: string): Promise<MultiMeaningWord | null> {
  // Tier 1: Check Dexie cache
  try {
    const cached = await db.multiMeaningWords.get(word);
    if (cached && Date.now() - cached.updatedAt < CACHE_TTL) {
      return cached.data;
    }
  } catch { /* cache miss */ }

  // Tier 2: Check static seeds
  const seed = MULTI_MEANING_SEEDS.find(s => s.word.toLowerCase() === word);
  if (seed) {
    await cacheResult(word, seed);
    return seed;
  }

  // Tier 3: Fetch from Dictionary API and parse
  const dictData = await fetchDictionaryMeanings(word);
  if (!dictData || dictData.senses.length < 2) return null;

  await cacheResult(word, dictData);
  return dictData;
}

async function cacheResult(word: string, data: MultiMeaningWord): Promise<void> {
  try {
    await db.multiMeaningWords.put({ word, data, updatedAt: Date.now() });
  } catch { /* non-critical */ }
}

interface DictPhonetic {
  text?: string;
  audio?: string;
}

interface DictDefinition {
  definition: string;
  example?: string;
}

interface DictMeaning {
  partOfSpeech: string;
  definitions: DictDefinition[];
}

interface DictEntry {
  word: string;
  phonetics: DictPhonetic[];
  meanings: DictMeaning[];
}

async function fetchDictionaryMeanings(word: string): Promise<MultiMeaningWord | null> {
  try {
    const res = await fetch(
      `${DICTIONARY_API_BASE}/${encodeURIComponent(word)}`,
      { signal: AbortSignal.timeout(FETCH_TIMEOUT) },
    );
    if (!res.ok) return null;

    const entries: DictEntry[] = await res.json();
    if (!entries?.length) return null;

    const entry = entries[0];
    const ipa = entry.phonetics.find(p => p.text)?.text ?? '';

    const senses: WordSense[] = [];
    let senseIndex = 0;

    for (const meaning of entry.meanings) {
      const pos = meaning.partOfSpeech as WordSense['partOfSpeech'];
      for (const def of meaning.definitions.slice(0, 2)) {
        senseIndex++;
        const examples: SenseExample[] = [];
        if (def.example) {
          examples.push({
            sentence: def.example,
            translation: '',
            highlight: word,
          });
        }

        senses.push({
          id: `${word}-${pos}-${senseIndex}`,
          partOfSpeech: pos,
          meaning: def.definition,
          meaningEn: def.definition,
          examples,
          frequency: senseIndex <= 2 ? 1 : senseIndex <= 4 ? 2 : 3,
        });

        if (senses.length >= 8) break;
      }
      if (senses.length >= 8) break;
    }

    if (senses.length < 2) return null;

    return {
      word,
      ipa,
      totalSenses: senses.length,
      senses,
    };
  } catch {
    return null;
  }
}

export function getMultiMeaningSeed(word: string): MultiMeaningWord | undefined {
  return MULTI_MEANING_SEEDS.find(s => s.word.toLowerCase() === word.toLowerCase().trim());
}

export function getAllSeeds(): MultiMeaningWord[] {
  return MULTI_MEANING_SEEDS;
}
