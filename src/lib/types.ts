export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';
export type WordStatus = 'new' | 'learning' | 'review' | 'mastered';
export type Theme = 'light' | 'dark' | 'system';
export type FontScale = 'small' | 'normal' | 'large';
export type FlashcardRating = 0 | 2 | 4 | 5;
export type DictationMode = 'word' | 'phrase' | 'sentence' | 'quiz';
export type ListeningMode = DictationMode | 'fill-blank' | 'speed' | 'listen-choose' | 'conversation' | 'story' | 'accent' | 'note-taking';

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

  // Enriched fields (optional for backward compat)
  partOfSpeech?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  wordFamily?: string[];
  collocations?: string[];
  imageUrl?: string | null;
  frequency?: number; // 1-5 (1=most common)
  mnemonic?: string;
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
export type QuizType = 'multiple_choice' | 'fill_blank' | 'error_correction' | 'sentence_order' | 'role_identify' | 'transform';

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

export interface RoleIdentifyExercise {
  type: 'role_identify';
  sentence: string;
  parts: SentencePart[];
  targetIndices: number[];
}

export interface TransformExercise {
  type: 'transform';
  instruction: string;
  original: string;
  acceptedAnswers: string[];
  hint?: string;
}

export type GrammarExercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | ErrorCorrectionExercise
  | SentenceOrderExercise
  | RoleIdentifyExercise
  | TransformExercise;

// Phase 11 — Visual Grammar types

export interface SentencePart {
  text: string;
  role: 'subject' | 'verb' | 'object' | 'time' | 'auxiliary' | 'complement' | 'connector' | 'determiner';
  tooltip?: string;
}

export interface ColoredExample {
  parts: SentencePart[];
  vi: string;
  audio?: string;
}

export interface VerbConjugation {
  pronoun: string;
  affirmative: string;
  negative: string;
  question: string;
  highlight?: 'base' | 'third-person' | 'irregular';
}

export interface ConjugationTable {
  verb: string;
  tense: string;
  rows: VerbConjugation[];
  notes?: string;
}

export interface BeforeAfter {
  wrong: string;
  correct: string;
  wrongHighlight: number[];
  correctHighlight: number[];
  explanation: string;
}

export interface TheoryStep {
  title: string;
  content: string;
  examples?: Array<{ en: string; vi: string }>;
  coloredExamples?: ColoredExample[];
  conjugation?: ConjugationTable;
  beforeAfter?: BeforeAfter[];
  visualType?: 'timeline' | 'diagram' | 'comparison' | 'formula';
  visualData?: Record<string, unknown>;
}

export interface CheatSheet {
  title: string;
  formula: string;
  keyPoints: string[];
  signalWords: string[];
  commonMistakes: string[];
}

export interface TheorySection {
  heading: string;
  content: string;
  examples: Array<{ en: string; vi: string }>;
  coloredExamples?: ColoredExample[];
  conjugation?: ConjugationTable;
  beforeAfter?: BeforeAfter[];
  steps?: TheoryStep[];
  visualType?: 'timeline' | 'diagram' | 'comparison' | 'formula';
  visualData?: Record<string, unknown>;
}

export interface GrammarLessonData {
  id: string;
  title: string;
  level: CEFRLevel;
  theory: {
    sections: TheorySection[];
  };
  exercises: GrammarExercise[];
  cheatSheet?: CheatSheet;
  prerequisites?: string[];
  relatedReference?: string[];
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
  type: 'xp' | 'badge' | 'goal' | 'levelUp' | 'info' | 'success';
  title: string;
  description?: string;
  icon?: string;
}
