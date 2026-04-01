import { CheckCircle2, Circle } from 'lucide-react';
import type { DailyChallengeTask, DailyChallengeTaskType } from '../../../db/models';
import { TASK_ORDER, TASK_LABELS } from '../hooks/useDailyChallenge';

interface Props {
  tasks: DailyChallengeTask[];
  activeTask: DailyChallengeTaskType | null;
}

export function ChallengeTaskList({ tasks, activeTask }: Props) {
  const taskMap = new Map(tasks.map(t => [t.type, t.completed]));

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {TASK_ORDER.map((type) => {
        const isDone = taskMap.get(type) ?? false;
        const isActive = type === activeTask;
        const { label, icon } = TASK_LABELS[type];

        return (
          <div
            key={type}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              isDone
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : isActive
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {isDone ? <CheckCircle2 size={11} /> : <Circle size={11} />}
            <span>{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
