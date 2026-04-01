import { useState } from 'react';
import { Filter } from 'lucide-react';
import type { Scenario } from '../hooks/useRoleplay';
import { ScenarioCard } from './ScenarioCard';
import { cn } from '../../../lib/utils';

const CATEGORY_LABELS: Record<string, string> = {
  daily: 'Hàng ngày',
  travel: 'Du lịch',
  work: 'Công việc',
  social: 'Xã hội',
};

interface ScenarioGridProps {
  scenarios: Scenario[];
  onSelect: (scenario: Scenario) => void;
}

export function ScenarioGrid({ scenarios, onSelect }: ScenarioGridProps) {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const categories = [...new Set(scenarios.map((s) => s.category))];
  const filtered = filterCategory ? scenarios.filter((s) => s.category === filterCategory) : scenarios;

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter size={16} className="text-gray-600 dark:text-gray-400 shrink-0" />
        <button
          onClick={() => setFilterCategory(null)}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-colors',
            !filterCategory
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
              : 'bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:text-gray-400',
          )}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              filterCategory === cat
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                : 'bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:text-gray-400',
            )}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((s) => (
          <ScenarioCard key={s.id} scenario={s} onSelect={onSelect} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 py-8">
          Không có kịch bản phù hợp
        </p>
      )}
    </div>
  );
}
