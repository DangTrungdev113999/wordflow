import { useState, useEffect } from 'react';
import { getMultiMeaning, getMultiMeaningSeed } from '../../../services/multiMeaningService';
import type { MultiMeaningWord } from '../models';

interface UseMultiMeaningResult {
  data: MultiMeaningWord | null;
  loading: boolean;
}

/**
 * Fetch multi-meaning data for a word.
 * Checks seed data synchronously first, then falls back to async service.
 */
export function useMultiMeaning(word: string | undefined): UseMultiMeaningResult {
  const [data, setData] = useState<MultiMeaningWord | null>(() => {
    if (!word) return null;
    return getMultiMeaningSeed(word) ?? null;
  });
  const [loading, setLoading] = useState(() => {
    if (!word) return false;
    // If seed hit, no loading needed
    return !getMultiMeaningSeed(word);
  });

  useEffect(() => {
    if (!word) {
      setData(null);
      setLoading(false);
      return;
    }

    // Seed already available — skip async fetch
    const seed = getMultiMeaningSeed(word);
    if (seed) {
      setData(seed);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getMultiMeaning(word).then(result => {
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [word]);

  return { data, loading };
}
