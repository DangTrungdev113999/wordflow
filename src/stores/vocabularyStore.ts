import { create } from 'zustand';
import type { VocabTopic, VocabWord } from '../lib/types';
import type { WordProgress } from '../db/models';
import { ALL_TOPICS } from '../data/vocabulary/_index';

interface SessionResultEntry {
  wordId: string;
  correct: boolean;
}

interface VocabularyState {
  topics: VocabTopic[];
  currentTopic: VocabTopic | null;
  wordProgressMap: Record<string, WordProgress>;
  flashcardQueue: VocabWord[];
  currentCardIndex: number;
  isFlipped: boolean;
  sessionStats: { correct: number; incorrect: number; total: number };
  sessionResults: SessionResultEntry[];
  setCurrentTopic: (topic: VocabTopic | null) => void;
  setWordProgressMap: (map: Record<string, WordProgress>) => void;
  setFlashcardQueue: (queue: VocabWord[]) => void;
  nextCard: () => void;
  flipCard: () => void;
  resetFlip: () => void;
  recordAnswer: (correct: boolean, wordId?: string) => void;
  resetSession: () => void;
}

export const useVocabularyStore = create<VocabularyState>()((set, get) => ({
  topics: ALL_TOPICS,
  currentTopic: null,
  wordProgressMap: {},
  flashcardQueue: [],
  currentCardIndex: 0,
  isFlipped: false,
  sessionStats: { correct: 0, incorrect: 0, total: 0 },
  sessionResults: [],
  setCurrentTopic: (topic) => set({ currentTopic: topic }),
  setWordProgressMap: (map) => set({ wordProgressMap: map }),
  setFlashcardQueue: (queue) => set({ flashcardQueue: queue, currentCardIndex: 0, isFlipped: false }),
  nextCard: () => {
    const { currentCardIndex, flashcardQueue } = get();
    if (currentCardIndex < flashcardQueue.length) {
      set({ currentCardIndex: currentCardIndex + 1, isFlipped: false });
    }
  },
  flipCard: () => set((s) => ({ isFlipped: !s.isFlipped })),
  resetFlip: () => set({ isFlipped: false }),
  recordAnswer: (correct, wordId) =>
    set((s) => ({
      sessionStats: {
        correct: s.sessionStats.correct + (correct ? 1 : 0),
        incorrect: s.sessionStats.incorrect + (correct ? 0 : 1),
        total: s.sessionStats.total + 1,
      },
      sessionResults: wordId
        ? [...s.sessionResults, { wordId, correct }]
        : s.sessionResults,
    })),
  resetSession: () =>
    set({ flashcardQueue: [], currentCardIndex: 0, isFlipped: false, sessionStats: { correct: 0, incorrect: 0, total: 0 }, sessionResults: [] }),
}));
