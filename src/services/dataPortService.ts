import { db } from '../db/database';
import type { UserProfile, WordProgress, GrammarLesson, DailyLog, DictionaryCache, DailyChallengeLog } from '../db/models';
import { parseCSV } from '../lib/csvParser';

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
    dailyChallenges?: DailyChallengeLog[];
  };
}

export async function exportAllData(): Promise<ExportData> {
  const userProfile = await db.userProfile.get('default');
  if (!userProfile) throw new Error('No user profile found');

  const [wordProgress, grammarLessons, dailyLogs, dictionaryCache, dailyChallenges] = await Promise.all([
    db.wordProgress.toArray(),
    db.grammarLessons.toArray(),
    db.dailyLogs.toArray(),
    db.dictionaryCache.toArray(),
    db.dailyChallenges.toArray(),
  ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'WordFlow',
    data: { userProfile, wordProgress, grammarLessons, dailyLogs, dictionaryCache, dailyChallenges },
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

  // Validate dailyChallenges (optional for backward compat)
  if (data.dailyChallenges && Array.isArray(data.dailyChallenges)) {
    const challenges = data.dailyChallenges as Array<Record<string, unknown>>;
    for (let i = 0; i < challenges.length; i++) {
      if (typeof challenges[i].date !== 'string' || !dateRegex.test(challenges[i].date as string)) {
        errors.push(`dailyChallenges[${i}].date must match format YYYY-MM-DD`);
      }
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
  await db.transaction('rw', [db.userProfile, db.wordProgress, db.grammarLessons, db.dailyLogs, db.dictionaryCache, db.dailyChallenges], async () => {
    await Promise.all([
      db.userProfile.clear(),
      db.wordProgress.clear(),
      db.grammarLessons.clear(),
      db.dailyLogs.clear(),
      db.dictionaryCache.clear(),
      db.dailyChallenges.clear(),
    ]);

    await db.userProfile.add(data.userProfile);
    if (data.wordProgress.length) await db.wordProgress.bulkAdd(data.wordProgress);
    if (data.grammarLessons.length) await db.grammarLessons.bulkAdd(data.grammarLessons);
    if (data.dailyLogs.length) await db.dailyLogs.bulkAdd(data.dailyLogs);
    if (data.dictionaryCache?.length) await db.dictionaryCache.bulkAdd(data.dictionaryCache);
    if (data.dailyChallenges?.length) await db.dailyChallenges.bulkAdd(data.dailyChallenges);
  });
}

// --- Custom Topic Export/Import ---

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  words: Array<{ word: string; meaning: string; ipa: string; example: string; audioUrl: string | null }>;
}

function escapeCSV(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export async function exportCustomTopicCSV(topicId: number): Promise<string> {
  const words = await db.customWords.where('topicId').equals(topicId).toArray();

  const header = 'word,meaning,ipa,example';
  const rows = words.map(w =>
    [w.word, w.meaning, w.ipa, w.example]
      .map(v => escapeCSV(v ?? ''))
      .join(',')
  );

  return [header, ...rows].join('\n');
}

export async function exportCustomTopicJSON(topicId: number): Promise<object> {
  const topic = await db.customTopics.get(topicId);
  const words = await db.customWords.where('topicId').equals(topicId).toArray();

  return {
    version: 1,
    app: 'WordFlow',
    type: 'custom_topic',
    exportedAt: new Date().toISOString(),
    topic: { name: topic?.name, icon: topic?.icon },
    words: words.map(w => ({
      word: w.word,
      meaning: w.meaning,
      ipa: w.ipa,
      example: w.example,
      audioUrl: w.audioUrl,
    })),
  };
}

export function importCustomTopicCSV(
  csv: string,
  existingWords: Set<string>,
): ImportResult {
  const errors: string[] = [];

  let parsed: { headers: string[]; rows: Record<string, string>[] };
  try {
    parsed = parseCSV(csv);
  } catch {
    return { success: false, imported: 0, skipped: 0, errors: ['Invalid CSV format'], words: [] };
  }

  if (!parsed.headers.includes('word')) {
    errors.push("CSV must have 'word' column");
  }
  if (!parsed.headers.includes('meaning')) {
    errors.push("CSV must have 'meaning' column");
  }
  if (errors.length > 0) {
    return { success: false, imported: 0, skipped: 0, errors, words: [] };
  }

  const words: ImportResult['words'] = [];
  let skipped = 0;

  for (const row of parsed.rows) {
    const word = row['word']?.trim();
    if (!word) continue;

    if (existingWords.has(word.toLowerCase())) {
      skipped++;
      continue;
    }

    words.push({
      word,
      meaning: row['meaning']?.trim() ?? '',
      ipa: row['ipa']?.trim() ?? '',
      example: row['example']?.trim() ?? '',
      audioUrl: null,
    });
  }

  return { success: true, imported: words.length, skipped, errors: [], words };
}

export function importCustomTopicJSON(
  json: string,
  existingWords: Set<string>,
): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { success: false, imported: 0, skipped: 0, errors: ['Invalid JSON'], words: [] };
  }

  const obj = parsed as Record<string, unknown>;

  const errors: string[] = [];
  if (obj.version !== 1) errors.push('version must be 1');
  if (obj.app !== 'WordFlow') errors.push('app must be "WordFlow"');
  if (obj.type !== 'custom_topic') errors.push('type must be "custom_topic"');

  if (!Array.isArray(obj.words)) {
    errors.push('Missing words array');
  }

  if (errors.length > 0) {
    return { success: false, imported: 0, skipped: 0, errors, words: [] };
  }

  const rawWords = obj.words as Array<Record<string, unknown>>;
  const words: ImportResult['words'] = [];
  let skipped = 0;

  for (const w of rawWords) {
    const word = (typeof w.word === 'string' ? w.word : '').trim();
    if (!word) continue;

    if (existingWords.has(word.toLowerCase())) {
      skipped++;
      continue;
    }

    words.push({
      word,
      meaning: typeof w.meaning === 'string' ? w.meaning : '',
      ipa: typeof w.ipa === 'string' ? w.ipa : '',
      example: typeof w.example === 'string' ? w.example : '',
      audioUrl: typeof w.audioUrl === 'string' ? w.audioUrl : null,
    });
  }

  return { success: true, imported: words.length, skipped, errors: [], words };
}

export async function performCustomImport(
  topicId: number,
  words: ImportResult['words'],
): Promise<void> {
  await db.customWords.bulkAdd(
    words.map(w => ({
      topicId,
      word: w.word,
      meaning: w.meaning,
      ipa: w.ipa,
      example: w.example,
      audioUrl: w.audioUrl,
      createdAt: Date.now(),
    }))
  );
}
