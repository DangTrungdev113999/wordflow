import { useEffect } from 'react';
import { Target, Calendar, TrendingUp, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { GoalCard } from '../components/GoalCard';
import { GoalForm } from '../components/GoalForm';
import { WeeklySchedule } from '../components/WeeklySchedule';
import { WeeklyChart } from '../components/WeeklyChart';
import { useStudyProgress } from '../../../hooks/useStudyProgress';
import { useStudyPlanStore } from '../../../stores/studyPlanStore';
import { useTimerStore, formatTime } from '../../../hooks/useStudyTimer';
import { useProgressStore } from '../../../stores/progressStore';
import { scheduleReminders } from '../../../services/reminderService';

export function StudyPlannerPage() {
  const { goalProgress, weeklyData, todayLog } = useStudyProgress();
  const removeGoal = useStudyPlanStore((s) => s.removeGoal);
  const schedule = useStudyPlanStore((s) => s.schedule);
  const snapshotWeek = useStudyPlanStore((s) => s.snapshotWeek);
  const lastSnapshotWeek = useStudyPlanStore((s) => s.lastSnapshotWeek);
  const elapsedMs = useTimerStore((s) => s.elapsedMs);
  const { todayXP } = useProgressStore();

  // Schedule reminders when schedule changes
  useEffect(() => {
    if (schedule.length > 0) {
      scheduleReminders(schedule);
    }
  }, [schedule]);

  // Weekly snapshot — check if we need to archive last week
  useEffect(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    const weekStart = monday.toISOString().slice(0, 10);

    if (lastSnapshotWeek && lastSnapshotWeek !== weekStart) {
      const totalMinutes = todayLog?.minutesSpent ?? 0;
      snapshotWeek(totalMinutes, todayXP, weeklyData.filter((d) => d.xp > 0).length);
    }
  }, [lastSnapshotWeek, todayLog, todayXP, weeklyData, snapshotWeek]);

  const todayMinutes = Math.floor(elapsedMs / 60000) + (todayLog?.minutesSpent ?? 0);
  const completedGoals = goalProgress.filter((g) => g.isComplete).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Study Planner</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Set goals, track progress, and build a study habit
        </p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} className="text-indigo-200" />
            <span className="text-xs font-medium text-indigo-200">Goals Met</span>
          </div>
          <p className="text-2xl font-bold">
            {completedGoals}
            <span className="text-sm font-normal text-indigo-200">/{goalProgress.length}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Timer size={14} className="text-cyan-200" />
            <span className="text-xs font-medium text-cyan-200">Today</span>
          </div>
          <p className="text-2xl font-bold">
            {formatTime(todayMinutes * 60000)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-emerald-200" />
            <span className="text-xs font-medium text-emerald-200">XP Today</span>
          </div>
          <p className="text-2xl font-bold">{todayXP}</p>
        </motion.div>
      </div>

      {/* Goals section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-indigo-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Goals</h2>
        </div>

        {goalProgress.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {goalProgress.map((gp) => (
              <GoalCard key={gp.goal.id} data={gp} onRemove={removeGoal} />
            ))}
          </div>
        ) : (
          <Card className="mb-3">
            <div className="text-center py-6">
              <Target size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No goals yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Add a goal to start tracking your progress
              </p>
            </div>
          </Card>
        )}
        <GoalForm />
      </section>

      {/* Schedule section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-violet-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Schedule</h2>
        </div>
        <Card>
          <WeeklySchedule />
        </Card>
      </section>

      {/* Weekly chart */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-cyan-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Progress</h2>
        </div>
        <Card>
          <WeeklyChart data={weeklyData} />
        </Card>
      </section>
    </div>
  );
}
