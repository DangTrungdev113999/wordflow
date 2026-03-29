import type { CEFRLevel, WordStatus, Theme, DictionaryEntry, MediaVocabWord, GrammarExercise } from '../lib/types';

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
  dictationAttempts?: number;
  dictationCorrect?: number;
  pronunciationCorrect?: number;
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
  placementDone?: boolean;
  placementLevel?: CEFRLevel;
}

export interface DictionaryCache {
  word: string;
  data: DictionaryEntry[];
  cachedAt: number;
}

export type DailyChallengeTaskType = 'learnWord' | 'grammarQuiz' | 'dictation' | 'sentenceBuilding' | 'mediaVocab';

export interface DailyChallengeTask {
  type: DailyChallengeTaskType;
  contentId: string;
  completed: boolean;
  score?: number;
}

export interface DailyChallengeLog {
  date: string;                    // "2026-03-28" — PK
  tasks: DailyChallengeTask[];
  completed: boolean;
  xpEarned: number;
}

export interface CustomTopic {
  id?: number;
  name: string;
  icon: string;
  createdAt: number;
}

export interface CustomWord {
  id?: number;
  topicId: number;
  word: string;
  meaning: string;
  ipa: string;
  example: string;
  audioUrl: string | null;
  createdAt: number;
}

// Phase 6 — AI Features

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface Correction {
  wrong: string;
  correct: string;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  corrections?: Correction[];
  timestamp: number;
}

export interface GrammarIssue {
  original: string;
  correction: string;
  rule: string;
}

export interface WritingFeedback {
  overallScore: number;
  categories: {
    grammar: { score: number; issues: GrammarIssue[] };
    vocabulary: { score: number; feedback: string };
    coherence: { score: number; feedback: string };
    taskCompletion: { score: number; feedback: string };
  };
  improvedVersion: string;
  encouragement: string;
  vocabSuggestions: string[];
}

export interface WritingSubmission {
  id: string;
  promptId: string;
  content: string;
  wordCount: number;
  feedback: WritingFeedback | null;
  overallScore: number;
  submittedAt: number;
}

export interface RoleplayMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface RoleplaySummary {
  goalCompleted: boolean;
  goalFeedback: string;
  fluency: number;
  fluencyFeedback: string;
  grammarIssues: { original: string; correction: string; explanation: string }[];
  usefulPhrases: string[];
  phrasesToLearn: string[];
  overallFeedback: string;
}

export interface RoleplaySession {
  id: string;
  scenarioId: string;
  messages: RoleplayMessage[];
  status: 'in-progress' | 'completed';
  summary?: RoleplaySummary | null;
  startedAt: number;
  completedAt?: number;
}

// Phase 9 — Vocabulary Upgrade: enriched word cache
export interface EnrichedWordData {
  partOfSpeech: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  wordFamily: string[];
  collocations: string[];
  mnemonic: string;
  frequency: number;
}

// Phase 10 — Word Image System (Dual Coding)
export interface WordImageData {
  url: string;
  source: 'unsplash' | 'placeholder' | 'emoji';
  alt: string;
  thumbUrl?: string;
  fullUrl?: string;
}

export interface EnrichedWord {
  word: string; // primary key
  data: EnrichedWordData;
  updatedAt: number; // timestamp for TTL
  imageData?: WordImageData;
  imageUpdatedAt?: number;
}

// Phase 7 — Learn from Media
export interface MediaSession {
  id: string;
  createdAt: string;
  sourceType: 'url' | 'text';
  sourceUrl?: string;
  title: string;
  originalText: string;
  extractedVocab: MediaVocabWord[];
  quizExercises: GrammarExercise[];
  quizScore?: number;
  completed: boolean;
}
