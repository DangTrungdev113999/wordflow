import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { movingAverage, getHeatmapIntensity, useAnalytics } from '../useAnalytics';
import { db } from '../../../../db/database';
import type { WordProgress, DailyLog } from '../../../../db/models';

function makeDailyLog(overrides: Partial<DailyLog> & { date: string }): DailyLog {
  return {
    wordsLearned: 0,
    wordsReviewed: 0,
    grammarCompleted: 0,
    quizAccuracy: 0,
    xpEarned: 0,
    minutesSpent: 0,
    ...overrides,
  };
}

function makeWordProgress(overrides: Partial<WordProgress> & { wordId: string }): WordProgress {
  return {
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: Date.now(),
    lastReview: Date.now(),
    status: 'new',
    ...overrides,
  };
}

describe('movingAverage', () => {
  it('computes 3-day moving average correctly', () => {
    const data = [10, 20, 30, 40, 50];
    const result = movingAverage(data, 3);
    expect(result[0]).toBe(10); // [10]
    expect(result[1]).toBe(15); // [10,20] / 2
    expect(result[2]).toBe(20); // [10,20,30] / 3
    expect(result[3]).toBe(30); // [20,30,40] / 3
    expect(result[4]).toBe(40); // [30,40,50] / 3
  });

  it('handles single element', () => {
    expect(movingAverage([42], 3)).toEqual([42]);
  });

  it('handles empty array', () => {
    expect(movingAverage([], 3)).toEqual([]);
  });
});

describe('getHeatmapIntensity', () => {
  it('returns 0 for 0 XP', () => {
    expect(getHeatmapIntensity(0)).toBe(0);
  });

  it('returns 1 for 1-20 XP', () => {
    expect(getHeatmapIntensity(1)).toBe(1);
    expect(getHeatmapIntensity(20)).toBe(1);
  });

  it('returns 2 for 21-50 XP', () => {
    expect(getHeatmapIntensity(21)).toBe(2);
    expect(getHeatmapIntensity(50)).toBe(2);
  });

  it('returns 3 for 51-100 XP', () => {
    expect(getHeatmapIntensity(51)).toBe(3);
    expect(getHeatmapIntensity(100)).toBe(3);
  });

  it('returns 4 for 101+ XP', () => {
    expect(getHeatmapIntensity(101)).toBe(4);
    expect(getHeatmapIntensity(500)).toBe(4);
  });
});

describe('useAnalytics hook', () => {
  beforeEach(async () => {
    await db.wordProgress.clear();
    await db.dailyLogs.clear();
  });

  it('returns empty data when no records exist', async () => {
    const { result } = renderHook(() => useAnalytics());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.weakAreas).toEqual([]);
    expect(result.current.accuracyTrend).toEqual([]);
    expect(result.current.heatmapData.length).toBe(91);
    expect(result.current.heatmapData.every((d) => d.intensity === 0)).toBe(true);
    expect(result.current.masteryBreakdown.every((d) => d.count === 0)).toBe(true);
    expect(result.current.skillRadar.every((d) => d.score === 0)).toBe(true);
  });

  it('sorts weak areas by ascending easeFactor', async () => {
    await db.wordProgress.bulkAdd([
      makeWordProgress({ wordId: 'travel:airport', easeFactor: 1.5, status: 'learning' }),
      makeWordProgress({ wordId: 'travel:hotel', easeFactor: 1.8, status: 'learning' }),
      makeWordProgress({ wordId: 'food-drink:coffee', easeFactor: 3.0, status: 'mastered' }),
      makeWordProgress({ wordId: 'health:doctor', easeFactor: 2.0, status: 'review' }),
    ]);

    const { result } = renderHook(() => useAnalytics());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.weakAreas[0].topic).toBe('travel');
    expect(result.current.weakAreas[0].avgEase).toBeCloseTo(1.65, 1);
    expect(result.current.weakAreas[1].topic).toBe('health');
    expect(result.current.weakAreas[2].topic).toBe('food-drink');
  });

  it('counts mastery breakdown by status', async () => {
    await db.wordProgress.bulkAdd([
      makeWordProgress({ wordId: 'a:w1', status: 'new' }),
      makeWordProgress({ wordId: 'a:w2', status: 'new' }),
      makeWordProgress({ wordId: 'a:w3', status: 'learning' }),
      makeWordProgress({ wordId: 'a:w4', status: 'mastered' }),
    ]);

    const { result } = renderHook(() => useAnalytics());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const breakdown = result.current.masteryBreakdown;
    expect(breakdown.find((d) => d.status === 'New')?.count).toBe(2);
    expect(breakdown.find((d) => d.status === 'Learning')?.count).toBe(1);
    expect(breakdown.find((d) => d.status === 'Review')?.count).toBe(0);
    expect(breakdown.find((d) => d.status === 'Mastered')?.count).toBe(1);
  });

  it('computes skill radar scores capped at 100', async () => {
    const today = new Date();
    const logs: DailyLog[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      logs.push(
        makeDailyLog({
          date: d.toISOString().slice(0, 10),
          wordsLearned: 30,
          wordsReviewed: 30,
          grammarCompleted: 10,
          dictationAttempts: 10,
          dictationCorrect: 10,
          pronunciationCorrect: 20,
        })
      );
    }
    await db.dailyLogs.bulkAdd(logs);

    const { result } = renderHook(() => useAnalytics());
    await waitFor(() => expect(result.current.loading).toBe(false));

    for (const skill of result.current.skillRadar) {
      expect(skill.score).toBeLessThanOrEqual(100);
      expect(skill.score).toBeGreaterThan(0);
    }
  });

  it('computes accuracy trend with smoothing', async () => {
    const today = new Date();
    const logs: DailyLog[] = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      logs.push(makeDailyLog({ date: d.toISOString().slice(0, 10), quizAccuracy: (5 - i) * 20 }));
    }
    await db.dailyLogs.bulkAdd(logs);

    const { result } = renderHook(() => useAnalytics());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.accuracyTrend.length).toBe(5);
    // First entry smoothed = raw (only 1 point)
    expect(result.current.accuracyTrend[0].smoothed).toBe(result.current.accuracyTrend[0].accuracy);
    // Third entry smoothed = avg of first 3
    const third = result.current.accuracyTrend[2];
    const expectedSmoothed = (result.current.accuracyTrend[0].accuracy + result.current.accuracyTrend[1].accuracy + third.accuracy) / 3;
    expect(third.smoothed).toBeCloseTo(expectedSmoothed, 0);
  });
});
