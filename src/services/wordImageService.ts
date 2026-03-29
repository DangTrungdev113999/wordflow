import { db } from '../db/database';
import type { WordImageData, EnrichedWordData } from '../db/models';

export type { WordImageData };

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const IMAGE_CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

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

// Dedup in-flight image requests
const inflightRequests = new Map<string, Promise<WordImageData>>();

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
): Promise<WordImageData> {
  const key = word.toLowerCase().trim();

  // Dedup concurrent requests
  const inflight = inflightRequests.get(key);
  if (inflight) return inflight;

  const promise = doGetWordImage(key, meaning, topicId);
  inflightRequests.set(key, promise);
  promise.finally(() => inflightRequests.delete(key));

  return promise;
}

async function doGetWordImage(
  word: string,
  meaning: string,
  topicId?: string,
): Promise<WordImageData> {
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
    try {
      const image = await fetchUnsplashImage(word);
      if (image) {
        await cacheImageData(word, image);
        return image;
      }

      // Retry with meaning as query (for abstract words)
      const retryImage = await fetchUnsplashImage(meaning);
      if (retryImage) {
        retryImage.alt = `${word} — ${meaning}`;
        await cacheImageData(word, retryImage);
        return retryImage;
      }
    } catch {
      // Unsplash failure — fall through to emoji
    }
  }

  // 3. Emoji fallback
  const emoji = getEmojiPlaceholder(topicId ?? '', word);
  await cacheImageData(word, emoji);
  return emoji;
}

async function fetchUnsplashImage(
  query: string,
): Promise<WordImageData | null> {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '1');
  url.searchParams.set('orientation', 'squarish');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  });

  if (!res.ok) return null;

  const data = await res.json();
  const photo = data.results?.[0];
  if (!photo) return null;

  return {
    url: photo.urls.small, // ~400px
    source: 'unsplash',
    alt: photo.alt_description || query,
    thumbUrl: photo.urls.thumb, // ~200px
    fullUrl: photo.urls.regular, // ~1080px
  };
}

function getEmojiPlaceholder(topicId: string, _word: string): WordImageData {
  return {
    url: '',
    source: 'emoji',
    alt: TOPIC_EMOJI_MAP[topicId] || '📝',
  };
}

async function cacheImageData(
  word: string,
  imageData: WordImageData,
): Promise<void> {
  try {
    const existing = await db.enrichedWords.get(word);
    if (existing) {
      await db.enrichedWords.update(word, { imageData, imageUpdatedAt: Date.now() });
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
        updatedAt: 0, // 0 = not enriched yet, will be fetched when needed
        imageData,
        imageUpdatedAt: Date.now(),
      });
    }
  } catch {
    // Cache write failure is non-critical
  }
}

/**
 * Prefetch images for a topic's words.
 * - Max 25 words per call
 * - Throttle 1 req/sec for Unsplash rate limit
 * - Only fetches words without cached images
 */
export async function prefetchTopicImages(
  words: Array<{ word: string; meaning: string }>,
  topicId: string,
): Promise<void> {
  const batch = words.slice(0, 25);

  // Filter out words that already have cached images
  const uncached: typeof batch = [];
  for (const w of batch) {
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

  // Throttled sequential fetch (1 req/sec for Unsplash respect)
  for (const w of uncached) {
    await getWordImage(w.word, w.meaning, topicId);
    // Throttle only if using Unsplash
    if (UNSPLASH_ACCESS_KEY) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

export { TOPIC_EMOJI_MAP };
