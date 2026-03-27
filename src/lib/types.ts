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
