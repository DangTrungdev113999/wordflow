# Review: Phase 13-2 — Phrasal Verbs + Collocations

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-30
**Branch:** feature/phase13-2-phrasal-collocations
**Commit:** c34012e

---

## Status: NEEDS CHANGES (1 Medium)

### ✅ Những phần tốt

- **Data quality** — 148 phrasal verbs + 91 collocations, Vietnamese translations tự nhiên, examples tốt
- **Components** — PhrasalVerbItem expandable, CollocationItem ✅/❌ display đúng design
- **Pages** — search + filter chips hoạt động, level badges
- **useUsageSearch** — simple string search phù hợp
- **Hub page** — 4/5 cards enabled, đúng trạng thái
- **Routes** — đúng ordering, lazy loaded

### ⚠️ Lưu ý: Commit chứa file ngoài scope
Commit c34012e có thay đổi listening/ files (HintBar, audioService, etc.) không thuộc P13-2. Cần clean trước khi merge — chỉ giữ P13-2 files.

### 🔴 Issues cần fix

#### 1. [MEDIUM] Counts recalculated mỗi render (cả 2 pages)
**Files:** `PhrasalVerbsPage.tsx:27-30`, `CollocationsPage.tsx:24-28`

`counts` object filter toàn bộ array cho mỗi category trên MỖI render (kể cả khi chỉ search text thay đổi). O(n*k) không cần thiết vì data là static.

**Fix:** Wrap trong `useMemo(() => ..., [])` hoặc precompute module-level constant:
```ts
const COUNTS = Object.fromEntries(
  CATEGORIES.map(c => [c.value, DATA.filter(d => d.category === c.value).length])
);
```

### 🟡 Nice-to-have (không block merge)

#### 2. [LOW] LEVEL_COLOR / CAT_COLOR thiếu fallback
Nếu thêm level/category mới → badge invisible. Thêm default color.

#### 3. [LOW] Data contradictions nhỏ
- "have a break" listed as incorrect nhưng note nói valid in BrE
- "free speech" listed as incorrect nhưng note nói cũng đúng

#### 4. [LOW] PhrasalVerb model thiếu `separable` field
Design có `separable: boolean` nhưng model không implement. Acceptable nếu track cho follow-up.

### Summary

Data quality cao, UI đúng design. Fix performance counts + clean listening files ngoài scope. Sau đó merge được.
