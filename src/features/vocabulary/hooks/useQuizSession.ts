import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { useProgressStore } from '../../../stores/progressStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { useSessionStreak } from './useSessionStreak';
import { db } from '../../../db/database';
import { calculateSM2, createInitialProgress } from '../../../services/spacedRepetition';
import { eventBus } from '../../../services/eventBus';
import { useVocabSession } from './useVocabSession';
import { XP_VALUES, MODE_RATING_MAP, TIMED_DURATION } from '../../../lib/constants';
import type { VocabWord, FlashcardRating } from '../../../lib/types';
import type { VocabSessionConfig, VocabSessionWordResult } from '../types';
import type { XPBreakdown } from '../components/SessionSummary';

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Pick 3 distractors from the pool, falling back to other topics at same CEFR level. */
function generateDistractors(
  correctWord: VocabWord,
  pool: VocabWord[],
  allTopicWords: VocabWord[],
  direction: 'en-to-vi' | 'vi-to-en',
): string[] {
  const correctText = direction === 'en-to-vi' ? correctWord.meaning : correctWord.word;

  // Candidate pool: other words from same topic
  let candidates = pool
    .filter(w => w.word !== correctWord.word)
    .map(w => (direction === 'en-to-vi' ? w.meaning : w.word));

  // If not enough, add words from other topics (same CEFR level, passed as allTopicWords)
  if (candidates.length < 3) {
    const fallback = allTopicWords
      .filter(w => w.word !== correctWord.word)
      .map(w => (direction === 'en-to-vi' ? w.meaning : w.word));
    candidates = [...new Set([...candidates, ...fallback])];
  }

  // Remove duplicates of the correct answer
  candidates = candidates.filter(c => c !== correctText);

  return shuffle(candidates).slice(0, 3);
}

