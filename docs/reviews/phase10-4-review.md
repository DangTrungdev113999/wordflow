# Review: Phase 10-4 — Active Recall + Context Enhancement

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Branch:** feature/phase10-4-active-recall
**Commits:** 3c6d353, e9853be, d979576

---

## Status: NEEDS CHANGES (3 Medium)

### ✅ Những phần tốt

- **ActiveRecallBanner** — 3-phase flow (prompt → rating → done) đúng spec, SM-2 integration OK
- **ContextFillSession** — UI clean, context icons đúng, progress bar, feedback flash
- **useContextProgress** — `MASTERY_THRESHOLD=3`, reactive via `useLiveQuery`, idempotent recording
- **Enrichment** — richExamples 5 context types, validation + fallback, prompt structured
- **MixedReviewPage** — Context mode hoạt động, XP tính đúng

### 🔴 Issues cần fix

#### 1. [MEDIUM] Tap example = auto-mark mastery (không qua quiz)
**File:** `WordDetail.tsx:259`

Click vào example → `recordContextCorrect(ex.context)` — user chỉ cần đọc mà mark mastery. Spec yêu cầu "correct trong ≥3 contexts" = phải trả lời đúng quiz.

**Fix:** Xóa `onClick` handler. Context mastery chỉ nên record từ `ContextFillSession` khi trả lời đúng.

#### 2. [MEDIUM] Options < 4 khi session có ít từ
**File:** `MixedReviewPage.tsx:338-341`

Distractors lấy từ `questions` array. Session 2-3 từ → chỉ 1-2 options thay vì 4. User dễ đoán.

**Fix:** Thêm fallback random words từ cùng topic hoặc all topics khi distractors < 3.

#### 3. [MEDIUM] Duplicate CONTEXT_ICONS/CONTEXT_LABELS
**Files:** `WordDetail.tsx:22-36` + `ContextFillSession.tsx:6-21`

Cùng constant định nghĩa 2 lần. Extract thành shared file.

**Fix:** Tạo `src/features/vocabulary/constants/context.ts` chứa cả hai.

### 🟡 Nice-to-have (không block merge)

#### 4. [LOW] SM-2 quality=2 (Mang máng) same effect as quality=0
Cả hai đều reset repetitions=0. UX hơi phản trực giác. Cân nhắc dùng quality=3 cho "Mang máng".

#### 5. [LOW] Context mode dùng sai event names
`MixedReviewPage.tsx:393-396` — emit `flashcard:correct/incorrect` cho context mode. Nên có `context:correct/incorrect`.

#### 6. [LOW] `blankWord` không handle compound words
`\b` word boundary không match "ice cream", "set up". Edge case cho vocab data hiện tại.

### Summary

ContextFillSession và ActiveRecallBanner implement tốt. 3 issues cần fix: bỏ tap-to-mark mastery, handle ít distractors, extract shared constants. Sau đó merge được.
