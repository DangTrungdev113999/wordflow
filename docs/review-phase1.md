# Review: Phase 1 — Foundation MVP

## Status: NEEDS CHANGES

## Issues

### 🔴 CRITICAL
1. **`src/features/vocabulary/hooks/useFlashcard.ts`** — `handleRate()` không gọi `recordAnswer()` → `sessionStats` luôn `{correct:0, incorrect:0, total:0}` suốt session. `FlashcardPage` hiển thị accuracy = 0.
   - Fix: thêm `recordAnswer(rating >= 3)` vào `handleRate` sau `nextCard()`

### 🟡 BUG
2. **`src/features/vocabulary/pages/FlashcardPage.tsx:49`** — XP display hardcode `sessionStats.correct * 10` nhưng XP thực tế varies (Again=5, Good=10, Easy=15). Ngoài ra dùng `sessionStats.correct` luôn = 0 (bug #1).
   - Fix: track `sessionXP` riêng hoặc dùng `todayXP` từ `progressStore`

3. **`daily_goal_met` XP bonus (100xp) không bao giờ được award** — `constants.ts` định nghĩa nhưng không có code nào trigger.
   - Fix: trong `useFlashcard.ts`, sau `incrementWordsLearned`, check `todayTotal >= dailyGoal` → `addXP(XP_VALUES.daily_goal_met)` (once per day flag)

### 🔵 MINOR
4. **`src/lib/utils.ts:25-34`** — LEVELS array duplicate y hệt `constants.ts:12-21`. Import từ constants thay vì copy.

5. **`src/db/models.ts:58`** — `DictionaryCache.data: unknown` → cast `as DictionaryEntry[]` ở service. Nên type trực tiếp `DictionaryEntry[]`.

6. **`src/components/layout/Sidebar.tsx`** — Missing. Architecture spec có Sidebar cho desktop layout.

## ✅ PASS
- SM-2 algorithm: khớp chính xác spec
- Dexie DB schema: đúng hoàn toàn
- Dictionary API: cache IndexedDB + 7-day TTL ✓
- Audio service: HTML5 Audio + Web Speech fallback ✓
- Zustand stores: structure đúng
- Data JSON: format đúng spec, 25 words/topic
- TypeScript: không có `any`, types clean
- Streak logic: đúng spec section 5.3
- Code quality: sạch, readable, file structure đúng architecture

## Summary
Code quality tổng thể tốt. Architecture implement đúng spec. Có 1 critical bug (sessionStats không update) và 2 bugs nhỏ (XP display + daily goal bonus). Fix xong 3 issues đầu là merge được.
