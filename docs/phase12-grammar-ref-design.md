# Phase 12: Grammar Reference & Quick Lookup — Technical Design

**Designer:** Marcus (Tech Lead)
**Date:** 2026-03-30
**Brief:** Phase 12 yêu cầu từ Trung (qua Alex)

---

## Tổng quan

Phase 12 bổ sung **Reference Tools** (tra cứu nhanh ngữ pháp) và **mở rộng B1/B2 lessons**. Tận dụng tối đa infrastructure có sẵn: grammar data JSON, Dexie, Zustand store, existing components (ConjugationGrid, TenseTimeline, ColoredSentence).

**4 mảng chính:**
1. Reference Tools — irregular verbs, tense comparison, tense overview
2. Quick Lookup — collocations, phrasal verbs, prepositions, articles
3. Special Cases — common mistakes, false friends, grammar patterns
4. B1/B2 Grammar Lessons — mở rộng từ 20 → 40+ lessons

**Nguyên tắc:** Static data files (JSON), no API dependency, reuse UI components, searchable/filterable, offline-first.

---

## PHẦN 1: Reference Tools

### 1.1 Irregular Verbs Table

**Data file:**
```ts
// src/data/reference/irregular-verbs.ts — MỚI

export interface IrregularVerb {
  base: string;          // V1: go
  past: string;          // V2: went
  pastParticiple: string; // V3: gone
  meaning: string;       // đi
  pattern: string;       // ABB | ABC | AAA | ABA
  audio?: string;        // pronunciation URL (optional)
  frequency: 1 | 2 | 3;  // 1=common, 2=medium, 3=rare
  examples: {
    base: string;        // "I go to school every day."
    past: string;        // "I went to school yesterday."
    pastParticiple: string; // "I have gone to school."
  };
}

// ~120 verbs, grouped by pattern:
// AAA: cut-cut-cut, put-put-put, shut-shut-shut
// ABB: buy-bought-bought, catch-caught-caught
// ABC: go-went-gone, see-saw-seen
// ABA: come-came-come, run-ran-run
```

**Component:**
```ts
// src/features/grammar/components/IrregularVerbsTable.tsx — MỚI

interface Props {
  filterPattern?: string;     // AAA | ABB | ABC | ABA | all
  filterFrequency?: number;   // 1 | 2 | 3
  searchQuery?: string;       // search V1/V2/V3/meaning
  sortBy?: 'alpha' | 'pattern' | 'frequency';
}

// UI:
// ┌──────────────────────────────────────┐
// │ 🔍 Tìm kiếm...          [Pattern ▼] │
// │ [Tần suất ▼]  [Sắp xếp ▼]          │
// ├──────────────────────────────────────┤
// │ V1       │ V2       │ V3      │ Nghĩa│
// │ go  🔊   │ went     │ gone    │ đi   │
// │ see 🔊   │ saw      │ seen    │ nhìn │
// │ ...      │ ...      │ ...     │ ...  │
// └──────────────────────────────────────┘
// Tap row → expand: examples + pattern badge + frequency indicator
```

**Features:**
- Search debounced 300ms, matches V1/V2/V3/meaning
- Filter by pattern (AAA/ABB/ABC/ABA) + frequency
- Sort: alphabetical (default), by pattern group, by frequency
- Tap row → expand với 3 example sentences
- 🔊 button → `playWordAudio(verb.base)` (reuse audioService)
- Pattern badge: color-coded (AAA=green, ABB=blue, ABC=purple, ABA=orange)

### 1.2 Tense Comparison — Side-by-Side

