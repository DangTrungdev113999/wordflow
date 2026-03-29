import { db } from '../db/database';
import type { WordImageData, EnrichedWordData } from '../db/models';

export type { WordImageData };

// NOTE: Free-tier Unsplash key (50 req/hour, read-only photo search).
// Exposed in client bundle via VITE_ prefix — accepted risk for MVP.
// Key is rate-limited and publicly scoped; no backend proxy needed.
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const IMAGE_CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
const RATE_LIMIT_CACHE_TTL = 60 * 60 * 1000; // 1 hour — retry after rate limit

// Module-level 429 flag — skip Unsplash calls until this timestamp passes
let rateLimitedUntil = 0;

const TOPIC_EMOJI_MAP: Record<string, string> = {
  'daily-life': '🌅',
  'food-drink': '🍜',
  travel: '✈️',
  family: '👨‍👩‍👧',
  health: '💊',
  education: '📚',
  sports: '⚽',
  emotions: '💭',
  nature: '🌿',
  clothing: '👕',
  shopping: '🛍️',
  home: '🏠',
  work: '💼',
  transportation: '🚗',
  'time-numbers': '⏰',
  entertainment: '🎬',
  communication: '💬',
  business: '📊',
  technology: '💻',
  environment: '🌍',
};

class RateLimitError extends Error {}

// Dedup in-flight image requests
const inflightRequests = new Map<string, Promise<WordImageData>>();

// Dedup in-flight prefetches per topic
const inflightPrefetches = new Set<string>();

// Cancel previous prefetch when a new topic is opened
let currentPrefetchController: AbortController | null = null;

function isValidUnsplashUrl(url: unknown): url is string {
  return typeof url === 'string' && url.startsWith('https://images.unsplash.com/');
}

function sanitizeAltText(text: unknown, fallback: string): string {
  if (typeof text !== 'string') return fallback;
  return text.replace(/<[^>]*>/g, '').slice(0, 200).trim() || fallback;
}

/**
 * Get an image for a word using 3-tier fallback:
 * 1. Dexie cache (enrichedWords.imageData)
 * 2. Unsplash API (if key configured)
 * 3. Emoji by topic
 */
export async function getWordImage(
  word: string,
  meaning: string,
  topicId?: string,
  signal?: AbortSignal,
): Promise<WordImageData> {
  const key = word.toLowerCase().trim();

  // Dedup concurrent requests
  const inflight = inflightRequests.get(key);
  if (inflight) return inflight;

  const promise = doGetWordImage(key, meaning, topicId, signal);

  inflightRequests.set(key, promise);
  promise.finally(() => inflightRequests.delete(key));

  return promise;
}

async function doGetWordImage(
  word: string,
  meaning: string,
  topicId?: string,
  signal?: AbortSignal,
): Promise<WordImageData> {
  // Short-circuit if globally rate-limited — skip Unsplash entirely
  if (Date.now() < rateLimitedUntil) {
    const emoji = getEmojiPlaceholder(topicId ?? '');
    await cacheImageData(word, emoji, RATE_LIMIT_CACHE_TTL);
    return emoji;
  }
  // 1. Check cache
  try {
    const cached = await db.enrichedWords.get(word);
    if (
      cached?.imageData &&
      cached.imageUpdatedAt &&
      Date.now() - cached.imageUpdatedAt < IMAGE_CACHE_TTL
    ) {
      return cached.imageData;
    }
  } catch {
    // Cache read failure is non-critical
  }

  // 2. Try Unsplash (only if key is configured)
  if (UNSPLASH_ACCESS_KEY) {
    let photo: WordImageData | null = null;

    // First try: English word
    try {
      photo = await fetchUnsplashImage(word, signal);
    } catch (e) {
      if (e instanceof RateLimitError) {
        const emoji = getEmojiPlaceholder(topicId ?? '');
        await cacheImageData(word, emoji, RATE_LIMIT_CACHE_TTL);
        return emoji;
      }
      console.warn(`[wordImage] Unsplash failed for "${word}":`, e);
    }

    if (photo) {
      await cacheImageData(word, photo);
      return photo;
    }

    // Retry: Vietnamese meaning (if first returned null OR threw)
    try {
      photo = await fetchUnsplashImage(meaning, signal);
    } catch (e) {
      if (e instanceof RateLimitError) {
        const emoji = getEmojiPlaceholder(topicId ?? '');
        await cacheImageData(word, emoji, RATE_LIMIT_CACHE_TTL);
        return emoji;
      }
      console.warn(`[wordImage] Unsplash retry failed for "${meaning}":`, e);
    }

    if (photo) {
      photo.alt = `${word} — ${meaning}`;
      await cacheImageData(word, photo);
      return photo;
    }
  }

  // 3. Emoji fallback (no results — cache with full 30-day TTL)
  const emoji = getEmojiPlaceholder(topicId ?? '');
  await cacheImageData(word, emoji);
  return emoji;
}

