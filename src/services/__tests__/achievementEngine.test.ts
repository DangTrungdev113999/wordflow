import { describe, it, expect } from 'vitest';
import { checkAchievements } from '../achievementEngine';
import type { AchievementContext } from '../../lib/types';

const baseContext: AchievementContext = {
  totalWords: 0,
  streak: 0,
  lessonsCompleted: 0,
  hasPerfectQuiz: false,
  currentHour: 12,
  earnedBadges: [],
  dictationCount: 0,
  challengeCount: 0,
  pronunciationCount: 0,
};

describe('achievementEngine - Phase 4 conditions', () => {
  it('unlocks dictation_10 when dictationCount >= 10', () => {
    const badges = checkAchievements({ ...baseContext, dictationCount: 10 });
    expect(badges.some(b => b.id === 'dictation_10')).toBe(true);
  });

  it('unlocks dictation_50 when dictationCount >= 50', () => {
    const badges = checkAchievements({ ...baseContext, dictationCount: 50 });
    expect(badges.some(b => b.id === 'dictation_50')).toBe(true);
  });

  it('unlocks daily_challenge_7 when challengeCount >= 7', () => {
    const badges = checkAchievements({ ...baseContext, challengeCount: 7 });
    expect(badges.some(b => b.id === 'daily_challenge_7')).toBe(true);
  });

  it('unlocks pronunciation_10 when pronunciationCount >= 10', () => {
    const badges = checkAchievements({ ...baseContext, pronunciationCount: 10 });
    expect(badges.some(b => b.id === 'pronunciation_10')).toBe(true);
  });

  it('does not re-award already earned badges', () => {
    const badges = checkAchievements({ ...baseContext, dictationCount: 10, earnedBadges: ['dictation_10'] });
    expect(badges.some(b => b.id === 'dictation_10')).toBe(false);
  });

  it('does not unlock when count below threshold', () => {
    const badges = checkAchievements({ ...baseContext, dictationCount: 5 });
    expect(badges.some(b => b.id === 'dictation_10')).toBe(false);
  });
});
