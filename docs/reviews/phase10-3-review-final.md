# Re-Review: Phase 10-3 — Mixed Review (Final)

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Commit:** 29f4306

---

## Status: PASS ✅

### Fixes verified

1. **XP persist** ✅ — dùng `XP_VALUES` từ constants, accumulate per-card qua `statsRef`, display đúng
2. **word:learned dedup** ✅ — `learnedInSession` Set trong cả FlashcardReview và QuizReview
3. **Context fallback** ✅ — toast tiếng Việt thông báo tạm dùng Flashcard
4. **ConfirmDialog** ✅ — thay `window.confirm()`, variant warning, Vietnamese labels
5. **Shared shuffle** ✅ — extract vào `src/lib/utils.ts`, cả 2 files import chung

### Note
Dead branch `rating === 2` trong `getFlashcardXP` — không ảnh hưởng, có thể clean up sau.

### Summary
P10-3 Mixed Review ready to merge. Tất cả issues đã fix sạch. 🎉
