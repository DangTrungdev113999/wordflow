import presentSimple from './present-simple.json';
import pastSimple from './past-simple.json';
import articles from './articles.json';
import presentContinuous from './present-continuous.json';
import comparatives from './comparatives.json';
import modals from './modals.json';
import futureSimple from './future-simple.json';
import pastContinuous from './past-continuous.json';
import prepositionsPlace from './prepositions-place.json';
import prepositionsTime from './prepositions-time.json';
import possessives from './possessives.json';
import countableUncountable from './countable-uncountable.json';
import thereIsAre from './there-is-are.json';
import imperative from './imperative.json';
import conjunctions from './conjunctions.json';
import questionWords from './question-words.json';
import whQuestions from './wh-questions.json';
import adverbsFrequency from './adverbs-frequency.json';
import presentPerfect from './present-perfect.json';
import conditionalsZero from './conditionals-zero.json';
import type { GrammarLessonData } from '../../lib/types';

export const ALL_GRAMMAR_LESSONS: GrammarLessonData[] = [
  presentSimple,
  pastSimple,
  articles,
  presentContinuous,
  prepositionsPlace,
  prepositionsTime,
  possessives,
  thereIsAre,
  imperative,
  conjunctions,
  questionWords,
  whQuestions,
  adverbsFrequency,
  comparatives,
  modals,
  futureSimple,
  pastContinuous,
  countableUncountable,
  presentPerfect,
  conditionalsZero,
] as GrammarLessonData[];
