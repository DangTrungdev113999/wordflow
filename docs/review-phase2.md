# Review: Phase 2 — Grammar & Quiz

## Status: NEEDS CHANGES

## Issues

### 🔴 CRITICAL
1. **`src/stores/grammarStore.ts`** — `updateLessonProgress()` chỉ update Zustand in-memory, KHÔNG persist xuống `db.grammarLessons`. Store init với `lessonProgress: {}` trống, không load từ DB. Kết quả: bestScore, attempts, completed mất sau refresh.
   - Fix: thêm `db.grammarLessons.put(...)` trong `updateLessonProgress()` + thêm `loadProgressFromDB()` khi init store

### 🟠 BUG
2. **`src/features/grammar/pages/QuizPage.tsx:50-56`** — Side effects (addXP, updateLessonProgress, setState) gọi trực tiếp trong render body. React anti-pattern → re-render loop risk, double-execution trong Strict Mode.
   - Fix: chuyển vào `useEffect(() => { ... }, [quiz.isComplete])`

### 🟡 FEATURE GAP
3. **`src/features/grammar/components/SentenceOrder.tsx`** — Chỉ có tap to select/deselect, không thể reorder words sau khi đặt vào answer area. Spec yêu cầu "drag/tap to reorder".
   - Fix tối thiểu: cho tap word trong selected area để remove + re-add, hoặc thêm `@dnd-kit/core` cho drag

### ⚪ MINOR
4. **`src/features/grammar/pages/LessonPage.tsx:52,66`** — Bold-text parsing (`split(/(\*\*.*?\*\*)/)`) viết 2 lần. Extract thành `renderBold(text)` helper.

## ✅ PASS
- Grammar JSON: đúng format spec, 6 lessons đủ 4 loại quiz ✓
- QuizRenderer: dispatch đúng component theo type ✓
- FillBlank: case-insensitive + multiple answers (`.some()`) ✓
- ErrorCorrection: highlight + fix logic đúng ✓
- xpEngine.ts: XP values khớp 100% spec section 5.2 ✓
- Routes: đúng spec section 7 ✓
- TypeScript: clean, discriminated union `GrammarExercise` đúng ✓
- Code quality: tổng thể sạch, structure đúng architecture ✓

## Summary
Feature implementation đúng spec. 1 critical (DB not persisted), 1 bug (render side effects), 1 feature gap (SentenceOrder reorder). Fix #1 và #2 bắt buộc, #3 nên fix luôn.
