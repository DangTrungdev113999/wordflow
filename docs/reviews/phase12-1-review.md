# Review: Phase 12-1 — Reference Data + Infrastructure

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-30
**Branch:** feature/phase12-1-reference-data
**Commits:** 1768a53, 4733202

---

## Status: NEEDS CHANGES (3 Medium)

### ✅ Những phần tốt

- **Data quality overall** — irregular verbs 130/120, all verb forms correct; tense comparisons 7/7 đúng; collocations 130 items/8 groups; common mistakes 40 items Vietnamese-specific excellent; grammar patterns 40/40 structures correct
- **useReferenceSearch hook** — generic, debounced, reusable design
- **ReferencePage hub** — clean grid layout, search functional
- **GrammarPage tabs** — Lessons/Reference switching works

### 🔴 Issues cần fix

#### 1. [MEDIUM] Sub-routes thiếu — reference links 404
**File:** `routes/index.tsx:74-76`

Không có routes cho `/grammar/reference/*`. Card links như `/grammar/reference/irregular-verbs` sẽ fall through vào `grammar/:lessonId` → wrong param, broken.

**Fix:** Thêm placeholder routes cho P12-2/P12-3 hoặc dùng catch-all redirect:
```ts
// Tạm thời redirect về ReferencePage cho chưa-implement pages
'/grammar/reference/:tool' → ReferencePage (with coming-soon toast)
```

#### 2. [MEDIUM] `false-friends.ts` thiếu `id` và `level` fields
**File:** `false-friends.ts:1-8`

Không có `id` (cần cho React keys) và `level` (cần cho filter). Tất cả data files khác đều có.

**Fix:** Thêm `id: string` và `level: 'A1' | 'A2' | 'B1' | 'B2'` cho mỗi item.

#### 3. [MEDIUM] `REFERENCE_CARDS` duplicate + `useReferenceSearch` dead code
**Files:** `ReferencePage.tsx:34-146` + `GrammarPage.tsx:27-118` + `useReferenceSearch.ts`

- `REFERENCE_CARDS` array copy nguyên từ ReferencePage sang GrammarPage
- `useReferenceSearch` hook tạo ra nhưng không dùng — ReferencePage reimplements search inline (không debounce)

**Fix:**
- Extract `REFERENCE_CARDS` vào shared file (vd: `src/data/reference/cards.ts`)
- ReferencePage dùng `useReferenceSearch` thay vì inline filter

### 🟡 Nice-to-have (không block merge)

#### 4. [LOW] Phrasal verbs separable errors
- `give off` (line 865) → inseparable (fix `separable: false`)
- `break up` (line 893) → separable (fix `separable: true`)

#### 5. [LOW] False friends không Vietnamese-specific
3-5 items (`gift`, `gymnasium`, `preservative`) là false friends German/French, không phải lỗi người Việt hay mắc. Thay bằng items relevant hơn.

#### 6. [LOW] Missing accessibility
- `ReferenceCard.tsx:27` — thiếu `aria-label` trên Link
- `GrammarPage.tsx:162-168` — tab buttons thiếu WAI-ARIA (`role="tab"`, `aria-selected`)
- `ReferenceCard.tsx:22` — `accentColor` prop declared nhưng không dùng

### Summary

Data quality tốt, ~95% accurate. Infrastructure cơ bản OK. 3 issues cần fix: routing cho sub-pages, false-friends interface, và eliminate duplicate/dead code. Fix xong là merge được.
