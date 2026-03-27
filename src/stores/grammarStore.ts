import { create } from 'zustand';
import type { GrammarLessonData, GrammarExercise } from '../lib/types';
import { ALL_GRAMMAR_LESSONS } from '../data/grammar/_index';
import { db } from '../db/database';

interface QuizState {
  currentExerciseIndex: number;
  answers: Array<{ correct: boolean; userAnswer: string }>;
  isComplete: boolean;
}

interface GrammarState {
  lessons: GrammarLessonData[];
  currentLesson: GrammarLessonData | null;
  lessonProgress: Record<string, { completed: boolean; bestScore: number; attempts: number }>;
  quiz: QuizState;
  setCurrentLesson: (lesson: GrammarLessonData | null) => void;
  submitAnswer: (correct: boolean, userAnswer: string) => void;
  nextExercise: () => void;
  resetQuiz: () => void;
  updateLessonProgress: (lessonId: string, score: number) => void;
  loadProgressFromDB: () => Promise<void>;
  getCurrentExercise: () => GrammarExercise | null;
}

export const useGrammarStore = create<GrammarState>()((set, get) => ({
  lessons: ALL_GRAMMAR_LESSONS,
  currentLesson: null,
  lessonProgress: {},
  quiz: {
    currentExerciseIndex: 0,
    answers: [],
    isComplete: false,
  },
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  submitAnswer: (correct, userAnswer) =>
    set((s) => {
      const newAnswers = [...s.quiz.answers, { correct, userAnswer }];
      const lesson = s.currentLesson;
      const isComplete = lesson ? newAnswers.length >= lesson.exercises.length : true;
      return {
        quiz: { ...s.quiz, answers: newAnswers, isComplete },
      };
    }),
  nextExercise: () =>
    set((s) => ({
      quiz: { ...s.quiz, currentExerciseIndex: s.quiz.currentExerciseIndex + 1 },
    })),
  resetQuiz: () =>
    set({
      quiz: { currentExerciseIndex: 0, answers: [], isComplete: false },
    }),
  updateLessonProgress: async (lessonId, score) => {
    const existing = get().lessonProgress[lessonId];
    const updated = {
      completed: true,
      bestScore: Math.max(score, existing?.bestScore ?? 0),
      attempts: (existing?.attempts ?? 0) + 1,
    };

    // Update in-memory
    set((s) => ({
      lessonProgress: { ...s.lessonProgress, [lessonId]: updated },
    }));

    // Persist to IndexedDB
    const lesson = get().lessons.find((l) => l.id === lessonId);
    await db.grammarLessons.put({
      id: lessonId,
      title: lesson?.title ?? lessonId,
      level: lesson?.level ?? 'A1',
      completed: updated.completed,
      bestScore: updated.bestScore,
      attempts: updated.attempts,
    });
  },
  loadProgressFromDB: async () => {
    const records = await db.grammarLessons.toArray();
    const progress: Record<string, { completed: boolean; bestScore: number; attempts: number }> = {};
    for (const r of records) {
      progress[r.id] = {
        completed: r.completed,
        bestScore: r.bestScore,
        attempts: r.attempts,
      };
    }
    set({ lessonProgress: progress });
  },
  getCurrentExercise: () => {
    const { currentLesson, quiz } = get();
    if (!currentLesson) return null;
    return currentLesson.exercises[quiz.currentExerciseIndex] ?? null;
  },
}));

// Auto-load progress from DB on store creation
useGrammarStore.getState().loadProgressFromDB();
