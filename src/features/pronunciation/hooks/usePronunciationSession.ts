import { useState, useCallback, useRef } from 'react';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { enrichWord } from '../../../services/enrichmentService';
import { eventBus } from '../../../services/eventBus';
import { levenshteinDistance } from '../../../lib/utils';
import type { VocabWord } from '../../../lib/types';

export interface PronunciationScore {
  word: string;
  attempts: number;
  bestConfidence: number;
  passed: boolean;
}

export type AttemptResult = 'exact' | 'close' | 'miss';

interface AttemptInfo {
  result: AttemptResult;
  transcript: string;
  confidence: number;
}

const MAX_ATTEMPTS = 3;
const PASS_CONFIDENCE = 0.7;
const SESSION_SIZE = 10;

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function usePronunciationSession(words: VocabWord[]) {
  const [sessionWords, setSessionWords] = useState<VocabWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<PronunciationScore[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [lastAttemptInfo, setLastAttemptInfo] = useState<AttemptInfo | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [audioUrls, setAudioUrls] = useState<Map<string, string | null>>(new Map());

  const { isSupported, isListening, startListening } = useSpeechRecognition();
  const xpEarned = useRef(0);

  const startSession = useCallback(() => {
    const selected = shuffleArray(words).slice(0, SESSION_SIZE);
    setSessionWords(selected);
    setCurrentIndex(0);
    setScores([]);
    setCurrentAttempt(0);
    setLastAttemptInfo(null);
    setIsComplete(false);
    setIsStarted(true);
    xpEarned.current = 0;

    // Pre-fetch audio for all session words
    const urlMap = new Map<string, string | null>();
    selected.forEach((w) => {
      urlMap.set(w.word.toLowerCase(), w.audioUrl);
    });
    setAudioUrls(urlMap);

    // Enrich words for audio URLs (background, non-blocking)
    for (const w of selected) {
      enrichWord(w.word).then((data) => {
        if (data.audioUrl) {
          setAudioUrls((prev) => {
            const next = new Map(prev);
            next.set(w.word.toLowerCase(), data.audioUrl);
            return next;
          });
        }
      });
    }
  }, [words]);

  const currentWord = sessionWords[currentIndex] ?? null;

  const evaluate = useCallback(
    (transcript: string, alternatives: string[], confidence: number, targetWord: string): AttemptResult => {
      const target = targetWord.toLowerCase();
      const allTranscripts = alternatives.length > 0 ? alternatives : [transcript.toLowerCase()];

      // Exact match check
      for (const alt of allTranscripts) {
        if (alt === target) return 'exact';
      }

      // Confidence-based pass
      if (confidence >= PASS_CONFIDENCE) {
        for (const alt of allTranscripts) {
          if (levenshteinDistance(alt, target) <= 1) return 'exact';
        }
      }

      // Fuzzy match (close)
      for (const alt of allTranscripts) {
        if (levenshteinDistance(alt, target) <= 1) return 'close';
      }

      return 'miss';
    },
    [],
  );

  const attemptPronunciation = useCallback(async () => {
    if (!currentWord || isListening) return;

    try {
      const { transcript, alternatives, confidence } = await startListening('en-US');
      const result = evaluate(transcript, alternatives, confidence, currentWord.word);

      setLastAttemptInfo({ result, transcript, confidence });

      const passed = result === 'exact';
      const newAttempt = currentAttempt + 1;
      setCurrentAttempt(newAttempt);

      if (passed) {
        // Emit correct event
        eventBus.emit('pronunciation:correct', { wordId: `${currentWord.word}` });
        xpEarned.current += 5; // pronunciation_correct XP
      }

      // If passed or max attempts reached, record score
      if (passed || newAttempt >= MAX_ATTEMPTS) {
        if (!passed) {
          eventBus.emit('pronunciation:incorrect', { wordId: `${currentWord.word}` });
        }

        setScores((prev) => [
          ...prev,
          {
            word: currentWord.word,
            attempts: newAttempt,
            bestConfidence: confidence,
            passed,
          },
        ]);
      }
    } catch {
      // Speech recognition error — treat as miss attempt
      const newAttempt = currentAttempt + 1;
      setCurrentAttempt(newAttempt);
      setLastAttemptInfo({ result: 'miss', transcript: '', confidence: 0 });

      if (newAttempt >= MAX_ATTEMPTS) {
        eventBus.emit('pronunciation:incorrect', { wordId: `${currentWord.word}` });
        setScores((prev) => [
          ...prev,
          {
            word: currentWord.word,
            attempts: newAttempt,
            bestConfidence: 0,
            passed: false,
          },
        ]);
      }
    }
  }, [currentWord, currentAttempt, isListening, startListening, evaluate]);

  const nextWord = useCallback(() => {
    const next = currentIndex + 1;
    if (next >= sessionWords.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex(next);
      setCurrentAttempt(0);
      setLastAttemptInfo(null);
    }
  }, [currentIndex, sessionWords.length]);

  const isWordDone =
    lastAttemptInfo?.result === 'exact' || currentAttempt >= MAX_ATTEMPTS;

  return {
    isSupported,
    isStarted,
    isListening,
    isComplete,
    currentWord,
    currentIndex,
    total: sessionWords.length,
    currentAttempt,
    maxAttempts: MAX_ATTEMPTS,
    lastAttemptInfo,
    isWordDone,
    scores,
    xpEarned: xpEarned.current,
    audioUrls,
    startSession,
    attemptPronunciation,
    nextWord,
  };
}
