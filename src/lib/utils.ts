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

/** Fisher-Yates shuffle (immutable — returns new array). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

/**
 * Levenshtein distance between two strings (case-insensitive).
 * Returns the minimum number of single-character edits needed to transform a into b.
 */
export function levenshteinDistance(a: string, b: string): number {
  const s = a.toLowerCase();
  const t = b.toLowerCase();
  if (s === t) return 0;
  if (s.length === 0) return t.length;
  if (t.length === 0) return s.length;

  const m = s.length;
  const n = t.length;
  // Use single array optimization
  const prev = Array.from({ length: n + 1 }, (_, i) => i);

  for (let i = 1; i <= m; i++) {
    let corner = prev[0];
    prev[0] = i;
    for (let j = 1; j <= n; j++) {
      const upper = prev[j];
      prev[j] = s[i - 1] === t[j - 1]
        ? corner
        : 1 + Math.min(corner, prev[j], prev[j - 1]);
      corner = upper;
    }
  }

  return prev[n];
}
