import { db } from '../db/database';
import { ALL_TOPICS } from '../data/vocabulary/_index';

export interface WeakWord {
  wordId: string;
  word: string;
  meaning: string;
  ipa: string;
  easeFactor: number;
  topic: string;
}

export async function getWeakWords(limit = 20): Promise<WeakWord[]> {
  const allProgress = await db.wordProgress.toArray();

  const weakProgresses = allProgress
    .filter(
      (p) =>
        p.easeFactor < 2.0 ||
        (p.status === 'learning' && p.repetitions === 0 && p.lastReview > 0),
    )
    .sort((a, b) => a.easeFactor - b.easeFactor)
    .slice(0, limit);

  const result: WeakWord[] = [];

  for (const prog of weakProgresses) {
    // wordId format: "topic:word"
    const colonIdx = prog.wordId.indexOf(':');
    if (colonIdx === -1) continue;

    const topicId = prog.wordId.slice(0, colonIdx);
    const wordStr = prog.wordId.slice(colonIdx + 1);

    const topic = ALL_TOPICS.find((t) => t.topic === topicId);
    if (!topic) continue;

    const vocabWord = topic.words.find((w) => w.word === wordStr);
    if (!vocabWord) continue;

    result.push({
      wordId: prog.wordId,
      word: vocabWord.word,
      meaning: vocabWord.meaning,
      ipa: vocabWord.ipa,
      easeFactor: prog.easeFactor,
      topic: topicId,
    });
  }

  return result;
}

export function getSessionWeakWords(
  results: Array<{ wordId: string; correct: boolean }>,
  allWeakWords: WeakWord[],
): WeakWord[] {
  const incorrectIds = new Set(
    results.filter((r) => !r.correct).map((r) => r.wordId),
  );
  const weakIds = new Set(allWeakWords.map((w) => w.wordId));

  // Session incorrect words first
  const sessionIncorrect = allWeakWords.filter((w) =>
    incorrectIds.has(w.wordId),
  );
  const otherWeak = allWeakWords.filter(
    (w) => !incorrectIds.has(w.wordId) && weakIds.has(w.wordId),
  );

  // Also include incorrect words not already in allWeakWords
  const missingIncorrect: WeakWord[] = [];
  for (const r of results) {
    if (!r.correct && !weakIds.has(r.wordId)) {
      const colonIdx = r.wordId.indexOf(':');
      if (colonIdx === -1) continue;

      const topicId = r.wordId.slice(0, colonIdx);
      const wordStr = r.wordId.slice(colonIdx + 1);

      const topic = ALL_TOPICS.find((t) => t.topic === topicId);
      if (!topic) continue;

      const vocabWord = topic.words.find((w) => w.word === wordStr);
      if (!vocabWord) continue;

      missingIncorrect.push({
        wordId: r.wordId,
        word: vocabWord.word,
        meaning: vocabWord.meaning,
        ipa: vocabWord.ipa,
        easeFactor: 2.5,
        topic: topicId,
      });
    }
  }

  return [...sessionIncorrect, ...missingIncorrect, ...otherWeak];
}
