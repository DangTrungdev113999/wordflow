# Review: Phase 8 — Tracking & Goals

## Status: NEEDS CHANGES (7 issues, 2 critical)

---

## Critical Issues

### 1. `mistakeStore.ts:66-68` — SM-2 hard case bị stuck interval=1
```ts
case 'hard':
  interval = Math.max(1, Math.round(interval * 1.2));
```
Khi `interval=1`: `Math.round(1 * 1.2) = 1` → rate "hard" liên tục nhưng interval không bao giờ tăng. User sẽ bị kẹt review cùng mistake mãi.
**Fix:** Đổi `Math.round` → `Math.ceil`, hoặc lưu interval dạng float (không round).

### 2. `eventSubscribers.ts:142` — sentenceBuildingPerfect proxy sai
```ts
const sentenceBuildingPerfect = sentenceBuildingCount;
```
Achievement `sentence_perfect` yêu cầu "complete without wrong attempts" nhưng đang dùng tổng completions làm proxy. User 10 completions (có sai) vẫn count = 10 perfect.
**Fix:** Track riêng số lần complete không sai. Emit thêm field `isPerfect` từ sentence building hook, count chỉ khi `isPerfect === true`.

---

## Important Issues

### 3. `mistakeStore.ts:107-109` — reviewedToday đếm sai
```ts
const reviewedToday = mistakes.filter(
  m => m.reviewCount > 0 && m.lastReviewResult && m.nextReview > today
).length;
```
Đếm tất cả mistake đã review (bất kỳ ngày nào) có nextReview tương lai, không phải reviewed hôm nay. Model thiếu field `lastReviewedAt`.
**Fix:** Thêm `lastReviewedAt: string` vào Mistake model. Update khi review. Filter: `m.lastReviewedAt?.startsWith(today)`.

### 4. `eventSubscribers.ts:171-174` — weeklyGoalsMet logic cộng dồn sai
```ts
const weeklyGoalsMet = weeklySnapshots.reduce((sum, snap) => {
  const allMet = snap.goals.every(g => g.achieved >= g.target);
  return sum + (allMet ? snap.daysActive : 0);
}, 0);
```
Achievement `goal_achiever` cần `weeklyGoalsMet >= 7` nhưng logic cộng dồn `daysActive` qua nhiều tuần → 4 ngày/tuần × 2 tuần = 8 cũng trigger.
**Fix:** Đếm số tuần đạt full (all goals met AND daysActive >= 7), hoặc check `snap.daysActive >= 7 && allMet` rồi count tuần.

### 5. `useStudyTimer.ts:73` — Multiple instances gây đếm x2
Nếu `useStudyTimer()` mount ở 2 component cùng lúc (StudyTimerWidget + page nào đó), mỗi instance tạo interval riêng → thời gian chạy x2.
**Fix:** Singleton pattern — dùng module-level state hoặc React context, ensure chỉ 1 interval chạy.

---

## Minor Issues

### 6. `achievementEngine.ts` — Switch thiếu default case
Achievement condition type mới sẽ silently fail. Thêm `default: console.warn('Unknown condition:', condition.type)`.

### 7. `shareService.ts:33` — Toast type = 'info' thay vì 'success'
Copy thành công nên dùng `type: 'success'` cho UX nhất quán.

---

## Completeness: 100% ✅
- Tất cả files trong design đã tạo đầy đủ
- Routes `/mistake-journal` + `/study-planner` ✅
- Nav links + badge count due reviews ✅
- SM-2 spaced repetition logic (ngoài bug #1) ✅
- Event bus integration + mistakeCollector ✅
- Study timer + dailyLog minutesSpent update ✅
- Reminder service + Notification API ✅
- Recharts charts (bar + pie + line) ✅
- Achievement 41 total + tier system + share ✅
- TypeScript clean, Playwright verified ✅

## Summary
Implementation đầy đủ và chất lượng tốt. Tuy nhiên có 2 bugs critical (SM-2 stuck interval, achievement proxy sai) cần fix trước merge. 5 issues còn lại cũng nên fix để đảm bảo data accuracy.
