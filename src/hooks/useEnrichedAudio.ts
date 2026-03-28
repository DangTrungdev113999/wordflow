import { useEffect, useRef, useState } from 'react';
import { enrichWord, preloadAudio } from '../services/enrichmentService';
import type { VocabWord } from '../lib/types';

/**
 * Enriches audio URLs for flashcard words.
 * - Resolves audio for the current word immediately
 * - Preloads audio for the next PRELOAD_AHEAD words
 */
const PRELOAD_AHEAD = 3;

export function useEnrichedAudio(
  queue: VocabWord[],
  currentIndex: number,
) {
  const [audioMap, setAudioMap] = useState<Record<string, string | null>>({});
  const enrichedWords = useRef(new Set<string>());

  useEffect(() => {
    if (queue.length === 0) return;

    // Enrich current + next PRELOAD_AHEAD words
    const wordsToEnrich = queue
      .slice(currentIndex, currentIndex + PRELOAD_AHEAD + 1)
      .map((w) => w.word)
      .filter((w) => !enrichedWords.current.has(w.toLowerCase()));

    if (wordsToEnrich.length === 0) return;

    wordsToEnrich.forEach((w) => enrichedWords.current.add(w.toLowerCase()));

    const promises = wordsToEnrich.map(async (word) => {
      const enriched = await enrichWord(word);
      return { word: word.toLowerCase(), audioUrl: enriched.audioUrl };
    });

    Promise.all(promises).then((results) => {
      const newEntries: Record<string, string | null> = {};
      const urlsToPreload: (string | null)[] = [];

      for (const { word, audioUrl } of results) {
        newEntries[word] = audioUrl;
        urlsToPreload.push(audioUrl);
      }

      setAudioMap((prev) => ({ ...prev, ...newEntries }));
      preloadAudio(urlsToPreload);
    });
  }, [queue, currentIndex]);

  /** Get the enriched audio URL for a word, falling back to its original audioUrl */
  function getAudioUrl(word: VocabWord): string | null {
    return audioMap[word.word.toLowerCase()] ?? word.audioUrl;
  }

  return { getAudioUrl };
}
