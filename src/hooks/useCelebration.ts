import { useState, useEffect, useCallback } from 'react';
import { eventBus } from '../services/eventBus';

export function useCelebration() {
  const [showConfetti, setShowConfetti] = useState(false);

  const celebrate = useCallback(() => {
    setShowConfetti(true);
  }, []);

  const dismissConfetti = useCallback(() => {
    setShowConfetti(false);
  }, []);

  useEffect(() => {
    const handleGoalMet = () => celebrate();
    const handleQuizComplete = ({ correct, total }: { correct: number; total: number }) => {
      if (correct === total && total > 0) celebrate();
    };
    const handleDictationPerfect = ({ correct, total }: { correct: number; total: number }) => {
      if (correct === total && total > 0) celebrate();
    };
    const handleChallengeComplete = () => celebrate();
    const handleAchievement = () => celebrate();

    eventBus.on('daily_goal:met', handleGoalMet);
    eventBus.on('quiz:complete', handleQuizComplete);
    eventBus.on('dictation:session_complete', handleDictationPerfect);
    eventBus.on('daily_challenge:complete', handleChallengeComplete);
    eventBus.on('achievement:unlocked', handleAchievement);

    return () => {
      eventBus.off('daily_goal:met', handleGoalMet);
      eventBus.off('quiz:complete', handleQuizComplete);
      eventBus.off('dictation:session_complete', handleDictationPerfect);
      eventBus.off('daily_challenge:complete', handleChallengeComplete);
      eventBus.off('achievement:unlocked', handleAchievement);
    };
  }, [celebrate]);

  return { showConfetti, celebrate, dismissConfetti };
}
