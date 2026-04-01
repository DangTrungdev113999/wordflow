# Review: UX Overhaul Phase A — Navigation Restructure

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-04-01
**Commit:** b3437ba

---

## Status: PASS ✅ (1 recommended fix)

### ✅ Những phần tốt

- **5-tab BottomNav** — Home/Learn/Review/AI/Me, smart parent-tab highlighting
- **Container pages** — LearnPage 7 cards, ReviewPage 3 cards + due banner, MePage profile + 4 cards, AIHub thêm Learn from Media
- **Routes** — 3 routes mới, tất cả 40+ routes cũ giữ nguyên 100%
- **Sidebar removed** — clean, `pb-20` consistent, fullscreen logic fix đúng
- **Layout** — card grids responsive, badge hiển thị đúng

### 🟡 Recommended fix (không block merge nhưng nên fix)

#### 1. [P2] `aria-current` không set đúng cho parent tab
**File:** `BottomNav.tsx:51-58`

Khi user ở `/vocabulary`, tab Learn highlight visually nhưng `aria-current="page"` không được set → screen readers không biết tab nào active. 

**Fix:** Set `aria-current` manually dựa trên custom `isActive()` logic.

### 🟡 Nice-to-have

#### 2. [LOW] Xóa dead code `Sidebar.tsx`
File không còn import nào nhưng vẫn tồn tại trên disk.

#### 3. [LOW] Hardcoded path arrays brittle
`BottomNav.tsx:22-40` — thêm sub-page mới phải update array. Cân nhắc prefix-based matching.

#### 4. [LOW] Pronunciation ở Learn vs proposal nói AI
`LearnPage.tsx:67` — deviation từ proposal, nên document lý do.

### Summary

Phase A implement clean, đúng spec. Navigation restructure hoạt động tốt. Merge được — fix a11y trong Phase B. Good job Sam! 🎉
