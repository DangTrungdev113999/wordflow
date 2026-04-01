# Review: UX Overhaul Phase C — Learning Path

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-04-01
**Commit:** 08c7d69

---

## Status: NEEDS CHANGES (2 Critical + 2 Medium)

### ✅ Những phần tốt

- **Data model** — Unit/Lesson/LessonPhase types clean, extensible
- **Content mapping** — 15 lessons mapped đúng vocab/grammar topics hiện có
- **LearnPage** — tab toggle + accordion UI đẹp, lesson cards đọc status đúng
- **DashboardPage** — `useShallow` chống infinite re-render, next lesson integration clean
- **LessonFlowPage** — state machine vocab→grammar→quiz→completion flow đúng, no memory leaks
- **Performance** — useMemo/useCallback hợp lý, Framer Motion cleanup OK

### 🔴 Critical (P1)

#### 1. XP farming — replay lesson = XP vô hạn
**Files:** `lessonStore.ts:84` + `LessonFlowPage.tsx:553`

`completeLesson` overwrite status vô điều kiện, `addXP` không check đã complete. User replay lesson completed → nhận full XP lại.

**Fix:** Check status trước khi award:
```ts
// LessonFlowPage.tsx
const alreadyCompleted = getLessonStatus(lessonId) === 'completed';
// ... sau quiz
if (!alreadyCompleted) addXP(totalXP);
```

#### 2. Không enforce lesson lock — skip ahead qua URL
**File:** `LessonFlowPage.tsx:508`

User navigate trực tiếp `/learn/lesson/u5-l3` bypass unlock logic.

**Fix:** Check `isLessonAvailable(lessonId)` on mount, redirect nếu locked:
```ts
if (!isLessonAvailable(lessonId)) navigate('/learn');
```

### 🟡 Medium (P2)

#### 3. XP formula duplicated
**Files:** `LessonFlowPage.tsx:548-551` + `LessonFlowPage.tsx:574`

XP tính 2 lần (logic + JSX). Nếu sửa 1 chỗ quên chỗ kia → sai.

**Fix:** Store `totalXP` trong state, pass xuống `CompletionScreen`.

#### 4. GrammarPhase return null khi grammarId invalid
**File:** `LessonFlowPage.tsx:139`

User thấy blank screen, không thể tiếp tục.

**Fix:** Auto-skip to quiz hoặc show error message.

### 🟡 Nice-to-have

- Dead ternary `finalScore` (`LessonFlowPage.tsx:340`) — cả 2 branch giống nhau
- `startLesson` reset in-progress lessons — cân nhắc chỉ reset nếu status ≠ `in_progress`
- `phases` field trong type chưa dùng, hardcode trong LessonFlowPage
- Progress ring NaN khi total=0

### Summary

Learning Path architecture tốt, content mapping đúng. **2 critical bugs**: XP farming + skip lessons qua URL. Fix P1s + P2s rồi merge được.
