import presentSimple from './present-simple.json';
import pastSimple from './past-simple.json';
import articles from './articles.json';
import presentContinuous from './present-continuous.json';
import comparatives from './comparatives.json';
import modals from './modals.json';
import type { GrammarLessonData } from '../../lib/types';

export const ALL_GRAMMAR_LESSONS: GrammarLessonData[] = [
  presentSimple,
  pastSimple,
  articles,
  presentContinuous,
  comparatives,
  modals,
] as GrammarLessonData[];
