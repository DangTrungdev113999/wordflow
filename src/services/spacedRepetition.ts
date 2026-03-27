import type { WordProgress } from '../db/models';
import { DEFAULT_EASE_FACTOR, MIN_EASE_FACTOR } from '../lib/constants';
import type { FlashcardRating } from '../lib/types';

export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  status: WordProgress['status'];
}

export function calculateSM2(
  quality: FlashcardRating,
  current: Pick<WordProgress, 'easeFactor' | 'interval' | 'repetitions'>
): SM2Result {
  let { easeFactor, interval, repetitions } = current;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(
    MIN_EASE_FACTOR,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  let status: WordProgress['status'];
  if (repetitions === 0) {
    status = 'learning';
  } else if (repetitions < 3) {
    status = 'learning';
  } else if (interval >= 21) {
    status = 'mastered';
  } else {
    status = 'review';
  }

  return { easeFactor, interval, repetitions, nextReview, status };
}

export function createInitialProgress(wordId: string): WordProgress {
  return {
    wordId,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 1,
    repetitions: 0,
    nextReview: Date.now(),
    lastReview: 0,
    status: 'new',
  };
}

export function isDueForReview(progress: WordProgress): boolean {
  return progress.nextReview <= Date.now() || progress.status === 'new';
}
