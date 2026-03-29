import { db } from '../db/database';
import type { EnrichedWordData, EnrichedExample } from '../db/models';
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
    if (cached && cached.updatedAt > 0 && Date.now() - cached.updatedAt < CACHE_TTL) {
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
  "examples": ["5 natural sentences using this word, A1-B1 difficulty, varied contexts"],
  "richExamples": [
    {"sentence": "daily life example", "context": "daily", "translation": "Vietnamese translation"},
    {"sentence": "work/school example", "context": "work", "translation": "Vietnamese translation"},
    {"sentence": "social/conversation example", "context": "social", "translation": "Vietnamese translation"},
    {"sentence": "news/formal example (B1)", "context": "formal", "translation": "Vietnamese translation"},
    {"sentence": "short dialogue (2 turns)", "context": "dialogue", "translation": "Vietnamese translation"}
  ],
  "synonyms": ["up to 5 synonyms, ordered by frequency"],
  "antonyms": ["up to 3 antonyms"],
  "wordFamily": ["related word forms with part of speech, e.g. 'happy (adj)', 'happiness (n)'"],
  "collocations": ["5 common word pairings/phrases"],
  "mnemonic": "A memorable Vietnamese memory hook using one of these techniques: 1) Sound association: Vietnamese words that SOUND like the English word, 2) Visual story: vivid mental image connecting sound to meaning, 3) Word breakdown: split compound words and explain each part, 4) Rhyme/rhythm: catchy and fun. Keep it SHORT (1-2 sentences), FUNNY if possible, in Vietnamese.",
  "mnemonicType": "sound|visual|breakdown|rhyme",
  "frequency": 1-5 (1=very common daily word, 5=rare)
}`;
}

const VALID_CONTEXTS = new Set(['daily', 'work', 'social', 'formal', 'dialogue']);
const VALID_MNEMONIC_TYPES = new Set(['sound', 'visual', 'breakdown', 'rhyme']);

function parseRichExamples(raw: unknown): EnrichedExample[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const examples: EnrichedExample[] = [];
  for (const item of raw.slice(0, 5)) {
    if (typeof item !== 'object' || !item) continue;
    const obj = item as Record<string, unknown>;
    const sentence = String(obj.sentence ?? '');
    const ctx = String(obj.context ?? '');
    if (!sentence) continue;
    examples.push({
      sentence,
      context: VALID_CONTEXTS.has(ctx) ? (ctx as EnrichedExample['context']) : 'daily',
      translation: obj.translation ? String(obj.translation) : undefined,
    });
  }
  return examples.length > 0 ? examples : undefined;
}

function parseResponse(text: string): EnrichedWordData | null {
  try {
    // Strip markdown fences if present
    const cleaned = text.replace(/```(?:json)?\s*/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const mnemonicType = String(parsed.mnemonicType ?? '');

    return {
      partOfSpeech: String(parsed.partOfSpeech ?? ''),
      examples: Array.isArray(parsed.examples) ? parsed.examples.map(String).slice(0, 5) : [],
      richExamples: parseRichExamples(parsed.richExamples),
      synonyms: Array.isArray(parsed.synonyms) ? parsed.synonyms.map(String).slice(0, 5) : [],
      antonyms: Array.isArray(parsed.antonyms) ? parsed.antonyms.map(String).slice(0, 3) : [],
      wordFamily: Array.isArray(parsed.wordFamily) ? parsed.wordFamily.map(String) : [],
      collocations: Array.isArray(parsed.collocations) ? parsed.collocations.map(String) : [],
      mnemonic: String(parsed.mnemonic ?? ''),
      mnemonicType: VALID_MNEMONIC_TYPES.has(mnemonicType)
        ? (mnemonicType as EnrichedWordData['mnemonicType'])
        : undefined,
      frequency:
        typeof parsed.frequency === 'number' ? Math.max(1, Math.min(5, parsed.frequency)) : 3,
    };
  } catch {
    return null;
  }
}

/**
 * Batch enrich multiple words. Returns a map of word -> EnrichedWordData.
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
    if (cached && cached.updatedAt > 0 && Date.now() - cached.updatedAt < CACHE_TTL) {
      return cached.data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if cached data needs re-enrichment (missing P10-2 fields).
 */
export function needsReEnrichment(data: EnrichedWordData): boolean {
  return !data.richExamples || data.richExamples.length === 0 || !data.mnemonicType;
}

/**
 * Force re-enrich a word (bypass cache TTL). Used for lazy migration.
 */
export async function forceReEnrich(
  word: string,
  meaning: string,
): Promise<EnrichedWordData> {
  const key = word.toLowerCase().trim();
  try {
    const existing = await db.enrichedWords.get(key);
    if (existing) {
      await db.enrichedWords.update(key, { updatedAt: 0 });
    }
  } catch {
    /* non-critical */
  }
  return enrichWordData(word, meaning);
}

/**
 * Regenerate only the mnemonic for a word. Bypasses cache, calls AI
 * with a lightweight prompt, and updates only mnemonic fields in Dexie.
 */
export async function regenerateMnemonic(
  word: string,
  meaning: string,
): Promise<{ mnemonic: string; mnemonicType?: EnrichedWordData['mnemonicType'] } | null> {
  if (!aiService.hasAnyProvider()) return null;

  await acquireSlot();
  try {
    const prompt = `For the English word "${word}" (Vietnamese meaning: "${meaning}"), create a NEW memorable Vietnamese memory hook.

Return JSON:
{
  "mnemonic": "A short (1-2 sentences) Vietnamese memory hook. Use one technique: sound association (Vietnamese words that SOUND like the English word), visual story (vivid mental image), word breakdown (split compound words), or rhyme. Be creative, funny if possible.",
  "mnemonicType": "sound|visual|breakdown|rhyme"
}`;

    const response = await aiService.chat(
      [
        {
          role: 'system',
          content: 'You are a vocabulary memory hook specialist. Respond ONLY with valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      { feature: 'word-enrichment', maxTokens: 256, temperature: 0.9 },
    );

    const cleaned = response.text
      .replace(/```(?:json)?\s*/g, '')
      .replace(/```/g, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    const mnemonic = String(parsed.mnemonic ?? '');
    const typeStr = String(parsed.mnemonicType ?? '');
    const mnemonicType = VALID_MNEMONIC_TYPES.has(typeStr)
      ? (typeStr as EnrichedWordData['mnemonicType'])
      : undefined;

    if (!mnemonic) return null;

    // Update only mnemonic fields in cache
    const key = word.toLowerCase().trim();
    try {
      const existing = await db.enrichedWords.get(key);
      if (existing) {
        await db.enrichedWords.update(key, {
          data: { ...existing.data, mnemonic, mnemonicType },
        });
      }
    } catch {
      /* non-critical */
    }

    return { mnemonic, mnemonicType };
  } catch {
    return null;
  } finally {
    releaseSlot();
  }
}
