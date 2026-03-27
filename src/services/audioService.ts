let currentAudio: HTMLAudioElement | null = null;

export async function playWordAudio(word: string, audioUrl?: string | null): Promise<void> {
  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      currentAudio = audio;
      await audio.play();
      return;
    } catch {
      // fall through to Web Speech API
    }
  }

  // Fallback: Web Speech API
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

export function stopAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
