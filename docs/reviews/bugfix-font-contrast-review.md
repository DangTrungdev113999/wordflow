# Review: Bugfix — Font Size & Color Contrast

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-04-01
**Commit:** db3f707
**Files:** 192 files changed

---

## Status: NEEDS CHANGES (1 Medium)

### ✅ Những phần tốt

- **Font Scale architecture** — CSS variable `--font-scale` trên html, `initFontScale()` tránh FOUC, zustand persist đúng
- **Color contrast bulk changes** — pattern `text-gray-500→700`, `text-gray-400→600` consistent across 192 files
- **Dark mode** — tất cả có `dark:` variants, borders + backgrounds giữ nguyên ✅
- **SettingsPage UI** — 3 options visual differentiation qua font size class

### 🔴 Issues cần fix

#### 1. [MEDIUM] Dark mode placeholder gần như invisible
**Files:** ~11 search input files

Placeholder bị đổi thành `dark:placeholder:text-gray-700` (#374151) trên `dark:bg-gray-800` (#1f2937) → contrast cực thấp, gần như không thấy.

**Fix:** Đổi dark placeholder thành `dark:placeholder:text-gray-500` — đủ nhạt để phân biệt với text nhập, nhưng vẫn đọc được.

### 🟡 Nice-to-have (không block merge)

#### 2. [LOW] Disabled button icon quá đậm
**File:** `ChatInput.tsx`

Disabled state từ `text-gray-400` → `text-gray-600` — trông không còn "disabled". Nên giữ `text-gray-400` cho disabled states.

#### 3. [LOW] ChevronRight arrows quá nổi
**Files:** DashboardPage + others

Decorative arrows từ `text-gray-300` → `text-gray-600` — bây giờ compete với content text. Nên dùng `text-gray-400/500`.

### Summary

Font scale implementation solid. Bulk color changes đúng hướng. Chỉ cần fix dark placeholder contrast (~11 files) là merge được. Disabled states và decorative icons nên giữ nhạt hơn nhưng không critical.
