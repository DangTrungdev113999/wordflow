import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../../db/database';
import { exportAllData, importData } from '../dataPortService';

describe('dataPortService', () => {
  beforeEach(async () => {
    // Ensure DB is open and clean
    if (!db.isOpen()) await db.open();
    await db.userProfile.clear();
    await db.wordProgress.clear();
    await db.grammarLessons.clear();
    await db.dailyLogs.clear();
    await db.dictionaryCache.clear();
    await db.dailyChallenges.clear();

    // Seed default profile
    await db.userProfile.add({
      id: 'default',
      xp: 100,
      level: 2,
      currentStreak: 3,
      longestStreak: 5,
      lastActiveDate: '2026-03-28',
      dailyGoal: 10,
      theme: 'system',
      badges: ['first_word'],
      createdAt: Date.now(),
    });
  });

  describe('exportAllData', () => {
    it('returns correct structure', async () => {
      const data = await exportAllData();
      expect(data.version).toBe(1);
      expect(data.app).toBe('WordFlow');
      expect(data.exportedAt).toBeTruthy();
      expect(data.data.userProfile).toBeTruthy();
      expect(Array.isArray(data.data.wordProgress)).toBe(true);
      expect(Array.isArray(data.data.grammarLessons)).toBe(true);
      expect(Array.isArray(data.data.dailyLogs)).toBe(true);
    });
  });

  describe('importData', () => {
    it('rejects invalid JSON', async () => {
      const result = await importData('not json');
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('rejects wrong version', async () => {
      const data = { version: 99, app: 'WordFlow', data: {} };
      const result = await importData(JSON.stringify(data));
      expect(result.success).toBe(false);
    });

    it('rejects wrong app name', async () => {
      const data = { version: 1, app: 'OtherApp', data: {} };
      const result = await importData(JSON.stringify(data));
      expect(result.success).toBe(false);
    });

    it('validates wordId format', async () => {
      const data = {
        version: 1,
        app: 'WordFlow',
        exportedAt: new Date().toISOString(),
        data: {
          userProfile: { id: 'default', xp: 0, level: 1, currentStreak: 0, longestStreak: 0, lastActiveDate: '', dailyGoal: 10, theme: 'system', badges: [], createdAt: 0 },
          wordProgress: [{ wordId: 'invalid-no-colon', easeFactor: 2.5, interval: 1, repetitions: 0, nextReview: 0, lastReview: 0, status: 'new' }],
          grammarLessons: [],
          dailyLogs: [],
        },
      };
      const result = await importData(JSON.stringify(data));
      expect(result.success).toBe(false);
      expect(result.errors.some((e: string) => e.includes('wordId'))).toBe(true);
    });

    it('validates easeFactor >= 1.3', async () => {
      const data = {
        version: 1,
        app: 'WordFlow',
        exportedAt: new Date().toISOString(),
        data: {
          userProfile: { id: 'default', xp: 0, level: 1, currentStreak: 0, longestStreak: 0, lastActiveDate: '', dailyGoal: 10, theme: 'system', badges: [], createdAt: 0 },
          wordProgress: [{ wordId: 'topic:word', easeFactor: 0.5, interval: 1, repetitions: 0, nextReview: 0, lastReview: 0, status: 'new' }],
          grammarLessons: [],
          dailyLogs: [],
        },
      };
      const result = await importData(JSON.stringify(data));
      expect(result.success).toBe(false);
      expect(result.errors.some((e: string) => e.includes('easeFactor'))).toBe(true);
    });

    it('accepts valid data and returns stats', async () => {
      const data = {
        version: 1,
        app: 'WordFlow',
        exportedAt: new Date().toISOString(),
        data: {
          userProfile: { id: 'default', xp: 100, level: 2, currentStreak: 3, longestStreak: 5, lastActiveDate: '2026-03-28', dailyGoal: 10, theme: 'system', badges: [], createdAt: 0 },
          wordProgress: [{ wordId: 'topic:word', easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: 0, lastReview: 0, status: 'learning' }],
          grammarLessons: [],
          dailyLogs: [{ date: '2026-03-28', wordsLearned: 5, wordsReviewed: 3, grammarCompleted: 1, quizAccuracy: 80, xpEarned: 50, minutesSpent: 10 }],
        },
      };
      const result = await importData(JSON.stringify(data));
      expect(result.success).toBe(true);
      expect(result.stats.words).toBe(1);
      expect(result.stats.logs).toBe(1);
    });
  });
});
