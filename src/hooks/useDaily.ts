import { useEffect } from 'react';
import { useProgressStore } from '../stores/progressStore';
import { getTodayString, getYesterdayString } from '../lib/utils';
import { db } from '../db/database';

export function useDaily() {
  const { lastActiveDate, currentStreak, setStreak, setLastActiveDate, resetDailyCounters } =
    useProgressStore();

  useEffect(() => {
    const today = getTodayString();
    const yesterday = getYesterdayString();

    if (lastActiveDate === today) {
      // Already active today, nothing to do
      return;
    }

    if (lastActiveDate !== yesterday && lastActiveDate !== '') {
      // Streak broken
      setStreak(0);
    }

    resetDailyCounters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const recordActivity = async () => {
    const today = getTodayString();
    if (lastActiveDate === today) return;

    const newStreak = lastActiveDate === getYesterdayString()
      ? currentStreak + 1
      : 1;

    setStreak(newStreak);
    setLastActiveDate(today);

    // Ensure DailyLog exists for today
    const existing = await db.dailyLogs.get(today);
    if (!existing) {
      await db.dailyLogs.add({
        date: today,
        wordsLearned: 0,
        wordsReviewed: 0,
        grammarCompleted: 0,
        quizAccuracy: 0,
        xpEarned: 0,
        minutesSpent: 0,
      });
    }
  };

  return { recordActivity };
}
