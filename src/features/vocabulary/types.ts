export type LearningMode = 'flashcard' | 'quiz' | 'spelling' | 'match' | 'context';

export interface VocabSessionConfig {
  topicId: string;
  mode: LearningMode;
  wordCount: number; // 5 | 10 | 15 | 20
  wordsFilter: 'all' | 'new' | 'weak' | 'due';
}

export interface VocabSessionWordResult {
  wordId: string;
  word: string;
  correct: boolean;
  attempts: number;
  timeMs: number;
}

export interface VocabSessionResult {
  mode: LearningMode;
  words: VocabSessionWordResult[];
  totalTime: number;
  accuracy: number;
  xpEarned: number;
}
