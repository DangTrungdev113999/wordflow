import dailyLife from './daily-life.json';
import foodDrink from './food-drink.json';
import travel from './travel.json';
import type { VocabTopic } from '../../lib/types';

export const ALL_TOPICS: VocabTopic[] = [
  dailyLife as VocabTopic,
  foodDrink as VocabTopic,
  travel as VocabTopic,
];

export const TOPICS_MAP: Record<string, VocabTopic> = Object.fromEntries(
  ALL_TOPICS.map(t => [t.topic, t])
);
