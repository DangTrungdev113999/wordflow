import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/database';

export interface ReviewSchedule {
  dueToday: number;
  dueTomorrow: number;
  dueThisWeek: number;
  overdueCount: number;
  /** Word counts for 7 consecutive days starting from today */
  forecast: number[];
  loading: boolean;
}

/**
 * Queries wordProgress table, groups by nextReview date,
 * and forecasts due words for the next 7 days.
 */
export function useReviewSchedule(): ReviewSchedule {
  const schedule = useLiveQuery(async () => {
    const allProgress = await db.wordProgress.toArray();
    const now = Date.now();

    // Day boundaries
    const today = startOfDay(now);
    const tomorrow = today + DAY_MS;
    const dayAfterTomorrow = tomorrow + DAY_MS;
    const weekEnd = today + 7 * DAY_MS;

    let overdueCount = 0;
    const forecast = new Array(7).fill(0);

    for (const p of allProgress) {
      if (p.status === 'new' && p.lastReview === 0) continue; // never reviewed, skip

      const due = p.nextReview;

      if (due < today) {
        overdueCount++;
        forecast[0]++; // overdue counts as today
      } else if (due < weekEnd) {
        const dayIndex = Math.floor((due - today) / DAY_MS);
        if (dayIndex >= 0 && dayIndex < 7) {
          forecast[dayIndex]++;
        }
      }
    }

    const dueToday = overdueCount + forecast[0] - overdueCount; // just forecast[0] includes overdue already
    const dueTomorrow = forecast[1];
    const dueThisWeek = forecast.reduce((a, b) => a + b, 0);

    return {
      dueToday: forecast[0],
      dueTomorrow,
      dueThisWeek,
      overdueCount,
      forecast,
    };
  }, []);

  return {
    dueToday: schedule?.dueToday ?? 0,
    dueTomorrow: schedule?.dueTomorrow ?? 0,
    dueThisWeek: schedule?.dueThisWeek ?? 0,
    overdueCount: schedule?.overdueCount ?? 0,
    forecast: schedule?.forecast ?? [0, 0, 0, 0, 0, 0, 0],
    loading: schedule === undefined,
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
