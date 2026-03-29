# Review: Phase 11-3 — Visual Infographics + Polish

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Branch:** feature/phase11-3-visual-polish
**Commit:** 88f0aae

---

## Status: NEEDS CHANGES (2 Medium)

### ✅ Những phần tốt

- **TenseTimeline** — SVG rendering clean, markers (point/range/repeated), framer-motion animation ✅
- **ComparisonTable** — 2 tenses side-by-side, mobile stack ✅
- **FormulaCard** — animated step-by-step, framer-motion stagger ✅
- **GrammarDashboard** — recharts integration, completion %, weak areas ✅
- **12 lessons enriched** — 20/20 có cheatSheet + coloredExamples, 6 tense lessons có conjugation ✅
- **Test screenshots** — đã xóa hết ✅

### 🔴 Issues cần fix

#### 1. [MEDIUM] GrammarVisual unsafe double-cast
**File:** `GrammarVisual.tsx:13,16,19`

`data as unknown as TenseTimelineProps` — không có runtime validation. JSON shape sai → crash im lặng.

**Fix:** Thêm type guard hoặc validate required fields trước khi cast:
```tsx
if (type === 'timeline' && 'tense' in data && 'markers' in data) {
  return <TenseTimeline {...(data as TenseTimelineProps)} />;
}
return null; // fallback nếu data không khớp
```

#### 2. [MEDIUM] SentenceExplorer missing import
**File:** `SentenceExplorer.tsx:4,86`

`SentenceRole` dùng ở line 86 nhưng không import. Works by accident qua structural typing. Thêm import.

### 🟡 Nice-to-have

#### 3. [LOW] DashboardChart loaded trên mobile nhưng hidden
`DashboardChart.tsx:1` — recharts bundle load nhưng `hidden sm:block`. Nên dynamic import khi sm+ only.

#### 4. [LOW] Hardcoded CEFR levels
`GrammarDashboard.tsx:47` — `['A1', 'A2']` hardcoded. Derive từ lesson data.

### Summary

Visual components chất lượng, dashboard hữu ích, 12 lessons enriched đầy đủ. 2 issues cần fix: GrammarVisual type safety + missing import. Fix xong là Phase 11 complete! 🎉