**Data file:**
```ts
// src/data/reference/tense-comparisons.ts — MỚI

export interface TenseComparison {
  id: string;                    // 'present-simple-vs-continuous'
  title: string;                 // 'Present Simple vs Continuous'
  tenseA: {
    name: string;                // 'Present Simple'
    structure: string;           // 'S + V(s/es)'
    usage: string[];             // ['Thói quen', 'Sự thật']
    signalWords: string[];       // ['always', 'every day', 'usually']
    examples: { en: string; vi: string }[];
  };
  tenseB: {
    name: string;
    structure: string;
    usage: string[];
    signalWords: string[];
    examples: { en: string; vi: string }[];
  };
  keyDifference: string;         // "Simple = thói quen, Continuous = đang xảy ra"
  commonMistakes: {
    wrong: string;
    correct: string;
    explanation: string;
  }[];
  quiz: {                        // Mini quiz 5 câu
    sentence: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
}

// Các cặp so sánh:
// 1. Present Simple vs Present Continuous
// 2. Past Simple vs Past Continuous
// 3. Past Simple vs Present Perfect
// 4. Present Perfect vs Present Perfect Continuous
// 5. Will vs Going to
// 6. Past Simple vs Past Perfect
// 7. Present Simple vs Present Perfect
```

**Component:**
```ts
// src/features/grammar/components/TenseCompare.tsx — MỚI

// UI: Split-screen layout
// ┌─────────────────┬─────────────────┐
// │ Present Simple   │ Present Cont.   │
// │                  │                 │
// │ S + V(s/es)      │ S + am/is/are   │
// │                  │   + V-ing       │
// │ ◉ Thói quen     │ ◉ Đang xảy ra  │
// │ ◉ Sự thật       │ ◉ Tạm thời     │
// │                  │                 │
// │ Signal words:    │ Signal words:   │
// │ always, every    │ now, right now  │
// │ day, usually     │ at the moment   │
// ├─────────────────┴─────────────────┤
// │ 💡 Khác biệt chính:               │
// │ Simple = thói quen lặp lại        │
// │ Continuous = đang xảy ra lúc nói  │
// ├───────────────────────────────────┤
// │ ⚠️ Lỗi thường gặp                 │
// │ ✗ I am go to school every day     │
// │ ✓ I go to school every day        │
// ├───────────────────────────────────┤
// │ [📝 Làm quiz]                      │
// └───────────────────────────────────┘
```

**Features:**
- Side-by-side trên desktop (md+), stacked trên mobile
- Color-coded: tenseA = indigo, tenseB = emerald
- Reuse `ColoredSentence` cho examples
- Mini quiz 5 câu inline (không cần route riêng)
- Swipe/tabs để chuyển giữa các cặp so sánh

### 1.3 Tense Overview — Timeline Visual

**Component:**
```ts
// src/features/grammar/components/TenseOverview.tsx — MỚI

// Reuse + enhance TenseTimeline component hiện có
// UI: Horizontal timeline
//
// PAST ──────────── NOW ──────────── FUTURE
//  │                 │                 │
//  Past Simple       Present Simple    Future Simple
//  Past Continuous   Present Cont.     Going to
//  Past Perfect      Present Perfect   Will
//                    Pres. Perf. Cont.
//
// Tap vào mỗi tense → popup: structure + usage + 2 examples
// Link → bài grammar tương ứng
```

**Data:** Tận dụng existing lesson data từ `src/data/grammar/`. Map `lessonId` → tense position trên timeline.

---

## PHẦN 2: Quick Lookup

### 2.1 Collocations Guide

**Data file:**
```ts
// src/data/reference/collocations.ts — MỚI

export interface CollocationGroup {
  id: string;                    // 'make-vs-do'
  title: string;                 // 'Make vs Do'
  description: string;           // 'Khi nào dùng MAKE, khi nào dùng DO?'
  entries: {
    word: string;                // 'make'
    collocations: {
      phrase: string;            // 'make a decision'
      meaning: string;           // 'đưa ra quyết định'
      example: string;           // 'I need to make a decision.'
    }[];
  }[];
  tip: string;                   // 'MAKE = tạo ra cái mới, DO = thực hiện hành động'
  quiz: { sentence: string; options: string[]; correct: number }[];
}

// Groups:
// 1. make vs do (15 collocations mỗi)
// 2. say vs tell (10 mỗi)
// 3. look vs see vs watch (8 mỗi)
// 4. speak vs talk (8 mỗi)
// 5. hear vs listen (6 mỗi)
// 6. bring vs take (6 mỗi)
// 7. borrow vs lend (4 mỗi)
// 8. rob vs steal (4 mỗi)
```

