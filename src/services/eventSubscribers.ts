import { eventBus } from './eventBus';
import { calculateQuizXP } from './xpEngine';
import { checkAchievements } from './achievementEngine';
import { logWordReviewed, logQuizCompleted, logBonusXP, logDictation, logPronunciation } from './dailyLogService';
import { initMistakeCollector } from './mistakeCollector';
import { useProgressStore } from '../stores/progressStore';
import { useGrammarStore } from '../stores/grammarStore';
import { useToastStore } from '../stores/toastStore';
import { useStudyPlanStore } from '../stores/studyPlanStore';
import { useMistakeStore } from '../stores/mistakeStore';
import { XP_VALUES } from '../lib/constants';
import { db } from '../db/database';

let initialized = false;

export function initEventSubscribers() {
  if (initialized) return;
  initialized = true;

  // Initialize mistake collector (Phase 8)
  initMistakeCollector();
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

  // daily_challenge:complete → bonus XP + toast
  eventBus.on('daily_challenge:complete', () => {
    const { addXP } = useProgressStore.getState();
    addXP(XP_VALUES.daily_challenge_complete);
    useToastStore.getState().addToast({ type: 'xp', title: `+${XP_VALUES.daily_challenge_complete} XP Bonus!`, description: 'All daily tasks completed!' });
    void logBonusXP(XP_VALUES.daily_challenge_complete);
  });

    // pronunciation:correct → XP + dailyLog
  eventBus.on('pronunciation:correct', () => {
    const { addXP } = useProgressStore.getState();
    addXP(XP_VALUES.pronunciation_correct);
    void logPronunciation(true, XP_VALUES.pronunciation_correct);
  });

  // pronunciation:incorrect → no XP (event still fires for achievement tracking)
  eventBus.on('pronunciation:incorrect', () => {
    // No XP for incorrect pronunciation
  });

  // Wildcard: check achievements after ANY event (debounced)
  let achievementCheckTimer: ReturnType<typeof setTimeout> | null = null;

  eventBus.on('*', () => {
    if (achievementCheckTimer) clearTimeout(achievementCheckTimer);
    achievementCheckTimer = setTimeout(async () => {
      const { totalWordsLearned, currentStreak, badges, addBadge, xp } = useProgressStore.getState();
      const { lessonProgress } = useGrammarStore.getState();
      const { addToast } = useToastStore.getState();
      const { goals, weeklySnapshots } = useStudyPlanStore.getState();
      const { mistakes } = useMistakeStore.getState();

      const lessonsCompleted = Object.values(lessonProgress).filter((p) => p.completed).length;
      const hasPerfectQuiz = Object.values(lessonProgress).some((p) => p.bestScore === 100);

      // Query actual counts from database
      const dailyLogs = await db.dailyLogs.toArray();
      const dictationCount = dailyLogs.reduce((sum, log) => sum + (log.dictationCorrect ?? 0), 0);
      const pronunciationCount = dailyLogs.reduce((sum, log) => sum + (log.pronunciationCorrect ?? 0), 0);
      const totalMinutesStudied = dailyLogs.reduce((sum, log) => sum + (log.minutesSpent ?? 0), 0);

      const allChallenges = await db.dailyChallenges.toArray();
      const challengeCount = allChallenges.filter(c => c.completed).length;

      // Count sentence building completions from daily challenge tasks
      const sentenceBuildingCount = allChallenges.reduce((sum, c) => {
        if (!Array.isArray(c.tasks)) return sum;
        return sum + c.tasks.filter(t => t.type === 'sentenceBuilding' && t.completed).length;
      }, 0);

      // Sentence building perfect: count only tasks completed with no wrong attempts (score === 100)
      const sentenceBuildingPerfect = allChallenges.reduce((sum, c) => {
        if (!Array.isArray(c.tasks)) return sum;
        return sum + c.tasks.filter(t => t.type === 'sentenceBuilding' && t.completed && t.score === 100).length;
      }, 0);

      const mediaSessions = await db.mediaSessions.toArray();
      const mediaSessionCount = mediaSessions.filter(s => s.completed).length;

      // Writing submissions count
      const writingSubmissions = await db.writingSubmissions.count();

      // Challenge streak: count consecutive completed days from today backwards
      const sortedChallenges = [...allChallenges]
        .filter(c => c.completed)
        .sort((a, b) => b.date.localeCompare(a.date));
      let challengeStreak = 0;
      if (sortedChallenges.length > 0) {
        let checkDate = new Date().toISOString().split('T')[0];
        for (const c of sortedChallenges) {
          if (c.date === checkDate) {
            challengeStreak++;
            const d = new Date(checkDate);
            d.setDate(d.getDate() - 1);
            checkDate = d.toISOString().split('T')[0];
          } else if (c.date < checkDate) {
            break;
          }
        }
      }

      // Study planner metrics
      const goalsCreated = goals.length;
      const weeklyGoalsMet = weeklySnapshots.filter(snap =>
        snap.daysActive >= 7 && snap.goals.every(g => g.achieved >= g.target)
      ).length;

      // Mistake journal metrics
      const mistakesReviewed = mistakes.filter(m => m.reviewCount > 0).length;
      const mistakesMastered = mistakes.filter(m => m.interval > 30).length;

      const newBadges = checkAchievements({
        totalWords: totalWordsLearned,
        streak: currentStreak,
        lessonsCompleted,
        hasPerfectQuiz,
        currentHour: new Date().getHours(),
        earnedBadges: badges,
        dictationCount,
        challengeCount,
        pronunciationCount,
        sentenceBuildingCount,
        mediaSessionCount,
        grammarLessonsCompleted: lessonsCompleted,
        grammarPerfectQuiz: hasPerfectQuiz ? 1 : 0,
        writingSubmissions,
        sentenceBuildingPerfect,
        challengeStreak,
        goalsCreated,
        weeklyGoalsMet,
        totalMinutesStudied,
        mistakesReviewed,
        mistakesMastered,
        totalXp: xp,
      });

      for (const achievement of newBadges) {
        addBadge(achievement.id);
        addToast({
          type: 'badge',
          title: `${achievement.badge} ${achievement.title}`,
          description: achievement.description,
          icon: achievement.badge,
        });
        eventBus.emit('achievement:unlocked', { id: achievement.id });
      }
    }, 300);
  });
}
