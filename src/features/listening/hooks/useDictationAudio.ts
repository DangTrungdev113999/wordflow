import { useState } from 'react';
import { playWordAudio } from '../../../services/audioService';

export function useDictationAudio() {
  const [isPlaying, setIsPlaying] = useState(false);

  async function play(word: string, audioUrl?: string | null) {
    setIsPlaying(true);
    try {
      await playWordAudio(word, audioUrl ?? undefined);
    } finally {
      setTimeout(() => setIsPlaying(false), 500);
    }
  }

  function playSentence(text: string) {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => setTimeout(() => setIsPlaying(false), 500);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  }

  return { play, playSentence, isPlaying };
}