### 2.2 Phrasal Verbs

**Data file:**
```ts
// src/data/reference/phrasal-verbs.ts — MỚI

export interface PhrasalVerb {
  verb: string;               // 'get up'
  meaning: string;            // 'thức dậy'
  baseVerb: string;           // 'get'
  particle: string;           // 'up'
  separable: boolean;         // true = "turn the light off" OK
  examples: { en: string; vi: string }[];
  level: 'A1' | 'A2' | 'B1' | 'B2';
  frequency: 1 | 2 | 3;
}

// ~100 phrasal verbs, grouped by base verb:
// get: get up, get on, get off, get along, get over
// look: look for, look after, look up, look forward to
// turn: turn on, turn off, turn up, turn down
// take: take off, take up, take over, take after
// put: put on, put off, put up with, put away
// come: come in, come back, come across, come up with
// go: go on, go out, go through, go ahead
// give: give up, give in, give back, give away
// break: break down, break up, break in, break out
// make: make up, make out, make up for
```

**Component:**
```ts
// src/features/grammar/components/PhrasalVerbLookup.tsx — MỚI

// UI:
// ┌──────────────────────────────────────┐
// │ 🔍 Tìm phrasal verb...              │
// │ [Base verb ▼] [Level ▼] [Sep. ▼]   │
// ├──────────────────────────────────────┤
// │ get up 🔊                    A1  ✂️  │
// │ thức dậy                            │
// │ → "I get up at 7 every morning."    │
// │                                      │
// │ get on                       A2  🔗  │
// │ lên (xe), tiến bộ                   │
// │ → "She got on the bus."             │
// └──────────────────────────────────────┘
// ✂️ = separable, 🔗 = inseparable
```

### 2.3 Preposition Guide

**Data file:**
```ts
// src/data/reference/prepositions.ts — MỚI

export interface PrepositionRule {
  category: 'time' | 'place' | 'movement' | 'other';
  preposition: string;        // 'in'
  rules: {
    usage: string;            // 'Tháng, năm, mùa'
    examples: string[];       // ['in January', 'in 2024', 'in summer']
    tip?: string;             // 'IN = khoảng thời gian dài'
  }[];
  commonMistakes: {
    wrong: string;
    correct: string;
  }[];
}

// Categories:
// Time: in/on/at + for/since/during + by/until/before/after
// Place: in/on/at + above/below/between/among + next to/behind/in front of
// Movement: to/from/into/out of + through/across/along + up/down
```

**Component:**
```ts
// src/features/grammar/components/PrepositionGuide.tsx — MỚI

// UI: Tab-based (Time | Place | Movement)
// Mỗi tab: visual diagram + rules table + mistakes
// Reuse existing prepositions-place.json và prepositions-time.json cho cross-link
```

### 2.4 Articles Cheat Sheet

**Data file:**
```ts
// src/data/reference/articles.ts — MỚI

export interface ArticleRule {
  article: 'a' | 'an' | 'the' | 'zero';
  rules: {
    when: string;              // 'Lần đầu nhắc đến'
    examples: { en: string; vi: string }[];
    tip: string;
  }[];
  specialCases: string[];      // 'the sun, the moon (unique things)'
  commonMistakes: { wrong: string; correct: string; explanation: string }[];
}
```

---

## PHẦN 3: Special Cases

### 3.1 Common Mistakes (Người Việt)

