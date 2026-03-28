import { describe, it, expect } from 'vitest';
import { PLACEMENT_QUESTIONS, calculatePlacementLevel } from '../placement-questions';

describe('Placement Questions', () => {
  it('has exactly 10 questions', () => {
    expect(PLACEMENT_QUESTIONS).toHaveLength(10);
  });

  it('has 5 A1 and 5 A2 questions', () => {
    const a1 = PLACEMENT_QUESTIONS.filter(q => q.level === 'A1');
    const a2 = PLACEMENT_QUESTIONS.filter(q => q.level === 'A2');
    expect(a1).toHaveLength(5);
    expect(a2).toHaveLength(5);
  });

  it('all questions have 4 options', () => {
    PLACEMENT_QUESTIONS.forEach(q => {
      expect(q.options).toHaveLength(4);
    });
  });

  it('all answer indices are valid (0-3)', () => {
    PLACEMENT_QUESTIONS.forEach(q => {
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThanOrEqual(3);
    });
  });
});

describe('calculatePlacementLevel', () => {
  it('returns A1 when correct < 5', () => {
    expect(calculatePlacementLevel(0)).toBe('A1');
    expect(calculatePlacementLevel(4)).toBe('A1');
  });

  it('returns A2 when correct >= 5', () => {
    expect(calculatePlacementLevel(5)).toBe('A2');
    expect(calculatePlacementLevel(10)).toBe('A2');
  });
});
