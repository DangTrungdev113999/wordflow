import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { METRIC_LABELS, METRIC_UNITS } from '../../../models/StudyPlan';
import type { GoalProgress } from '../../../hooks/useStudyProgress';

const METRIC_COLORS: Record<string, { ring: string; text: string; bg: string }> = {
  words: { ring: '#6366f1', text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  xp: { ring: '#8b5cf6', text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  minutes: { ring: '#06b6d4', text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  lessons: { ring: '#10b981', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  quizAccuracy: { ring: '#f59e0b', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
};

interface GoalCardProps {
  data: GoalProgress;
  onRemove: (id: string) => void;
}

export function GoalCard({ data, onRemove }: GoalCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { goal, current, percentage, isComplete } = data;
  const colors = METRIC_COLORS[goal.metric] ?? METRIC_COLORS.words;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 group ${
        isComplete ? 'ring-2 ring-emerald-400/50' : ''
      }`}
    >
      <button
        onClick={() => setShowConfirm(true)}
        className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 dark:text-gray-700 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        title="Remove goal"
      >
        <Trash2 size={14} />
      </button>

      <div className="flex items-center gap-4">
        {/* Circular progress */}
        <div className="relative flex-shrink-0">
          <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-gray-100 dark:text-gray-800"
            />
            <motion.circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke={colors.ring}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-lg font-bold ${colors.text}`}>
              {percentage}%
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${colors.bg} ${colors.text}`}>
              {goal.type}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {METRIC_LABELS[goal.metric]}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {current} / {goal.target} {METRIC_UNITS[goal.metric]}
          </p>
          {isComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-medium text-emerald-500 mt-1"
            >
              Goal reached!
            </motion.p>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => onRemove(goal.id)}
        title="Remove goal?"
        description="This goal and its progress tracking will be removed."
        confirmLabel="Remove"
      />
    </motion.div>
  );
}
