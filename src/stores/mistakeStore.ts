import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Mistake, MistakeType, MistakeStats, ReviewResult } from '../models/Mistake';

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + Math.round(days));
  return d.toISOString().split('T')[0];
}

interface MistakeState {
  mistakes: Mistake[];

  addMistake(mistake: Omit<Mistake, 'id' | 'createdAt' | 'easeFactor' | 'interval' | 'nextReview' | 'reviewCount'>): void;
  reviewMistake(id: string, result: ReviewResult): void;
  getDueForReview(): Mistake[];
  getStats(): MistakeStats;
  deleteMistake(id: string): void;
  clearResolved(): void;
}

export const useMistakeStore = create<MistakeState>()(
  persist(
    (set, get) => ({
      mistakes: [],

      addMistake: (input) => {
        const today = todayISO();
        // Deduplicate: skip if same question + correctAnswer + source already exists
        const exists = get().mistakes.some(
          m => m.question === input.question && m.correctAnswer === input.correctAnswer && m.source === input.source
        );
        if (exists) return;

        const mistake: Mistake = {
          ...input,
          id: nanoid(),
          createdAt: today,
          easeFactor: 2.5,
          interval: 1,
          nextReview: today, // review immediately
          reviewCount: 0,
        };
        set(s => ({ mistakes: [...s.mistakes, mistake] }));
      },

      reviewMistake: (id, result) => {
        const today = todayISO();
        set(s => ({
          mistakes: s.mistakes.map(m => {
            if (m.id !== id) return m;

            let { easeFactor, interval } = m;

            switch (result) {
              case 'forgot':
                interval = 1;
                easeFactor -= 0.2;
                break;
              case 'hard':
                interval = Math.max(1, Math.ceil(interval * 1.2));
                easeFactor -= 0.15;
                break;
              case 'good':
                interval = Math.max(1, Math.round(interval * easeFactor));
                break;
              case 'easy':
                interval = Math.max(1, Math.round(interval * easeFactor * 1.3));
                easeFactor += 0.15;
                break;
            }

            easeFactor = Math.max(1.3, easeFactor);

            return {
              ...m,
              easeFactor,
              interval,
              nextReview: addDays(today, interval),
              reviewCount: m.reviewCount + 1,
              lastReviewResult: result,
              lastReviewedAt: today,
            };
          }),
        }));
      },

      getDueForReview: () => {
        const today = todayISO();
        return get().mistakes.filter(m => m.nextReview <= today);
      },

      getStats: () => {
        const { mistakes } = get();
        const today = todayISO();

        const byType = {} as Record<MistakeType, number>;
        const allTypes: MistakeType[] = ['vocabulary', 'grammar', 'spelling', 'sentence_order', 'listening', 'reading', 'writing'];
        for (const t of allTypes) byType[t] = 0;
        for (const m of mistakes) byType[m.type] = (byType[m.type] || 0) + 1;

        // Count reviewed today
        const reviewedToday = mistakes.filter(
          m => m.lastReviewedAt?.startsWith(today)
        ).length;

        const dueForReview = mistakes.filter(m => m.nextReview <= today).length;

        // Pattern analysis: group by type + keyword
        const patternMap = new Map<string, number>();
        for (const m of mistakes) {
          const key = m.type;
          patternMap.set(key, (patternMap.get(key) || 0) + 1);
        }
        const topPatterns = Array.from(patternMap.entries())
          .map(([pattern, count]) => ({ pattern, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        return {
          totalMistakes: mistakes.length,
          byType,
          topPatterns,
          reviewedToday,
          dueForReview,
        };
      },

      deleteMistake: (id) => {
        set(s => ({ mistakes: s.mistakes.filter(m => m.id !== id) }));
      },

      clearResolved: () => {
        set(s => ({ mistakes: s.mistakes.filter(m => m.interval <= 30) }));
      },
    }),
    { name: 'wordflow-mistakes' }
  )
);
