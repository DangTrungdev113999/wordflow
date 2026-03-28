import { useEffect, useRef } from 'react';
import { useProgressStore } from '../stores/progressStore';
import { useGrammarStore } from '../stores/grammarStore';
import { useStudyPlanStore } from '../stores/studyPlanStore';
import { useMistakeStore } from '../stores/mistakeStore';
import { useToastStore } from '../stores/toastStore';
import { checkAchievements } from '../services/achievementEngine';

export function useAchievements() {
  const { totalWordsLearned, currentStreak, badges, addBadge, xp } = useProgressStore();
  const { lessonProgress } = useGrammarStore();
  const { goals, weeklySnapshots } = useStudyPlanStore();
  const { mistakes } = useMistakeStore();
  const { addToast } = useToastStore();
  const checkedRef = useRef(false);

  const lessonsCompleted = Object.values(lessonProgress).filter((p) => p.completed).length;
  const hasPerfectQuiz = Object.values(lessonProgress).some((p) => p.bestScore === 100);

  // Initial load check only — ongoing achievement checks are handled by eventSubscribers
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    const goalsCreated = goals.length;
    const weeklyGoalsMet = weeklySnapshots.reduce((sum, snap) => {
      const allMet = snap.goals.every(g => g.achieved >= g.target);
      return sum + (allMet ? snap.daysActive : 0);
    }, 0);
    const mistakesReviewed = mistakes.filter(m => m.reviewCount > 0).length;
    const mistakesMastered = mistakes.filter(m => m.interval > 30).length;

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
      sentenceBuildingCount: 0,
      mediaSessionCount: 0,
      grammarLessonsCompleted: lessonsCompleted,
      grammarPerfectQuiz: hasPerfectQuiz ? 1 : 0,
      writingSubmissions: 0,
      sentenceBuildingPerfect: 0,
      challengeStreak: 0,
      goalsCreated,
      weeklyGoalsMet,
      totalMinutesStudied: 0,
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
    }
  }, [totalWordsLearned, currentStreak, lessonsCompleted, hasPerfectQuiz]); // eslint-disable-line react-hooks/exhaustive-deps
}
