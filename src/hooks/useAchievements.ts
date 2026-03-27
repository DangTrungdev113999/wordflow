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

  useEffect(() => {
    // Debounce: don't check on initial render with empty data
    if (checkedRef.current && totalWordsLearned === 0 && currentStreak === 0) return;
    checkedRef.current = true;

    const newBadges = checkAchievements({
      totalWords: totalWordsLearned,
      streak: currentStreak,
      lessonsCompleted,
      hasPerfectQuiz,
      currentHour: new Date().getHours(),
      earnedBadges: badges,
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
