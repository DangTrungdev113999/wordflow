import { db } from '../db/database';
import type { CustomTopic, CustomWord } from '../db/models';
import { DICTIONARY_API_BASE } from '../lib/constants';

const FETCH_TIMEOUT = 5000;

export interface DictionarySearchResult {
  word: string;
  ipa: string;
  meaning: string;
  example: string;
  audioUrl: string | null;
}

// --- Topic CRUD ---

export async function createTopic(name: string, icon: string): Promise<number> {
  return db.customTopics.add({ name, icon, createdAt: Date.now() });
}

export async function deleteTopic(topicId: number): Promise<void> {
  await db.transaction('rw', [db.customTopics, db.customWords, db.wordProgress], async () => {
    // Remove word progress entries for this topic's words
    const words = await db.customWords.where('topicId').equals(topicId).toArray();
    const progressIds = words.map((w) => `custom-${topicId}:${w.word}`);
    await db.wordProgress.where('wordId').anyOf(progressIds).delete();
    // Remove words and topic
    await db.customWords.where('topicId').equals(topicId).delete();
    await db.customTopics.delete(topicId);
  });
}

export async function getTopics(): Promise<CustomTopic[]> {
  return db.customTopics.orderBy('createdAt').reverse().toArray();
}

// --- Word CRUD ---

export async function addWord(topicId: number, result: DictionarySearchResult): Promise<number> {
  return db.customWords.add({
    topicId,
    word: result.word,
    meaning: result.meaning,
    ipa: result.ipa,
    example: result.example,
    audioUrl: result.audioUrl,
    createdAt: Date.now(),
  });
}

export async function removeWord(wordId: number): Promise<void> {
  const word = await db.customWords.get(wordId);
  if (word) {
    await db.wordProgress.delete(`custom-${word.topicId}:${word.word}`);
    await db.customWords.delete(wordId);
  }
}

export async function getWords(topicId: number): Promise<CustomWord[]> {
  return db.customWords.where('topicId').equals(topicId).toArray();
}

export async function getTopicById(topicId: number): Promise<CustomTopic | undefined> {
  return db.customTopics.get(topicId);
}

// --- Dictionary Search ---

export async function searchWord(word: string): Promise<DictionarySearchResult | null> {
  try {
    const res = await fetch(
      `${DICTIONARY_API_BASE}/${encodeURIComponent(word.trim().toLowerCase())}`,
      { signal: AbortSignal.timeout(FETCH_TIMEOUT) },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const entry = data[0];

    // Extract IPA
    const ipa = entry.phonetic
      || entry.phonetics?.find((p: { text?: string }) => p.text)?.text
      || '';

    // Extract audio URL
    let audioUrl: string | null = null;
    for (const p of entry.phonetics ?? []) {
      if (p.audio) { audioUrl = p.audio; break; }
    }

    // Extract first definition and example
    let meaning = '';
    let example = '';
    for (const m of entry.meanings ?? []) {
      for (const def of m.definitions ?? []) {
        if (!meaning && def.definition) {
          meaning = def.definition;
        }
        if (!example && def.example) {
          example = def.example;
        }
        if (meaning && example) break;
      }
      if (meaning && example) break;
    }

    return {
      word: entry.word ?? word,
      ipa,
      meaning,
      example,
      audioUrl,
    };
  } catch {
    return null;
  }
}
