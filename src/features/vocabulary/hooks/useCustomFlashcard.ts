import { useCallback, useEffect, useRef, useState } from 'react';
import { db } from '../../../db/database';
import { getWords, getTopicById } from '../../../services/customTopicService';
import { calculateSM2, createInitialProgress } from '../../../services/spacedRepetition';
import { eventBus } from '../../../services/eventBus';
import { useProgressStore } from '../../../stores/progressStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import type { FlashcardRating, VocabWord } from '../../../lib/types';
import type { WordProgress, CustomTopic } from '../../../db/models';

export function useCustomFlashcard(topicId: number) {
  const [topic, setTopic] = useState<CustomTopic | null>(null);
  const [flashcardQueue, setFlashcardQueue] = useState<VocabWord[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [wordProgressMap, setWordProgressMap] = useState<Record<string, WordProgress>>({});
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [sessionResults, setSessionResults] = useState<Array<{ wordId: string; correct: boolean }>>([]);

  const { todayWordsLearned, todayXP } = useProgressStore();
  const { dailyGoal } = useSettingsStore();
  const dailyGoalAwarded = useRef(false);

  const currentWord = flashcardQueue[currentCardIndex];
  const isSessionComplete = currentCardIndex >= flashcardQueue.length && flashcardQueue.length > 0;

  useEffect(() => {
    async function load() {
      const [t, words] = await Promise.all([getTopicById(topicId), getWords(topicId)]);
      if (!t || words.length === 0) return;
      setTopic(t);

      // Convert CustomWord to VocabWord format
      const vocabWords: VocabWord[] = words.map((w) => ({
        word: w.word,
        meaning: w.meaning,
        ipa: w.ipa,
        example: w.example,
        audioUrl: w.audioUrl,
      }));

      // Load progress
      const wordIds = vocabWords.map((w) => `custom-${topicId}:${w.word}`);
      const progresses = await db.wordProgress.where('wordId').anyOf(wordIds).toArray();
      const map: Record<string, WordProgress> = {};
      progresses.forEach((p) => { map[p.wordId] = p; });
      setWordProgressMap(map);

      // Filter to due words
      let queue = vocabWords.filter((w) => {
        const id = `custom-${topicId}:${w.word}`;
        const prog = map[id];
        if (!prog) return true;
        return prog.nextReview <= Date.now();
      }).slice(0, 20);

      if (queue.length === 0) {
        queue = vocabWords.slice(0, 20);
      }

      setFlashcardQueue(queue);
    }

    load();

    return () => {
      setFlashcardQueue([]);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setSessionStats({ correct: 0, incorrect: 0, total: 0 });
      setSessionResults([]);
    };
  }, [topicId]);

  const flipCard = useCallback(() => setIsFlipped((f) => !f), []);

  const handleRate = useCallback(async (rating: FlashcardRating) => {
    if (!currentWord || !topic) return;

    const wordId = `custom-${topicId}:${currentWord.word}`;
    const existing = wordProgressMap[wordId];
    const current = existing ?? createInitialProgress(wordId);
    const result = calculateSM2(rating, current);

    const newProgress = { ...current, ...result, lastReview: Date.now() };

    await db.wordProgress.put(newProgress);
    setWordProgressMap((prev) => ({ ...prev, [wordId]: newProgress }));

    const isCorrect = rating >= 3;
    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      total: prev.total + 1,
    }));
    setSessionResults((prev) => [...prev, { wordId, correct: isCorrect }]);

    if (isCorrect) {
      eventBus.emit('flashcard:correct', { wordId, rating: rating as 0 | 2 | 4 | 5 });
    } else {
      eventBus.emit('flashcard:incorrect', { wordId });
    }

    if (!existing || existing.status === 'new') {
      eventBus.emit('word:learned', { wordId });
    }

    const newTodayLearned = todayWordsLearned + 1;
    if (!dailyGoalAwarded.current && newTodayLearned >= dailyGoal) {
      eventBus.emit('daily_goal:met', {});
      dailyGoalAwarded.current = true;
    }

    setCurrentCardIndex((prev) => prev + 1);
    setIsFlipped(false);
  }, [currentWord, topic, topicId, wordProgressMap, todayWordsLearned, dailyGoal]);

  // Emit mistakes when session completes
  const mistakeEmittedRef = useRef(false);
  useEffect(() => {
    if (!isSessionComplete || mistakeEmittedRef.current) return;
    mistakeEmittedRef.current = true;

    const incorrect = sessionResults.filter(r => !r.correct);
    if (incorrect.length > 0) {
      eventBus.emit('mistakes:collected', {
        source: 'quiz',
        mistakes: incorrect.map(r => {
          const wordKey = r.wordId.replace(`custom-${topicId}:`, '');
          const word = flashcardQueue.find(w => w.word === wordKey);
          return {
            type: 'vocabulary' as const,
            question: word ? `What does "${word.word}" mean?` : r.wordId,
            userAnswer: 'Incorrect recall',
            correctAnswer: word?.meaning ?? r.wordId,
          };
        }),
      });
    }
  }, [isSessionComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    topic,
    currentWord,
    isFlipped,
    flipCard,
    handleRate,
    sessionStats,
    sessionResults,
    isSessionComplete,
    flashcardQueue,
    currentCardIndex,
    sessionXP: todayXP,
  };
}
