# Review: Daily Challenge v2 (Phase 7 Feature 1)

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-28
**Status:** ❌ NEEDS CHANGES

---

## Critical Bug

### 1. `useDailyChallenge.ts:192` — Streak KHÔNG BAO GIỜ được update

Thiếu hoàn toàn streak update logic. Code đọc `currentStreak` nhưng không increment.

**Cần thêm:**
```typescript
const yesterday = getYesterdayString();
const yesterdayLog = await db.dailyChallenges.get(yesterday);
const newStreak = (yesterdayLog?.completed) ? currentStreak + 1 : 1;
useProgressStore.getState().setStreak(newStreak);
useProgressStore.getState().setLastActiveDate(today);
const milestone = checkStreakMilestone(newStreak); // check giá trị MỚI
```

---

## Bugs

### 2. `useDailyChallenge.ts:186-188` — 75 XP bonus không cộng vào store

```typescript
if (allDone) {
  const bonus = 75;
  newXP += bonus; // chỉ track local, THIẾU addXP(bonus)
}
```

User thấy "Earned X XP" nhưng XP thật thiếu 75.
**Fix:** Thêm `useProgressStore.getState().addXP(bonus);`

### 3. `useDailyChallenge.ts:193-199` — Badge không được award

```typescript
if (milestone) {
  useProgressStore.getState().addXP(milestone.xpBonus);
  // THIẾU: addBadge(milestone.badgeId)
}
```

**Fix:** Thêm `useProgressStore.getState().addBadge(milestone.badgeId);`

### 4. `useDailyChallenge.ts:195` — Milestone XP thiếu trong log.xpEarned

Milestone XP cộng vào store nhưng không cộng vào `newXP` → log hiện thấp hơn thực tế.
**Fix:** `newXP += milestone.xpBonus;`

---

## Minor

### 5. `ChallengeSentenceBuildingTask.tsx:37` — Duplicate words dùng indexOf
Nếu câu có từ trùng (e.g., "the cat and the dog"), tap từ thứ 2 remove từ thứ 1.
**Fix (optional):** Track bằng index hoặc unique ID.

---

## Đã OK

- ✅ Dexie migration backward compatible (v6, guard old format)
- ✅ addXP không gọi trong render
- ✅ 5 tasks, CEFR filter, seed-based — đúng design
- ✅ streakRewards.ts milestones match design
- ✅ ChallengeSentenceBuildingTask + ChallengeMediaTask integration hợp lý
- ✅ achievements.json đúng
- ✅ Code clean, không dead code
