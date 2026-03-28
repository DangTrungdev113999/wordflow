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
    const { type, value } = achievement.condition;

    switch (type) {
      case 'totalWords':
        met = context.totalWords >= value;
        break;
      case 'streak':
        met = context.streak >= value;
        break;
      case 'lessonsCompleted':
        met = context.lessonsCompleted >= value;
        break;
      case 'perfectQuiz':
        met = context.hasPerfectQuiz;
        break;
      case 'nightOwl':
        met = context.currentHour >= value;
        break;
      case 'dictationCount':
        met = context.dictationCount >= value;
        break;
      case 'challengeCount':
        met = context.challengeCount >= value;
        break;
      case 'pronunciationCount':
        met = context.pronunciationCount >= value;
        break;
      case 'sentenceBuildingCount':
        met = context.sentenceBuildingCount >= value;
        break;
      case 'mediaSessionCount':
        met = context.mediaSessionCount >= value;
        break;
      case 'grammarLessonsCompleted':
        met = context.grammarLessonsCompleted >= value;
        break;
      case 'grammarPerfectQuiz':
        met = context.grammarPerfectQuiz >= value;
        break;
      case 'writingSubmissions':
        met = context.writingSubmissions >= value;
        break;
      case 'sentenceBuildingPerfect':
        met = context.sentenceBuildingPerfect >= value;
        break;
      case 'challengeStreak':
        met = context.challengeStreak >= value;
        break;
      case 'goalsCreated':
        met = context.goalsCreated >= value;
        break;
      case 'weeklyGoalsMet':
        met = context.weeklyGoalsMet >= value;
        break;
      case 'totalMinutesStudied':
        met = context.totalMinutesStudied >= value;
        break;
      case 'mistakesReviewed':
        met = context.mistakesReviewed >= value;
        break;
      case 'mistakesMastered':
        met = context.mistakesMastered >= value;
        break;
      case 'totalXp':
        met = context.totalXp >= value;
        break;
    }

    if (met) newlyUnlocked.push(achievement);
  }

  return newlyUnlocked;
}
