# Review: UX Overhaul Phase B — Home Screen

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-04-01
**Commit:** 25d613a

---

## Status: NEEDS CHANGES (3 Medium — P1 defer to Phase C)

### ✅ Những phần tốt

- **Today's Session Card** — priority order đúng (review → continue → daily challenge), tappable links, gradient accent
- **Progress tracking** — daily goal progress bar, animation, learned/reviewed counts
- **Dark mode** — fully covered, mọi element có `dark:` variants
- **Responsive** — mobile-first container, pb-24 cho bottom nav
- **Edge cases** — new user (no data) handle tốt, fallback "Bắt đầu học"

### 🟠 P1 — Defer to Phase C (không block merge)

#### Smart Suggestions static, không data-driven
**File:** `DashboardPage.tsx:69-89`

Spec gọi là "Smart Suggestions" nhưng chỉ có 3 static branches. Không có: topic-based, weak-area analysis, time-of-day logic. **Acceptable cho Phase B** — Phase C Learning Path sẽ có data richer để build suggestions thông minh hơn.

### 🔴 Issues cần fix

#### 1. [MEDIUM] `incompleteTopic` không memo — O(topics × words) mỗi render
**File:** `DashboardPage.tsx:47-55`

Iterate ALL topics × ALL words on every render. Cần `useMemo`.

**Fix:**
```tsx
const incompleteTopic = useMemo(() => {
  // existing logic
}, [wordProgressMap]);
```

#### 2. [MEDIUM] Daily Challenge luôn hiển thị dù đã complete
**File:** `DashboardPage.tsx:45`

Spec nói "if not done today" nhưng không check completion status.

**Fix:** Check `isDailyChallengeComplete()` hoặc tương tự trước khi add vào sessionItems.

#### 3. [MEDIUM] Animation variants re-created mỗi render
**File:** `DashboardPage.tsx:91-97`

`stagger` và `fadeUp` objects tạo mới mỗi render. Move ra ngoài component.

### 🟡 Nice-to-have

- Review threshold `>= 3` bỏ qua user có 1-2 due words
- Missing "Thành tựu gần đây" section từ spec
- Status bar có thể overflow trên <320px screens

### Summary

Home screen redesign đẹp, UX flow tốt. 3 medium issues: memo perf, daily challenge check, animation constants. Fix xong merge được. Smart Suggestions improve dần theo phases sau.
