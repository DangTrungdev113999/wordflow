# Review: Phase 9 — UI/UX Overhaul

## Status: NEEDS CHANGES (2 blocking issues)

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Scope:** 5 batches, 63 files, ~2,578 dòng thay đổi

---

## 🔴 BLOCKING — Phải sửa trước khi merge

### 1. `eventBus.ts:13` — Empty object type `{}`
```typescript
'daily_goal:met': {};  // ← TypeScript strict mode sẽ reject
```
**Fix:** Đổi thành `'daily_goal:met': Record<string, never>;`

### 2. `Button.tsx:16-19` — `focus-visible:ring-primary` / `ring-danger` không resolve
Tailwind v4 với `@theme` block expose `--color-primary` dưới dạng CSS variable, nhưng **KHÔNG tự generate utility class `ring-primary`**. Focus ring trên buttons hiện tại bị silent fail — user sẽ không thấy focus indicator.

**Fix:** Dùng arbitrary value:
```
focus-visible:ring-[var(--color-primary)]
focus-visible:ring-[var(--color-danger)]
```
Hoặc thêm explicit ring color mapping trong `@theme` block.

---

## 🟡 MEDIUM — Nên sửa

### 3. Còn 2 `grid-cols-3` chưa responsive
| File | Line |
|------|------|
| `SettingsPage.tsx` | 58 |
| `AchievementsPage.tsx` | 97 |

**Fix:** `grid-cols-1 sm:grid-cols-3` (cùng pattern với các file khác)

### 4. `whileTap` scale không nhất quán
- SettingsPage: 0.95, 0.93
- DictationInput: 0.9
- WritingHistory: 0.98
- RoleplaySummary: 0.97

**Recommend:** Chuẩn hóa 0.97 cho buttons, 0.95 cho smaller elements.

---

## 🟢 LOW — Nice to have

- `useChartTheme.ts:13` — Thêm explicit return type
- `ToastContainer.tsx:42` — Animation timing desync (0.6s → 0.5s)
- `staggerChildren` inconsistent across files — chuẩn hóa 0.08

---

## ✅ ĐÁNH GIÁ TỪNG BATCH

| Batch | Status | Ghi chú |
|-------|--------|---------|
| 1 — Critical fixes | ✅ Pass | AnimatePresence, responsive grids, ConfirmDialog — tất cả đúng |
| 2 — Animation gaps | ✅ Pass | 9 screens có framer-motion, variants extracted, patterns consistent |
| 3 — UX improvements | ✅ Pass | Onboarding dots, search, 3D flip, skeletons — clean implementation |
| 4 — Design system | ⚠️ 95% | Color tokens + WCAG tốt, nhưng ring-primary broken (blocking #2) |
| 5 — Polish | ⚠️ 95% | Font, confetti, responsive textarea tốt, nhưng eventBus type (blocking #1) |

## 👍 Điểm tốt

- AnimatePresence setup trong App.tsx textbook correct
- ConfirmDialog production-quality: full ARIA, focus trap, Escape key
- `prefers-reduced-motion` dùng universal `*` selector — bắt cả CSS và framer-motion
- `useChartTheme` dùng `useSyncExternalStore` + `MutationObserver` — đúng React 18 pattern
- 3D flip card clean với proper `backfaceVisibility` và `preserve-3d`
- Event cleanup trong `useCelebration.ts` properly unsubscribe on unmount
- Zero unused imports, zero dead code
- Zero `text-[10px]`/`text-[11px]` remaining

## Tổng kết

Code quality tốt, implement đúng design. Chỉ cần fix 2 blocking issues + 2 responsive grids rồi merge được.
