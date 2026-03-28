import { useState, useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';
import type { SentenceBuildingExercise, WordItem, SentenceBuildingResult } from '../../lib/types';

export function stripPunctuation(text: string): string {
  return text.replace(/[.!?,;:'"]+/g, '');
}

export interface SentenceBuildingState {
  exercises: SentenceBuildingExercise[];
  currentIndex: number;
  bankWords: WordItem[];
  placedWords: WordItem[];
  hintsUsed: number;
  wrongAttempts: number;
  results: SentenceBuildingResult[];
  isComplete: boolean;
  checkResult: 'correct' | 'wrong' | null;
  wrongWordIds: Set<string>;
}

function createWordItems(exercise: SentenceBuildingExercise): WordItem[] {
  const allWords = [...exercise.words];
  if (exercise.distractors?.length) {
    allWords.push(...exercise.distractors);
  }

  return allWords.map((word) => ({
    id: nanoid(),
    word,
    isDistractor: exercise.distractors?.includes(word) ?? false,
    isHinted: false,
  }));
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useSentenceBuilding(exercises: SentenceBuildingExercise[]) {
  const [state, setState] = useState<SentenceBuildingState>(() => {
    const first = exercises[0];
    return {
      exercises,
      currentIndex: 0,
      bankWords: first ? shuffleArray(createWordItems(first)) : [],
      placedWords: [],
      hintsUsed: 0,
      wrongAttempts: 0,
      results: [],
      isComplete: false,
      checkResult: null,
      wrongWordIds: new Set(),
    };
  });

  const currentExercise = state.exercises[state.currentIndex] ?? null;

  const moveToZone = useCallback((wordId: string) => {
    setState((prev) => {
      const wordIdx = prev.bankWords.findIndex((w) => w.id === wordId);
      if (wordIdx === -1) return prev;
      const word = prev.bankWords[wordIdx];
      return {
        ...prev,
        bankWords: prev.bankWords.filter((w) => w.id !== wordId),
        placedWords: [...prev.placedWords, word],
        checkResult: null,
        wrongWordIds: new Set(),
      };
    });
  }, []);

  const moveToBank = useCallback((wordId: string) => {
    setState((prev) => {
      const word = prev.placedWords.find((w) => w.id === wordId);
      if (!word || word.isHinted) return prev;
      return {
        ...prev,
        placedWords: prev.placedWords.filter((w) => w.id !== wordId),
        bankWords: [...prev.bankWords, word],
        checkResult: null,
        wrongWordIds: new Set(),
      };
    });
  }, []);

  const reorderPlaced = useCallback((oldIndex: number, newIndex: number) => {
    setState((prev) => {
      if (prev.placedWords[oldIndex]?.isHinted || prev.placedWords[newIndex]?.isHinted) {
        return prev;
      }
      const updated = [...prev.placedWords];
      const [removed] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, removed);
      return { ...prev, placedWords: updated, checkResult: null, wrongWordIds: new Set() };
    });
  }, []);

  const checkAnswer = useCallback(() => {
    setState((prev) => {
      const exercise = prev.exercises[prev.currentIndex];
      if (!exercise) return prev;

      const correctWords = stripPunctuation(exercise.sentence)
        .split(/\s+/);

      const userWords = prev.placedWords.filter((w) => !w.isDistractor);
      const userSentence = userWords.map((w) => w.word).join(' ');
      const correctSentence = correctWords.join(' ');

      // Check if no distractors are in placed words and all correct words are placed
      const noDistractorsPlaced = !prev.placedWords.some((w) => w.isDistractor);
      const allCorrectPlaced = userWords.length === correctWords.length;
      const orderCorrect =
        noDistractorsPlaced &&
        allCorrectPlaced &&
        userSentence.toLowerCase() === correctSentence.toLowerCase();

      if (orderCorrect) {
        const score = Math.max(0, 100 - prev.hintsUsed * 20 - prev.wrongAttempts * 10);
        const result: SentenceBuildingResult = {
          exerciseId: exercise.id,
          correct: true,
          hintsUsed: prev.hintsUsed,
          wrongAttempts: prev.wrongAttempts,
          score,
          userAnswer: userSentence,
        };
        return { ...prev, checkResult: 'correct' as const, results: [...prev.results, result] };
      }

      // Find wrong positions
      const wrongIds = new Set<string>();
      prev.placedWords.forEach((w, i) => {
        if (w.isDistractor) {
          wrongIds.add(w.id);
        } else if (i < correctWords.length && w.word.toLowerCase() !== correctWords[i].toLowerCase()) {
          wrongIds.add(w.id);
        } else if (i >= correctWords.length) {
          wrongIds.add(w.id);
        }
      });

      return {
        ...prev,
        checkResult: 'wrong' as const,
        wrongAttempts: prev.wrongAttempts + 1,
        wrongWordIds: wrongIds,
      };
    });
  }, []);

  const useHint = useCallback(() => {
    setState((prev) => {
      const exercise = prev.exercises[prev.currentIndex];
      if (!exercise) return prev;

      const correctWords = stripPunctuation(exercise.sentence)
        .split(/\s+/);

      // Find first position that doesn't have the correct hinted word
      for (let i = 0; i < correctWords.length; i++) {
        const placed = prev.placedWords[i];
        if (placed?.isHinted) continue;

        // Find the correct word in bank or placed (non-hinted)
        const targetWord = correctWords[i];
        const allAvailable = [...prev.bankWords, ...prev.placedWords.filter((w) => !w.isHinted)];
        const match = allAvailable.find(
          (w) => w.word.toLowerCase() === targetWord.toLowerCase() && !w.isDistractor
        );

        if (!match) continue;

        // Remove match from wherever it is
        const newBank = prev.bankWords.filter((w) => w.id !== match.id);
        const newPlaced = prev.placedWords.filter((w) => w.id !== match.id);

        // Insert hinted word at correct position
        const hintedWord: WordItem = { ...match, isHinted: true };
        newPlaced.splice(i, 0, hintedWord);

        return {
          ...prev,
          bankWords: newBank,
          placedWords: newPlaced,
          hintsUsed: prev.hintsUsed + 1,
          checkResult: null,
          wrongWordIds: new Set(),
        };
      }
      return prev;
    });
  }, []);

  const nextExercise = useCallback(() => {
    setState((prev) => {
      const nextIdx = prev.currentIndex + 1;
      if (nextIdx >= prev.exercises.length) {
        // If current exercise wasn't completed (skipped), add a result
        const currentHasResult = prev.results.some(
          (r) => r.exerciseId === prev.exercises[prev.currentIndex]?.id
        );
        const finalResults = currentHasResult
          ? prev.results
          : [
              ...prev.results,
              {
                exerciseId: prev.exercises[prev.currentIndex]?.id ?? '',
                correct: false,
                hintsUsed: prev.hintsUsed,
                wrongAttempts: prev.wrongAttempts,
                score: 0,
                userAnswer: prev.placedWords.map((w) => w.word).join(' '),
              },
            ];
        return { ...prev, isComplete: true, results: finalResults };
      }

      const nextExercise = prev.exercises[nextIdx];
      return {
        ...prev,
        currentIndex: nextIdx,
        bankWords: shuffleArray(createWordItems(nextExercise)),
        placedWords: [],
        hintsUsed: 0,
        wrongAttempts: 0,
        checkResult: null,
        wrongWordIds: new Set(),
      };
    });
  }, []);

  const totalScore = useMemo(
    () => state.results.reduce((sum, r) => sum + r.score, 0),
    [state.results]
  );

  const totalXP = useMemo(() => {
    const baseXP = state.results.length * 10;
    const avgScore = state.results.length > 0 ? totalScore / state.results.length : 0;
    const bonus = Math.round(avgScore / 10);
    return baseXP + bonus;
  }, [state.results, totalScore]);

  return {
    ...state,
    currentExercise,
    totalScore,
    totalXP,
    moveToZone,
    moveToBank,
    reorderPlaced,
    checkAnswer,
    useHint,
    nextExercise,
  };
}
