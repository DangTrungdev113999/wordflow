import Dexie, { type Table } from 'dexie';
import type { Word, WordProgress, GrammarLesson, DailyLog, UserProfile, DictionaryCache, DailyChallengeLog, DailyChallengeTask, CustomTopic, CustomWord, ChatConversation, ChatMessage, WritingSubmission, RoleplaySession, MediaSession, EnrichedWord, ContextProgressEntry, GrammarBookmark } from './models';
import type { MultiMeaningWordCache, ConfusingPairCache, PhrasalVerbCache, CollocationCache, GrammarPatternCache } from '../features/word-usage/models';

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
  mediaSessions!: Table<MediaSession, string>;
  enrichedWords!: Table<EnrichedWord, string>;
  contextProgress!: Table<ContextProgressEntry, string>;
  grammarBookmarks!: Table<GrammarBookmark, string>;
  multiMeaningWords!: Table<MultiMeaningWordCache, string>;
  confusingPairsCache!: Table<ConfusingPairCache, number>;
  phrasalVerbs!: Table<PhrasalVerbCache, number>;
  collocations!: Table<CollocationCache, number>;
  grammarPatterns!: Table<GrammarPatternCache, number>;

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

    this.version(5).stores({
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
      mediaSessions: 'id, createdAt',
    });

    // Version 6 — Daily Challenge v2: migrate old 3-task object → 5-task array
    this.version(6).stores({
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
      mediaSessions: 'id, createdAt',
    }).upgrade(tx => {
      return tx.table('dailyChallenges').toCollection().modify((challenge: Record<string, unknown>) => {
        if (!Array.isArray(challenge.tasks)) {
          const oldTasks = challenge.tasks as { learnWord: boolean; grammarQuiz: boolean; dictation: boolean };
          challenge.tasks = [
            { type: 'learnWord', contentId: (challenge.wordId as string) || '', completed: oldTasks.learnWord },
            { type: 'grammarQuiz', contentId: '', completed: oldTasks.grammarQuiz },
            { type: 'dictation', contentId: '', completed: oldTasks.dictation },
          ] satisfies DailyChallengeTask[];
          delete challenge.wordId;
        }
      });
    });

    // Version 7 — Vocabulary Upgrade: enriched word cache
    this.version(7).stores({
      enrichedWords: 'word, updatedAt',
    });

    // Version 8 — Phase 10-4: Context Progress (Active Recall + Context Mastery)
    this.version(8).stores({
      contextProgress: 'wordId, contextMastered, lastUpdated',
    });

    // Version 9 — Phase 11: Grammar Bookmarks
    this.version(9).stores({
      grammarBookmarks: '&lessonId, createdAt',
    });

    // Version 10 — Phase 13: Word Usage & Context Guide
    this.version(10).stores({
      multiMeaningWords: 'word, updatedAt',
      confusingPairsCache: '++id, word1, word2, category',
      phrasalVerbs: '++id, baseVerb, particle, updatedAt',
      collocations: '++id, word, category, updatedAt',
      grammarPatterns: '++id, pattern, category',
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
