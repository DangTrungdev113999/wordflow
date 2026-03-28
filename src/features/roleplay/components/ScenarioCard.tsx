import type { Scenario } from '../hooks/useRoleplay';
import { cn } from '../../../lib/utils';

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

interface ScenarioCardProps {
  scenario: Scenario;
  onSelect: (scenario: Scenario) => void;
}

export function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
  return (
    <button
      onClick={() => onSelect(scenario)}
      className="text-left bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0 w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
          {scenario.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {scenario.titleVi}
            </h3>
            <span className={cn('px-1.5 py-0.5 text-[10px] font-bold rounded shrink-0', LEVEL_COLORS[scenario.level] || '')}>
              {scenario.level}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
            {scenario.descriptionVi}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            {scenario.maxTurns} lượt · {scenario.userRoleVi}
          </p>
        </div>
      </div>
    </button>
  );
}
