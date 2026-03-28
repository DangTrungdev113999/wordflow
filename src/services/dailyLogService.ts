import { db } from '../db/database';
import { getTodayString } from '../lib/utils';
import type { DailyLog } from '../db/models';

async function ensureTodayLog(): Promise<DailyLog> {
  const today = getTodayString();
  let log = await db.dailyLogs.get(today);
  if (!log) {
    log = {
      date: today,
      wordsLearned: 0,
      wordsReviewed: 0,
      grammarCompleted: 0,
      quizAccuracy: 0,
      xpEarned: 0,
      minutesSpent: 0,
    };
    await db.dailyLogs.add(log);
  }
  return log;
}

export async function logWordLearned(xp: number): Promise<void> {
  const log = await ensureTodayLog();
  await db.dailyLogs.put({
    ...log,
    wordsLearned: log.wordsLearned + 1,
    xpEarned: log.xpEarned + xp,
  });
}

export async function logWordReviewed(xp: number): Promise<void> {
  const log = await ensureTodayLog();
  await db.dailyLogs.put({
    ...log,
    wordsReviewed: log.wordsReviewed + 1,
    xpEarned: log.xpEarned + xp,
  });
}

export async function logQuizCompleted(correctCount: number, totalCount: number, xp: number): Promise<void> {
  const log = await ensureTodayLog();
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  // Average accuracy if multiple quizzes in a day
  const newAccuracy = log.grammarCompleted > 0
    ? Math.round((log.quizAccuracy * log.grammarCompleted + accuracy) / (log.grammarCompleted + 1))
    : accuracy;
  await db.dailyLogs.put({
    ...log,
    grammarCompleted: log.grammarCompleted + 1,
    quizAccuracy: newAccuracy,
    xpEarned: log.xpEarned + xp,
  });
}

export async function logBonusXP(xp: number): Promise<void> {
  const log = await ensureTodayLog();
  await db.dailyLogs.put({
    ...log,
    xpEarned: log.xpEarned + xp,
  });
}

export async function logPronunciation(correct: boolean, xp: number): Promise<void> {
  const log = await ensureTodayLog();
  await db.dailyLogs.put({
    ...log,
    pronunciationCorrect: (log.pronunciationCorrect ?? 0) + (correct ? 1 : 0),
    xpEarned: log.xpEarned + xp,
  });
}

export async function logDictation(correct: boolean, xp: number): Promise<void> {
  const log = await ensureTodayLog();
  await db.dailyLogs.put({
    ...log,
    dictationAttempts: (log.dictationAttempts ?? 0) + 1,
    dictationCorrect: (log.dictationCorrect ?? 0) + (correct ? 1 : 0),
    xpEarned: log.xpEarned + xp,
  });
}

export async function logStudyMinutes(minutes: number): Promise<void> {
  if (minutes <= 0) return;
  const log = await ensureTodayLog();
  await db.dailyLogs.put({
    ...log,
    minutesSpent: log.minutesSpent + minutes,
  });
}
