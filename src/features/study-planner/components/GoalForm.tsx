import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudyPlanStore } from '../../../stores/studyPlanStore';
import { METRIC_LABELS } from '../../../models/StudyPlan';
import type { StudyGoal } from '../../../models/StudyPlan';

const METRIC_OPTIONS: { value: StudyGoal['metric']; defaults: Record<string, number> }[] = [
  { value: 'words', defaults: { daily: 10, weekly: 50 } },
  { value: 'xp', defaults: { daily: 50, weekly: 300 } },
  { value: 'minutes', defaults: { daily: 30, weekly: 150 } },
  { value: 'lessons', defaults: { daily: 1, weekly: 5 } },
  { value: 'quizAccuracy', defaults: { daily: 80, weekly: 80 } },
];

export function GoalForm() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'daily' | 'weekly'>('daily');
  const [metric, setMetric] = useState<StudyGoal['metric']>('words');
  const [target, setTarget] = useState(10);
  const addGoal = useStudyPlanStore((s) => s.addGoal);

  function handleMetricChange(m: StudyGoal['metric']) {
    setMetric(m);
    const opt = METRIC_OPTIONS.find((o) => o.value === m);
    if (opt) setTarget(opt.defaults[type]);
  }

  function handleTypeChange(t: 'daily' | 'weekly') {
    setType(t);
    const opt = METRIC_OPTIONS.find((o) => o.value === metric);
    if (opt) setTarget(opt.defaults[t]);
  }

  function handleSubmit() {
    if (target <= 0) return;
    addGoal({ type, metric, target });
    setOpen(false);
    setType('daily');
    setMetric('words');
    setTarget(10);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-400 dark:text-gray-500 hover:border-indigo-300 hover:text-indigo-500 dark:hover:border-indigo-700 dark:hover:text-indigo-400 transition-colors"
      >
        <Plus size={16} />
        Add Goal
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">New Goal</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Type toggle */}
              <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4">
                {(['daily', 'weekly'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTypeChange(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      type === t
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {t === 'daily' ? 'Daily' : 'Weekly'}
                  </button>
                ))}
              </div>

              {/* Metric */}
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Metric
              </label>
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {METRIC_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleMetricChange(opt.value)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                      metric === opt.value
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-700'
                    }`}
                  >
                    {METRIC_LABELS[opt.value]}
                  </button>
                ))}
              </div>

              {/* Target */}
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Target
              </label>
              <input
                type="number"
                min={1}
                max={metric === 'quizAccuracy' ? 100 : 9999}
                value={target}
                onChange={(e) => setTarget(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-5"
              />

              <button
                onClick={handleSubmit}
                className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
              >
                Create Goal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
