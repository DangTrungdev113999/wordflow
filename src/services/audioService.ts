let currentAudio: HTMLAudioElement | null = null;

export interface PlayOptions {
  rate?: number;          // 0.5 - 2.0, default 1.0
  voice?: string;         // voice name or 'male'|'female' shortcut
  lang?: string;          // default 'en-US'
  onEnd?: () => void;     // callback when done
  signal?: AbortSignal;   // cancel audio
}

function findVoice(voiceHint?: string): SpeechSynthesisVoice | undefined {
  if (!voiceHint) return undefined;
  const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
  if (!voices.length) return undefined;

  const hint = voiceHint.toLowerCase();

  // Shortcut: male/female
  if (hint === 'female') {
    return voices.find(v => /female|samantha|victoria|google.*us.*female/i.test(v.name)) ?? voices[0];
  }
  if (hint === 'male') {
    return voices.find(v => /male|daniel|alex|google.*us.*male/i.test(v.name) && !/female/i.test(v.name)) ?? voices[0];
  }

  // Try exact match, then partial
  return voices.find(v => v.name === voiceHint)
    ?? voices.find(v => v.name.toLowerCase().includes(hint))
    ?? undefined;
}

export async function playAudio(text: string, options?: PlayOptions): Promise<void> {
  // Cancel current audio
  stopAudio();

  const rate = options?.rate ?? 1.0;
  const lang = options?.lang ?? 'en-US';

  // Abort signal support
  if (options?.signal?.aborted) return;

  return new Promise<void>((resolve) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;

      const voice = findVoice(options?.voice);
      if (voice) utterance.voice = voice;

      const done = () => {
        options?.onEnd?.();
        resolve();
      };

      utterance.onend = done;
      utterance.onerror = () => resolve();

      if (options?.signal) {
        options.signal.addEventListener('abort', () => {
          window.speechSynthesis.cancel();
          resolve();
        }, { once: true });
      }

      window.speechSynthesis.speak(utterance);
    } else {
      resolve();
    }
  });
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
}

// Backward compat
export async function playWordAudio(word: string, audioUrl?: string | null): Promise<void> {
  // Stop any currently playing audio
  stopAudio();

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

  return playAudio(word, { rate: 0.9 });
}

export function playAudio(
  text: string,
  options?: { rate?: number; onEnd?: () => void },
): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = options?.rate ?? 0.9;
    if (options?.onEnd) utterance.onend = options.onEnd;
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
