# Review: Phase 11-2 — Interactive Quiz + SentenceExplorer

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Branch:** feature/phase11-2-interactive-quiz
**Commits:** 399af65, 00a99a3

---

## Status: NEEDS CHANGES (2 Medium)

### ✅ Những phần tốt

- **Types** — RoleIdentifyExercise + TransformExercise đúng, union updated ✅
- **QuizRenderer** — dispatch 2 types mới đúng ✅
- **QuizPage** — `getExerciseQuestion` + `getExerciseCorrectAnswer` handle exhaustive ✅
- **LessonPage** — SentenceExplorer integration clean ✅
- **JSON data** — 4 lessons enriched, 14 exercises mỗi file, 6 types đều có, multi-word parts OK ✅

### 🔴 Issues cần fix

#### 1. [MEDIUM] Click-outside dismiss thiếu cho role picker
**Files:** `SentenceExplorer.tsx:141-168` + `RoleIdentify.tsx:138-166`

Dropdown chỉ close khi chọn role hoặc tap chip khác. Trên mobile, tap empty space → picker vẫn mở → confusing.

**Fix:** Thêm backdrop overlay hoặc `useClickOutside` hook cho cả 2 components. Gợi ý:
```tsx
// Backdrop overlay approach (simpler):
{activeIndex !== null && (
  <div className="fixed inset-0 z-10" onClick={() => setActiveIndex(null)} />
)}
// Picker needs z-20
```

#### 2. [MEDIUM] RoleIdentify không có partial credit
**File:** `RoleIdentify.tsx:59`

Binary pass/fail — user đúng 4/5 words vẫn score 0. Nên có threshold hoặc ratio.

**Fix:** `onAnswer(correctCount / totalCount >= 0.7, ...)` hoặc pass score ratio cho QuizPage tính điểm.

### 🟡 Nice-to-have (không block merge)

#### 3. [LOW] Hint luôn visible, thiếu toggle
**File:** `TransformExercise.tsx:81-85`

Hint hiện luôn, không có nút show/hide. Thêm toggle state.

#### 4. [LOW] `ALL_ROLES` duplicate
**Files:** `SentenceExplorer.tsx:12` + `RoleIdentify.tsx:14`

Cùng array. Extract thành shared constant.

#### 5. [LOW] `computeDiff` naive
**File:** `TransformExercise.tsx:15-26`

Set-based → không handle duplicate words hoặc word-order changes. OK cho data hiện tại nhưng fragile.

### Summary

SentenceExplorer + 2 exercise types implement tốt. 2 issues cần fix: click-outside dismiss + partial credit. Fix xong merge được.
