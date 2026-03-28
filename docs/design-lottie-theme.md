# Design: Lottie Animations + Dark/Light Theme Fix

**Author:** Marcus (Tech Lead)  
**Date:** 2026-03-28  
**Status:** Pending Alex confirm

---

## 1. Bug Fix: Dark/Light Mode Không Hoạt Động

### Root Cause
App dùng **Tailwind CSS v4** (`@import "tailwindcss"` trong `index.css`). Tailwind v4 mặc định dark mode = `prefers-color-scheme` (theo system). Hook `useTheme` toggle class `dark` trên `<html>` nhưng **thiếu khai báo custom variant** để Tailwind v4 nhận class-based dark mode.

### Fix
Thêm 1 dòng vào `src/index.css`, **ngay sau** `@import "tailwindcss"`:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

Chỉ cần 1 dòng này. Không sửa gì khác. Logic trong `useTheme.ts`, `ThemeToggle.tsx`, `settingsStore.ts` đều đúng rồi.

### Test
- Click ThemeToggle → cycle light → dark → system
- Verify `dark:bg-*` classes apply đúng ở mỗi mode
- Verify system mode follow OS preference

---

## 2. Lottie Animations — Kế Hoạch Tổng Thể

### Package
```bash
pnpm add lottie-react
```
(`lottie-react` — lightweight React wrapper cho lottie-web, ~50KB gzipped)

