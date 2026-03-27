export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';
export type WordStatus = 'new' | 'learning' | 'review' | 'mastered';
export type Theme = 'light' | 'dark' | 'system';
export type FlashcardRating = 0 | 2 | 4 | 5;

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
