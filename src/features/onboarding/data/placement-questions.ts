import type { CEFRLevel } from '../../../lib/types';

export interface PlacementQuestion {
  question: string;
  options: string[];
  answer: number;
  level: CEFRLevel;
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // 5 A1 questions (basic)
  { question: 'She ___ a teacher.', options: ['am', 'is', 'are', 'be'], answer: 1, level: 'A1' },
  { question: 'I ___ breakfast every morning.', options: ['has', 'have', 'having', 'had'], answer: 1, level: 'A1' },
  { question: '___ you like coffee?', options: ['Does', 'Do', 'Is', 'Are'], answer: 1, level: 'A1' },
  { question: 'They ___ from Japan.', options: ['is', 'am', 'are', 'be'], answer: 2, level: 'A1' },
  { question: 'He ___ to school by bus.', options: ['go', 'goes', 'going', 'gone'], answer: 1, level: 'A1' },

  // 5 A2 questions (elementary)
  { question: 'I ___ to London last summer.', options: ['go', 'went', 'have gone', 'going'], answer: 1, level: 'A2' },
  { question: 'She is ___ than her sister.', options: ['tall', 'taller', 'tallest', 'more tall'], answer: 1, level: 'A2' },
  { question: 'We ___ dinner when the phone rang.', options: ['have', 'had', 'were having', 'are having'], answer: 2, level: 'A2' },
  { question: 'You ___ wear a seatbelt in the car.', options: ['can', 'must', 'might', 'would'], answer: 1, level: 'A2' },
  { question: 'I have ___ finished my homework.', options: ['yet', 'already', 'still', 'since'], answer: 1, level: 'A2' },
];

export function calculatePlacementLevel(correctCount: number): CEFRLevel {
  return correctCount >= 5 ? 'A2' : 'A1';
}
