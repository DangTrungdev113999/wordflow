import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { useDailyChallenge } from '../hooks/useDailyChallenge';

export function DailyChallengeCard() {
  const { word, tasks, completed, xpEarned, loading } = useDailyChallenge();

  if (loading) return null;

  const doneCount = [tasks.learnWord, tasks.grammarQuiz, tasks.dictation].filter(Boolean).length;
  const started = doneCount > 0;

  return (
    <Link to="/daily-challenge" className="block">
      <Card className="group hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
        {completed ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">✅ Challenge Complete!</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Earned {xpEarned} XP today</p>
            </div>
            <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400" />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">🎯 Today's Challenge</p>
              {started ? (
                <p className="text-xs text-indigo-500 mt-0.5">{doneCount}/3 tasks done — Continue</p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Word: <span className="font-medium text-indigo-600 dark:text-indigo-400">{word.word}</span></p>
              )}
            </div>
            <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full group-hover:bg-indigo-600 transition-colors">
              {started ? 'Continue' : 'Start'}
            </span>
          </div>
        )}
      </Card>
    </Link>
  );
}
