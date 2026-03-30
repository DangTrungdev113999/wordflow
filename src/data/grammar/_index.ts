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
// B1 lessons
import b1PresentPerfectContinuous from './b1-present-perfect-continuous.json';
import b1PastPerfect from './b1-past-perfect.json';
import b1Conditionals1 from './b1-conditionals-1.json';
import b1Conditionals2 from './b1-conditionals-2.json';
import b1PassiveVoice from './b1-passive-voice.json';
import b1ReportedSpeech from './b1-reported-speech.json';
import b1RelativeClauses from './b1-relative-clauses.json';
import b1ModalPerfect from './b1-modal-perfect.json';
import b1UsedTo from './b1-used-to.json';
import b1GerundInfinitive from './b1-gerund-infinitive.json';
// B2 lessons
import b2Conditionals3 from './b2-conditionals-3.json';
import b2MixedConditionals from './b2-mixed-conditionals.json';
import b2Subjunctive from './b2-subjunctive.json';
import b2CleftSentences from './b2-cleft-sentences.json';
import b2PassiveAdvanced from './b2-passive-advanced.json';
import b2ReportedSpeechAdvanced from './b2-reported-speech-advanced.json';
import b2FuturePerfect from './b2-future-perfect.json';
import b2WishIfOnly from './b2-wish-if-only.json';
import b2RelativeClausesAdvanced from './b2-relative-clauses-advanced.json';
import b2Inversion from './b2-inversion.json';
import type { GrammarLessonData } from '../../lib/types';

export const ALL_GRAMMAR_LESSONS: GrammarLessonData[] = [
  // A1-A2
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
  // B1
  b1PresentPerfectContinuous,
  b1PastPerfect,
  b1Conditionals1,
  b1Conditionals2,
  b1PassiveVoice,
  b1ReportedSpeech,
  b1RelativeClauses,
  b1ModalPerfect,
  b1UsedTo,
  b1GerundInfinitive,
  // B2
  b2Conditionals3,
  b2MixedConditionals,
  b2Subjunctive,
  b2CleftSentences,
  b2PassiveAdvanced,
  b2ReportedSpeechAdvanced,
  b2FuturePerfect,
  b2WishIfOnly,
  b2RelativeClausesAdvanced,
  b2Inversion,
] as GrammarLessonData[];