**Data file:**
```ts
// src/data/reference/common-mistakes.ts — MỚI

export interface CommonMistake {
  id: string;
  category: 'tense' | 'preposition' | 'article' | 'word-order' | 'pronunciation' | 'vocabulary';
  title: string;              // 'Quên thêm -s/-es ngôi thứ 3'
  wrong: string;              // 'She go to school.'
  correct: string;            // 'She goes to school.'
  explanation: string;        // 'Tiếng Việt không chia động từ, nên hay quên...'
  tip: string;                // 'Nhớ: He/She/It + V-s/es'
  relatedLesson?: string;     // 'present-simple'
  level: 'A1' | 'A2' | 'B1' | 'B2';
}

// ~40 mistakes, ví dụ:
// - Quên -s/-es ngôi 3 (She go → She goes)
// - Dùng sai in/on/at (in Monday → on Monday)
// - Thiếu article (I am student → I am a student)
// - Word order sai (I very like → I really like)
// - Dùng "have" thay "there is/are" (Have many people → There are many people)
// - Nhầm since/for (since 3 years → for 3 years)
// - Dùng present simple cho đang xảy ra (I eat now → I am eating now)
```

### 3.2 False Friends

**Data file:**
```ts
// src/data/reference/false-friends.ts — MỚI

export interface FalseFriend {
  word: string;                // 'actually'
  commonMistake: string;       // 'Nghĩ là "thực ra" nhưng dùng sai ngữ cảnh'
  correctMeaning: string;      // 'thực sự, thực tế là'
  wrongUsage: string;          // Vietnamese learners often confuse with...
  examples: { en: string; vi: string }[];
  tip: string;
}

// ~30 false friends:
// actually ≠ hiện tại (actually = thực ra)
// eventually ≠ cuối cùng theo nghĩa VN
// sympathetic ≠ có cảm tình
// sensible ≠ nhạy cảm (sensible = hợp lý)
// library ≠ thư viện (nhầm với bookstore)
// etc.
```

### 3.3 Grammar Patterns

**Data file:**
```ts
// src/data/reference/grammar-patterns.ts — MỚI

export interface GrammarPattern {
  id: string;
  pattern: string;              // 'suggest + V-ing'
  meaning: string;              // 'gợi ý ai làm gì'
  structure: string;            // 'Subject + suggest + V-ing / that + S + (should) + V'
  examples: { en: string; vi: string }[];
  commonMistake: {
    wrong: string;              // 'I suggest to go...'
    correct: string;            // 'I suggest going...'
  };
  relatedPatterns?: string[];   // ['recommend + V-ing', 'advise + V-ing']
  level: 'A2' | 'B1' | 'B2';
}

// ~40 patterns:
// want + to V, need + to V, decide + to V
// enjoy + V-ing, avoid + V-ing, suggest + V-ing
// used to + V, be used to + V-ing, get used to + V-ing
// would rather + V, had better + V
// make/let + O + V (bare infinitive)
// too + adj + to V, adj + enough + to V
// so...that, such...that
// unless = if...not
// wish + Past Simple (hiện tại), wish + Past Perfect (quá khứ)
```

---

## PHẦN 4: B1/B2 Grammar Lessons

### Mở rộng Grammar Data

Thêm **20 bài mới** (hiện có 20 A1-A2 → tổng 40 bài):

**B1 (10 bài):**
```
b1-present-perfect-continuous.json  — Present Perfect Continuous
b1-past-perfect.json               — Past Perfect
b1-conditionals-1.json              — First Conditional
b1-conditionals-2.json              — Second Conditional
b1-passive-voice.json               — Passive Voice (Present/Past)
b1-reported-speech.json             — Reported Speech (basics)
b1-relative-clauses.json            — Relative Clauses (who/which/that)
b1-modal-perfect.json               — Modal + Have + PP (should have done)
b1-used-to.json                     — Used to / Be used to / Get used to
b1-gerund-infinitive.json           — Gerund vs Infinitive
```

