import Dexie, { type Table } from 'dexie';
import type { Word, WordProgress, GrammarLesson, DailyLog, UserProfile, DictionaryCache, DailyChallengeLog, CustomTopic, CustomWord, ChatConversation, ChatMessage, WritingSubmission, RoleplaySession } from './models';

export class WordFlowDatabase extends Dexie {
  words!: Table<Word, string>;
  wordProgress!: Table<WordProgress, string>;
  grammarLessons!: Table<GrammarLesson, string>;
  dailyLogs!: Table<DailyLog, string>;
  userProfile!: Table<UserProfile, string>;
  dictionaryCache!: Table<DictionaryCache, string>;
  dailyChallenges!: Table<DailyChallengeLog, string>;
  customTopics!: Table<CustomTopic, number>;
  customWords!: Table<CustomWord, number>;
  chatConversations!: Table<ChatConversation, string>;
  chatMessages!: Table<ChatMessage, string>;
  writingSubmissions!: Table<WritingSubmission, string>;
  roleplaySessions!: Table<RoleplaySession, string>;

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

    this.version(2).stores({
      words: 'id, topic, cefrLevel',
      wordProgress: 'wordId, nextReview, status',
      grammarLessons: 'id, level, completed',
      dailyLogs: 'date',
      userProfile: 'id',
      dictionaryCache: 'word, cachedAt',
      dailyChallenges: 'date',
    });

    this.version(3).stores({
      words: 'id, topic, cefrLevel',
      wordProgress: 'wordId, nextReview, status',
      grammarLessons: 'id, level, completed',
      dailyLogs: 'date',
      userProfile: 'id',
      dictionaryCache: 'word, cachedAt',
      dailyChallenges: 'date',
      customTopics: '++id, name, createdAt',
      customWords: '++id, topicId, word, createdAt',
    });

    this.version(4).stores({
      words: 'id, topic, cefrLevel',
      wordProgress: 'wordId, nextReview, status',
      grammarLessons: 'id, level, completed',
      dailyLogs: 'date',
      userProfile: 'id',
      dictionaryCache: 'word, cachedAt',
      dailyChallenges: 'date',
      customTopics: '++id, name, createdAt',
      customWords: '++id, topicId, word, createdAt',
      chatConversations: 'id, updatedAt',
      chatMessages: 'id, conversationId, timestamp',
      writingSubmissions: 'id, promptId, submittedAt',
      roleplaySessions: 'id, scenarioId, completedAt',
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
