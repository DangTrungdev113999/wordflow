// Phase 13: Word Usage & Context Guide — Type Definitions

export interface SenseExample {
  sentence: string;
  translation: string;
  highlight: string;
}

export interface WordSense {
  id: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction';
  meaning: string;
  meaningEn: string;
  examples: SenseExample[];
  register?: 'formal' | 'informal' | 'slang' | 'technical';
  frequency: 1 | 2 | 3; // 1=common, 2=less common, 3=rare
  collocations?: string[];
}

export interface MultiMeaningWord {
  word: string;
  ipa: string;
  totalSenses: number;
  senses: WordSense[];
  tips?: string;
}

export interface PairComparison {
  word: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  translation: string;
}

export interface PairQuizItem {
  sentence: string;
  correct: string;
  explanation: string;
}

export interface PairQuiz {
  sentences: PairQuizItem[];
}

export interface ConfusingPair {
  id: string;
  word1: string;
  word2: string;
  category: 'spelling' | 'meaning' | 'grammar' | 'usage';
  comparison: PairComparison[];
  commonMistake: string;
  memoryTip: string;
  quiz?: PairQuiz;
}

// Dexie cache types
export interface MultiMeaningWordCache {
  word: string;
  data: MultiMeaningWord;
  updatedAt: number;
}

export interface ConfusingPairCache {
  id?: number;
  word1: string;
  word2: string;
  category: string;
  data: ConfusingPair;
  updatedAt: number;
}

// Future P13-2/P13-3 types (for Dexie schema)
export interface PhrasalVerbCache {
  id?: number;
  baseVerb: string;
  particle: string;
  data: unknown;
  updatedAt: number;
}

export interface CollocationCache {
  id?: number;
  word: string;
  category: string;
  data: unknown;
  updatedAt: number;
}

export interface GrammarPatternCache {
  id?: number;
  pattern: string;
  category: string;
  data: unknown;
}
