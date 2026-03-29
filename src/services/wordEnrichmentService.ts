import { db } from '../db/database';
import type { EnrichedWordData } from '../db/models';
import { aiService } from './ai/aiService';

const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_CONCURRENT = 5;

let activeRequests = 0;
const queue: Array<{ resolve: () => void }> = [];

function acquireSlot(): Promise<void> {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests++;
    return Promise.resolve();
  }
  return new Promise((resolve) => queue.push({ resolve }));
}

function releaseSlot(): void {
  activeRequests--;
  const next = queue.shift();
  if (next) {
    activeRequests++;
    next.resolve();
  }
}

// Dedup concurrent requests for the same word
const inflightRequests = new Map<string, Promise<EnrichedWordData | null>>();

const EMPTY_ENRICHMENT: EnrichedWordData = {
  partOfSpeech: '',
  examples: [],
  synonyms: [],
  antonyms: [],
  wordFamily: [],
  collocations: [],
  mnemonic: '',
  frequency: 3,
};

/**
 * Enrich a single word with AI-generated data.
 * Cache-first with 30-day TTL. Graceful fallback on failure.
 */
export async function enrichWordData(
  word: string,
  meaning: string,
): Promise<EnrichedWordData> {
  const key = word.toLowerCase().trim();

  const inflight = inflightRequests.get(key);
  if (inflight) return inflight.then((r) => r ?? { ...EMPTY_ENRICHMENT });

  const promise = doEnrichWord(key, meaning);
  inflightRequests.set(key, promise);
  promise.finally(() => inflightRequests.delete(key));

  return promise.then((r) => r ?? { ...EMPTY_ENRICHMENT });
}

async function doEnrichWord(
  word: string,
  meaning: string,
): Promise<EnrichedWordData | null> {
  // 1. Check cache
  try {
    const cached = await db.enrichedWords.get(word);
    if (cached && Date.now() - cached.updatedAt < CACHE_TTL) {
      return cached.data;
    }
  } catch {
    // Cache read failure is non-critical
  }

  // 2. Call AI
  if (!aiService.hasAnyProvider()) return null;

  await acquireSlot();
  try {
    const prompt = buildPrompt(word, meaning);
    const response = await aiService.chat(
      [
        { role: 'system', content: 'You are a vocabulary enrichment assistant. Respond ONLY with valid JSON, no markdown or extra text.' },
        { role: 'user', content: prompt },
      ],
      { feature: 'word-enrichment', maxTokens: 512, temperature: 0.3 },
    );

    const data = parseResponse(response.text);
    if (!data) return null;

    // 3. Cache result (preserve imageData from Phase 10)
    try {
      const existing = await db.enrichedWords.get(word);
      await db.enrichedWords.put({
        word,
        data,
        updatedAt: Date.now(),
        imageData: existing?.imageData,
        imageUpdatedAt: existing?.imageUpdatedAt,
      });
    } catch {
      // Cache write failure is non-critical
    }

    return data;
  } catch {
    return null;
  } finally {
    releaseSlot();
  }
}

function buildPrompt(word: string, meaning: string): string {
  return `Given the English word "${word}" (Vietnamese meaning: "${meaning}"):

Return JSON:
{
  "partOfSpeech": "noun/verb/adj/adv/etc",
  "examples": ["3-5 natural sentences using this word, A1-A2 difficulty"],
  "synonyms": ["up to 5 synonyms"],
  "antonyms": ["up to 3 antonyms"],
  "wordFamily": ["related word forms"],
  "collocations": ["common word pairings"],
  "mnemonic": "a fun/memorable trick to remember this word in Vietnamese",
  "frequency": 1-5 (1=very common daily word, 5=rare)
}`;
}

function parseResponse(text: string): EnrichedWordData | null {
  try {
    // Strip markdown fences if present
    const cleaned = text.replace(/```(?:json)?\s*/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      partOfSpeech: String(parsed.partOfSpeech ?? ''),
      examples: Array.isArray(parsed.examples) ? parsed.examples.map(String).slice(0, 5) : [],
      synonyms: Array.isArray(parsed.synonyms) ? parsed.synonyms.map(String).slice(0, 5) : [],
      antonyms: Array.isArray(parsed.antonyms) ? parsed.antonyms.map(String).slice(0, 3) : [],
      wordFamily: Array.isArray(parsed.wordFamily) ? parsed.wordFamily.map(String) : [],
      collocations: Array.isArray(parsed.collocations) ? parsed.collocations.map(String) : [],
      mnemonic: String(parsed.mnemonic ?? ''),
      frequency: typeof parsed.frequency === 'number' ? Math.max(1, Math.min(5, parsed.frequency)) : 3,
    };
  } catch {
    return null;
  }
}

/**
 * Batch enrich multiple words. Returns a map of word → EnrichedWordData.
 * Non-blocking: failures for individual words don't affect others.
 */
export async function batchEnrichWords(
  words: Array<{ word: string; meaning: string }>,
): Promise<Map<string, EnrichedWordData>> {
  const results = new Map<string, EnrichedWordData>();

  await Promise.all(
    words.map(async ({ word, meaning }) => {
      const data = await enrichWordData(word, meaning);
      results.set(word.toLowerCase().trim(), data);
    }),
  );

  return results;
}

/**
 * Get cached enrichment only (no API call). Returns null if not cached.
 */
export async function getCachedEnrichment(word: string): Promise<EnrichedWordData | null> {
  try {
    const cached = await db.enrichedWords.get(word.toLowerCase().trim());
    if (cached && Date.now() - cached.updatedAt < CACHE_TTL) {
      return cached.data;
    }
    return null;
  } catch {
    return null;
  }
}
