import { motion } from 'framer-motion';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router';
import { useDailyChallenge, type TaskName } from '../hooks/useDailyChallenge';
import { ChallengeTaskList } from '../components/ChallengeTaskList';
import { ChallengeWordTask } from '../components/ChallengeWordTask';
import { ChallengeGrammarTask } from '../components/ChallengeGrammarTask';
import { ChallengeDictationTask } from '../components/ChallengeDictationTask';
import { Card } from '../../../components/ui/Card';

const TASK_ORDER: TaskName[] = ['learnWord', 'grammarQuiz', 'dictation'];

export function DailyChallengePage() {
  const { date, word, exercise, tasks, completed, xpEarned, loading, completeTask } = useDailyChallenge();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeTask = completed ? null : TASK_ORDER.find((t) => !tasks[t]) ?? null;
  const doneCount = TASK_ORDER.filter((t) => tasks[t]).length;

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="px-4 py-6 space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <Link to="/" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Daily Challenge</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
        </div>
        <div className="ml-auto text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
          {doneCount}/3
        </div>
      </motion.div>

      {/* Task progress pills */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <ChallengeTaskList tasks={tasks} activeTask={activeTask} />
      </motion.div>

      {/* Completion celebration */}
      {completed && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="text-center border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30">
            <Trophy size={40} className="mx-auto text-yellow-500 mb-2" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Challenge Complete!</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">You earned <span className="font-bold text-indigo-600 dark:text-indigo-400">{xpEarned} XP</span> today</p>
          </Card>
        </motion.div>
      )}

      {/* Active task or completed tasks */}
      <div className="space-y-3">
        {/* Task 1: Learn Word */}
        {(activeTask === 'learnWord' || tasks.learnWord) && (
          <ChallengeWordTask word={word} done={tasks.learnWord} onComplete={() => completeTask('learnWord')} />
        )}

        {/* Task 2: Grammar Quiz */}
        {(activeTask === 'grammarQuiz' || tasks.grammarQuiz) && (
          <ChallengeGrammarTask exercise={exercise} done={tasks.grammarQuiz} onComplete={() => completeTask('grammarQuiz')} />
        )}

        {/* Task 3: Dictation */}
        {(activeTask === 'dictation' || tasks.dictation) && (
          <ChallengeDictationTask word={word} done={tasks.dictation} onComplete={() => completeTask('dictation')} />
        )}
      </div>
    </div>
  );
}
