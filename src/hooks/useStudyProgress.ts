import { useEffect, useState } from 'react';
import { db } from '../db/database';
import { useProgressStore } from '../stores/progressStore';
import { useStudyPlanStore } from '../stores/studyPlanStore';
import { useTimerStore } from './useStudyTimer';
import { getTodayString } from '../lib/utils';
import type { StudyGoal } from '../models/StudyPlan';
import type { DailyLog } from '../db/models';

export interface GoalProgress {
  goal: StudyGoal;
  current: number;
  percentage: number;
  isComplete: boolean;
}

export function useStudyProgress() {
  const goals = useStudyPlanStore((s) => s.goals);
  const updateGoalProgress = useStudyPlanStore((s) => s.updateGoalProgress);
  const { todayWordsLearned, todayXP } = useProgressStore();
  const elapsedMs = useTimerStore((s) => s.elapsedMs);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [weekLogs, setWeekLogs] = useState<DailyLog[]>([]);

  // Load today's log + week logs
  useEffect(() => {
    async function loadLogs() {
      const today = getTodayString();
      const log = await db.dailyLogs.get(today);
      setTodayLog(log ?? null);

      // Load last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const startDate = sevenDaysAgo.toISOString().slice(0, 10);
      const logs = await db.dailyLogs.where('date').between(startDate, today, true, true).toArray();
      setWeekLogs(logs);
    }
    loadLogs();

    // Refresh periodically
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate current value for each goal
  const goalProgress: GoalProgress[] = goals.map((goal) => {
    let current = 0;

    if (goal.type === 'daily') {
      switch (goal.metric) {
        case 'words':
          current = todayWordsLearned;
          break;
        case 'xp':
          current = todayXP;
          break;
        case 'minutes':
          current = Math.floor(elapsedMs / 60000) + (todayLog?.minutesSpent ?? 0);
          break;
        case 'lessons':
          current = todayLog?.grammarCompleted ?? 0;
          break;
        case 'quizAccuracy':
          current = todayLog?.quizAccuracy ?? 0;
          break;
      }
    } else {
      // Weekly: aggregate from weekLogs
      switch (goal.metric) {
        case 'words':
          current = weekLogs.reduce((sum, l) => sum + l.wordsLearned, 0);
          break;
        case 'xp':
          current = weekLogs.reduce((sum, l) => sum + l.xpEarned, 0);
          break;
        case 'minutes':
          current = weekLogs.reduce((sum, l) => sum + l.minutesSpent, 0);
          break;
        case 'lessons':
          current = weekLogs.reduce((sum, l) => sum + l.grammarCompleted, 0);
          break;
        case 'quizAccuracy':
          current =
            weekLogs.length > 0
              ? Math.round(weekLogs.reduce((sum, l) => sum + l.quizAccuracy, 0) / weekLogs.length)
              : 0;
          break;
      }
    }

    return {
      goal,
      current,
      percentage: goal.target > 0 ? Math.min(100, Math.round((current / goal.target) * 100)) : 0,
      isComplete: current >= goal.target,
    };
  });

  // Sync progress back to store
  useEffect(() => {
    for (const gp of goalProgress) {
      if (gp.current !== gp.goal.current) {
        updateGoalProgress(gp.goal.id, gp.current);
      }
    }
  }, [goalProgress, updateGoalProgress]);

  const weeklyData = buildWeeklyData(weekLogs);

  return { goalProgress, todayLog, weekLogs, weeklyData };
}

function buildWeeklyData(logs: DailyLog[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result: { day: string; date: string; words: number; xp: number; minutes: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const log = logs.find((l) => l.date === dateStr);
    result.push({
      day: days[d.getDay()],
      date: dateStr.slice(5),
      words: log?.wordsLearned ?? 0,
      xp: log?.xpEarned ?? 0,
      minutes: log?.minutesSpent ?? 0,
    });
  }

  return result;
}
