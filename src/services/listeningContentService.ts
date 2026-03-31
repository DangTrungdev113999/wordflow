import { db } from '../db/database';
import { aiService } from './ai/aiService';
import type { VocabWord, CEFRLevel } from '../lib/types';
import type { ConversationContent, StoryContent, ListeningContentRecord } from '../db/models';

const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

const inflightRequests = new Map<string, Promise<ConversationContent | StoryContent>>();

// --------------- public API ---------------

export async function generateConversation(
  topic: string,
  words: VocabWord[],
  cefrLevel: CEFRLevel = 'A2',
): Promise<ConversationContent> {
  const cacheKey = `conv_${topic}`;

  // Check inflight
  const inflight = inflightRequests.get(cacheKey);
  if (inflight) return inflight as Promise<ConversationContent>;

  const promise = doGenerateConversation(topic, words, cefrLevel, cacheKey);
  inflightRequests.set(cacheKey, promise);
  promise.finally(() => inflightRequests.delete(cacheKey));

  return promise;
}

export async function generateStory(
  topic: string,
  words: VocabWord[],
  cefrLevel: CEFRLevel = 'A2',
): Promise<StoryContent> {
  const cacheKey = `story_${topic}`;

  const inflight = inflightRequests.get(cacheKey);
  if (inflight) return inflight as Promise<StoryContent>;

  const promise = doGenerateStory(topic, words, cefrLevel, cacheKey);
  inflightRequests.set(cacheKey, promise);
  promise.finally(() => inflightRequests.delete(cacheKey));

  return promise;
}

// --------------- internals ---------------

async function getCached<T>(id: string): Promise<T | null> {
  try {
    const record = await db.listeningContent.get(id);
    if (record && Date.now() - record.createdAt < CACHE_TTL) {
      return record.content as T;
    }
    // Expired — delete
    if (record) await db.listeningContent.delete(id);
  } catch { /* cache miss */ }
  return null;
}

async function saveCache(record: ListeningContentRecord): Promise<void> {
  try {
    await db.listeningContent.put(record);
  } catch { /* non-critical */ }
}

async function doGenerateConversation(
  topic: string,
  words: VocabWord[],
  cefrLevel: CEFRLevel,
  cacheKey: string,
): Promise<ConversationContent> {
  // Cache check
  const cached = await getCached<ConversationContent>(cacheKey);
  if (cached) return cached;

  const vocabList = words.slice(0, 12).map(w => `${w.word} (${w.meaning})`).join(', ');

  const response = await aiService.chat(
    [
      {
        role: 'system',
        content: 'You are an ESL content creator. Generate ONLY valid JSON, no markdown or extra text.',
      },
      {
        role: 'user',
        content: `Create an English conversation about "${topic}" at CEFR ${cefrLevel} level.

Requirements:
- 2 speakers with natural names (e.g. Anna, Tom)
- 8-12 dialogue lines alternating between speakers
- Use at least 5 of these vocabulary words naturally: ${vocabList}
- Each line has Vietnamese translation
- 4 comprehension questions in Vietnamese with 4 options each (in Vietnamese)
- relatedLine is the 0-based index of the conversation line the question refers to

JSON format:
{
  "title": "string (English, e.g. 'At the Coffee Shop')",
  "speakers": [{"name":"string","voice":"male"|"female"}],
  "lines": [{"speaker":"string","text":"string","translation":"string","highlightWords":["string"]}],
  "questions": [{"question":"string (Vietnamese)","options":["string"],"correctIndex":0-3,"explanation":"string (Vietnamese)","relatedLine":0}],
  "keyVocab": ["string"],
  "durationEstimate": number
}`,
      },
    ],
    { feature: 'listening-conversation', maxTokens: 2048, temperature: 0.7 },
  );

  const parsed = JSON.parse(response.text);
  const content: ConversationContent = {
    id: cacheKey,
    topic,
    cefrLevel,
    title: parsed.title,
    speakers: parsed.speakers,
    lines: parsed.lines,
    questions: (parsed.questions ?? []).slice(0, 4),
    keyVocab: parsed.keyVocab ?? [],
    durationEstimate: parsed.durationEstimate ?? 60,
  };

  await saveCache({ id: cacheKey, topic, type: 'conversation', content, createdAt: Date.now() });
  return content;
}

async function doGenerateStory(
  topic: string,
  words: VocabWord[],
  cefrLevel: CEFRLevel,
  cacheKey: string,
): Promise<StoryContent> {
  const cached = await getCached<StoryContent>(cacheKey);
  if (cached) return cached;

  const vocabList = words.slice(0, 15).map(w => `${w.word} (${w.meaning})`).join(', ');

  const response = await aiService.chat(
    [
      {
        role: 'system',
        content: 'You are an ESL content creator. Generate ONLY valid JSON, no markdown or extra text.',
      },
      {
        role: 'user',
        content: `Write an English short story/news article about "${topic}" at CEFR ${cefrLevel} level.

Requirements:
- 3-5 paragraphs, each 2-4 sentences
- Use at least 8 of these vocabulary words naturally: ${vocabList}
- Vietnamese translation for each paragraph
- 5 comprehension questions in Vietnamese with 4 options each (in Vietnamese)
- relatedLine is the 0-based paragraph index the question refers to

JSON format:
{
  "title": "string (English, e.g. 'A Day at the Market')",
  "paragraphs": ["string"],
  "translation": ["string (Vietnamese per paragraph)"],
  "questions": [{"question":"string (Vietnamese)","options":["string"],"correctIndex":0-3,"explanation":"string (Vietnamese)","relatedLine":0}],
  "keyVocab": ["string"],
  "durationEstimate": number
}`,
      },
    ],
    { feature: 'listening-story', maxTokens: 2048, temperature: 0.7 },
  );

  const parsed = JSON.parse(response.text);
  const content: StoryContent = {
    id: cacheKey,
    topic,
    cefrLevel,
    title: parsed.title,
    paragraphs: parsed.paragraphs,
    translation: parsed.translation,
    questions: (parsed.questions ?? []).slice(0, 5),
    keyVocab: parsed.keyVocab ?? [],
    durationEstimate: parsed.durationEstimate ?? 120,
  };

  await saveCache({ id: cacheKey, topic, type: 'story', content, createdAt: Date.now() });
  return content;
}
