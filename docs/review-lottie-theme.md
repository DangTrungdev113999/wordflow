# Code Review: Lottie Animations + Dark Mode Fix

**Reviewer:** Marcus (Tech Lead)  
**Date:** 2026-03-28  
**Commits:** ed9cff5, 21d9b06, 8bb14d4  
**Verdict:** ✅ PASS

---

## Checklist

| Item | Status | Notes |
|------|--------|-------|
| Dark mode fix | ✅ | Đúng 1 dòng `@custom-variant dark` — chính xác theo design |
| Lottie package | ✅ | `lottie-react@2.4.1` — lightweight, đúng choice |
| Lottie JSON files | ✅ | 5 files, tổng 15KB — rất nhẹ, valid Lottie v5 format |
| Celebration animation | ✅ | Thay CheckCircle trong cả QuizSummary + SessionSummary |
| Correct/Wrong feedback | ✅ | MultipleChoice + FillBlank đều có overlay animation |
| StreakFire Lottie | ✅ | Loop khi active, static Flame khi streak=0 |
| XPBurst component | ✅ | Clean, pointer-events-none, absolute positioning |
| PageTransition | ✅ | Fade+slide, wrap all routes via `withSuspense` |
| Button whileTap | ✅ | `scale: 0.97` — subtle, không gây lag |
| Card whileHover | ✅ | `y: -2` với 150ms transition — smooth |
| Lazy loading routes | ✅ | Tất cả pages lazy load + Suspense fallback |
| TypeScript | ✅ | `tsc --noEmit` pass, no errors |
| Unit tests | ✅ | 44/44 pass |
| Build | ✅ | Clean |

## Không có issue blocking

## Minor suggestions (không cần fix ngay, để backlog)

1. **Lottie lazy import:** Hiện tại `lottie-react` được import trực tiếp trong StreakFire, MultipleChoice, FillBlank. Vì StreakFire render trên mọi page (Dashboard), Lottie sẽ luôn load. Cân nhắc `React.lazy(() => import('lottie-react'))` cho các component ít dùng (XPBurst, correct/wrong) ở phase sau.

2. **AnimatePresence thiếu:** `PageTransition` có `exit` animation nhưng `App.tsx` không wrap `<Outlet>` trong `<AnimatePresence>`. Exit animation sẽ không chạy. Không critical vì enter animation vẫn hoạt động, nhưng nếu muốn smooth exit thì cần thêm `AnimatePresence` + key routing.

3. **xp-star.json chưa dùng:** File `xp-star.json` được import trong `XPBurst.tsx` nhưng `XPBurst` chưa được integrate vào MultipleChoice/FillBlank (chỉ có correct/wrong overlay). Để backlog — cần thêm XP tracking state per-question.

Tất cả 3 điểm trên là nice-to-have, không block merge.