**B2 (10 bài):**
```
b2-conditionals-3.json              — Third Conditional
b2-mixed-conditionals.json          — Mixed Conditionals
b2-passive-advanced.json            — Advanced Passive (have sth done, get sth done)
b2-reported-speech-advanced.json    — Advanced Reported Speech
b2-relative-clauses-advanced.json   — Non-defining Relative Clauses
b2-inversion.json                   — Inversion (Not only...but also, Hardly...when)
b2-subjunctive.json                 — Subjunctive (It's important that he BE...)
b2-cleft-sentences.json             — Cleft Sentences (It is...that, What I want is...)
b2-future-perfect.json              — Future Perfect & Future Perfect Continuous
b2-wish-if-only.json                — Wish / If only (all tenses)
```

**Cấu trúc mỗi bài:** Giữ nguyên schema hiện có (`theory.sections[]` + `exercises[]`), thêm:
- `prerequisites: string[]` — bài cần học trước (vd: `b1-past-perfect` cần `past-simple`)
- `relatedReference?: string[]` — link sang reference tools (vd: `'tense-comparison'`, `'common-mistakes'`)

**Cập nhật `_index.ts`:** Thêm 20 bài mới vào index, group theo level.

---

## Routing & Navigation

### Routes mới

```ts
// src/routes/index.tsx — THÊM

// Reference hub
'/grammar/reference'                  → ReferencePage (hub cho tất cả reference tools)
'/grammar/reference/irregular-verbs'  → IrregularVerbsPage
'/grammar/reference/tense-compare'    → TenseComparePage
'/grammar/reference/tense-overview'   → TenseOverviewPage
'/grammar/reference/collocations'     → CollocationsPage
'/grammar/reference/phrasal-verbs'    → PhrasalVerbsPage
'/grammar/reference/prepositions'     → PrepositionGuidePage
'/grammar/reference/articles'         → ArticlesPage
'/grammar/reference/common-mistakes'  → CommonMistakesPage
'/grammar/reference/false-friends'    → FalseFriendsPage
'/grammar/reference/grammar-patterns' → GrammarPatternsPage
```

### Navigation Update

```ts
// GrammarPage.tsx — UPDATE

// Thêm tab/section: Lessons | Reference | Bookmarks
// Tab "Lessons": filter by level (A1/A2/B1/B2)
// Tab "Reference": grid cards → reference tools
// Tab "Bookmarks": existing bookmarks page (inline)
```

---

## File Structure

### Data files mới (`src/data/reference/`)
```
src/data/reference/
├── irregular-verbs.ts         — ~120 verbs
├── tense-comparisons.ts       — 7 comparison pairs
├── collocations.ts            — 8 groups
├── phrasal-verbs.ts           — ~100 phrasal verbs
├── prepositions.ts            — 3 categories
├── articles.ts                — 4 article types
├── common-mistakes.ts         — ~40 mistakes
├── false-friends.ts           — ~30 items
├── grammar-patterns.ts        — ~40 patterns
└── index.ts                   — barrel export
```

### Grammar lessons mới (`src/data/grammar/`)
```
src/data/grammar/
├── ... (20 existing A1-A2)
├── b1-present-perfect-continuous.json
├── b1-past-perfect.json
├── b1-conditionals-1.json
├── b1-conditionals-2.json
├── b1-passive-voice.json
├── b1-reported-speech.json
├── b1-relative-clauses.json
├── b1-modal-perfect.json
├── b1-used-to.json
├── b1-gerund-infinitive.json
├── b2-conditionals-3.json
├── b2-mixed-conditionals.json
├── b2-passive-advanced.json
├── b2-reported-speech-advanced.json
├── b2-relative-clauses-advanced.json
├── b2-inversion.json
├── b2-subjunctive.json
├── b2-cleft-sentences.json
├── b2-future-perfect.json
└── b2-wish-if-only.json
```

