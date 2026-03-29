import { useState, useEffect, useRef } from 'react';
import { useVocabularyStore } from '../../../stores/vocabularyStore';
import { db } from '../../../db/database';
import type { VocabWord, VocabTopic } from '../../../lib/types';
import type { VocabSessionConfig } from '../types';
import type { WordProgress } from '../../../db/models';

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useVocabSession(config: VocabSessionConfig) {
  const { topics } = useVocabularyStore();
  const [topic, setTopic] = useState<VocabTopic | null>(null);
  const [words, setWords] = useState<VocabWord[]>([]);
  const [wordProgressMap, setWordProgressMap] = useState<Record<string, WordProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const topicData = topics.find(t => t.topic === config.topicId);
    if (!topicData) return;
    setTopic(topicData);

    const wordIds = topicData.words.map(w => `${config.topicId}:${w.word}`);

    db.wordProgress.where('wordId').anyOf(wordIds).toArray().then(progresses => {
      const map: Record<string, WordProgress> = {};
      for (const p of progresses) {
        map[p.wordId] = p;
      }
      setWordProgressMap(map);

      let filtered = topicData.words;

      switch (config.wordsFilter) {
        case 'new':
          filtered = filtered.filter(w => {
            const prog = map[`${config.topicId}:${w.word}`];
            return !prog || prog.status === 'new';
          });
          break;
        case 'weak':
          filtered = filtered.filter(w => {
            const prog = map[`${config.topicId}:${w.word}`];
            if (!prog) return false;
            return prog.easeFactor < 2.0 || (prog.status === 'learning' && prog.repetitions === 0);
          });
          break;
        case 'due':
          filtered = filtered.filter(w => {
            const prog = map[`${config.topicId}:${w.word}`];
            if (!prog) return true;
            return prog.nextReview <= Date.now();
          });
          break;
      }

      const shuffled = shuffle(filtered);
      const limited = shuffled.slice(0, config.wordCount);

      // Fallback to all words if filter returns empty
      if (limited.length === 0) {
        setWords(shuffle(topicData.words).slice(0, config.wordCount));
      } else {
        setWords(limited);
      }

      setIsLoading(false);
      startTimeRef.current = Date.now();
    });
  }, [config.topicId, config.wordsFilter, config.wordCount, topics]);

  const getElapsedTime = () => Date.now() - startTimeRef.current;

  return {
    topic,
    words,
    wordProgressMap,
    setWordProgressMap,
    isLoading,
    getElapsedTime,
    allTopics: topics,
  };
}
