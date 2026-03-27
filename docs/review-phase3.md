# Review: Phase 3 — Gamification & Polish

## Status: NEEDS CHANGES

## Issues

### 🔴 CRITICAL
1. **DailyLog không bao giờ được write** — `useFlashcard.ts` và `QuizPage.tsx` gọi `addXP()`, `incrementWordsLearned()` nhưng KHÔNG ghi vào `db.dailyLogs`. StatsPage query DailyLog từ IndexedDB → charts luôn trống/0.
   - Fix: sau mỗi activity (flashcard answer, quiz complete), cần `db.dailyLogs.where('date').equals(today).modify(...)` hoặc tạo helper `updateDailyLog()` trong progressStore để increment `wordsLearned`, `wordsReviewed`, `xpEarned`, `grammarCompleted`, `quizAccuracy`, `minutesSpent`

### 🟡 IMPORTANT
2. **PWA không hoàn chỉnh** — Có `manifest.json` nhưng thiếu service worker → app không installable. Thiếu PNG icons 192x192 + 512x512.
   - Fix: cài `vite-plugin-pwa`, generate icons, register SW trong `main.tsx`

3. **Vocabulary data: 325 words < 500 spec** — 13 topics × 25 = 325. Architecture Phase 3 yêu cầu 500+.
   - Fix: thêm ≥7 topics mới hoặc expand existing topics

### 🔵 MINOR
4. **`useAchievements.ts`** — `checkedRef` + `eslint-disable-line` che dependency array, logic khó follow.
   - Fix: refactor rõ ràng hơn, thêm comment giải thích intent

5. **Không có page transitions** — Framer Motion có trong stack nhưng chưa có AnimatePresence wrap routes.
   - Suggestion: wrap router outlet với AnimatePresence cho smooth transitions

## ✅ PASS
- achievementEngine: 10 badges đúng spec 5.4, conditions chính xác ✓
- achievements.json: đủ 10 definitions ✓
- AchievementsPage: earned/locked badges + LevelProgress ✓
- toastStore + ToastContainer: AnimatePresence, auto-dismiss 3.5s ✓
- StatsPage: Recharts bar + line charts structure đúng (nhưng data trống do bug #1) ✓
- SettingsPage: theme 3 options + daily goal ✓
- Sidebar.tsx: responsive `hidden lg:flex` ✓
- FlipCard: Framer Motion rotateY + preserve-3d ✓
- progressStore: badges persist via Zustand persist ✓
- Grammar data: 20 lessons ✓
- TypeScript: no `any`, types clean ✓

## Summary
Phase 3 gần hoàn thiện. Critical bug là DailyLog không persist — StatsPage vô nghĩa nếu không có data. PWA thiếu service worker. Vocabulary chưa đạt 500 words. Fix #1 bắt buộc, #2 #3 nên fix để đạt spec.
