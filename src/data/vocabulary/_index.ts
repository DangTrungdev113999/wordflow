import dailyLife from './daily-life.json';
import foodDrink from './food-drink.json';
import travel from './travel.json';
import business from './business.json';
import technology from './technology.json';
import health from './health.json';
import education from './education.json';
import sports from './sports.json';
import emotions from './emotions.json';
import nature from './nature.json';
import shopping from './shopping.json';
import home from './home.json';
import work from './work.json';
import type { VocabTopic } from '../../lib/types';

export const ALL_TOPICS: VocabTopic[] = [
  dailyLife,
  foodDrink,
  travel,
  health,
  education,
  sports,
  emotions,
  nature,
  shopping,
  home,
  work,
  business,
  technology,
] as VocabTopic[];
