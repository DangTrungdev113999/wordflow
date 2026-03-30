# Review: Phase 12-2 — Irregular Verbs + Tense Tools

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-30
**Branch:** feature/phase12-2-verb-tense-tools
**Commit:** 09d36fa

---

## Status: NEEDS CHANGES (1 Critical + 1 Medium)

### ✅ Những phần tốt

- **IrregularVerbsTable** — search debounced, filter/sort 3 modes, expand row + audio + pattern badges, frequency dots
- **TenseCompare** — side-by-side desktop / stacked mobile, 7 pairs, signal words, common mistakes, mini quiz inline (5q, no DB persist), indigo/emerald color-coding
- **TenseOverview** — SVG timeline đúng, tense positioning correct (3 past + 4 present + 2 future), popup detail + grammar links, responsive
- **Routes** — 3 routes đúng order (trước :tool wildcard)
- **Page wrappers** — clean, consistent

### 🔴 Issues cần fix

#### 1. [CRITICAL] Pattern key `ABD` → `ABA`
**File:** `IrregularVerbsTable.tsx:32`

`PATTERN_STYLES` có key `ABD` nhưng data dùng `ABA`. Filter ABA pattern không match, badge undefined cho ABA verbs (come-came-come, run-ran-run).

**Fix:** Đổi key `'ABD'` → `'ABA'` trong PATTERN_STYLES.

#### 2. [MEDIUM] Accessibility gaps
**Files:** nhiều chỗ

- `IrregularVerbsTable.tsx:89` — search input thiếu `aria-label`
- `TenseCompare.tsx:26,46,67` — nav buttons + pagination dots thiếu `aria-label`
- `TenseOverview.tsx:210,244` — tense toggle buttons thiếu `aria-expanded`
- `TenseOverview.tsx:285` — close button thiếu `aria-label`

**Fix:** Thêm ARIA attributes cho tất cả interactive elements.

### 🟡 Nice-to-have (không block merge)

#### 3. [LOW] ColoredSentence không reuse
`TenseCompare.tsx:197` — examples render plain text, spec yêu cầu dùng `ColoredSentence`. Có thể để P12-3 hoặc polish phase.

#### 4. [LOW] Swipe gesture thiếu
`TenseCompare.tsx` — có tabs + buttons nhưng không có touch swipe. Mobile UX improvement.

#### 5. [LOW] searchFields array literal
`IrregularVerbsTable.tsx:61` — tạo array mới mỗi render, extract ra constant.

### Summary

Architecture tốt, UI polished, data integration đúng. Fix critical ABA key bug + accessibility gaps là merge được.
