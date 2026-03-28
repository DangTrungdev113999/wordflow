import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { getTodayString } from '../lib/utils';
import type { StudyGoal, StudySchedule, WeeklySnapshot } from '../models/StudyPlan';

interface StudyPlanState {
  goals: StudyGoal[];
  schedule: StudySchedule[];
  weeklySnapshots: WeeklySnapshot[];
  lastSnapshotWeek: string;

  addGoal: (goal: Pick<StudyGoal, 'type' | 'metric' | 'target'>) => void;
  removeGoal: (id: string) => void;
  updateGoalProgress: (id: string, current: number) => void;
  updateSchedule: (schedule: StudySchedule[]) => void;
  toggleScheduleDay: (dayOfWeek: number, startTime: string, duration: number, focus: string[]) => void;
  removeScheduleDay: (dayOfWeek: number) => void;
  updateScheduleReminder: (dayOfWeek: number, enabled: boolean) => void;
  snapshotWeek: (totalMinutes: number, totalXp: number, daysActive: number) => void;
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday = start
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  return monday.toISOString().slice(0, 10);
}

export const useStudyPlanStore = create<StudyPlanState>()(
  persist(
    (set, get) => ({
      goals: [],
      schedule: [],
      weeklySnapshots: [],
      lastSnapshotWeek: '',

      addGoal: (goal) => {
        const newGoal: StudyGoal = {
          id: nanoid(10),
          ...goal,
          current: 0,
          createdAt: getTodayString(),
        };
        set((s) => ({ goals: [...s.goals, newGoal] }));
      },

      removeGoal: (id) => {
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
      },

      updateGoalProgress: (id, current) => {
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, current } : g)),
        }));
      },

      updateSchedule: (schedule) => set({ schedule }),

      toggleScheduleDay: (dayOfWeek, startTime, duration, focus) => {
        set((s) => {
          const existing = s.schedule.find((sch) => sch.dayOfWeek === dayOfWeek);
          if (existing) {
            return { schedule: s.schedule.filter((sch) => sch.dayOfWeek !== dayOfWeek) };
          }
          return {
            schedule: [
              ...s.schedule,
              { dayOfWeek, startTime, duration, focus, reminderEnabled: true },
            ],
          };
        });
      },

      removeScheduleDay: (dayOfWeek) => {
        set((s) => ({ schedule: s.schedule.filter((sch) => sch.dayOfWeek !== dayOfWeek) }));
      },

      updateScheduleReminder: (dayOfWeek, enabled) => {
        set((s) => ({
          schedule: s.schedule.map((sch) =>
            sch.dayOfWeek === dayOfWeek ? { ...sch, reminderEnabled: enabled } : sch
          ),
        }));
      },

      snapshotWeek: (totalMinutes, totalXp, daysActive) => {
        const weekStart = getWeekStart();
        if (get().lastSnapshotWeek === weekStart) return;

        const snapshot: WeeklySnapshot = {
          weekStart,
          goals: get().goals.map((g) => ({
            metric: g.metric,
            target: g.target,
            achieved: g.current,
          })),
          totalMinutes,
          totalXp,
          daysActive,
        };

        set((s) => ({
          weeklySnapshots: [...s.weeklySnapshots.slice(-11), snapshot],
          lastSnapshotWeek: weekStart,
          // Reset current progress for new week
          goals: s.goals.map((g) => ({ ...g, current: 0 })),
        }));
      },
    }),
    { name: 'wordflow-study-plan' }
  )
);
