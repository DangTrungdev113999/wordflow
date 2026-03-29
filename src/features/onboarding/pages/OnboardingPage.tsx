import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { PlacementQuiz } from '../components/PlacementQuiz';
import { PlacementResult } from '../components/PlacementResult';
import { calculatePlacementLevel } from '../data/placement-questions';
import { db } from '../../../db/database';
import { cn } from '../../../lib/utils';
import type { CEFRLevel } from '../../../lib/types';

type Step = 'welcome' | 'quiz' | 'result';

const STEPS: { key: Step; label: string }[] = [
  { key: 'welcome', label: 'Welcome' },
  { key: 'quiz', label: 'Quiz' },
  { key: 'result', label: 'Result' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('welcome');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [level, setLevel] = useState<CEFRLevel>('A1');

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300',
                  i < currentStepIndex
                    ? 'bg-indigo-500 text-white'
                    : i === currentStepIndex
                      ? 'bg-indigo-500 text-white ring-4 ring-indigo-500/20'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500',
                )}
                animate={i === currentStepIndex ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {i < currentStepIndex ? '✓' : i + 1}
              </motion.div>
              <span
                className={cn(
                  'text-xs font-medium',
                  i <= currentStepIndex
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400 dark:text-gray-500',
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="relative w-12 h-0.5 bg-gray-200 dark:bg-gray-800 rounded-full mb-5">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: i < currentStepIndex ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

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