### Nguồn Animation Files
Dùng free animations từ [LottieFiles](https://lottiefiles.com). Download JSON files vào `src/assets/lottie/`. Gợi ý search terms trên LottieFiles cho từng animation:

### 2.1 Celebration — Quiz Complete & Session Complete

**File:** `src/assets/lottie/celebration.json`  
**Search:** "confetti", "celebration", "success confetti"

**Áp dụng vào:**
- `QuizSummary.tsx` — thay icon CheckCircle tĩnh bằng Lottie confetti
- `SessionSummary.tsx` — tương tự

```tsx
// Thay thế block icon CheckCircle hiện tại:
// <div className="w-20 h-20 bg-green-100..."><CheckCircle .../></div>
// Bằng:
import Lottie from 'lottie-react';
import celebrationAnim from '@/assets/lottie/celebration.json';

<Lottie 
  animationData={celebrationAnim} 
  loop={false} 
  className="w-32 h-32" 
/>
```

### 2.2 XP Gain — Sau Mỗi Câu Trả Lời Đúng

**File:** `src/assets/lottie/xp-star.json`  
**Search:** "star burst", "sparkle", "coin collect"

**Áp dụng vào:**
- `MultipleChoice.tsx` — khi submit đúng, hiện animation nhỏ trên nút
- `FillBlank.tsx` — tương tự
- Tạo component wrapper:

```tsx
// src/components/common/XPBurst.tsx
import Lottie from 'lottie-react';
import xpStarAnim from '@/assets/lottie/xp-star.json';

interface XPBurstProps {
  show: boolean;
}
export function XPBurst({ show }: XPBurstProps) {
  if (!show) return null;
  return (
    <div className="absolute -top-4 right-2 pointer-events-none">
      <Lottie 
        animationData={xpStarAnim} 
        loop={false} 
        className="w-16 h-16" 
      />
    </div>
  );
}
```

### 2.3 Streak Fire — Thay StreakFire Icon Tĩnh

**File:** `src/assets/lottie/fire.json`  
**Search:** "fire", "flame loop", "streak fire"

**Áp dụng vào:**
- `StreakFire.tsx` — khi `streak > 0`, thay `<Flame>` icon bằng Lottie fire animation (loop)
- Giữ nguyên static icon khi `streak === 0`

```tsx
// Trong StreakFire.tsx, thay Flame icon khi active:
{isActive ? (
  <Lottie 
    animationData={fireAnim} 
    loop={true} 
    className={cn({ sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-8 h-8' }[size])} 
  />
) : (
  <Flame className="text-gray-300 dark:text-gray-700" ... />
)}
```

### 2.4 Achievement Unlock — Badge Earned

**File:** `src/assets/lottie/badge-unlock.json`  
**Search:** "badge unlock", "trophy", "medal"

**Áp dụng vào:**
- `BadgeCard.tsx` — khi badge mới unlock (cần thêm prop `isNew: boolean`)
- Nếu `earned && isNew` → play animation 1 lần
- Nếu `earned && !isNew` → chỉ hiện static badge

### 2.5 Loading States

**File:** `src/assets/lottie/loading-books.json`  
**Search:** "loading books", "education loading", "book animation"

**Áp dụng vào:**
- `Skeleton.tsx` hoặc tạo `LoadingScreen.tsx` mới
- Dùng cho page transitions khi lazy load routes
- Thay thế spinner/skeleton ở các trang data-heavy (Dashboard, Achievements)

### 2.6 Empty States

**File:** `src/assets/lottie/empty-search.json`  
**Search:** "empty state", "no results", "search empty"

**Áp dụng vào:**
- Khi topic list trống
- Khi không có weak words
- Khi achievements chưa unlock nào

### 2.7 Correct/Wrong Answer Feedback

**Files:**
- `src/assets/lottie/correct-check.json` — search: "check mark success", "correct green"
- `src/assets/lottie/wrong-shake.json` — search: "wrong answer", "error shake", "red x"

**Áp dụng vào:**
- `MultipleChoice.tsx` — after submit, overlay animation lên option đúng/sai
- `FillBlank.tsx` — tương tự
- `ErrorCorrection.tsx`, `SentenceOrder.tsx`

---

## 3. Page Transitions (Framer Motion — Đã Có Sẵn)

App đã có `framer-motion`. Thêm page transition wrapper:

```tsx
// src/components/common/PageTransition.tsx
import { motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

Wrap mỗi page component trong `PageTransition`. Thêm `<AnimatePresence>` vào `App.tsx` quanh `<Outlet />`.

---

## 4. Micro-interactions (Framer Motion)

Nâng cấp các component hiện có:

- **Button press:** Thêm `whileTap={{ scale: 0.97 }}` vào `Button.tsx`
- **Card hover:** Thêm `whileHover={{ y: -2 }}` vào `Card.tsx`
- **Rating buttons (Flashcard):** `whileTap={{ scale: 0.9 }}` + color pulse
- **Progress bar:** Animate width change với `transition={{ type: 'spring' }}`
- **Toast notifications:** Slide-in từ top với spring animation (đã có ToastContainer, thêm motion)

---

## 5. Cấu Trúc Files

```
src/assets/lottie/
├── celebration.json
├── xp-star.json
├── fire.json
├── badge-unlock.json
├── loading-books.json
├── empty-search.json
├── correct-check.json
└── wrong-shake.json

src/components/common/
├── XPBurst.tsx          (NEW)
├── PageTransition.tsx   (NEW)
├── LottieLoader.tsx     (NEW — lazy load wrapper)
├── StreakFire.tsx        (MODIFY)
└── FlipCard.tsx          (no change)
```

---

## 6. Thứ Tự Implement

| Priority | Task | Effort |
|----------|------|--------|
| P0 | Fix dark mode (1 dòng CSS) | 5 min |
| P1 | `lottie-react` + celebration animation (Quiz/Session Summary) | 1h |
| P2 | Streak fire animation | 30min |
| P3 | XP burst + correct/wrong feedback | 1h |
| P4 | Page transitions (AnimatePresence) | 45min |
| P5 | Micro-interactions (Button, Card, ProgressBar) | 30min |
| P6 | Achievement unlock animation | 30min |
| P7 | Loading & empty states | 30min |

**Tổng estimate:** ~5h

---

## 7. Lưu Ý Quan Trọng Cho Sam

1. **Lottie JSON files phải tải từ LottieFiles.com** — search theo keywords đã ghi. Chọn file < 50KB mỗi cái
2. **Lazy load Lottie:** Dùng `React.lazy` hoặc dynamic import cho `lottie-react` vì nó ~50KB. Không load trên mọi page
3. **Dark mode Lottie:** Một số animation có màu cố định — chọn animation neutral hoặc dùng filter CSS để adapt
4. **Test:** Sau mỗi animation, chạy lại E2E tests (37 tests) để đảm bảo không break
5. **Performance:** Lottie canvas render — set `renderer="svg"` (default) cho chất lượng, tránh `renderer="canvas"` trên mobile
