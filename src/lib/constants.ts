import type { FlashcardRating } from './types';

export const XP_VALUES = {
  flashcard_correct: 10,
  flashcard_easy: 15,
  flashcard_hard: 5,
  quiz_correct: 10,
  quiz_perfect_score: 50,
  lesson_complete: 30,
  daily_goal_met: 100,
  streak_bonus: (streak: number) => Math.min(streak * 5, 50),
  speed_bonus: 5,
  // Phase 4
  dictation_correct: 10,
  dictation_session_perfect: 30,
  daily_challenge_complete: 75,
  pronunciation_correct: 5,
  // Phase 6 — AI Features
  chat_message_sent: 5,
  chat_no_correction_bonus: 10,
  // Phase 13 — Usage Quiz
  usage_quiz_correct: 10,
  // Phase 14 — Hint penalties (negative)
  hint_first_letter: -2,
  hint_ipa: -3,
  hint_meaning: -4,
  hint_slow_replay: -1,
  // Phase 14-3 — Conversation + Story Listening
  listening_comprehension_correct: 15,
  listening_comprehension_perfect: 20,
  // Phase 14-4 — Accent Exposure + Note-taking
  accent_correct: 10,
  accent_new_bonus: 5,
  accent_session_perfect: 30,
  note_taking_per_point: 20,
} as const;

/**
 * SM-2 rating mapping per learning mode.
 * Flashcard uses self-reported ratings (0/2/4/5).
 * Quiz/context modes map binary correct/incorrect → SM-2 quality.
 */
export const MODE_RATING_MAP: Record<string, { correct: FlashcardRating; incorrect: FlashcardRating }> = {
  quiz:      { correct: 4, incorrect: 0 },
  context:   { correct: 4, incorrect: 0 },
  spelling:  { correct: 5, incorrect: 0 },
  match:     { correct: 4, incorrect: 0 },
};

/** Timer duration per mode (seconds per question) */
export const TIMED_DURATION: Record<string, number> = {
  quiz: 10,
  spelling: 15,
};

export const LEVELS = [
  { level: 1, xpRequired: 0, title: 'Beginner' },
  { level: 2, xpRequired: 200, title: 'Learner' },
  { level: 3, xpRequired: 500, title: 'Explorer' },
  { level: 4, xpRequired: 1000, title: 'Achiever' },
  { level: 5, xpRequired: 2000, title: 'Scholar' },
  { level: 6, xpRequired: 4000, title: 'Expert' },
  { level: 7, xpRequired: 7000, title: 'Master' },
  { level: 8, xpRequired: 10000, title: 'Legend' },
] as const;

export const DEFAULT_DAILY_GOAL = 10;
export const DEFAULT_EASE_FACTOR = 2.5;
export const MIN_EASE_FACTOR = 1.3;

export const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';
export const DATAMUSE_API_BASE = 'https://api.datamuse.com/words';

export const CEFR_LEVELS: readonly string[] = ['A1', 'A2', 'B1', 'B2'];

export const TOPIC_ICONS: Record<string, string> = {
  'daily-life': '🏠',
  'food-drink': '🍔',
  'travel': '✈️',
  'business': '💼',
  'technology': '💻',
  'health': '❤️',
  'education': '📚',
  'sports': '⚽',
  'emotions': '😊',
  'nature': '🌿',
  'shopping': '🛍️',
  'home': '🏡',
  'work': '👔',
  'family': '👨‍👩‍👧‍👦',
  'clothing': '👗',
  'transportation': '🚌',
  'entertainment': '🎬',
  'communication': '💬',
  'time-numbers': '⏰',
  'environment': '🌍',
};

export const TOPIC_COLORS: Record<string, string> = {
  'daily-life': 'from-blue-400 to-blue-600',
  'food-drink': 'from-orange-400 to-red-500',
  'travel': 'from-green-400 to-teal-500',
  'business': 'from-purple-400 to-purple-600',
  'technology': 'from-cyan-400 to-blue-500',
  'health': 'from-pink-400 to-rose-500',
  'education': 'from-amber-400 to-orange-500',
  'sports': 'from-emerald-400 to-green-600',
  'emotions': 'from-rose-400 to-pink-500',
  'nature': 'from-lime-400 to-green-500',
  'shopping': 'from-fuchsia-400 to-pink-500',
  'home': 'from-yellow-400 to-amber-500',
  'work': 'from-slate-400 to-gray-600',
  'family': 'from-sky-400 to-blue-500',
  'clothing': 'from-violet-400 to-purple-500',
  'transportation': 'from-red-400 to-orange-500',
  'entertainment': 'from-indigo-400 to-violet-500',
  'communication': 'from-teal-400 to-cyan-500',
  'time-numbers': 'from-gray-400 to-slate-500',
  'environment': 'from-green-500 to-emerald-600',
};
