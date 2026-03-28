import type { SentenceBuildingTopic } from '../../lib/types';
import dailyLife from './daily-life.json';
import travel from './travel.json';
import foodDrink from './food-drink.json';
import work from './work.json';

export const ALL_SENTENCE_TOPICS: SentenceBuildingTopic[] = [
  dailyLife as SentenceBuildingTopic,
  travel as SentenceBuildingTopic,
  foodDrink as SentenceBuildingTopic,
  work as SentenceBuildingTopic,
];

export const ALL_SENTENCES = ALL_SENTENCE_TOPICS.flatMap(t => t.sentences);
