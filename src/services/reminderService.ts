import type { StudySchedule } from '../models/StudyPlan';
import { DAY_LABELS } from '../models/StudyPlan';

let scheduledTimers: ReturnType<typeof setTimeout>[] = [];

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function getNotificationStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

function showNotification(title: string, body: string) {
  if (Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: '/favicon.ico',
    tag: 'wordflow-study-reminder',
  });
}

export function scheduleReminders(schedules: StudySchedule[]) {
  clearReminders();

  const now = new Date();
  const todayDow = now.getDay();

  for (const sch of schedules) {
    if (!sch.reminderEnabled) continue;

    // Calculate ms until next occurrence
    let daysUntil = sch.dayOfWeek - todayDow;
    if (daysUntil < 0) daysUntil += 7;

    const [hours, minutes] = sch.startTime.split(':').map(Number);
    const target = new Date(now);
    target.setDate(target.getDate() + daysUntil);
    target.setHours(hours, minutes, 0, 0);

    // If today but time already passed, schedule for next week
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 7);
    }

    const delay = target.getTime() - now.getTime();
    const focusText = sch.focus.length > 0 ? ` Focus: ${sch.focus.join(', ')}` : '';
    const timer = setTimeout(() => {
      showNotification(
        'Time to study!',
        `${DAY_LABELS[sch.dayOfWeek]} ${sch.startTime} — ${sch.duration} min session.${focusText}`
      );
    }, delay);

    scheduledTimers.push(timer);
  }
}

export function clearReminders() {
  scheduledTimers.forEach(clearTimeout);
  scheduledTimers = [];
}