### Components mới (`src/features/grammar/`)
```
src/features/grammar/
├── components/
│   ├── ... (existing)
│   ├── IrregularVerbsTable.tsx    — searchable verb table
│   ├── TenseCompare.tsx           — side-by-side comparison
│   ├── TenseOverview.tsx          — timeline visual (enhance existing)
│   ├── PhrasalVerbLookup.tsx      — searchable phrasal verbs
│   ├── CollocationGuide.tsx       — make vs do, etc.
│   ├── PrepositionGuide.tsx       — in/on/at rules
│   ├── ArticlesCheatSheet.tsx     — a/an/the/zero
│   ├── CommonMistakes.tsx         — Vietnamese-specific mistakes
│   ├── FalseFriends.tsx           — words that deceive
│   ├── GrammarPatterns.tsx        — verb patterns
│   └── ReferenceCard.tsx          — reusable card cho reference hub
├── pages/
│   ├── ... (existing)
│   ├── ReferencePage.tsx          — reference hub
│   ├── IrregularVerbsPage.tsx
│   ├── TenseComparePage.tsx
│   ├── TenseOverviewPage.tsx
│   ├── CollocationsPage.tsx
│   ├── PhrasalVerbsPage.tsx
│   ├── PrepositionGuidePage.tsx
│   ├── ArticlesPage.tsx
│   ├── CommonMistakesPage.tsx
│   ├── FalseFriendsPage.tsx
│   └── GrammarPatternsPage.tsx
└── hooks/
    └── useReferenceSearch.ts      — shared search/filter hook
```

---

## Shared Patterns

### Search/Filter Hook
```ts
// src/features/grammar/hooks/useReferenceSearch.ts — MỚI

export function useReferenceSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  options?: {
    debounceMs?: number;     // default 300
    filterFn?: (item: T, filters: Record<string, string>) => boolean;
    sortFn?: (a: T, b: T, sortBy: string) => number;
  }
): {
  query: string;
  setQuery: (q: string) => void;
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  results: T[];
  resultCount: number;
}
```

### Mini Quiz Component
```ts
// Reuse pattern từ existing QuizRenderer
// Inline quiz cho reference pages (không cần navigate)
// 5 câu, show score at end, no DB persistence (lightweight)
```

---

## Implementation Order

Chia thành **4 batches** để Sam code:

**P12-1: Data + Infrastructure** (foundation)
- Tất cả data files trong `src/data/reference/`
- `useReferenceSearch` hook
- `ReferenceCard` component
- `ReferencePage` (hub) + route registration
- Update `GrammarPage` tabs

**P12-2: Reference Tools** (irregular verbs + tense tools)
- `IrregularVerbsTable` + page
- `TenseCompare` + page
- `TenseOverview` (enhance existing TenseTimeline) + page

**P12-3: Quick Lookup + Special Cases**
- `PhrasalVerbLookup` + page
- `CollocationGuide` + page
- `PrepositionGuide` + page
- `ArticlesCheatSheet` + page
- `CommonMistakes` + page
- `FalseFriends` + page
- `GrammarPatterns` + page

**P12-4: B1/B2 Lessons**
- 10 B1 grammar lesson JSONs + register
- 10 B2 grammar lesson JSONs + register
- Update `_index.ts`, level filter trên GrammarPage
- Prerequisites system (recommended order)

---

## Dependencies

- **Không có dependency mới** — tất cả dùng libs có sẵn
- Framer Motion cho animations (đã có)
- audioService cho pronunciation (đã có)
- Existing UI components: Button, Card, Badge, Modal, Skeleton

## Edge Cases & Notes

1. **Offline-first:** Tất cả data là static files, không phụ thuộc API
2. **Search performance:** ~120 irregular verbs + ~100 phrasal verbs = nhẹ, không cần virtualization
3. **Mobile responsive:** TenseCompare side-by-side → stacked trên mobile (<md)
4. **Cross-linking:** Reference items link sang grammar lessons và ngược lại
5. **Lesson prerequisites:** Chỉ là "recommended", không block access (user vẫn mở được)
6. **Quiz trong reference:** Lightweight, không persist score vào DB (khác với grammar lesson quiz)
7. **Audio:** Reuse `audioService.playWordAudio()` cho irregular verbs và phrasal verbs
