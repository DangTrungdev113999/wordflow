export interface StudyGoal {
  id: string;
  type: 'daily' | 'weekly';
  metric: 'words' | 'xp' | 'minutes' | 'lessons' | 'quizAccuracy';
  target: number;
  current: number;
  createdAt: string;
}

export interface StudySchedule {
  dayOfWeek: number;         // 0=Sun..6=Sat
  startTime: string;         // "09:00" (HH:mm)
  duration: number;          // minutes
  focus: string[];           // ['vocabulary', 'grammar', 'listening']
  reminderEnabled: boolean;
}

export interface WeeklySnapshot {
  weekStart: string;         // ISO date (Monday)
  goals: { metric: string; target: number; achieved: number }[];
  totalMinutes: number;
  totalXp: number;
  daysActive: number;
}

export const METRIC_LABELS: Record<StudyGoal['metric'], string> = {
  words: 'Words',
  xp: 'XP',
  minutes: 'Minutes',
  lessons: 'Lessons',
  quizAccuracy: 'Quiz Accuracy %',
};

export const METRIC_UNITS: Record<StudyGoal['metric'], string> = {
  words: 'words',
  xp: 'XP',
  minutes: 'min',
  lessons: 'lessons',
  quizAccuracy: '%',
};

export const FOCUS_AREAS = [
  { id: 'vocabulary', label: 'Vocabulary', color: '#6366f1' },
  { id: 'grammar', label: 'Grammar', color: '#8b5cf6' },
  { id: 'listening', label: 'Listening', color: '#06b6d4' },
  { id: 'reading', label: 'Reading', color: '#10b981' },
  { id: 'pronunciation', label: 'Pronunciation', color: '#f59e0b' },
  { id: 'writing', label: 'Writing', color: '#ec4899' },
] as const;

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
