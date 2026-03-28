import mitt from 'mitt';
import type { DictationMode } from '../lib/types';
export type { DictationMode } from '../lib/types';

type AppEvents = {
  'flashcard:correct': { wordId: string; rating: 0 | 2 | 4 | 5 };
  'flashcard:incorrect': { wordId: string };
  'quiz:complete': { lessonId: string; correct: number; total: number };
  'lesson:complete': { lessonId: string };
  'word:learned': { wordId: string };
  'word:mastered': { wordId: string };
  'daily_goal:met': {};
  'streak:updated': { current: number };
  // Phase 4 events
  'dictation:correct': { wordId: string; mode: DictationMode };
  'dictation:incorrect': { wordId: string; mode: DictationMode };
  'dictation:session_complete': { correct: number; total: number; mode: DictationMode };
  'daily_challenge:complete': { date: string; score: number };
  'pronunciation:correct': { wordId: string };
  'pronunciation:incorrect': { wordId: string };
};

export type AppEventTypes = AppEvents;
export const eventBus = mitt<AppEvents>();