async function fetchUnsplashImage(
  query: string,
  signal?: AbortSignal,
): Promise<WordImageData | null> {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '1');
  url.searchParams.set('orientation', 'squarish');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    signal,
  });

  if (res.status === 429) {
    rateLimitedUntil = Date.now() + RATE_LIMIT_CACHE_TTL;
    throw new RateLimitError();
  }
  if (!res.ok) return null;

  const data = await res.json();
  const photo = data.results?.[0];
  if (!photo) return null;

  // Validate URLs are from Unsplash CDN to prevent XSS via spoofed responses
  const smallUrl = photo.urls?.small;
  const thumbUrl = photo.urls?.thumb;
  const regularUrl = photo.urls?.regular;
  if (!isValidUnsplashUrl(smallUrl)) return null;

  return {
    url: smallUrl,
    source: 'unsplash',
    alt: sanitizeAltText(photo.alt_description, query),
    thumbUrl: isValidUnsplashUrl(thumbUrl) ? thumbUrl : undefined,
    fullUrl: isValidUnsplashUrl(regularUrl) ? regularUrl : undefined,
  };
}

function getEmojiPlaceholder(topicId: string): WordImageData {
  return {
    url: '',
    source: 'emoji',
    alt: TOPIC_EMOJI_MAP[topicId] || '📝',
  };
}

async function cacheImageData(
  word: string,
  imageData: WordImageData,
  ttl?: number,
): Promise<void> {
  try {
    // When a custom TTL is provided (e.g. rate-limit), backdate imageUpdatedAt
    // so the cache expires after `ttl` instead of the full IMAGE_CACHE_TTL.
    const imageUpdatedAt = ttl
      ? Date.now() - IMAGE_CACHE_TTL + ttl
      : Date.now();

    const existing = await db.enrichedWords.get(word);
    if (existing) {
      await db.enrichedWords.update(word, { imageData, imageUpdatedAt });
    } else {
      // Create a minimal entry for image-only cache
      const emptyData: EnrichedWordData = {
        partOfSpeech: '',
        examples: [],
        synonyms: [],
        antonyms: [],
        wordFamily: [],
        collocations: [],
        mnemonic: '',
        frequency: 3,
      };
      await db.enrichedWords.put({
        word,
        data: emptyData,
        updatedAt: 0, // sentinel: not enriched yet — enrichment service checks updatedAt > 0
        imageData,
        imageUpdatedAt,
      });
    }
  } catch {
    // Cache write failure is non-critical
  }
}

/**
 * Prefetch images for a topic's words.
 * - Max 25 words per call
 * - Parallel 3 at a time with throttle between batches
 * - Dedup per topic — skips if same topic is already prefetching
 * - Supports AbortSignal for cleanup on navigation
 */
export async function prefetchTopicImages(
  words: Array<{ word: string; meaning: string }>,
  topicId: string,
): Promise<void> {
  // Cancel any previous prefetch (user switched topics)
  currentPrefetchController?.abort();
  const controller = new AbortController();
  currentPrefetchController = controller;
  const signal = controller.signal;

  // Dedup: skip if this topic is already being prefetched
  if (inflightPrefetches.has(topicId)) return;
  inflightPrefetches.add(topicId);

  try {
    const batch = words.slice(0, 25);

    // Filter out words that already have cached images
    const uncached: typeof batch = [];
    for (const w of batch) {
      if (signal.aborted) return;
      try {
        const cached = await db.enrichedWords.get(w.word.toLowerCase().trim());
        if (
          cached?.imageData &&
          cached.imageUpdatedAt &&
          Date.now() - cached.imageUpdatedAt < IMAGE_CACHE_TTL
        ) {
          continue;
        }
      } catch {
        // proceed to fetch
      }
      uncached.push(w);
    }

    if (uncached.length === 0) return;

    // Parallel fetch with concurrency limit of 3
    const CONCURRENCY = 3;
    for (let i = 0; i < uncached.length; i += CONCURRENCY) {
      if (signal.aborted || Date.now() < rateLimitedUntil) return;
      const chunk = uncached.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map((w) => getWordImage(w.word, w.meaning, topicId, signal)));
      // Throttle between batches if using Unsplash
      if (UNSPLASH_ACCESS_KEY && i + CONCURRENCY < uncached.length) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  } finally {
    inflightPrefetches.delete(topicId);
  }
}
