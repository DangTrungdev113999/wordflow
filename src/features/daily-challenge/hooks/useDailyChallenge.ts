import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../../../db/database';
import type { DailyChallengeLog, DailyChallengeTask, DailyChallengeTaskType } from '../../../db/models';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { ALL_GRAMMAR_LESSONS } from '../../../data/grammar/_index';
import { ALL_SENTENCES } from '../../../data/sentences/_index';
import { useProgressStore } from '../../../stores/progressStore';
import { useToastStore } from '../../../stores/toastStore';
import { eventBus } from '../../../services/eventBus';
import { checkStreakMilestone } from '../streakRewards';
import type { VocabWord, GrammarExercise, CEFRLevel, SentenceBuildingExercise } from '../../../lib/types';

// --- Seed-based deterministic selection ---

function getDailySeed(date: string): number {
  let hash = 0;
  for (const char of date) {
    hash = ((hash << 5) - hash) + char.charCodeAt(0);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// --- CEFR filtering ---

function getCEFRPool(level: CEFRLevel): CEFRLevel[] {
  switch (level) {
    case 'A1': return ['A1', 'A2'];
    case 'A2': return ['A1', 'A2', 'B1'];
    case 'B1': return ['A2', 'B1', 'B2'];
    case 'B2': return ['B1', 'B2'];
  }
}

function getFilteredWords(level: CEFRLevel | null): VocabWord[] {
  if (!level) return ALL_TOPICS.flatMap(t => t.words);
  const pool = getCEFRPool(level);
  const filtered = ALL_TOPICS.filter(t => pool.includes(t.cefrLevel)).flatMap(t => t.words);
  return filtered.length > 0 ? filtered : ALL_TOPICS.flatMap(t => t.words);
}

function getFilteredExercises(level: CEFRLevel | null): GrammarExercise[] {
  if (!level) return ALL_GRAMMAR_LESSONS.flatMap(l => l.exercises);
  const pool = getCEFRPool(level);
  const filtered = ALL_GRAMMAR_LESSONS.filter(l => pool.includes(l.level)).flatMap(l => l.exercises);
  return filtered.length > 0 ? filtered : ALL_GRAMMAR_LESSONS.flatMap(l => l.exercises);
}

function getFilteredSentences(level: CEFRLevel | null): SentenceBuildingExercise[] {
  if (!level) return ALL_SENTENCES;
  const pool = getCEFRPool(level);
  const filtered = ALL_SENTENCES.filter(s => pool.includes(s.cefrLevel));
  return filtered.length > 0 ? filtered : ALL_SENTENCES;
}

// --- Task order ---

export const TASK_ORDER: DailyChallengeTaskType[] = [
  'learnWord',
  'grammarQuiz',
  'sentenceBuilding',
  'dictation',
  'mediaVocab',
];

export const TASK_LABELS: Record<DailyChallengeTaskType, { label: string; icon: string }> = {
  learnWord: { label: 'Learn Word', icon: '📖' },
  grammarQuiz: { label: 'Grammar', icon: '📝' },
  sentenceBuilding: { label: 'Sentence', icon: '🧩' },
  dictation: { label: 'Dictation', icon: '🎧' },
  mediaVocab: { label: 'Vocab Quiz', icon: '📰' },
};

// --- Content selection ---

interface DailyContent {
  word: VocabWord;
  exercise: GrammarExercise;
  sentence: SentenceBuildingExercise;
  mediaWord: VocabWord; // different word for mediaVocab quiz
  mediaOptions: string[]; // 4 MC options for mediaVocab
}

function selectDailyContent(seed: number, level: CEFRLevel | null): DailyContent {
  const words = getFilteredWords(level);
  const exercises = getFilteredExercises(level);
  const sentences = getFilteredSentences(level);

  const word = words[seed % words.length];
  const exercise = exercises[(seed * 7) % exercises.length];
  const sentence = sentences[(seed * 13) % sentences.length];

  // Pick a different word for mediaVocab quiz
  const mediaIdx = (seed * 19) % words.length;
  const mediaWord = mediaIdx === (seed % words.length)
    ? words[(mediaIdx + 1) % words.length]
    : words[mediaIdx];

  // Generate 4 MC options (1 correct + 3 distractors)
  const correctMeaning = mediaWord.meaning;
  const distractorPool = words
    .filter(w => w.word !== mediaWord.word && w.meaning !== correctMeaning)
    .map(w => w.meaning);
  const distractors: string[] = [];
  for (let i = 0; i < 3 && distractorPool.length > 0; i++) {
    const idx = (seed * (23 + i * 11)) % distractorPool.length;
    distractors.push(distractorPool.splice(idx, 1)[0]);
  }
  // Insert correct answer at deterministic position
  const options = [...distractors];
  const correctPos = seed % (options.length + 1);
  options.splice(correctPos, 0, correctMeaning);

  return { word, exercise, sentence, mediaWord, mediaOptions: options };
}

// --- Hook ---

export interface DailyChallengeState {
  date: string;
  tasks: DailyChallengeTask[];
  content: DailyContent;
  completed: boolean;
  xpEarned: number;
  loading: boolean;
  completeTask: (taskType: DailyChallengeTaskType, score?: number) => Promise<void>;
}

export function useDailyChallenge(): DailyChallengeState {
  const today = getTodayString();
  const seed = getDailySeed(today);
  const levelRef = useRef<CEFRLevel | null>(null);
  const [content, setContent] = useState<DailyContent>(() => selectDailyContent(seed, null));

  const [tasks, setTasks] = useState<DailyChallengeTask[]>(
    TASK_ORDER.map(type => ({ type, contentId: '', completed: false }))
  );
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      db.dailyChallenges.get(today),
      db.userProfile.get('default'),
    ]).then(([log, profile]) => {
      const level = profile?.placementLevel ?? null;
      levelRef.current = level;
      const dailyContent = selectDailyContent(seed, level);
      setContent(dailyContent);

      if (log && Array.isArray(log.tasks)) {
        // Existing v2 log — restore state
        // Merge: keep saved completion state but ensure all 5 task types exist
        const merged = TASK_ORDER.map(type => {
          const saved = log.tasks.find(t => t.type === type);
          return saved ?? { type, contentId: '', completed: false };
        });
        setTasks(merged);
        setCompleted(log.completed);
        setXpEarned(log.xpEarned);
      }
      setLoading(false);
    });
  }, [today, seed]);

  const completeTask = useCallback(async (taskType: DailyChallengeTaskType, score?: number) => {
    const idx = tasks.findIndex(t => t.type === taskType);
    if (idx === -1 || tasks[idx].completed) return;

    const newTasks = tasks.map((t, i) =>
      i === idx ? { ...t, completed: true, score } : t
    );
    const taskXP = 15;
    let newXP = xpEarned + taskXP;

    useProgressStore.getState().addXP(taskXP);
    useToastStore.getState().addToast({ type: 'xp', title: `+${taskXP} XP`, description: 'Daily Challenge task' });

    const allDone = newTasks.every(t => t.completed);
    if (allDone) {
      // Issue 2 fix: add bonus XP to store, not just local tracking
      const bonus = 75;
      newXP += bonus;
      useProgressStore.getState().addXP(bonus);
      eventBus.emit('daily_challenge:complete', { date: today, score: newXP });

      // Issue 1 fix: update streak based on yesterday's completion
      const yesterday = getYesterdayString();
      const yesterdayLog = await db.dailyChallenges.get(yesterday);
      const { currentStreak } = useProgressStore.getState();
      const newStreak = yesterdayLog?.completed ? currentStreak + 1 : 1;
      useProgressStore.getState().setStreak(newStreak);
      useProgressStore.getState().setLastActiveDate(today);

      // Check streak milestone with the NEW streak value
      const milestone = checkStreakMilestone(newStreak);
      if (milestone) {
        // Issue 4 fix: include milestone XP in log
        newXP += milestone.xpBonus;
        useProgressStore.getState().addXP(milestone.xpBonus);
        // Issue 3 fix: actually award the badge
        useProgressStore.getState().addBadge(milestone.badgeId);
        useToastStore.getState().addToast({
          type: 'xp',
          title: `🔥 ${milestone.days}-Day Streak!`,
          description: `+${milestone.xpBonus} XP milestone bonus!`,
        });
      }
    }

    const log: DailyChallengeLog = {
      date: today,
      tasks: newTasks,
      completed: allDone,
      xpEarned: newXP,
    };
    await db.dailyChallenges.put(log);

    setTasks(newTasks);
    setCompleted(allDone);
    setXpEarned(newXP);
  }, [tasks, xpEarned, today]);

  return { date: today, tasks, content, completed, xpEarned, loading, completeTask };
}
