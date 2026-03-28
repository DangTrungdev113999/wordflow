import { eventBus } from './eventBus';
import { calculateQuizXP } from './xpEngine';
import { checkAchievements } from './achievementEngine';
import { logWordReviewed, logQuizCompleted, logBonusXP, logDictation } from './dailyLogService';
import { useProgressStore } from '../stores/progressStore';
import { useGrammarStore } from '../stores/grammarStore';
import { useToastStore } from '../stores/toastStore';
import { XP_VALUES } from '../lib/constants';

export function initEventSubscribers() {
  // flashcard:correct → XP + dailyLog
  eventBus.on('flashcard:correct', ({ rating }) => {
    const { addXP } = useProgressStore.getState();

    let action: 'flashcard_easy' | 'flashcard_hard' | 'flashcard_correct';
    if (rating === 5) action = 'flashcard_easy';
    else if (rating === 2) action = 'flashcard_hard';
    else action = 'flashcard_correct';

    const xp = XP_VALUES[action];
    addXP(xp);

    // DailyLog is handled by word:learned / word:reviewed events from the hook
    // XP is included in those log calls
    void logWordReviewed(xp);
  });

  // word:learned → increment counter + dailyLog
  eventBus.on('word:learned', () => {
    const { incrementWordsLearned } = useProgressStore.getState();
    incrementWordsLearned();
  });

  // quiz:complete → XP + dailyLog
  eventBus.on('quiz:complete', ({ correct, total }) => {
    const { addXP } = useProgressStore.getState();
    const xp = calculateQuizXP(correct, total);
    addXP(xp.totalXP);
    void logQuizCompleted(correct, total, xp.totalXP);
  });

  // daily_goal:met → bonus XP
  eventBus.on('daily_goal:met', () => {
    const { addXP } = useProgressStore.getState();
    addXP(XP_VALUES.daily_goal_met);
    void logBonusXP(XP_VALUES.daily_goal_met);
  });

  // streak:updated → placeholder for future use
  eventBus.on('streak:updated', (_data) => {
    // Future: streak bonus, streak-based achievements
  });

  // word:mastered → placeholder
  eventBus.on('word:mastered', (_data) => {
    // Future: mastery-based achievements
  });

  // dictation:correct → XP + dailyLog
  eventBus.on('dictation:correct', () => {
    const { addXP } = useProgressStore.getState();
    addXP(XP_VALUES.dictation_correct);
    void logDictation(true, XP_VALUES.dictation_correct);
  });

  // dictation:incorrect → dailyLog only
  eventBus.on('dictation:incorrect', () => {
    void logDictation(false, 0);
  });

  // dictation:session_complete → bonus XP if perfect
  eventBus.on('dictation:session_complete', ({ correct, total }) => {
    if (correct === total) {
      const { addXP } = useProgressStore.getState();
      addXP(XP_VALUES.dictation_session_perfect);
      void logBonusXP(XP_VALUES.dictation_session_perfect);
    }
  });

  // Wildcard: check achievements after ANY event
  eventBus.on('*', () => {
    const { totalWordsLearned, currentStreak, badges, addBadge } = useProgressStore.getState();
    const { lessonProgress } = useGrammarStore.getState();
    const { addToast } = useToastStore.getState();

    const lessonsCompleted = Object.values(lessonProgress).filter((p) => p.completed).length;
    const hasPerfectQuiz = Object.values(lessonProgress).some((p) => p.bestScore === 100);

    const newBadges = checkAchievements({
      totalWords: totalWordsLearned,
      streak: currentStreak,
      lessonsCompleted,
      hasPerfectQuiz,
      currentHour: new Date().getHours(),
      earnedBadges: badges,
      dictationCount: 0,
      challengeCount: 0,
      pronunciationCount: 0,
    });

    for (const achievement of newBadges) {
      addBadge(achievement.id);
      addToast({
        type: 'badge',
        title: `${achievement.badge} ${achievement.title}`,
        description: achievement.description,
        icon: achievement.badge,
      });
    }
  });
}
