import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { useVocabularyStore } from '../../../stores/vocabularyStore';
import { useProgressStore } from '../../../stores/progressStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { db } from '../../../db/database';
import { calculateSM2, createInitialProgress } from '../../../services/spacedRepetition';
import { eventBus } from '../../../services/eventBus';
import type { FlashcardRating } from '../../../lib/types';

export function useFlashcard(topicId: string) {
  const [searchParams] = useSearchParams();
  const isWeakMode = searchParams.get('weak') === 'true';

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
    sessionResults,
    recordAnswer,
    resetSession,
  } = useVocabularyStore();

  const { todayWordsLearned, todayXP } = useProgressStore();
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

      let queue;
      if (isWeakMode) {
        // Weak mode: only words with low easeFactor or failed learning
        queue = topic.words.filter((w) => {
          const id = `${topicId}:${w.word}`;
          const prog = map[id];
          if (!prog) return false;
          return (
            prog.easeFactor < 2.0 ||
            (prog.status === 'learning' && prog.repetitions === 0)
          );
        });
      } else {
        queue = topic.words
          .filter((w) => {
            const id = `${topicId}:${w.word}`;
            const prog = map[id];
            if (!prog) return true;
            return prog.nextReview <= Date.now();
          })
          .slice(0, 20);
      }

      if (queue.length === 0) {
        setFlashcardQueue(topic.words.slice(0, 20));
      } else {
        setFlashcardQueue(queue);
      }
    });

    return () => resetSession();
  }, [topicId, isWeakMode]); // eslint-disable-line react-hooks/exhaustive-deps

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

    // Record answer for sessionStats
    const isCorrect = rating >= 3;
    recordAnswer(isCorrect, wordId);

    // Emit events instead of direct calls
    if (isCorrect) {
      eventBus.emit('flashcard:correct', { wordId, rating: rating as 0 | 2 | 4 | 5 });
    } else {
      eventBus.emit('flashcard:incorrect', { wordId });
    }

    // Emit word:learned for new words
    const isNew = !existing || existing.status === 'new';
    if (isNew) {
      eventBus.emit('word:learned', { wordId });
    }

    // Check daily goal met → emit event (once per session)
    const newTodayLearned = todayWordsLearned + 1;
    if (!dailyGoalAwarded.current && newTodayLearned >= dailyGoal) {
      eventBus.emit('daily_goal:met', {});
      dailyGoalAwarded.current = true;
    }

    nextCard();
  }, [currentWord, currentTopic, topicId, wordProgressMap, nextCard, setWordProgressMap, recordAnswer, todayWordsLearned, dailyGoal]);

  return {
    currentTopic,
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
