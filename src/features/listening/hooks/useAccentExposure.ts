import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { playAudio, stopAudio, getAvailableVoices } from '../../../services/audioService';
import { eventBus } from '../../../services/eventBus';
import { XP_VALUES } from '../../../lib/constants';
import type { VocabWord } from '../../../lib/types';
import type { Accent } from '../../../db/models';

const ACCENTS: { id: Accent; label: string; flag: string; voiceKeywords: string[]; lang: string; pitch: number }[] = [
  { id: 'us', label: 'American', flag: '🇺🇸', voiceKeywords: ['us', 'american', 'united states'], lang: 'en-US', pitch: 1.0 },
  { id: 'uk', label: 'British',  flag: '🇬🇧', voiceKeywords: ['uk', 'british', 'united kingdom', 'gb'], lang: 'en-GB', pitch: 1.1 },
  { id: 'au', label: 'Australian', flag: '🇦🇺', voiceKeywords: ['au', 'australian', 'australia'], lang: 'en-AU', pitch: 0.95 },
];

const ITEMS_PER_ACCENT = 4;
const TOTAL_ITEMS = ACCENTS.length * ITEMS_PER_ACCENT;

export interface AccentQuestion {
  word: VocabWord;
  accent: Accent;
  accentLabel: string;
  accentFlag: string;
}

interface AnswerResult {
  question: AccentQuestion;
  userAnswer: string;
  correct: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function checkAnswer(input: string, target: string): boolean {
  return input.toLowerCase().trim() === target.toLowerCase().trim();
}

function findAccentVoice(accent: Accent): string | undefined {
  const config = ACCENTS.find(a => a.id === accent)!;
  const voices = getAvailableVoices();
  if (voices.length === 0) return undefined;

  // Try matching by keywords in voice name
  for (const keyword of config.voiceKeywords) {
    const match = voices.find(v =>
      v.name.toLowerCase().includes(keyword) ||
      v.lang.toLowerCase().includes(keyword)
    );
    if (match) return match.name;
  }

  // Try matching by lang code
  const langMatch = voices.find(v => v.lang.startsWith(config.lang.split('-')[0]) && v.lang.includes(config.lang.split('-')[1]));
  if (langMatch) return langMatch.name;

  return undefined;
}

export function useAccentExposure(topic: string) {
  const items = useMemo<AccentQuestion[]>(() => {
    const topicData = ALL_TOPICS.find(t => t.topic === topic);
    if (!topicData) return [];

    const words = shuffle(topicData.words).slice(0, TOTAL_ITEMS);

    const questions: AccentQuestion[] = [];
    ACCENTS.forEach((accent, accentIdx) => {
      for (let i = 0; i < ITEMS_PER_ACCENT; i++) {
        const wordIdx = accentIdx * ITEMS_PER_ACCENT + i;
        if (wordIdx < words.length) {
          questions.push({
            word: words[wordIdx],
            accent: accent.id,
            accentLabel: accent.label,
            accentFlag: accent.flag,
          });
        }
      }
    });

    return questions;
  }, [topic]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const answersRef = useRef<AnswerResult[]>([]);
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seenAccents] = useState<Set<Accent>>(new Set());

  const currentItem = items[currentIndex] ?? null;
  const total = items.length;

  // Which accent round (0=US, 1=UK, 2=AU)
  const currentAccentIndex = Math.floor(currentIndex / ITEMS_PER_ACCENT);
  const currentAccent = ACCENTS[currentAccentIndex];
  const indexInRound = currentIndex % ITEMS_PER_ACCENT;

  const playWord = useCallback(async (accent?: Accent) => {
    if (!currentItem) return;
    const targetAccent = accent ?? currentItem.accent;
    const config = ACCENTS.find(a => a.id === targetAccent)!;

    setIsPlaying(true);
    const voiceName = findAccentVoice(targetAccent);

    await playAudio(currentItem.word.word, {
      rate: 0.9,
      voice: voiceName,
      lang: config.lang,
      onEnd: () => setIsPlaying(false),
    });
  }, [currentItem]);

  const playWordWithAccent = useCallback(async (word: string, accent: Accent) => {
    const config = ACCENTS.find(a => a.id === accent)!;
    const voiceName = findAccentVoice(accent);
    await playAudio(word, {
      rate: 0.9,
      voice: voiceName,
      lang: config.lang,
    });
  }, []);

  const submitAnswer = useCallback((input: string) => {
    if (!currentItem) return;
    const correct = checkAnswer(input, currentItem.word.word);

    // Track first-time accent exposure
    const isNewAccent = !seenAccents.has(currentItem.accent);
    if (isNewAccent) seenAccents.add(currentItem.accent);

    const result: AnswerResult = { question: currentItem, userAnswer: input, correct };
    setLastResult(result);
    answersRef.current = [...answersRef.current, result];
    setAnswers(prev => [...prev, result]);
    setShowCompare(true);
  }, [currentItem, seenAccents]);

  const next = useCallback(() => {
    setLastResult(null);
    setShowCompare(false);
    stopAudio();

    if (currentIndex + 1 >= total) {
      setIsComplete(true);
      const finalCorrect = answersRef.current.filter(a => a.correct).length;

      eventBus.emit('listening:accent', {
        topic,
        accent: 'all',
        correct: finalCorrect,
        total,
      });

      // Emit mistakes
      const incorrect = answersRef.current.filter(a => !a.correct);
      if (incorrect.length > 0) {
        eventBus.emit('mistakes:collected', {
          source: 'dictation',
          mistakes: incorrect.map(a => ({
            type: 'listening' as const,
            question: `Listen (${a.question.accentLabel}) and type: "${a.question.word.word}"`,
            userAnswer: a.userAnswer,
            correctAnswer: a.question.word.word,
          })),
        });
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, total, topic]);

  // Cleanup
  useEffect(() => {
    return () => { stopAudio(); };
  }, []);

  const correctCount = answers.filter(a => a.correct).length;

  // XP: 10/correct + 5 bonus per new accent (max 3 accents)
  const newAccentCount = new Set(answers.filter(a => a.correct).map(a => a.question.accent)).size;
  const xpEarned = correctCount * XP_VALUES.accent_correct
    + newAccentCount * XP_VALUES.accent_new_bonus
    + (isComplete && correctCount === total ? XP_VALUES.accent_session_perfect : 0);

  const incorrectAnswers = answers.filter(a => !a.correct);

  return {
    currentItem,
    currentIndex,
    total,
    lastResult,
    isComplete,
    answers,
    correctCount,
    xpEarned,
    incorrectAnswers,
    submitAnswer,
    next,
    showCompare,
    playWord,
    playWordWithAccent,
    isPlaying,
    currentAccent,
    currentAccentIndex,
    indexInRound,
    itemsPerAccent: ITEMS_PER_ACCENT,
    accents: ACCENTS,
  };
}
