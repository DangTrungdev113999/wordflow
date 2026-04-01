# Review: UX Overhaul Phase D — Lesson Flow Polish

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-04-01
**Commit:** c8b8b88

---

## Status: NEEDS CHANGES (1 Critical + 2 Medium)

### ✅ Những phần tốt

- **PracticePhase** — sentence ordering + fill-in-blank, fallback logic cho topics thiếu data
- **PhaseIntro** — clean intro cards với icon + "Sẵn sàng?" button
- **Progress persistence** — zustand persist + localStorage, resume toast, no race conditions ✅
- **Phase stepper** — dots indicator đúng (active/completed/pending)
- **Achievement events** — emit đúng events cho achievement engine
- **Completion polish** — confetti, score breakdown, animated XP counter

### 🔴 Critical (P1)

#### 1. Double XP on quiz completion
**File:** `LessonFlowPage.tsx:766-796`

`handleQuizComplete` vừa gọi `addXP(totalXP)` trực tiếp, vừa emit `quiz:complete` → `eventSubscribers` cũng gọi `addXP`. User nhận XP **2 lần**.

**Fix:** Xóa `addXP(totalXP)` trực tiếp, chỉ dùng event subscriber. Hoặc thêm flag `{ fromLesson: true }` vào event payload để subscriber skip.

### 🟡 Medium (P2)

#### 2. Fill-in-blank regex blank sai word form
**File:** `PracticePhase.tsx:55-56`

Regex `\brun\w*\b` blank "running" nhưng `correctWord` = "run". User chọn "run" = đúng, nhưng sentence gốc là "running" → confusing.

**Fix:** Dùng exact match thay vì `\w*` wildcard, hoặc set `correctWord` = matched text.

#### 3. Dead `lesson.phases` config — hardcoded thay vì đọc từ data
**Files:** `LessonFlowPage.tsx:734` + `lessonStore.ts:67`

Cả hai hardcode `['vocab', 'grammar', 'practice', 'quiz']`, bỏ qua `lesson.phases` trong units.ts. Dead config.

**Fix:** Dùng `lesson.phases` hoặc xóa field khỏi type.

### 🟡 Nice-to-have

- Dead ternary `finalScore` (`LessonFlowPage.tsx:354`)
- 11/15 topics thiếu sentence data → luôn fallback fill-in-blank (acceptable, thêm data dần)
- `handleNextLesson` không reset `earnedXP`
- A11y gaps trong sentence ordering (no keyboard/aria support)

### Summary

Phase D polish tốt — persistence, stepper, practice exercises, achievement integration đều solid. **1 critical bug double XP** cần fix ngay + 2 medium issues. Fix xong là UX Overhaul hoàn tất! 🎉
