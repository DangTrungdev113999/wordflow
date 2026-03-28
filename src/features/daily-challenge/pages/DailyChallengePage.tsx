import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Flame } from 'lucide-react';
import { Link } from 'react-router';
import { useDailyChallenge, TASK_ORDER } from '../hooks/useDailyChallenge';
import { ChallengeTaskList } from '../components/ChallengeTaskList';
import { ChallengeWordTask } from '../components/ChallengeWordTask';
import { ChallengeGrammarTask } from '../components/ChallengeGrammarTask';
import { ChallengeDictationTask } from '../components/ChallengeDictationTask';
import { ChallengeSentenceBuildingTask } from '../components/ChallengeSentenceBuildingTask';
import { ChallengeMediaTask } from '../components/ChallengeMediaTask';
import { Card } from '../../../components/ui/Card';
import { useProgressStore } from '../../../stores/progressStore';

export function DailyChallengePage() {
  const { date, tasks, content, completed, xpEarned, loading, completeTask } = useDailyChallenge();
  const currentStreak = useProgressStore(s => s.currentStreak);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const taskMap = new Map(tasks.map(t => [t.type, t.completed]));
  const activeTask = completed ? null : TASK_ORDER.find(t => !taskMap.get(t)) ?? null;
  const doneCount = tasks.filter(t => t.completed).length;

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
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Daily Challenge</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
        </div>
        {currentStreak > 0 && (
          <div className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full">
            <Flame size={13} />
            {currentStreak}
          </div>
        )}
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
          {doneCount}/5
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.03 }}>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(doneCount / 5) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
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
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You earned <span className="font-bold text-indigo-600 dark:text-indigo-400">{xpEarned} XP</span> today
            </p>
            {currentStreak > 1 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center justify-center gap-1">
                <Flame size={12} /> {currentStreak}-day streak!
              </p>
            )}
          </Card>
        </motion.div>
      )}

      {/* Task components */}
      <div className="space-y-3">
        {/* Task 1: Learn Word */}
        {(activeTask === 'learnWord' || taskMap.get('learnWord')) && (
          <ChallengeWordTask
            word={content.word}
            done={taskMap.get('learnWord') ?? false}
            onComplete={() => completeTask('learnWord')}
          />
        )}

        {/* Task 2: Grammar Quiz */}
        {(activeTask === 'grammarQuiz' || taskMap.get('grammarQuiz')) && (
          <ChallengeGrammarTask
            exercise={content.exercise}
            done={taskMap.get('grammarQuiz') ?? false}
            onComplete={() => completeTask('grammarQuiz')}
          />
        )}

        {/* Task 3: Sentence Building */}
        {(activeTask === 'sentenceBuilding' || taskMap.get('sentenceBuilding')) && (
          <ChallengeSentenceBuildingTask
            sentence={content.sentence}
            done={taskMap.get('sentenceBuilding') ?? false}
            onComplete={(score) => completeTask('sentenceBuilding', score)}
          />
        )}

        {/* Task 4: Dictation */}
        {(activeTask === 'dictation' || taskMap.get('dictation')) && (
          <ChallengeDictationTask
            word={content.word}
            done={taskMap.get('dictation') ?? false}
            onComplete={() => completeTask('dictation')}
          />
        )}

        {/* Task 5: Media Vocab */}
        {(activeTask === 'mediaVocab' || taskMap.get('mediaVocab')) && (
          <ChallengeMediaTask
            word={content.mediaWord}
            options={content.mediaOptions}
            done={taskMap.get('mediaVocab') ?? false}
            onComplete={(score) => completeTask('mediaVocab', score)}
          />
        )}
      </div>
    </div>
  );
}
