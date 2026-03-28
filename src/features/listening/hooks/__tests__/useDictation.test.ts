import { describe, it, expect } from 'vitest';

// Copied from source (not exported)
function extractPhrase(example: string, targetWord: string): string {
  const words = example.replace(/[.,!?;:'"]/g, '').split(/\s+/);
  const idx = words.findIndex(w => w.toLowerCase() === targetWord.toLowerCase());
  if (idx === -1) return targetWord;
  const start = Math.max(0, idx - 1);
  const end = Math.min(words.length, idx + 2);
  return words.slice(start, end).join(' ');
}

function checkAnswer(input: string, target: string): boolean {
  const normalized = input.toLowerCase().trim().replace(/\s+/g, ' ');
  const expected = target.toLowerCase().trim().replace(/\s+/g, ' ');
  return normalized === expected;
}

describe('checkAnswer', () => {
  it('exact match returns true', () => {
    expect(checkAnswer('breakfast', 'breakfast')).toBe(true);
  });

  it('case-insensitive', () => {
    expect(checkAnswer('Breakfast', 'breakfast')).toBe(true);
    expect(checkAnswer('HELLO', 'hello')).toBe(true);
  });

  it('trims whitespace', () => {
    expect(checkAnswer('  breakfast  ', 'breakfast')).toBe(true);
  });

  it('normalizes extra spaces', () => {
    expect(checkAnswer('good  morning', 'good morning')).toBe(true);
  });

  it('wrong answer returns false', () => {
    expect(checkAnswer('brekfast', 'breakfast')).toBe(false);
  });

  it('empty input returns false', () => {
    expect(checkAnswer('', 'breakfast')).toBe(false);
  });
});

describe('extractPhrase', () => {
  it('extracts 2-3 word chunk containing target', () => {
    const phrase = extractPhrase('I have breakfast at 7 AM every day.', 'breakfast');
    expect(phrase).toContain('breakfast');
    const words = phrase.split(' ');
    expect(words.length).toBeGreaterThanOrEqual(2);
    expect(words.length).toBeLessThanOrEqual(3);
  });

  it('falls back to targetWord when not found', () => {
    const phrase = extractPhrase('This sentence has no match.', 'zebra');
    expect(phrase).toBe('zebra');
  });

  it('handles word at beginning of sentence', () => {
    const phrase = extractPhrase('Breakfast is important.', 'Breakfast');
    expect(phrase.toLowerCase()).toContain('breakfast');
  });

  it('handles word at end of sentence', () => {
    const phrase = extractPhrase('I like breakfast.', 'breakfast');
    expect(phrase.toLowerCase()).toContain('breakfast');
  });
});
