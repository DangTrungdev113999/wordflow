import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { PlacementQuiz } from '../components/PlacementQuiz';
import { PlacementResult } from '../components/PlacementResult';
import { calculatePlacementLevel } from '../data/placement-questions';
import { db } from '../../../db/database';
import type { CEFRLevel } from '../../../lib/types';

type Step = 'welcome' | 'quiz' | 'result';

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('welcome');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [level, setLevel] = useState<CEFRLevel>('A1');

  async function savePlacement(placementLevel: CEFRLevel) {
    await db.userProfile.update('default', {
      placementDone: true,
      placementLevel: placementLevel,
    });
  }

  async function handleSkip() {
    await savePlacement('A1');
    navigate('/');
  }

  function handleQuizComplete(correctCount: number, totalQuestions: number) {
    const determined = calculatePlacementLevel(correctCount);
    setScore(correctCount);
    setTotal(totalQuestions);
    setLevel(determined);
    setStep('result');
  }

  async function handleStartLearning() {
    await savePlacement(level);
    navigate('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <WelcomeScreen
            key="welcome"
            onStart={() => setStep('quiz')}
            onSkip={handleSkip}
          />
        )}
        {step === 'quiz' && (
          <PlacementQuiz key="quiz" onComplete={handleQuizComplete} />
        )}
        {step === 'result' && (
          <PlacementResult
            key="result"
            level={level}
            score={score}
            totalQuestions={total}
            onStartLearning={handleStartLearning}
            onRedoTest={() => setStep('quiz')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
