import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, AlertCircle } from 'lucide-react';
import { useReviewSchedule } from '../hooks/useReviewSchedule';
import { cn } from '../../../lib/utils';

const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function getDayLabelsFromToday(): string[] {
  const today = new Date().getDay(); // 0=Sun
  const labels: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = (today + i) % 7;
    labels.push(i === 0 ? 'Nay' : DAY_LABELS[d === 0 ? 6 : d - 1]);
  }
  return labels;
}

/**
 * Dashboard card showing review schedule with 7-day forecast bars.
 */
export function ReviewSchedule() {
  const { dueToday, dueTomorrow, dueThisWeek, overdueCount, forecast, loading } = useReviewSchedule();

  if (loading) return null;

  const totalDue = dueToday;
  const hasWork = dueThisWeek > 0 || overdueCount > 0;

  if (!hasWork) return null;

  const maxBar = Math.max(...forecast, 1);
  const dayLabels = getDayLabelsFromToday();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <Calendar size={18} className="text-indigo-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Lịch ôn tập
            </h3>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              Tuần này: {dueThisWeek} từ
            </p>
          </div>
        </div>

        {totalDue > 0 && (
          <Link
            to="/vocabulary/mixed-review?source=due"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors active:scale-95"
          >
            Ôn ngay
            <ChevronRight size={14} />
          </Link>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={cn(
          'rounded-xl px-3 py-2.5 text-center',
          totalDue > 0
            ? 'bg-red-50 dark:bg-red-900/20'
            : 'bg-gray-50 dark:bg-gray-800/60',
        )}>
          <p className={cn(
            'text-lg font-bold tabular-nums',
            totalDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400',
          )}>
            {totalDue}
          </p>
          <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Hôm nay
          </p>
        </div>
        <div className="rounded-xl px-3 py-2.5 text-center bg-gray-50 dark:bg-gray-800/60">
          <p className="text-lg font-bold tabular-nums text-gray-700 dark:text-gray-300">
            {dueTomorrow}
          </p>
          <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Ngày mai
          </p>
        </div>
        <div className="rounded-xl px-3 py-2.5 text-center bg-gray-50 dark:bg-gray-800/60">
          <p className="text-lg font-bold tabular-nums text-gray-700 dark:text-gray-300">
            {dueThisWeek}
          </p>
          <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Tuần này
          </p>
        </div>
      </div>

      {/* Forecast bars */}
      <div className="flex items-end gap-1.5 h-16 mb-1.5">
        {forecast.map((count, i) => {
          const height = count > 0 ? Math.max(12, (count / maxBar) * 100) : 4;
          const isToday = i === 0;
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
              className={cn(
                'flex-1 rounded-t-md min-h-[3px] relative group cursor-default',
                isToday
                  ? 'bg-indigo-500 dark:bg-indigo-400'
                  : count > 0
                    ? 'bg-indigo-200 dark:bg-indigo-800'
                    : 'bg-gray-100 dark:bg-gray-800',
              )}
            >
              {count > 0 && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                  {count}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Day labels */}
      <div className="flex gap-1.5">
        {dayLabels.map((label, i) => (
          <span
            key={i}
            className={cn(
              'flex-1 text-center text-[10px] font-medium',
              i === 0
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400',
            )}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Overdue warning */}
      {overdueCount > 0 && (
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40">
          <AlertCircle size={14} className="text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {overdueCount} từ đã quá hạn ôn tập
          </p>
        </div>
      )}
    </motion.div>
  );
}
