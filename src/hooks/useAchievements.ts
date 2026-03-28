import { useEffect, useRef } from 'react';
import { useProgressStore } from '../stores/progressStore';
import { useGrammarStore } from '../stores/grammarStore';
import { useToastStore } from '../stores/toastStore';
import { checkAchievements } from '../services/achievementEngine';

export function useAchievements() {
  const { totalWordsLearned, currentStreak, badges, addBadge } = useProgressStore();
  const { lessonProgress } = useGrammarStore();
  const { addToast } = useToastStore();
  const checkedRef = useRef(false);

  const lessonsCompleted = Object.values(lessonProgress).filter((p) => p.completed).length;
  const hasPerfectQuiz = Object.values(lessonProgress).some((p) => p.bestScore === 100);

  // Initial load check only — ongoing achievement checks are handled by eventSubscribers
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

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
  }, [totalWordsLearned, currentStreak, lessonsCompleted, hasPerfectQuiz]); // eslint-disable-line react-hooks/exhaustive-deps
}
