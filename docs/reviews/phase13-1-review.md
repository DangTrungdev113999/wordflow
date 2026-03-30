# Review: Phase 13-1 — Multi-meaning Words + Confusing Pairs

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-30
**Branch:** feature/phase13-1-multi-meaning
**Commit:** 7cb69fd

---

## Status: NEEDS CHANGES (2 Medium)

### ✅ Những phần tốt

- **models.ts** — types match design chính xác (WordSense, MultiMeaningWord, ConfusingPair, PairQuiz...)
- **confusingPairs.ts** — 50 pairs đủ, quiz items trên tất cả entries, Vietnamese translations tự nhiên
- **multiMeaningSeeds.ts** — Data quality cao, collocations + examples + tips đầy đủ
- **Inflight dedup** trong multiMeaningService — clean pattern
- **Dexie schema** — version 10 migration, 5 tables mới
- **UI components** — tab chips, frequency dots, compact mode, side-by-side comparison đúng design wireframes
- **WordUsageHubPage** — hub clean, "Sắp ra mắt" cho future features

### 🔴 Issues cần fix

#### 1. [MEDIUM] Quiz score summary không hiển thị được (bug)
**File:** `PairQuizInline.tsx:18`

Sau khi trả lời câu cuối, `handleNext` tăng `currentIndex` past array → `quiz.sentences[currentIndex]` = undefined → guard `if (!item) return null` fire TRƯỚC `isComplete` check → score/retry UI không bao giờ hiện.

**Fix:** Di chuyển `isComplete` check lên trước item guard:
```tsx
const isComplete = results.length === quiz.sentences.length;
if (isComplete) { /* render score summary + retry */ }
const item = quiz.sentences[currentIndex];
if (!item) return null;
```

#### 2. [MEDIUM] Gemini enrichment (Tier 2) bị thiếu → Vietnamese meaning hiện tiếng Anh
**File:** `multiMeaningService.ts:109`

Design có 3 tầng nhưng implementation skip Gemini hoàn toàn. Words ngoài 19 seeds lấy từ Dictionary API → `meaning` field là English definition thay vì Vietnamese.

**Fix:** Implement basic Gemini enrichment hoặc ít nhất set `meaning` = `""` (empty) thay vì English definition khi chưa có Gemini, để UI có thể hiện "Chưa có dịch" thay vì confused English trong Vietnamese field. Gemini full integration có thể track cho follow-up.

### 🟡 Nice-to-have (không block merge)

#### 3. [LOW] MultiMeaningCard không dùng useMultiMeaning hook
Card có inline useEffect riêng, hook đã build nhưng unused. Hook có sync seed initialization tránh loading flash.

#### 4. [LOW] WordDetail placement khác design
Design: giữa Rich Examples và Dictionary Definitions. Actual: ở cuối sau Synonyms.

#### 5. [LOW] Static data không lazy-loaded
confusingPairs.ts (~1919 lines) + multiMeaningSeeds.ts (~686 lines) imported eagerly. Design yêu cầu dynamic import.

#### 6. [LOW] Seed data chỉ 19 từ (design nói 100)
Acceptable cho batch 1, nhưng nên track mở rộng.

### Summary

Architecture đúng design, types clean, UI components match wireframes, data quality tốt. Fix 2 bugs: quiz score unreachable + Vietnamese meaning bị hiện English. Sau đó merge được.
