# Review: Phase 11-1 — Visual Theory + Data Model

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Branch:** feature/phase11-1-visual-theory
**Commit:** 46d5b4f

---

## Status: NEEDS CHANGES (3 Medium cần fix, 2 Medium nice-to-have)

### ✅ Những phần tốt

- **Types** — backward compat, all new fields optional, SentencePart.role union matches ROLE_COLORS ✅
- **Colors** — 7 roles đủ, light + dark mode ✅
- **BeforeAfterCard** — side-by-side desktop, stacked mobile, word highlight, animation sequencing đẹp ✅
- **BookmarkedSheetsPage** — Dexie useLiveQuery, toggleBookmark logic đúng ✅
- **Database** — version 9, additive migration ✅
- **Routes** — `/grammar/bookmarks` trước wildcard ✅
- **JSON data** — 4 lessons enriched, structure đúng types, giải thích tiếng Việt tốt

### 🔴 Issues cần fix

#### 1. [MEDIUM] Steps mode bỏ mất sections không có steps
**File:** `LessonPage.tsx:70-73`

Khi 1 section có `steps`, toàn bộ rendering truyền thống bị skip. Sections "When to use" + "Signal Words" trong present-simple.json bị mất.

**Fix:** Render MỌI sections — section nào có steps → StepByStep, section nào không → render truyền thống. Không phải either/or.

#### 2. [MEDIUM] Role "auxiliary" dùng sai cho articles a/an
**File:** `articles.json:17,28`

`"a"/"an"` được gán role `auxiliary` → label "Trợ động từ" → SAI. Articles không phải auxiliary verbs.

**Fix:** Thêm role `determiner` vào types + colors, hoặc đổi sang role phù hợp hơn (ví dụ thêm `'determiner'` vào SentencePart.role union).

#### 3. [MEDIUM] `border-gray-150` không tồn tại
**File:** `ConjugationGrid.tsx:120`

Tailwind không có `gray-150`. Mobile cards sẽ không có border.

**Fix:** Đổi thành `border-gray-200`.

### 🟡 Nice-to-have (không block merge nhưng nên fix)

#### 4. [MEDIUM] localStorage không try/catch
**File:** `StepByStep.tsx:35`

Safari incognito throw lỗi. Wrap trong try/catch.

#### 5. [MEDIUM] `lessonId` prop dead code trong CheatSheetCard
**File:** `CheatSheetCard.tsx:13`

Declared + destructured nhưng không dùng. Xóa hoặc dùng cho share deep link.

### 🟡 Low priority

#### 6. [LOW] Thiếu role legend trong ColoredSentence
Spec yêu cầu legend (color key). Chỉ có tooltip. Thêm collapsible legend dùng ROLE_LABELS.

#### 7. [LOW] StepByStep thiếu swipe gesture
Chỉ có prev/next buttons. Thêm framer-motion `drag="x"` cho mobile UX.

### Summary

Components chất lượng tốt, types backward compat, JSON data đúng. 3 issues cần fix: steps mode mất content, role sai cho articles, invalid Tailwind class. Fix 3 cái đó là merge được.
