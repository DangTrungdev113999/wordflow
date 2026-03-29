# Review: Phase 10-3 — Mixed Review / Interleaving

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Branch:** feature/phase10-3-mixed-review
**Commits:** f0c60a7, 3c229c8

---

## Status: NEEDS CHANGES (2 Medium)

### ✅ Những phần tốt

- **Interleave shuffle** — round-robin + skip-on-repeat algorithm đúng, handle edge cases (empty, single topic) ✅
- **Word selection** — 4 filters hoạt động, dedup đúng, max 3/topic cho random ✅
- **MixedReviewPicker** — config UI clean, validation, diversity tip ≤2 topics ✅
- **VocabularyPage** — button + due banner đúng threshold (≥5), gradient styling ✅
- **Route** — `/vocabulary/mixed-review` đặt trước wildcard `:topic` ✅
- **Vietnamese UI** — labels, tips đều tiếng Việt, consistent

### 🔴 Issues cần fix

#### 1. [MEDIUM] XP không persist — chỉ display
**File:** `MixedReviewPage.tsx:371`

`xpEarned` tính đúng (base × 1.5x) nhưng chỉ truyền vào `SessionSummary` để hiển thị. Không emit qua `eventBus` hay ghi vào XP store. User thấy XP nhưng thực tế không được cộng.

**Fix:** Emit XP event khi session complete:
```ts
eventBus.emit('xp:earned', { amount: xpEarned, source: 'mixed-review' });
```

#### 2. [MEDIUM] `word:learned` có thể fire trùng
**File:** `MixedReviewPage.tsx:93-95, 194-196`

Check `existing.status === 'new'` dùng `localProgress` — nhưng `createInitialProgress` set status `'new'` và `calculateSM2` có thể không đổi status → fire `word:learned` mỗi lần review word đó.

**Fix:** Verify `calculateSM2` update status, hoặc track đã-fire trong session:
```ts
const learnedInSession = new Set<string>();
// before emit: if (!learnedInSession.has(wordId)) { emit; learnedInSession.add(wordId); }
```

### 🟡 Nice-to-have (không block merge)

#### 3. [LOW] Context mode silent fallback
**File:** `MixedReviewPage.tsx:292`

User chọn "Context" nhưng nhận flashcard không thông báo. Nên show toast hoặc ẩn option Context.

#### 4. [LOW] `window.confirm()` blocking
**File:** `MixedReviewPage.tsx:308`

Dùng `window.confirm()` thay vì modal component — không consistent với UI polished của app.

#### 5. [LOW] Duplicate shuffle function
**File:** `MixedReviewPage.tsx:23-30` vs `useMixedReview.ts:90-97`

Cùng Fisher-Yates, nên extract thành shared utility.

### Summary

Architecture tốt, interleave algorithm đúng, UI clean. 2 bugs cần fix: XP chỉ hiển thị không persist, và `word:learned` event có thể fire trùng. Fix 2 items đó là merge được.
