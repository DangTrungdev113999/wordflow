# Review: Phase 12-3 — Quick Lookup + Special Cases (7 pages)

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-30
**Branch:** feature/phase12-3-quick-lookup
**Commit:** 6455886

---

## Status: NEEDS CHANGES (1 Bug)

### ✅ Những phần tốt

- **7/7 pages** implement đúng design, clean patterns
- **CollocationGuide** — MiniQuiz state machine correct, out-of-bounds guard ✅
- **PrepositionGuide** — tab filtering + expand/collapse đúng ✅
- **ArticlesCheatSheet** — default expanded 'a', UX tốt ✅
- **CommonMistakes** — search/filter/sort plumbing correct ✅
- **FalseFriends** — search/filter đúng pattern ✅
- **GrammarPatterns** — LEVEL_STYLES covers đúng levels (A2/B1/B2), related patterns handle gracefully ✅
- **Routes** — 7 routes đúng order, trước catch-all ✅

### 🔴 Issues cần fix

#### 1. [BUG] Frequency dots invisible trong PhrasalVerbLookup
**File:** `PhrasalVerbLookup.tsx:29-33, 237`

`FREQUENCY_DOTS` dùng `text-emerald-500` trên empty `<div>` — `text-*` chỉ color text, không color background. Dots sẽ invisible vì div rỗng.

**Fix:**
```ts
const FREQUENCY_DOTS: Record<number, string> = {
  1: 'bg-emerald-500',    // was text-*
  2: 'bg-amber-500',      // was text-*
  3: 'bg-gray-400 dark:bg-gray-500',  // was text-*
};
```

### Summary

7 pages clean, chỉ 1 bug CSS nhỏ nhưng ảnh hưởng visual. Fix xong merge được.
