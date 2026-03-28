import { useState } from 'react';

interface SpeechRecognitionResult {
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

  async function startListening(lang = 'en-US'): Promise<SpeechRecognitionResult> {
    return new Promise((resolve, reject) => {
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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

      recognition.onresult = (event: any) => {
        const result = event.results[0];
        const alternatives = Array.from({ length: result.length }, (_, i) =>
          (result[i] as any).transcript.toLowerCase().trim()
        );
        resolve({
          transcript: alternatives[0],
          alternatives,
          confidence: result[0].confidence,
        });
      };

      recognition.onerror = (event: any) => {
        setError(event.error);
        setIsListening(false);
        reject(new Error(event.error));
      };

      recognition.onend = () => {
        setIsListening(false);
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
