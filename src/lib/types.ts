export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';
export type WordStatus = 'new' | 'learning' | 'review' | 'mastered';
export type Theme = 'light' | 'dark' | 'system';
export type FlashcardRating = 0 | 2 | 4 | 5;
export type DictationMode = 'word' | 'phrase' | 'sentence' | 'quiz';

export interface SessionResult {
  wordId: string;
  correct: boolean;
  timeMs: number;
  userAnswer?: string;
}

export interface VocabWord {
  word: string;
  meaning: string;
  ipa: string;
  example: string;
  audioUrl: string | null;
}

export interface VocabTopic {
  topic: string;
  topicLabel: string;
  cefrLevel: CEFRLevel;
  words: VocabWord[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
    }>;
  }>;
}

// Grammar types
export type QuizType = 'multiple_choice' | 'fill_blank' | 'error_correction' | 'sentence_order';

export interface MultipleChoiceExercise {
  type: 'multiple_choice';
  question: string;
  options: string[];
  answer: number;
}

export interface FillBlankExercise {
  type: 'fill_blank';
  question: string;
  acceptedAnswers: string[];
}

export interface ErrorCorrectionExercise {
  type: 'error_correction';
  sentence: string;
  correctSentence: string;
  errorIndex: number[];
}

export interface SentenceOrderExercise {
  type: 'sentence_order';
  words: string[];
  answer: string;
}

export type GrammarExercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | ErrorCorrectionExercise
  | SentenceOrderExercise;

export interface TheorySection {
  heading: string;
  content: string;
  examples: Array<{ en: string; vi: string }>;
}

export interface GrammarLessonData {
  id: string;
  title: string;
  level: CEFRLevel;
  theory: {
    sections: TheorySection[];
  };
  exercises: GrammarExercise[];
}

// Sentence Building types
export interface SentenceBuildingExercise {
  id: string;
  sentence: string;
  translation: string;
  words: string[];
  distractors?: string[];
  topic: string;
  cefrLevel: CEFRLevel;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SentenceBuildingTopic {
  topic: string;
  topicLabel: string;
  sentences: SentenceBuildingExercise[];
}

export interface WordItem {
  id: string;
  word: string;
  isDistractor: boolean;
  isHinted: boolean;
}

export interface SentenceBuildingResult {
  exerciseId: string;
  correct: boolean;
  hintsUsed: number;
  wrongAttempts: number;
  score: number;
  userAnswer: string;
}

// Achievement types
export type AchievementTier = 'bronze' | 'silver' | 'gold';

export type AchievementCategory =
  | 'vocabulary'
  | 'streak'
  | 'grammar'
  | 'writing'
  | 'sentence_building'
  | 'media'
  | 'daily_challenge'
  | 'study_planner'
  | 'mistake_journal'
  | 'tier'
  | 'general';

export type AchievementConditionType =
  | 'totalWords'
  | 'streak'
  | 'lessonsCompleted'
  | 'perfectQuiz'
  | 'nightOwl'
  | 'dictationCount'
  | 'challengeCount'
  | 'pronunciationCount'
  | 'sentenceBuildingCount'
  | 'mediaSessionCount'
  | 'grammarLessonsCompleted'
  | 'grammarPerfectQuiz'
  | 'writingSubmissions'
  | 'sentenceBuildingPerfect'
  | 'challengeStreak'
  | 'goalsCreated'
  | 'weeklyGoalsMet'
  | 'totalMinutesStudied'
  | 'mistakesReviewed'
  | 'mistakesMastered'
  | 'totalXp';

export interface AchievementDefinition {
  id: string;
  badge: string;
  title: string;
  description: string;
  category: AchievementCategory;
  condition: {
    type: AchievementConditionType;
    value: number;
  };
  tier?: AchievementTier;
}

export interface AchievementContext {
  totalWords: number;
  streak: number;
  lessonsCompleted: number;
  hasPerfectQuiz: boolean;
  currentHour: number;
  earnedBadges: string[];
  dictationCount: number;
  challengeCount: number;
  pronunciationCount: number;
  sentenceBuildingCount: number;
  mediaSessionCount: number;
  grammarLessonsCompleted: number;
  grammarPerfectQuiz: number;
  writingSubmissions: number;
  sentenceBuildingPerfect: number;
  challengeStreak: number;
  goalsCreated: number;
  weeklyGoalsMet: number;
  totalMinutesStudied: number;
  mistakesReviewed: number;
  mistakesMastered: number;
  totalXp: number;
}

// Media Learning types
export interface MediaVocabWord {
  word: string;
  meaning: string;
  ipa: string;
  contextSentence: string;
  cefrLevel: CEFRLevel;
  example: string;
}

// Toast types
export interface ToastMessage {
  id: string;
  type: 'xp' | 'badge' | 'goal' | 'levelUp' | 'info';
  title: string;
  description?: string;
  icon?: string;
}
