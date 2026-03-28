import { LEVELS } from './constants';

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
}

export function daysBetween(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1).getTime();
  const d2 = new Date(dateStr2).getTime();
  return Math.abs(Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
}

export function getLevelFromXP(xp: number): { level: number; title: string; nextXP: number; progress: number } {
  let current: (typeof LEVELS)[number] = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      break;
    }
  }

  const nextLevel = LEVELS.find(l => l.xpRequired > current.xpRequired);
  const nextXP = nextLevel?.xpRequired ?? current.xpRequired;
  const progress = nextLevel
    ? ((xp - current.xpRequired) / (nextXP - current.xpRequired)) * 100
    : 100;

  return { level: current.level, title: current.title, nextXP, progress };
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
