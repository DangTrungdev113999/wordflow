import Dexie, { type Table } from 'dexie';
import type { Word, WordProgress, GrammarLesson, DailyLog, UserProfile, DictionaryCache } from './models';

export class WordFlowDatabase extends Dexie {
  words!: Table<Word, string>;
  wordProgress!: Table<WordProgress, string>;
  grammarLessons!: Table<GrammarLesson, string>;
  dailyLogs!: Table<DailyLog, string>;
  userProfile!: Table<UserProfile, string>;
  dictionaryCache!: Table<DictionaryCache, string>;

  constructor() {
    super('WordFlowDB');

    this.version(1).stores({
      words: 'id, topic, cefrLevel',
      wordProgress: 'wordId, nextReview, status',
      grammarLessons: 'id, level, completed',
      dailyLogs: 'date',
      userProfile: 'id',
      dictionaryCache: 'word, cachedAt',
    });
  }
}

export const db = new WordFlowDatabase();

export async function initializeUserProfile(): Promise<void> {
  const existing = await db.userProfile.get('default');
  if (!existing) {
    await db.userProfile.add({
      id: 'default',
      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      dailyGoal: 10,
      theme: 'system',
      badges: [],
      createdAt: Date.now(),
    });
  }
}
