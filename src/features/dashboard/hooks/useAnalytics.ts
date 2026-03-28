import { useEffect, useState } from 'react';
import { db } from '../../../db/database';
import type { DailyLog, WordProgress } from '../../../db/models';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';

export interface AnalyticsData {
  weakAreas: Array<{ topic: string; topicLabel: string; avgEase: number; wordCount: number }>;
  accuracyTrend: Array<{ date: string; accuracy: number; smoothed: number }>;
  skillRadar: Array<{ skill: string; score: number }>;
  heatmapData: Array<{ date: string; intensity: number }>;
  masteryBreakdown: Array<{ status: string; count: number; color: string }>;
}

const topicLabelMap = new Map(ALL_TOPICS.map((t) => [t.topic, t.topicLabel]));

export function movingAverage(data: number[], window: number): number[] {
  return data.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

export function getHeatmapIntensity(xp: number): number {
  if (xp === 0) return 0;
  if (xp <= 20) return 1;
  if (xp <= 50) return 2;
  if (xp <= 100) return 3;
  return 4;
}

function computeWeakAreas(progress: WordProgress[]) {
  const byTopic = new Map<string, { totalEase: number; count: number }>();
  for (const wp of progress) {
    const topic = wp.wordId.split(':')[0];
    const entry = byTopic.get(topic) ?? { totalEase: 0, count: 0 };
    entry.totalEase += wp.easeFactor;
    entry.count += 1;
    byTopic.set(topic, entry);
  }

  return Array.from(byTopic.entries())
    .map(([topic, { totalEase, count }]) => ({
      topic,
      topicLabel: topicLabelMap.get(topic) ?? topic,
      avgEase: totalEase / count,
      wordCount: count,
    }))
    .sort((a, b) => a.avgEase - b.avgEase)
    .slice(0, 5);
}

function computeAccuracyTrend(logs: DailyLog[]) {
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const rawAccuracies = sorted.map((l) => l.quizAccuracy);
  const smoothed = movingAverage(rawAccuracies, 3);

  return sorted.map((log, i) => ({
    date: log.date,
    accuracy: log.quizAccuracy,
    smoothed: Math.round(smoothed[i] * 10) / 10,
  }));
}

function computeSkillRadar(logs: DailyLog[]) {
  const totalVocab = logs.reduce((s, l) => s + l.wordsLearned + l.wordsReviewed, 0);
  const vocabScore = Math.min(100, (totalVocab / (14 * 20)) * 100);

  const totalGrammar = logs.reduce((s, l) => s + l.grammarCompleted, 0);
  const grammarScore = Math.min(100, (totalGrammar / (14 * 3)) * 100);

  const listeningAccuracies = logs
    .filter((l) => (l.dictationAttempts ?? 0) > 0)
    .map((l) => (l.dictationCorrect ?? 0) / Math.max(l.dictationAttempts ?? 0, 1));
  const listeningScore =
    listeningAccuracies.length > 0
      ? Math.min(100, (listeningAccuracies.reduce((s, v) => s + v, 0) / listeningAccuracies.length) * 100)
      : 0;

  const totalPronunciation = logs.reduce((s, l) => s + (l.pronunciationCorrect ?? 0), 0);
  const pronunciationScore = Math.min(100, (totalPronunciation / (14 * 10)) * 100);

  return [
    { skill: 'Vocabulary', score: Math.round(vocabScore) },
    { skill: 'Grammar', score: Math.round(grammarScore) },
    { skill: 'Listening', score: Math.round(listeningScore) },
    { skill: 'Pronunciation', score: Math.round(pronunciationScore) },
  ];
}

function computeHeatmap(logs: DailyLog[]) {
  const logMap = new Map(logs.map((l) => [l.date, l.xpEarned]));
  const today = new Date();
  const days: Array<{ date: string; intensity: number }> = [];

  for (let i = 90; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const xp = logMap.get(dateStr) ?? 0;
    days.push({ date: dateStr, intensity: getHeatmapIntensity(xp) });
  }

  return days;
}

function computeMastery(progress: WordProgress[]) {
  const counts = { new: 0, learning: 0, review: 0, mastered: 0 };
  for (const wp of progress) {
    if (wp.status in counts) {
      counts[wp.status as keyof typeof counts]++;
    }
  }

  return [
    { status: 'New', count: counts.new, color: '#9ca3af' },
    { status: 'Learning', count: counts.learning, color: '#f59e0b' },
    { status: 'Review', count: counts.review, color: '#3b82f6' },
    { status: 'Mastered', count: counts.mastered, color: '#22c55e' },
  ];
}

export function useAnalytics(): AnalyticsData & { loading: boolean } {
  const [data, setData] = useState<AnalyticsData>({
    weakAreas: [],
    accuracyTrend: [],
    skillRadar: [],
    heatmapData: [],
    masteryBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const today = new Date();

      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysStr = thirtyDaysAgo.toISOString().slice(0, 10);

      const fourteenDaysAgo = new Date(today);
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      const fourteenDaysStr = fourteenDaysAgo.toISOString().slice(0, 10);

      const ninetyDaysAgo = new Date(today);
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const ninetyDaysStr = ninetyDaysAgo.toISOString().slice(0, 10);

      const [allProgress, last30Logs, last14Logs, last90Logs] = await Promise.all([
        db.wordProgress.toArray(),
        db.dailyLogs.where('date').above(thirtyDaysStr).toArray(),
        db.dailyLogs.where('date').above(fourteenDaysStr).toArray(),
        db.dailyLogs.where('date').above(ninetyDaysStr).toArray(),
      ]);

      setData({
        weakAreas: computeWeakAreas(allProgress),
        accuracyTrend: computeAccuracyTrend(last30Logs),
        skillRadar: computeSkillRadar(last14Logs),
        heatmapData: computeHeatmap(last90Logs),
        masteryBreakdown: computeMastery(allProgress),
      });
      setLoading(false);
    }

    load();
  }, []);

  return { ...data, loading };
}
