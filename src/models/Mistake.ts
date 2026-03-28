export type MistakeType = 'vocabulary' | 'grammar' | 'spelling' | 'sentence_order' | 'listening' | 'reading' | 'writing';

export type MistakeSource = 'quiz' | 'grammar-quiz' | 'dictation' | 'listening-quiz' | 'sentence-building' | 'writing' | 'media-quiz' | 'reading';

export type ReviewResult = 'forgot' | 'hard' | 'good' | 'easy';

export interface Mistake {
  id: string;
  type: MistakeType;
  source: MistakeSource;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
  createdAt: string;

  // Spaced repetition (SM-2) fields
  easeFactor: number;    // default 2.5, min 1.3
  interval: number;      // days, default 1
  nextReview: string;    // ISO date
  reviewCount: number;   // default 0
  lastReviewResult?: ReviewResult;
}

export interface MistakeStats {
  totalMistakes: number;
  byType: Record<MistakeType, number>;
  topPatterns: { pattern: string; count: number }[];
  reviewedToday: number;
  dueForReview: number;
}

export interface MistakeCollectedEvent {
  source: MistakeSource;
  mistakes: {
    type: MistakeType;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    explanation?: string;
  }[];
}
