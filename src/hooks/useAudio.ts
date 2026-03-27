import { useState, useCallback } from 'react';
import { playWordAudio, stopAudio } from '../services/audioService';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(async (word: string, audioUrl?: string | null) => {
    setIsPlaying(true);
    try {
      await playWordAudio(word, audioUrl);
    } finally {
      setTimeout(() => setIsPlaying(false), 1500);
    }
  }, []);

  const stop = useCallback(() => {
    stopAudio();
    setIsPlaying(false);
  }, []);

  return { isPlaying, play, stop };
}
