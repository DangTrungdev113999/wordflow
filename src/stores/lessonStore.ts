import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LessonPhase } from '../data/learning-path/types';
import { UNITS } from '../data/learning-path/units';

export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed';

interface LessonProgress {
  status: LessonStatus;
  currentPhase: LessonPhase | null;
  completedPhases: LessonPhase[];
  score: number;
  xpEarned: number;
  completedAt: string | null;
}

interface LessonState {
  progress: Record<string, LessonProgress>;
  startLesson: (lessonId: string) => void;
  completePhase: (lessonId: string, phase: LessonPhase) => void;
  completeLesson: (lessonId: string, score: number, xp: number) => void;
  getLessonStatus: (lessonId: string) => LessonStatus;
  getUnitProgress: (unitId: string) => { completed: number; total: number };
  getNextAvailableLesson: () => { lessonId: string; unitId: string } | null;
}

function getAllLessonIds(): string[] {
  return UNITS.flatMap((u) => u.lessons.map((l) => l.id));
}

function isLessonAvailable(lessonId: string, progress: Record<string, LessonProgress>): boolean {
  const allIds = getAllLessonIds();
  const idx = allIds.indexOf(lessonId);
  if (idx === 0) return true;
  const prevId = allIds[idx - 1];
  return progress[prevId]?.status === 'completed';
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set, get) => ({
      progress: {},

      startLesson: (lessonId) => {
        set((s) => ({
          progress: {
            ...s.progress,
            [lessonId]: {
              status: 'in_progress',
              currentPhase: 'vocab',
              completedPhases: [],
              score: 0,
              xpEarned: 0,
              completedAt: null,
            },
          },
        }));
      },

      completePhase: (lessonId, phase) => {
        set((s) => {
          const current = s.progress[lessonId];
          if (!current) return s;
          const completedPhases = current.completedPhases.includes(phase)
            ? current.completedPhases
            : [...current.completedPhases, phase];
          const phases: LessonPhase[] = ['vocab', 'grammar', 'practice', 'quiz'];
          const nextIdx = phases.indexOf(phase) + 1;
          const nextPhase = nextIdx < phases.length ? phases[nextIdx] : null;
          return {
            progress: {
              ...s.progress,
              [lessonId]: {
                ...current,
                completedPhases,
                currentPhase: nextPhase,
              },
            },
          };
        });
      },

      completeLesson: (lessonId, score, xp) => {
        set((s) => ({
          progress: {
            ...s.progress,
            [lessonId]: {
              status: 'completed',
              currentPhase: null,
              completedPhases: ['vocab', 'grammar', 'practice', 'quiz'],
              score,
              xpEarned: xp,
              completedAt: new Date().toISOString(),
            },
          },
        }));
      },

      getLessonStatus: (lessonId) => {
        const { progress } = get();
        const p = progress[lessonId];
        if (p) return p.status;
        return isLessonAvailable(lessonId, progress) ? 'available' : 'locked';
      },

      getUnitProgress: (unitId) => {
        const unit = UNITS.find((u) => u.id === unitId);
        if (!unit) return { completed: 0, total: 0 };
        const { progress } = get();
        const completed = unit.lessons.filter(
          (l) => progress[l.id]?.status === 'completed',
        ).length;
        return { completed, total: unit.lessons.length };
      },

      getNextAvailableLesson: () => {
        const { progress } = get();
        for (const unit of UNITS) {
          for (const lesson of unit.lessons) {
            const p = progress[lesson.id];
            if (p?.status === 'in_progress') {
              return { lessonId: lesson.id, unitId: unit.id };
            }
          }
        }
        for (const unit of UNITS) {
          for (const lesson of unit.lessons) {
            const p = progress[lesson.id];
            if (!p && isLessonAvailable(lesson.id, progress)) {
              return { lessonId: lesson.id, unitId: unit.id };
            }
          }
        }
        return null;
      },
    }),
    { name: 'wordflow-lessons' },
  ),
);
