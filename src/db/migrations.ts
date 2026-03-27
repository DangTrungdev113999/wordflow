// Schema versioning managed via Dexie version() calls in database.ts
// This file documents migration history for reference

/*
  Version 1 (initial):
  - words: id, topic, cefrLevel
  - wordProgress: wordId, nextReview, status
  - grammarLessons: id, level, completed
  - dailyLogs: date
  - userProfile: id
  - dictionaryCache: word, cachedAt
*/

export const CURRENT_DB_VERSION = 1;
