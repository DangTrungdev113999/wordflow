import { useState } from 'react';

interface SpeechRecognitionHookResult {
  transcript: string;
  alternatives: string[];
  confidence: number;
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  async function startListening(lang = 'en-US'): Promise<SpeechRecognitionHookResult> {
    return new Promise((resolve, reject) => {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.lang = lang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;
      recognition.continuous = false;

      setIsListening(true);
      setError(null);

      let resolved = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        resolved = true;
        const result = event.results[0];
        const alternatives = Array.from({ length: result.length }, (_, i) =>
          result[i].transcript.toLowerCase().trim()
        );
        resolve({
          transcript: alternatives[0],
          alternatives,
          confidence: result[0].confidence,
        });
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        resolved = true;
        setError(event.error);
        setIsListening(false);
        reject(new Error(event.error));
      };

      recognition.onend = () => {
        setIsListening(false);
        if (!resolved) {
          reject(new Error('no-speech'));
        }
      };

      recognition.start();

      // Auto-stop after 5 seconds
      setTimeout(() => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      }, 5000);
    });
  }

  return { isSupported, isListening, error, startListening };
}
