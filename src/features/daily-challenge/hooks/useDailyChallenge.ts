import { useState, useEffect, useCallback } from 'react';
import { db } from '../../../db/database';
import type { DailyChallengeLog } from '../../../db/models';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { ALL_GRAMMAR_LESSONS } from '../../../data/grammar/_index';
import { useProgressStore } from '../../../stores/progressStore';
import { useToastStore } from '../../../stores/toastStore';
import { eventBus } from '../../../services/eventBus';
import type { VocabWord, GrammarExercise } from '../../../lib/types';

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

const allWords: VocabWord[] = ALL_TOPICS.flatMap((t) => t.words);
const allExercises: GrammarExercise[] = ALL_GRAMMAR_LESSONS.flatMap((l) => l.exercises);

export type TaskName = 'learnWord' | 'grammarQuiz' | 'dictation';

export interface DailyChallengeState {
  date: string;
  word: VocabWord;
  exercise: GrammarExercise;
  tasks: { learnWord: boolean; grammarQuiz: boolean; dictation: boolean };
  completed: boolean;
  xpEarned: number;
  loading: boolean;
  completeTask: (task: TaskName) => Promise<void>;
}

export function useDailyChallenge(): DailyChallengeState {
  const today = getTodayString();
  const seed = getDailySeed(today);
  const word = allWords[seed % allWords.length];
  const exercise = allExercises[(seed * 7) % allExercises.length];

  const [tasks, setTasks] = useState({ learnWord: false, grammarQuiz: false, dictation: false });
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.dailyChallenges.get(today).then((log) => {
      if (log) {
        setTasks(log.tasks);
        setCompleted(log.completed);
        setXpEarned(log.xpEarned);
      }
      setLoading(false);
    });
  }, [today]);

  const completeTask = useCallback(async (taskName: TaskName) => {
    if (tasks[taskName]) return;

    const newTasks = { ...tasks, [taskName]: true };
    const taskXP = 15;
    let newXP = xpEarned + taskXP;

    useProgressStore.getState().addXP(taskXP);
    useToastStore.getState().addToast({ type: 'xp', title: `+${taskXP} XP`, description: 'Daily Challenge task' });

    const allDone = newTasks.learnWord && newTasks.grammarQuiz && newTasks.dictation;
    if (allDone) {
      const bonus = 50;
      newXP += bonus;
      useProgressStore.getState().addXP(bonus);
      useToastStore.getState().addToast({ type: 'xp', title: `+${bonus} XP Bonus!`, description: 'All daily tasks completed!' });
      eventBus.emit('daily_challenge:complete', { date: today, score: newXP });
    }

    const log: DailyChallengeLog = {
      date: today,
      wordId: word.word,
      tasks: newTasks,
      completed: allDone,
      xpEarned: newXP,
    };
    await db.dailyChallenges.put(log);

    setTasks(newTasks);
    setCompleted(allDone);
    setXpEarned(newXP);
  }, [tasks, xpEarned, today, word.word]);

  return { date: today, word, exercise, tasks, completed, xpEarned, loading, completeTask };
}
