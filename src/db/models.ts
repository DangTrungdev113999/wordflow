import type { CEFRLevel, WordStatus, Theme } from '../lib/types';

export interface Word {
  id: string;
  word: string;
  meaning: string;
  ipa: string;
  audioUrl?: string;
  example: string;
  topic: string;
  cefrLevel: CEFRLevel;
}

export interface WordProgress {
  wordId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastReview: number;
  status: WordStatus;
}

export interface GrammarLesson {
  id: string;
  title: string;
  level: CEFRLevel;
  completed: boolean;
  bestScore: number;
  attempts: number;
}

export interface DailyLog {
  date: string;
  wordsLearned: number;
  wordsReviewed: number;
  grammarCompleted: number;
  quizAccuracy: number;
  xpEarned: number;
  minutesSpent: number;
}

export interface UserProfile {
  id: 'default';
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  dailyGoal: number;
  theme: Theme;
  badges: string[];
  createdAt: number;
}

export interface DictionaryCache {
  word: string;
  data: unknown;
  cachedAt: number;
}
