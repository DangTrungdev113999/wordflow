import { useCallback, useEffect } from 'react';
import { useVocabularyStore } from '../../../stores/vocabularyStore';
import { useProgressStore } from '../../../stores/progressStore';
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
    resetSession,
  } = useVocabularyStore();

  const { addXP, incrementWordsLearned, incrementWordsReviewed } = useProgressStore();

  const currentWord = flashcardQueue[currentCardIndex];
  const isSessionComplete = currentCardIndex >= flashcardQueue.length && flashcardQueue.length > 0;

  useEffect(() => {
    const topic = topics.find((t) => t.topic === topicId);
    if (!topic) return;
    setCurrentTopic(topic);

    // Load word progress from DB
    const wordIds = topic.words.map((w) => `${topicId}:${w.word}`);
    db.wordProgress.where('wordId').anyOf(wordIds).toArray().then((progresses) => {
      const map: typeof wordProgressMap = {};
      progresses.forEach((p) => { map[p.wordId] = p; });
      setWordProgressMap(map);

      // Build flashcard queue: prioritize due/new words
      const queue = topic.words
        .filter((w) => {
          const id = `${topicId}:${w.word}`;
          const prog = map[id];
          if (!prog) return true; // new
          return prog.nextReview <= Date.now(); // due
        })
        .slice(0, 20); // limit to 20 per session

      if (queue.length === 0) {
        // All words reviewed — show all as a refresher
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

    // Upsert in DB
    await db.wordProgress.put(newProgress);

    // Update map
    setWordProgressMap({ ...wordProgressMap, [wordId]: newProgress });

    // Award XP
    let xpGain = XP_VALUES.flashcard_hard;
    if (rating === 5) xpGain = XP_VALUES.flashcard_easy;
    else if (rating >= 3) xpGain = XP_VALUES.flashcard_correct;
    addXP(xpGain);

    if (!existing || existing.status === 'new') {
      incrementWordsLearned();
    } else {
      incrementWordsReviewed();
    }

    nextCard();
  }, [currentWord, currentTopic, topicId, wordProgressMap, addXP, incrementWordsLearned, incrementWordsReviewed, nextCard, setWordProgressMap]);

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
  };
}
