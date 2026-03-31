# Review: Phase 13-3 — Context Grammar + Quiz Integration

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-31
**Branch:** feature/phase13-3-grammar-quiz
**Commit:** 2e3de79

---

## Status: NEEDS CHANGES (2 Medium)

### ✅ Những phần tốt

- **grammarPatterns.ts** — 29 patterns, 5 categories, tất cả có quiz, Vietnamese focus tốt
- **GrammarCompareCard** — side-by-side forms clean, common mistake + memory tip hiển thị đúng
- **GrammarPatternsPage** — search + filter, COUNTS precomputed module-level ✅
- **models.ts** — types match design (GrammarPattern, GrammarForm, GrammarCategory)
- **Hub page** — all 5 cards enabled

### 🔴 Issues cần fix

#### 1. [MEDIUM] UsageQuizSession exported nhưng không ai import (dead code)
**File:** `UsageQuizSession.tsx`

Component có XP integration (+10 per correct) nhưng không được dùng. Inline `QuizSection` trong GrammarCompareCard duplicate quiz logic KHÔNG có XP. User chơi quiz → không nhận XP.

**Fix:** Một trong hai:
- Wire `UsageQuizSession` vào page (ví dụ button "🧩 Quiz tổng hợp" trên GrammarPatternsPage)
- Hoặc xóa `UsageQuizSession`, thêm XP vào inline QuizSection

#### 2. [MEDIUM] Listening routes bị comment out
**File:** `routes/index.tsx`

3 listening routes + lazy imports bị comment `// TODO`. Nếu vô tình sửa → cần revert. Nếu cố ý → tách commit riêng.

**Fix:** Revert listening route changes về trạng thái main.

### 🟡 Nice-to-have (không block merge)

#### 3. [LOW] Mobile responsiveness
`GrammarCompareCard` dùng `grid-cols-2` cứng — trên mobile hẹp bị cramped. Nên `grid-cols-1 sm:grid-cols-2`.

#### 4. [LOW] Inline quiz không có XP
QuizSection trong GrammarCompareCard không gọi addXP — inconsistent với UsageQuizSession.

### Summary

Grammar data quality tốt, UI đúng design. Fix 2 issues: wire UsageQuizSession hoặc xóa dead code + revert listening routes. Phase 13 sắp xong! 🎉
