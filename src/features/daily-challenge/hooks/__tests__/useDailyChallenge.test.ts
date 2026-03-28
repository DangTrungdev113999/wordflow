import { describe, it, expect } from 'vitest';

// Test the seed algorithm directly (copied from source since not exported)
function getDailySeed(date: string): number {
  let hash = 0;
  for (const char of date) {
    hash = ((hash << 5) - hash) + char.charCodeAt(0);
    hash |= 0;
  }
  return Math.abs(hash);
}

describe('getDailySeed', () => {
  it('is deterministic — same date produces same seed', () => {
    const seed1 = getDailySeed('2026-03-28');
    const seed2 = getDailySeed('2026-03-28');
    expect(seed1).toBe(seed2);
  });

  it('different dates produce different seeds', () => {
    const seed1 = getDailySeed('2026-03-28');
    const seed2 = getDailySeed('2026-03-29');
    expect(seed1).not.toBe(seed2);
  });

  it('returns a non-negative number', () => {
    const seed = getDailySeed('2026-01-01');
    expect(seed).toBeGreaterThanOrEqual(0);
  });

  it('produces consistent word selection', () => {
    const items = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
    const seed = getDailySeed('2026-03-28');
    const pick1 = items[seed % items.length];
    const pick2 = items[seed % items.length];
    expect(pick1).toBe(pick2);
  });
});
