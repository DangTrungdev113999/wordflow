import { describe, it, expect } from 'vitest';
import { XP_VALUES } from '../../lib/constants';

describe('XP Values - Phase 4', () => {
  it('dictation_correct = 10', () => {
    expect(XP_VALUES.dictation_correct).toBe(10);
  });

  it('dictation_session_perfect = 30', () => {
    expect(XP_VALUES.dictation_session_perfect).toBe(30);
  });

  it('daily_challenge_complete = 50', () => {
    expect(XP_VALUES.daily_challenge_complete).toBe(50);
  });

  it('pronunciation_correct = 5', () => {
    expect(XP_VALUES.pronunciation_correct).toBe(5);
  });
});
