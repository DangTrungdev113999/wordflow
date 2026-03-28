import { CheckCircle2, Circle } from 'lucide-react';
import type { TaskName } from '../hooks/useDailyChallenge';

const TASK_LABELS: Record<TaskName, string> = {
  learnWord: '📖 Learn Word',
  grammarQuiz: '📝 Grammar Quiz',
  dictation: '🎧 Dictation',
};

const TASK_ORDER: TaskName[] = ['learnWord', 'grammarQuiz', 'dictation'];

interface Props {
  tasks: Record<TaskName, boolean>;
  activeTask: TaskName | null;
}

export function ChallengeTaskList({ tasks, activeTask }: Props) {
  return (
    <div className="flex items-center gap-2">
      {TASK_ORDER.map((task) => (
        <div
          key={task}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            tasks[task]
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : task === activeTask
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}
        >
          {tasks[task] ? <CheckCircle2 size={12} /> : <Circle size={12} />}
          {TASK_LABELS[task]}
        </div>
      ))}
    </div>
  );
}
