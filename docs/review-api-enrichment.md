# Code Review: API Enrichment Layer

**Reviewer:** Marcus (Tech Lead)  
**Date:** 2026-03-28  
**Commits:** 69181a3, 60b8213  
**Verdict:** ✅ PASS

---

## Checklist

| Item | Status | Notes |
|------|--------|-------|
| enrichmentService.ts | ✅ | Clean architecture: cache-first → parallel fetch → extract → cache write |
| Request dedup | ✅ | `inflightRequests` Map — tránh duplicate concurrent fetches |
| Timeout | ✅ | `AbortSignal.timeout(5000)` — đúng theo design |
| Graceful fallback | ✅ | Mọi fetch đều wrap try/catch, return empty data khi fail |
| Cache strategy | ✅ | IndexedDB via dictionaryCache, 7d TTL, prefix `enrichment:` |
| Parallel fetch | ✅ | `Promise.all([fetchDictionary, fetchSynonyms])` |
| Audio preloading | ✅ | `preloadAudio()` tạo `new Audio()` objects, skip already-preloaded |
| useEnrichedAudio hook | ✅ | Enrich current + 3 ahead, dedup via Set ref |
| FlashcardPage wiring | ✅ | `getAudioUrl(word)` fallback to local `word.audioUrl` |
| WordDetail enrichment | ✅ | Thay `lookupWord` bằng `enrichWord`, hiện definitions + synonyms |
| Synonyms UI | ✅ | Pill tags, rounded-full, dark mode support |
| Definitions limit | ✅ | Max 6 definitions, 2 per meaning |
| Constants | ✅ | `DATAMUSE_API_BASE` added to constants.ts |
| TypeScript | ✅ | `tsc --noEmit` pass |
| Unit tests | ✅ | 44/44 pass |

## Không có issue blocking

## Minor suggestions (backlog)

1. **Cache type casting:** `data as unknown as DictionaryEntry[]` trong `cacheEnrichment` là unsafe cast. Nên tạo riêng table `enrichmentCache` trong Dexie schema thay vì reuse `dictionaryCache`. Không critical vì read/write đều dùng cùng cast.

2. **Batch enrichment:** `enrichWordsForAudio` fetch tất cả words song song. Nếu queue lớn (20+ words), nên throttle thành batches of 5 để tránh flood API. Hiện tại hook chỉ fetch 4 words mỗi lần nên OK.

3. **Audio preload memory:** `preloadedAudio` Set grow vô hạn trong session. Với 450 words max thì không vấn đề, nhưng nếu thêm custom word lists thì cần cleanup strategy.
