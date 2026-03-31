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

// ──────────────────────────────────────────────────
// Phase 13-2: Phrasal Verbs
// ──────────────────────────────────────────────────

export interface PhrasalVerbExample {
  sentence: string;
  translation: string;
}

export interface PhrasalVerb {
  id: string;
  verb: string;        // full phrasal verb, e.g. "give up"
  baseVerb: string;    // e.g. "give"
  particle: string;    // e.g. "up"
  meaning: string;     // Vietnamese
  meaningEn: string;   // English
  examples: PhrasalVerbExample[];
  level: 'A2' | 'B1' | 'B2';
  synonyms?: string[];
  note?: string;
}

// ──────────────────────────────────────────────────
// Phase 13-2: Collocations
// ──────────────────────────────────────────────────

export type CollocationCategory =
  | 'verb-noun'
  | 'adj-noun'
  | 'noun-noun'
  | 'adv-adj'
  | 'verb-prep'
  | 'business';

export interface CollocationExample {
  sentence: string;
  translation: string;
}

export interface Collocation {
  id: string;
  collocation: string;        // e.g. "make a decision"
  category: CollocationCategory;
  meaning: string;            // Vietnamese
  examples: CollocationExample[];
  correct: string;            // Natural usage
  incorrect: string;          // Common mistake
  note?: string;
}

// ──────────────────────────────────────────────────
// Dexie cache types
// ──────────────────────────────────────────────────

export interface PhrasalVerbCache {
  id?: number;
  baseVerb: string;
  particle: string;
  data: PhrasalVerb;
  updatedAt: number;
}

export interface CollocationCache {
  id?: number;
  word: string;
  category: string;
  data: Collocation;
  updatedAt: number;
}

// ──────────────────────────────────────────────────
// Phase 13-3: Grammar Patterns
// ──────────────────────────────────────────────────

export type GrammarCategory =
  | 'verb-pattern'
  | 'used-to'
  | 'conditional'
  | 'reported-speech'
  | 'passive';

export interface GrammarForm {
  structure: string;
  meaning: string;
  example: SenseExample;
  usage: string;
}

export interface GrammarQuizItem {
  sentence: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface GrammarQuiz {
  items: GrammarQuizItem[];
}

export interface GrammarPattern {
  id: string;
  pattern: string;
  category: GrammarCategory;
  forms: GrammarForm[];
  commonMistake: string;
  memoryTip: string;
  quiz?: GrammarQuiz;
}

export interface GrammarPatternCache {
  id?: number;
  pattern: string;
  category: string;
  data: GrammarPattern;
}
