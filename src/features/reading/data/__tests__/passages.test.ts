import { describe, it, expect } from 'vitest';
import { READING_PASSAGES } from '../passages';

describe('READING_PASSAGES data integrity', () => {
  it('has at least one passage', () => {
    expect(READING_PASSAGES.length).toBeGreaterThan(0);
  });

  it('every passage has a unique id', () => {
    const ids = READING_PASSAGES.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every passage has a valid CEFR level', () => {
    const valid = new Set(['A1', 'A2', 'B1', 'B2']);
    for (const p of READING_PASSAGES) {
      expect(valid.has(p.level)).toBe(true);
    }
  });

  it('every passage has at least one question', () => {
    for (const p of READING_PASSAGES) {
      expect(p.questions.length).toBeGreaterThan(0);
    }
  });

  it('every passage has non-empty text and title', () => {
    for (const p of READING_PASSAGES) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.text.length).toBeGreaterThan(0);
    }
  });

  it('every passage has highlightedWords array', () => {
    for (const p of READING_PASSAGES) {
      expect(Array.isArray(p.highlightedWords)).toBe(true);
      expect(p.highlightedWords.length).toBeGreaterThan(0);
    }
  });

  it('multiple_choice questions have options and a valid answer index', () => {
    for (const p of READING_PASSAGES) {
      for (const q of p.questions) {
        if (q.type === 'multiple_choice') {
          expect(q.options).toBeDefined();
          expect(q.options!.length).toBeGreaterThanOrEqual(2);
          expect(typeof q.answer).toBe('number');
          expect(q.answer).toBeGreaterThanOrEqual(0);
          expect(q.answer as number).toBeLessThan(q.options!.length);
        }
      }
    }
  });

  it('true_false questions have a boolean answer', () => {
    for (const p of READING_PASSAGES) {
      for (const q of p.questions) {
        if (q.type === 'true_false') {
          expect(typeof q.answer).toBe('boolean');
        }
      }
    }
  });

  it('fill_blank questions have a string answer', () => {
    for (const p of READING_PASSAGES) {
      for (const q of p.questions) {
        if (q.type === 'fill_blank') {
          expect(typeof q.answer).toBe('string');
          expect((q.answer as string).length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('every question has an explanation', () => {
    for (const p of READING_PASSAGES) {
      for (const q of p.questions) {
        expect(q.explanation.length).toBeGreaterThan(0);
      }
    }
  });

  it('wordCount is a positive number', () => {
    for (const p of READING_PASSAGES) {
      expect(p.wordCount).toBeGreaterThan(0);
    }
  });
});
