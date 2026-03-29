# Review: Phase 10-5 — Gamification + Polish

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Branch:** feature/phase10-5-gamification
**Commit:** 65a3556

---

## Status: NEEDS CHANGES (3 High, 1 Medium)

### ✅ Những phần tốt

- **useSessionStreak** — logic đúng, thresholds correct, XP math OK
- **TimerBar** — RAF cleanup tốt, pause/resume correct, color transitions smooth
- **MixedReviewPage** — full integration: StreakIndicator + xpBreakdown + timer ✅
- **SessionSummary** — XP breakdown math checks out
- **SessionPicker** — timed toggle default OFF, session-only state

### 🔴 HIGH — Phải fix

#### 1. [HIGH] Overdue double-count trong ReviewSchedule
**File:** `ReviewSchedule.tsx:29`

`totalDue = dueToday + overdueCount` nhưng `dueToday` (= `forecast[0]`) ĐÃ bao gồm overdue → đếm overdue 2 lần.

**Fix:** `totalDue = forecast[0]` (hoặc chỉ `dueToday`).

#### 2. [HIGH] FlashcardPage không dùng streak/xpBreakdown
**File:** `FlashcardPage.tsx:14-26`

Hook `useFlashcard` trả `streak`, `multiplier`, `bestStreak`, `xpBreakdown` nhưng page không destructure. Không có StreakIndicator, không có XP breakdown.

**Fix:** Destructure và render StreakIndicator + truyền xpBreakdown vào SessionSummary.

#### 3. [HIGH] QuizPage không dùng streak/timer/xpBreakdown
**File:** `QuizPage.tsx:12-28`

Tương tự FlashcardPage — hook trả data nhưng page không dùng. Không có StreakIndicator, TimerBar, hay XP breakdown.

**Fix:** Destructure và render đầy đủ như MixedReviewPage.

### 🟠 MEDIUM

#### 4. [MED] Timed param thiếu cho spelling mode
**File:** `SessionPicker.tsx:94-97`

`&timed=1` chỉ append cho quiz route, spelling route thiếu.

**Fix:** Thêm timed param cho spelling route.

### 🟡 LOW (không block merge)

5. Dead code `dueToday` variable (`useReviewSchedule.ts:49`)
6. StreakIndicator 3-way ternary trả cùng emoji (`StreakIndicator.tsx:41-43`)
7. `stateRef` pattern trong useSessionStreak — functional updater cleaner
8. `tick` omitted từ useEffect deps (`TimerBar.tsx:67`)

### Summary

Core logic (streak, timer, XP math) đúng. Vấn đề chính là **integration thiếu** — FlashcardPage và QuizPage chưa wire streak/timer/xpBreakdown vào UI, và ReviewSchedule đếm overdue 2 lần. Fix 3 HIGH + 1 MED rồi merge được.
