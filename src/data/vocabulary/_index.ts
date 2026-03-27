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
import family from './family.json';
import clothing from './clothing.json';
import transportation from './transportation.json';
import entertainment from './entertainment.json';
import communication from './communication.json';
import timeNumbers from './time-numbers.json';
import environment from './environment.json';
import type { VocabTopic } from '../../lib/types';

export const ALL_TOPICS: VocabTopic[] = [
  dailyLife,
  foodDrink,
  travel,
  family,
  health,
  education,
  sports,
  emotions,
  nature,
  clothing,
  shopping,
  home,
  work,
  transportation,
  timeNumbers,
  entertainment,
  communication,
  business,
  technology,
  environment,
] as VocabTopic[];
