# Review: Phase 10-5 — Gamification + Polish

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Branch:** feature/phase10-5-gamification (đã merge vào main)
**Commits:** 65a3556, 7f249fe, 886232c

---

## Status: NEEDS CHANGES (3 Medium)

### ✅ Những phần tốt

- **Streak system** — multipliers đúng (3→1.2x, 5→1.5x, 10→2x), state management clean, `stateRef` tránh stale closures
- **TimerBar** — RAF-based countdown mượt, pause/resume đúng, cleanup cancel RAF on unmount
- **SessionSummary** — XP breakdown clean, grid adaptive
- **SessionPicker** — timed toggle chỉ hiện cho quiz/spelling, đúng
- **ReviewSchedule** — forecast 7 ngày, overdue counting fix đúng (886232c)

### 🔴 Issues cần fix

#### 1. [MEDIUM] Hardcoded `MODE_RATING_MAP.quiz` cho spelling mode
**File:** `useQuizSession.ts:122, 225`

Cả `handleSelect` và `handleTimeout` đều dùng `MODE_RATING_MAP.quiz`. Khi `mode=spelling`, correct answers nhận SM-2 quality `4` thay vì `5` → interval ngắn hơn intended.

**Fix:** `const ratingMap = MODE_RATING_MAP[modeParam] || MODE_RATING_MAP.quiz;`

#### 2. [MEDIUM] Duplicate answer-processing logic
**File:** `useQuizSession.ts:110-247`

`handleSelect` và `handleTimeout` cùng logic: SM-2 update → DB write → progress update → streak → event → results → advance. Dễ drift khi sửa 1 chỗ quên chỗ kia.

**Fix:** Extract `processAnswer(wordId, isCorrect, timeMs)` shared function.

#### 3. [MEDIUM] Dead code `dueToday` + unused variables
**File:** `useReviewSchedule.ts:48, 26, 21`

- `dueToday = overdueCount + forecast[0] - overdueCount` = `forecast[0]` (dead code)
- `dayAfterTomorrow` declared nhưng không dùng
- `now` chỉ dùng 1 chỗ, có thể inline

**Fix:** Xóa dead code, clean up unused vars.

### 🟡 Nice-to-have (không block merge)

#### 4. [LOW] No-op ternary trong StreakIndicator
**File:** `StreakIndicator.tsx:43`

3 branches đều return `'🔥'`. Nên differentiate hoặc simplify.

#### 5. [LOW] Mixed bonus XP approximation
**File:** `MixedReviewPage.tsx:544`

Tính `base = xp / 1.5` không chính xác khi có incorrect answers (0 XP). Nên track base XP riêng.

### Summary

Timer, streak, review schedule implement tốt. 3 issues cần fix: spelling mode SM-2 rating sai, duplicate logic dễ drift, dead code. Fix xong là Phase 10 complete! 🎉
