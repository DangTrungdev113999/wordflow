import { useState } from 'react';
import { Clock, Bell, BellOff, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudyPlanStore } from '../../../stores/studyPlanStore';
import { DAY_LABELS, FOCUS_AREAS } from '../../../models/StudyPlan';
import type { StudySchedule } from '../../../models/StudyPlan';
import { requestNotificationPermission } from '../../../services/reminderService';

interface EditingSlot {
  dayOfWeek: number;
  startTime: string;
  duration: number;
  focus: string[];
}

export function WeeklySchedule() {
  const schedule = useStudyPlanStore((s) => s.schedule);
  const toggleScheduleDay = useStudyPlanStore((s) => s.toggleScheduleDay);
  const removeScheduleDay = useStudyPlanStore((s) => s.removeScheduleDay);
  const updateScheduleReminder = useStudyPlanStore((s) => s.updateScheduleReminder);
  const [editing, setEditing] = useState<EditingSlot | null>(null);

  function getSlot(day: number): StudySchedule | undefined {
    return schedule.find((s) => s.dayOfWeek === day);
  }

  function handleDayClick(day: number) {
    const existing = getSlot(day);
    if (existing) return;
    setEditing({ dayOfWeek: day, startTime: '09:00', duration: 30, focus: [] });
  }

  function toggleFocus(area: string) {
    if (!editing) return;
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            focus: prev.focus.includes(area)
              ? prev.focus.filter((f) => f !== area)
              : [...prev.focus, area],
          }
        : null
    );
  }

  async function handleSave() {
    if (!editing) return;
    toggleScheduleDay(editing.dayOfWeek, editing.startTime, editing.duration, editing.focus);
    await requestNotificationPermission();
    setEditing(null);
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Weekly Schedule</h3>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {DAY_LABELS.map((label, i) => {
          const slot = getSlot(i);
          const isEditing = editing?.dayOfWeek === i;

          return (
            <div key={i} className="flex flex-col items-center">
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">
                {label}
              </span>
              <button
                onClick={() => (slot ? undefined : handleDayClick(i))}
                className={`relative w-full aspect-square rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center gap-0.5 ${
                  slot
                    ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900'
                    : isEditing
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {slot ? (
                  <>
                    <Clock size={12} />
                    <span className="text-xs leading-none">{slot.startTime}</span>
                  </>
                ) : (
                  <span className="text-lg leading-none">+</span>
                )}
              </button>

              {slot && (
                <div className="flex items-center gap-0.5 mt-1">
                  <button
                    onClick={() => updateScheduleReminder(i, !slot.reminderEnabled)}
                    className="p-0.5 rounded text-gray-400 hover:text-indigo-500 transition-colors"
                    title={slot.reminderEnabled ? 'Disable reminder' : 'Enable reminder'}
                  >
                    {slot.reminderEnabled ? <Bell size={10} /> : <BellOff size={10} />}
                  </button>
                  <button
                    onClick={() => removeScheduleDay(i)}
                    className="p-0.5 rounded text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit panel */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {DAY_LABELS[editing.dayOfWeek]}
                </span>
                <button
                  onClick={() => setEditing(null)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                  <input
                    type="time"
                    value={editing.startTime}
                    onChange={(e) => setEditing({ ...editing, startTime: e.target.value })}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={240}
                    step={5}
                    value={editing.duration}
                    onChange={(e) =>
                      setEditing({ ...editing, duration: Math.max(5, Number(e.target.value)) })
                    }
                    className="w-20 px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Focus Areas
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FOCUS_AREAS.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => toggleFocus(area.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                        editing.focus.includes(area.id)
                          ? 'text-white border-transparent'
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                      style={
                        editing.focus.includes(area.id)
                          ? { backgroundColor: area.color }
                          : undefined
                      }
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
              >
                <Check size={14} />
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule summary */}
      {schedule.length > 0 && !editing && (
        <div className="mt-3 space-y-1.5">
          {schedule
            .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            .map((slot) => (
              <div
                key={slot.dayOfWeek}
                className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300 w-8">
                  {DAY_LABELS[slot.dayOfWeek]}
                </span>
                <span>
                  {slot.startTime} · {slot.duration}min
                </span>
                {slot.focus.length > 0 && (
                  <div className="flex gap-1">
                    {slot.focus.map((f) => {
                      const area = FOCUS_AREAS.find((a) => a.id === f);
                      return (
                        <span
                          key={f}
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ backgroundColor: area?.color ?? '#6366f1' }}
                          title={area?.label}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
