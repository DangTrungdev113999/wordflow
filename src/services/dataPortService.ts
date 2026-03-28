import { db } from '../db/database';
import type { UserProfile, WordProgress, GrammarLesson, DailyLog, DictionaryCache } from '../db/models';

export interface ExportData {
  version: 1;
  exportedAt: string;
  app: 'WordFlow';
  data: {
    userProfile: UserProfile;
    wordProgress: WordProgress[];
    grammarLessons: GrammarLesson[];
    dailyLogs: DailyLog[];
    dictionaryCache: DictionaryCache[];
  };
}

export async function exportAllData(): Promise<ExportData> {
  const userProfile = await db.userProfile.get('default');
  if (!userProfile) throw new Error('No user profile found');

  const [wordProgress, grammarLessons, dailyLogs, dictionaryCache] = await Promise.all([
    db.wordProgress.toArray(),
    db.grammarLessons.toArray(),
    db.dailyLogs.toArray(),
    db.dictionaryCache.toArray(),
  ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'WordFlow',
    data: { userProfile, wordProgress, grammarLessons, dailyLogs, dictionaryCache },
  };
}

export async function importData(json: string): Promise<{
  success: boolean;
  stats: { words: number; lessons: number; logs: number };
  errors: string[];
}> {
  const errors: string[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { success: false, stats: { words: 0, lessons: 0, logs: 0 }, errors: ['Invalid JSON'] };
  }

  const obj = parsed as Record<string, unknown>;

  if (obj.version !== 1) errors.push('version must be 1');
  if (obj.app !== 'WordFlow') errors.push('app must be "WordFlow"');

  const data = obj.data as Record<string, unknown> | undefined;
  if (!data || typeof data !== 'object') {
    errors.push('Missing data object');
    return { success: false, stats: { words: 0, lessons: 0, logs: 0 }, errors };
  }

  if (!data.userProfile) errors.push('Missing userProfile');
  if (!Array.isArray(data.wordProgress)) errors.push('Missing wordProgress array');
  if (!Array.isArray(data.grammarLessons)) errors.push('Missing grammarLessons array');
  if (!Array.isArray(data.dailyLogs)) errors.push('Missing dailyLogs array');

  if (errors.length > 0) {
    return { success: false, stats: { words: 0, lessons: 0, logs: 0 }, errors };
  }

  // Validate userProfile
  const profile = data.userProfile as Record<string, unknown>;
  const requiredProfileFields = ['id', 'xp', 'level', 'currentStreak', 'dailyGoal', 'theme', 'badges'];
  for (const field of requiredProfileFields) {
    if (!(field in profile)) errors.push(`userProfile missing field: ${field}`);
  }

  // Validate wordProgress
  const wp = data.wordProgress as Array<Record<string, unknown>>;
  for (let i = 0; i < wp.length; i++) {
    if (typeof wp[i].wordId !== 'string' || !(wp[i].wordId as string).includes(':')) {
      errors.push(`wordProgress[${i}].wordId must match format "topic:word"`);
    }
    if (typeof wp[i].easeFactor !== 'number' || (wp[i].easeFactor as number) < 1.3) {
      errors.push(`wordProgress[${i}].easeFactor must be >= 1.3`);
    }
  }

  // Validate dailyLogs
  const logs = data.dailyLogs as Array<Record<string, unknown>>;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  for (let i = 0; i < logs.length; i++) {
    if (typeof logs[i].date !== 'string' || !dateRegex.test(logs[i].date as string)) {
      errors.push(`dailyLogs[${i}].date must match format YYYY-MM-DD`);
    }
  }

  const stats = {
    words: wp.length,
    lessons: (data.grammarLessons as unknown[]).length,
    logs: logs.length,
  };

  return { success: errors.length === 0, stats, errors };
}

export async function performImport(data: ExportData['data']): Promise<void> {
  await db.transaction('rw', [db.userProfile, db.wordProgress, db.grammarLessons, db.dailyLogs, db.dictionaryCache], async () => {
    await Promise.all([
      db.userProfile.clear(),
      db.wordProgress.clear(),
      db.grammarLessons.clear(),
      db.dailyLogs.clear(),
      db.dictionaryCache.clear(),
    ]);

    await db.userProfile.add(data.userProfile);
    if (data.wordProgress.length) await db.wordProgress.bulkAdd(data.wordProgress);
    if (data.grammarLessons.length) await db.grammarLessons.bulkAdd(data.grammarLessons);
    if (data.dailyLogs.length) await db.dailyLogs.bulkAdd(data.dailyLogs);
    if (data.dictionaryCache?.length) await db.dictionaryCache.bulkAdd(data.dictionaryCache);
  });
}
