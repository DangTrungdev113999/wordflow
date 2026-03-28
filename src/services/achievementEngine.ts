import achievementsData from '../data/achievements.json';
import type { AchievementDefinition, AchievementContext } from '../lib/types';

const ACHIEVEMENTS = achievementsData as AchievementDefinition[];

export function getAllAchievements(): AchievementDefinition[] {
  return ACHIEVEMENTS;
}

export function checkAchievements(context: AchievementContext): AchievementDefinition[] {
  const newlyUnlocked: AchievementDefinition[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (context.earnedBadges.includes(achievement.id)) continue;

    let met = false;
    switch (achievement.condition.type) {
      case 'totalWords':
        met = context.totalWords >= achievement.condition.value;
        break;
      case 'streak':
        met = context.streak >= achievement.condition.value;
        break;
      case 'lessonsCompleted':
        met = context.lessonsCompleted >= achievement.condition.value;
        break;
      case 'perfectQuiz':
        met = context.hasPerfectQuiz;
        break;
      case 'nightOwl':
        met = context.currentHour >= achievement.condition.value;
        break;
      case 'dictationCount':
        met = context.dictationCount >= achievement.condition.value;
        break;
      case 'challengeCount':
        met = context.challengeCount >= achievement.condition.value;
        break;
      case 'pronunciationCount':
        met = context.pronunciationCount >= achievement.condition.value;
        break;
      case 'sentenceBuildingCount':
        met = context.sentenceBuildingCount >= achievement.condition.value;
        break;
      case 'mediaSessionCount':
        met = context.mediaSessionCount >= achievement.condition.value;
        break;
    }

    if (met) newlyUnlocked.push(achievement);
  }

  return newlyUnlocked;
}
