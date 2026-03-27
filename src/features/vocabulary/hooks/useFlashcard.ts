import { useCallback, useEffect, useRef } from 'react';
import { useVocabularyStore } from '../../../stores/vocabularyStore';
import { useProgressStore } from '../../../stores/progressStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { db } from '../../../db/database';
import { calculateSM2, createInitialProgress } from '../../../services/spacedRepetition';
import { XP_VALUES } from '../../../lib/constants';
import type { FlashcardRating } from '../../../lib/types';

export function useFlashcard(topicId: string) {
  const {
    topics,
    currentTopic,
    setCurrentTopic,
    flashcardQueue,
    setFlashcardQueue,
    currentCardIndex,
    isFlipped,
    flipCard,
    nextCard,
    wordProgressMap,
    setWordProgressMap,
    sessionStats,
    recordAnswer,
    resetSession,
  } = useVocabularyStore();

  const { addXP, incrementWordsLearned, incrementWordsReviewed, todayWordsLearned, todayXP } = useProgressStore();
  const { dailyGoal } = useSettingsStore();
  const dailyGoalAwarded = useRef(false);

  const currentWord = flashcardQueue[currentCardIndex];
  const isSessionComplete = currentCardIndex >= flashcardQueue.length && flashcardQueue.length > 0;

  useEffect(() => {
    const topic = topics.find((t) => t.topic === topicId);
    if (!topic) return;
    setCurrentTopic(topic);

    const wordIds = topic.words.map((w) => `${topicId}:${w.word}`);
    db.wordProgress.where('wordId').anyOf(wordIds).toArray().then((progresses) => {
      const map: typeof wordProgressMap = {};
      progresses.forEach((p) => { map[p.wordId] = p; });
      setWordProgressMap(map);

      const queue = topic.words
        .filter((w) => {
          const id = `${topicId}:${w.word}`;
          const prog = map[id];
          if (!prog) return true;
          return prog.nextReview <= Date.now();
        })
        .slice(0, 20);

      if (queue.length === 0) {
        setFlashcardQueue(topic.words.slice(0, 20));
      } else {
        setFlashcardQueue(queue);
      }
    });

    return () => resetSession();
  }, [topicId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRate = useCallback(async (rating: FlashcardRating) => {
    if (!currentWord || !currentTopic) return;

    const wordId = `${topicId}:${currentWord.word}`;
    const existing = wordProgressMap[wordId];
    const current = existing ?? createInitialProgress(wordId);
    const result = calculateSM2(rating, current);

    const newProgress = {
      ...current,
      ...result,
      lastReview: Date.now(),
    };

    await db.wordProgress.put(newProgress);
    setWordProgressMap({ ...wordProgressMap, [wordId]: newProgress });

    // 🔴 FIX: Record answer for sessionStats
    const isCorrect = rating >= 3;
    recordAnswer(isCorrect);

    // 🟡 FIX: Award XP based on actual rating values
    let xpGain = XP_VALUES.flashcard_hard;
    if (rating === 5) xpGain = XP_VALUES.flashcard_easy;
    else if (rating >= 3) xpGain = XP_VALUES.flashcard_correct;
    addXP(xpGain);

    if (!existing || existing.status === 'new') {
      incrementWordsLearned();
    } else {
      incrementWordsReviewed();
    }

    // 🟡 FIX: Check daily goal met → award bonus (once per day)
    const newTodayLearned = todayWordsLearned + 1;
    if (!dailyGoalAwarded.current && newTodayLearned >= dailyGoal) {
      addXP(XP_VALUES.daily_goal_met);
      dailyGoalAwarded.current = true;
    }

    nextCard();
  }, [currentWord, currentTopic, topicId, wordProgressMap, addXP, incrementWordsLearned, incrementWordsReviewed, nextCard, setWordProgressMap, recordAnswer, todayWordsLearned, dailyGoal]);

  return {
    currentTopic,
    currentWord,
    isFlipped,
    flipCard,
    handleRate,
    sessionStats,
    isSessionComplete,
    flashcardQueue,
    currentCardIndex,
    sessionXP: todayXP,
  };
}
