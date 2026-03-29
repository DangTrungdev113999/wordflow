import mitt from 'mitt';
import type { DictationMode } from '../lib/types';
import type { MistakeCollectedEvent } from '../models/Mistake';
export type { DictationMode } from '../lib/types';

type AppEvents = {
  'flashcard:correct': { wordId: string; rating: 0 | 2 | 4 | 5; multiplier?: number };
  'flashcard:incorrect': { wordId: string };
  'quiz:complete': { lessonId: string; correct: number; total: number };
  'lesson:complete': { lessonId: string };
  'word:learned': { wordId: string };
  'word:mastered': { wordId: string };
  'daily_goal:met': Record<string, never>;
  'streak:updated': { current: number };
  // Phase 4 events
  'dictation:correct': { wordId: string; mode: DictationMode };
  'dictation:incorrect': { wordId: string; mode: DictationMode };
  'dictation:session_complete': { correct: number; total: number; mode: DictationMode };
  'daily_challenge:complete': { date: string; score: number };
  'pronunciation:correct': { wordId: string };
  'pronunciation:incorrect': { wordId: string };
  // Phase 5 — Reading Comprehension
  'reading:correct': { passageId: string };
  'reading:incorrect': { passageId: string };
  'reading:session_complete': { correct: number; total: number; passageId: string };
  // Phase 6 — AI Features
  'chat:message-sent': { corrections: number };
  'writing:submitted': { score: number; wordCount: number };
  'roleplay:completed': { scenarioId: string; goalCompleted: boolean; fluency: number };
  // Phase 8 — Mistake Journal
  'mistakes:collected': MistakeCollectedEvent;
  // Phase 9 — Celebrations
  'achievement:unlocked': { id: string };
};

export type AppEventTypes = AppEvents;
export const eventBus = mitt<AppEvents>();