export function useQuizSession(topicId: string) {
  const [searchParams] = useSearchParams();
  const countParam = parseInt(searchParams.get('count') ?? '10', 10);
  const filterParam = (searchParams.get('filter') ?? 'all') as VocabSessionConfig['wordsFilter'];
  const modeParam = searchParams.get('mode') ?? 'quiz';
  const isTimed = searchParams.get('timed') === '1';
  const timerDuration = TIMED_DURATION[modeParam] ?? 10;

  const config: VocabSessionConfig = {
    topicId,
    mode: 'quiz',
    wordCount: countParam,
    wordsFilter: filterParam,
  };

  const { topic, words, wordProgressMap, setWordProgressMap, isLoading, getElapsedTime, allTopics } = useVocabSession(config);

  // Collect fallback words from same CEFR level for distractors
  const cefrLevel = topic?.cefrLevel;
  const fallbackWords = cefrLevel
    ? allTopics.filter(t => t.cefrLevel === cefrLevel && t.topic !== topicId).flatMap(t => t.words)
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [results, setResults] = useState<VocabSessionWordResult[]>([]);
  const [baseXPTotal, setBaseXPTotal] = useState(0);
  const [speedBonusTotal, setSpeedBonusTotal] = useState(0);
  const questionStartRef = useRef(Date.now());

  const { todayWordsLearned } = useProgressStore();
  const { dailyGoal } = useSettingsStore();
  const dailyGoalAwarded = useRef(false);
  const { streak, multiplier, bestStreak, totalStreakBonus, recordAnswer: recordStreak } = useSessionStreak();

  const currentWord = words[currentIndex] ?? null;
  const isSessionComplete = currentIndex >= words.length && words.length > 0;

  // Generate direction and options for the current question
  const [direction, setDirection] = useState<'en-to-vi' | 'vi-to-en'>('en-to-vi');
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!currentWord || words.length === 0) return;

    const dir = Math.random() > 0.5 ? 'en-to-vi' : 'vi-to-en';
    setDirection(dir);

    const correct = dir === 'en-to-vi' ? currentWord.meaning : currentWord.word;
    const distractors = generateDistractors(currentWord, words, fallbackWords, dir);
    setOptions(shuffle([correct, ...distractors]));
    setSelectedOption(null);
    setShowFeedback(false);
    questionStartRef.current = Date.now();
  }, [currentIndex, words]); // eslint-disable-line react-hooks/exhaustive-deps

  const correctAnswer = currentWord
    ? (direction === 'en-to-vi' ? currentWord.meaning : currentWord.word)
    : '';

  const handleSelect = useCallback(async (option: string) => {
    if (showFeedback || !currentWord) return;

    setSelectedOption(option);
    setShowFeedback(true);

    const isCorrect = option === correctAnswer;
    const wordId = `${topicId}:${currentWord.word}`;
    const timeMs = Date.now() - questionStartRef.current;

    // SM-2 update using shared rating map
    const ratingMap = MODE_RATING_MAP.quiz;
    const rating: FlashcardRating = isCorrect ? ratingMap.correct : ratingMap.incorrect;
    const existing = wordProgressMap[wordId];
    const current = existing ?? createInitialProgress(wordId);
    const sm2Result = calculateSM2(rating, current);

    const newProgress = {
      ...current,
      ...sm2Result,
      lastReview: Date.now(),
    };

    await db.wordProgress.put(newProgress);
    setWordProgressMap({ ...wordProgressMap, [wordId]: newProgress });

    // XP + streak + speed bonus
    const baseXP = isCorrect ? XP_VALUES.quiz_correct : 0;
    recordStreak(isCorrect, baseXP);
    if (isCorrect) {
      setBaseXPTotal(prev => prev + baseXP);

      // Speed bonus: answered within time limit in timed mode
      if (isTimed && timeMs < timerDuration * 1000) {
        setSpeedBonusTotal(prev => prev + XP_VALUES.speed_bonus);
      }
    }

    // XP events
    if (isCorrect) {
      eventBus.emit('flashcard:correct', { wordId, rating });
    } else {
      eventBus.emit('flashcard:incorrect', { wordId });
    }

    // Track new words
    const isNew = !existing || existing.status === 'new';
    if (isNew) {
      eventBus.emit('word:learned', { wordId });
    }

    // Daily goal
    if (!dailyGoalAwarded.current) {
      const newCount = todayWordsLearned + 1;
      if (newCount >= dailyGoal) {
        eventBus.emit('daily_goal:met', {});
        dailyGoalAwarded.current = true;
      }
    }

    // Record result
    setResults(prev => [...prev, {
      wordId,
      word: currentWord.word,
      correct: isCorrect,
      attempts: 1,
      timeMs,
    }]);

    // Auto-advance after feedback delay
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 800);
  }, [showFeedback, currentWord, correctAnswer, topicId, wordProgressMap, setWordProgressMap, todayWordsLearned, dailyGoal, isTimed, timerDuration, recordStreak]);

  // Emit mistakes when session completes
  const mistakeEmittedRef = useRef(false);
  useEffect(() => {
    if (!isSessionComplete || mistakeEmittedRef.current) return;
    mistakeEmittedRef.current = true;

    const incorrect = results.filter(r => !r.correct);
    if (incorrect.length > 0) {
      eventBus.emit('mistakes:collected', {
        source: 'quiz',
        mistakes: incorrect.map(r => {
          const word = words.find(w => `${topicId}:${w.word}` === r.wordId);
          return {
            type: 'vocabulary' as const,
            question: word ? `What does "${word.word}" mean?` : r.wordId,
            userAnswer: 'Incorrect answer',
            correctAnswer: word?.meaning ?? r.wordId,
          };
        }),
      });
    }
  }, [isSessionComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Timer timeout — auto-skip as incorrect */
  const handleTimeout = useCallback(async () => {
    if (showFeedback || !currentWord) return;

    setSelectedOption(null);
    setShowFeedback(true);

    const wordId = `${topicId}:${currentWord.word}`;
    const ratingMap = MODE_RATING_MAP.quiz;
    const existing = wordProgressMap[wordId];
    const current = existing ?? createInitialProgress(wordId);
    const sm2Result = calculateSM2(ratingMap.incorrect, current);

    const newProgress = { ...current, ...sm2Result, lastReview: Date.now() };
    await db.wordProgress.put(newProgress);
    setWordProgressMap({ ...wordProgressMap, [wordId]: newProgress });

    recordStreak(false, 0);
    eventBus.emit('flashcard:incorrect', { wordId });

    setResults(prev => [...prev, {
      wordId,
      word: currentWord.word,
      correct: false,
      attempts: 1,
      timeMs: timerDuration * 1000,
    }]);

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 800);
  }, [showFeedback, currentWord, topicId, wordProgressMap, setWordProgressMap, timerDuration, recordStreak]);

  const accuracy = results.length > 0
    ? Math.round((results.filter(r => r.correct).length / results.length) * 100)
    : 0;

  const xpEarned = baseXPTotal + totalStreakBonus + speedBonusTotal;
  const xpBreakdown: XPBreakdown = {
    base: baseXPTotal,
    streakBonus: totalStreakBonus,
    speedBonus: speedBonusTotal > 0 ? speedBonusTotal : undefined,
  };

  return {
    topic,
    words,
    currentWord,
    currentIndex,
    isLoading,
    isSessionComplete,
    direction,
    options,
    selectedOption,
    showFeedback,
    correctAnswer,
    handleSelect,
    handleTimeout,
    results,
    accuracy,
    xpEarned,
    xpBreakdown,
    totalTime: getElapsedTime(),
    // Streak
    streak,
    multiplier,
    bestStreak,
    // Timer
    isTimed,
    timerDuration,
  };
}
