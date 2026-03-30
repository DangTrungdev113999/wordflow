# Re-Review: Phase 12-1 — Reference Data + Infrastructure (Final)

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-30
**Commit:** c561070

---

## Status: PASS ✅ (1 minor note)

### Fixes verified

1. **Sub-routes** ✅ — `/grammar/reference/:tool` catch-all, Construction toast banner tiếng Việt
2. **false-friends.ts** ✅ — `id` + `level` trên tất cả 30 items, 3 non-VN items thay bằng VN-relevant
3. **Shared REFERENCE_CARDS** ✅ — extract `cards.ts`, cả 2 pages import chung, `useReferenceSearch` hook dùng đúng
4. **Bonus** ✅ — phrasal verbs separable fix, ARIA attributes đầy đủ

### Note
Dynamic Tailwind class `group-hover:border-${accentColor}-200` cần safelist hoặc classes xuất hiện ở nơi khác. Nếu không purge sẽ miss. Check khi build production.

### Summary
P12-1 Reference Data + Infrastructure ready to merge. Data quality tốt, architecture clean. 🎉
