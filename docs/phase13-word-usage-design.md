# Phase 13: Word Usage & Context Guide — Technical Design

**Designer:** Marcus (Tech Lead)
**Date:** 2026-03-30
**Brief:** Alex's Phase 13 requirements

---

## Tổng quan

Phase 13 xây dựng hệ thống giúp user hiểu SÂU 1 từ: nhiều nghĩa, cách dùng, phrasal verbs, collocations, grammar patterns. Chia thành **5 features**, implement qua **3 batches**.

**Nguyên tắc:**
- Reuse infrastructure có sẵn (Gemini enrichment, Dictionary API, Dexie, enrichedWords)
- Data approach: Gemini generate + Dictionary API verify + static data cho patterns
- Progressive enhancement: offline-first với static data, AI enrich khi có key
- Backward compatible: không break WordDetail hiện tại, chỉ mở rộng

---

## Batch Plan

| Batch | Features | Scope |
|-------|----------|-------|
| P13-1 | Multi-meaning Words + Confusing Pairs | Core polysemy system + static pair data |
| P13-2 | Phrasal Verbs + Collocations | Grouped reference + search |
| P13-3 | Context Grammar + Integration | Grammar patterns + quiz integration |

---

## FEATURE 1: Multi-meaning Words

### Data Model

```ts
// src/features/word-usage/models.ts — MỚI

interface WordSense {
  id: string;                    // "run-v-1", "run-n-1"
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction';
  meaning: string;               // Vietnamese meaning
  meaningEn: string;             // English definition
  examples: SenseExample[];      // 2-3 examples per sense
  register?: 'formal' | 'informal' | 'slang' | 'technical';
  frequency: 1 | 2 | 3;         // 1=common, 2=less common, 3=rare
  collocations?: string[];       // common pairings for this sense
}

interface SenseExample {
  sentence: string;              // English
  translation: string;           // Vietnamese
  highlight: string;             // the word in context (bold target)
}

interface MultiMeaningWord {
  word: string;
  ipa: string;
  totalSenses: number;
  senses: WordSense[];           // ordered by frequency (common first)
  tips?: string;                 // Vietnamese mẹo phân biệt
}
```

### Data Sources — 3 tầng

```
Tầng 1: Dictionary API (dictionaryapi.dev)
  → Đã có! Trả meanings[] grouped by partOfSpeech
  → Mỗi meaning có definitions[], examples
  → Dùng làm BASE data — miễn phí, nhanh, đáng tin

Tầng 2: Gemini AI enrichment
  → Bổ sung Vietnamese meaning, register, frequency ranking
  → Generate thêm examples có context rõ ràng
  → Tạo "tips" phân biệt các nghĩa

Tầng 3: Static seed data (top 100 words)
  → Curated data cho 100 từ đa nghĩa phổ biến nhất
  → Fallback khi không có API key
  → File: src/data/multiMeaningSeeds.ts
```

### Service

```ts
// src/services/multiMeaningService.ts — MỚI

// Cache: Dexie table `multiMeaningWords`
// TTL: 30 days (same as enrichment)

export async function getMultiMeaning(word: string): Promise<MultiMeaningWord | null> {
  // 1. Check Dexie cache
  // 2. Cache hit → return
  // 3. Check static seeds → return if found
  // 4. Fetch Dictionary API → parse meanings
  // 5. If Gemini available → enrich with Vietnamese + frequency + tips
  // 6. Cache result → return
}

// Gemini prompt cho multi-meaning enrichment
const MULTI_MEANING_PROMPT = `
Word: "${word}"
Dictionary data: ${JSON.stringify(dictData)}

Enrich each meaning with:
1. Vietnamese translation (accurate, natural)
2. Frequency ranking (1=very common, 2=common, 3=rare)
3. Register (formal/informal/slang/technical) if applicable
4. 1 additional example sentence with Vietnamese translation
5. A short Vietnamese tip to distinguish between meanings

Return JSON:
{
  "senses": [
    {
      "partOfSpeech": "verb",
      "meaning": "chạy, di chuyển nhanh",
      "meaningEn": "to move quickly using legs",
      "frequency": 1,
      "register": null,
      "examples": [{ "sentence": "...", "translation": "...", "highlight": "run" }],
      "collocations": ["run fast", "run a marathon"]
    }
  ],
  "tips": "💡 'run' làm verb phổ biến nhất = chạy. Làm noun = cuộc chạy/đợt. 'Run a business' = điều hành (không phải chạy!)"
}
`;
```

### Dexie Schema Update

```ts
// src/db/database.ts — UPDATE

// Thêm table:
multiMeaningWords: 'word, updatedAt',
confusingPairs: '++id, word1, word2, category',
phrasalVerbs: '++id, baseVerb, particle, updatedAt',
collocations: '++id, word, category, updatedAt',
grammarPatterns: '++id, pattern, category'
```

### UI Component

```ts
// src/features/word-usage/components/MultiMeaningCard.tsx — MỚI

interface MultiMeaningCardProps {
  word: string;
  compact?: boolean;  // true = trong WordDetail, false = standalone page
}

// Layout:
// ┌──────────────────────────────────────┐
// │ run /rʌn/                    6 nghĩa │
// ├──────────────────────────────────────┤
// │ [verb] [noun] [adj]    ← tab chips  │
// ├──────────────────────────────────────┤
// │ 🟢 verb — nghĩa 1 (phổ biến nhất)  │
// │   chạy, di chuyển nhanh bằng chân   │
// │   "She runs every morning"           │
// │   → Cô ấy chạy bộ mỗi sáng         │
// │   📎 run fast, run a race            │
// │                                      │
// │ 🟡 verb — nghĩa 2                   │
// │   điều hành, quản lý                 │
// │   "He runs a small business"         │
// │   → Anh ấy điều hành 1 DN nhỏ       │
// │                                      │
// │ 🔵 noun — nghĩa 3                   │
// │   cuộc chạy, đợt chạy               │
// │   ...                                │
// ├──────────────────────────────────────┤
// │ 💡 Mẹo: "run" verb phổ biến = chạy  │
// │    "run" + business/company = điều   │
// │    hành. Noun = cuộc chạy/đợt.      │
// └──────────────────────────────────────┘

// Frequency indicators: 🟢 common, 🟡 less common, 🔴 rare
// Tab chips filter by partOfSpeech
// Compact mode: show top 3 senses only, "Xem thêm" expand
```

### Integration vào WordDetail

```ts
// src/features/vocabulary/components/WordDetail.tsx — UPDATE

// Thêm section MỚI giữa "Rich Examples" và "Dictionary Definitions":
// <MultiMeaningCard word={word.word} compact={true} />
// Chỉ hiển thị khi word có ≥2 senses
```

---

## FEATURE 2: Confusing Word Pairs

### Data Model

```ts
// src/features/word-usage/models.ts — THÊM

interface ConfusingPair {
  id: string;                     // "affect-effect"
  word1: string;
  word2: string;
  category: 'spelling' | 'meaning' | 'grammar' | 'usage';
  comparison: PairComparison[];
  commonMistake: string;          // Vietnamese: lỗi hay gặp
  memoryTip: string;              // Vietnamese: mẹo nhớ
  quiz?: PairQuiz;                // mini quiz
}

interface PairComparison {
  word: string;
  partOfSpeech: string;
  meaning: string;                // Vietnamese
  example: string;
  translation: string;
}

interface PairQuiz {
  sentences: PairQuizItem[];      // fill-in-blank
}

interface PairQuizItem {
  sentence: string;               // "The medicine had no _____ on me."
  correct: string;                // "effect"
  explanation: string;            // Vietnamese giải thích
}
```

### Data Source — Static + AI

```ts
// src/data/confusingPairs.ts — MỚI (static seed ~50 pairs)

// Categories:
// spelling: affect/effect, advice/advise, loose/lose, quite/quiet
// meaning: borrow/lend, bring/take, say/tell, watch/look/see
// grammar: lie/lay, rise/raise, sit/set
// usage: do/make, fun/funny, hard/hardly

export const CONFUSING_PAIRS: ConfusingPair[] = [
  {
    id: 'affect-effect',
    word1: 'affect',
    word2: 'effect',
    category: 'spelling',
    comparison: [
      {
        word: 'affect',
        partOfSpeech: 'verb',
        meaning: 'ảnh hưởng (động từ)',
        example: 'The rain affected our plans.',
        translation: 'Mưa ảnh hưởng đến kế hoạch của chúng tôi.'
      },
      {
        word: 'effect',
        partOfSpeech: 'noun',
        meaning: 'kết quả, tác động (danh từ)',
        example: 'The effect of the medicine was immediate.',
        translation: 'Tác dụng của thuốc có ngay lập tức.'
      }
    ],
    commonMistake: 'Hay nhầm vì phát âm gần giống. affect = verb (hành động), effect = noun (kết quả).',
    memoryTip: '💡 Affect = Action (cùng bắt đầu bằng A). Effect = End result (cùng bắt đầu bằng E).',
    quiz: {
      sentences: [
        { sentence: 'The cold weather _____ my health.', correct: 'affected', explanation: 'Cần verb → affect' },
        { sentence: 'What is the _____ of this drug?', correct: 'effect', explanation: 'Cần noun → effect' }
      ]
    }
  },
  // ... ~50 pairs total
];
```

### UI Components

```ts
// src/features/word-usage/components/ConfusingPairCard.tsx — MỚI

// Layout — side-by-side comparison:
// ┌────────────────┬────────────────┐
// │    affect       │    effect      │
// │    /əˈfekt/     │    /ɪˈfekt/    │
// ├────────────────┼────────────────┤
// │ verb            │ noun           │
// │ ảnh hưởng       │ kết quả        │
// │                 │                │
// │ "The rain       │ "The effect    │
// │  affected..."   │  was..."       │
// ├────────────────┴────────────────┤
// │ ⚠️ Hay nhầm vì phát âm giống   │
// │ 💡 Affect=Action, Effect=End    │
// ├─────────────────────────────────┤
// │ [🧩 Thử quiz]                  │
// └─────────────────────────────────┘

// src/features/word-usage/components/PairQuizInline.tsx — MỚI
// Mini fill-in-blank quiz embedded trong card
// Tap word1 or word2 → check → show explanation
```

### Pages & Routes

```ts
// Thêm routes:
/word-usage                        → WordUsageHubPage (overview 5 features)
/word-usage/multi-meaning          → MultiMeaningListPage
/word-usage/multi-meaning/:word    → MultiMeaningDetailPage
/word-usage/confusing-pairs        → ConfusingPairsPage
/word-usage/confusing-pairs/:id    → ConfusingPairDetailPage
/word-usage/phrasal-verbs          → PhrasalVerbsPage (P13-2)
/word-usage/collocations           → CollocationsPage (P13-2)
/word-usage/grammar                → GrammarPatternsPage (P13-3)
```

```ts
// src/features/word-usage/pages/WordUsageHubPage.tsx — MỚI
// Hub page với 5 cards:
// [📚 Từ đa nghĩa] [🔄 Cặp từ dễ nhầm] [🔗 Phrasal Verbs]
// [🤝 Collocations] [📐 Grammar Patterns]
// Mỗi card hiện count + progress
```

---

## FEATURE 3: Phrasal Verbs (Batch P13-2)

### Data Model

```ts
// src/features/word-usage/models.ts — THÊM

interface PhrasalVerb {
  id: string;                     // "get-up"
  baseVerb: string;               // "get"
  particle: string;               // "up"
  full: string;                   // "get up"
  meaning: string;                // Vietnamese
  meaningEn: string;              // English definition
  examples: SenseExample[];
  register?: 'formal' | 'informal';
  separable: boolean;             // "turn off the light" vs "turn the light off"
  relatedPhrases?: string[];      // similar phrasal verbs
}

interface PhrasalVerbGroup {
  baseVerb: string;               // "get"
  verbs: PhrasalVerb[];           // get up, get out, get in, get off...
  count: number;
}
```

### Data Source

```ts
// src/data/phrasalVerbs.ts — MỚI (~200 phrasal verbs, 15 base verbs)

// Top base verbs: get, take, put, come, go, turn, break, bring, carry, cut,
//                 give, hold, keep, look, make, pick, pull, run, set, work

// Static curated data + Gemini enrichment for examples
```

### UI

```ts
// src/features/word-usage/pages/PhrasalVerbsPage.tsx — MỚI

// Layout:
// ┌─────────────────────────────────┐
// │ 🔍 Search phrasal verbs...      │
// ├─────────────────────────────────┤
// │ [get (12)] [take (8)] [put (7)] │  ← filter chips by base verb
// │ [come (6)] [go (6)] [turn (5)]  │
// ├─────────────────────────────────┤
// │ get up      - thức dậy     🟢   │
// │ get out     - ra ngoài     🟢   │
// │ get in      - vào          🟢   │
// │ get off     - xuống (xe)   🟡   │
// │ get over    - vượt qua     🟡   │
// │ get along   - hòa hợp     🟡   │
// │ ...                              │
// └─────────────────────────────────┘

// Search: fuzzy match trên baseVerb + particle + meaning
// Tap item → expand inline (examples, separable note, related)
```

---

## FEATURE 4: Collocations (Batch P13-2)

### Data Model

```ts
// src/features/word-usage/models.ts — THÊM

interface Collocation {
  id: string;                     // "heavy-rain"
  word: string;                   // "heavy"
  collocateWith: string;          // "rain"
  full: string;                   // "heavy rain"
  meaning: string;                // Vietnamese: "mưa to"
  category: CollocationCategory;
  wrongAlternative?: string;      // "strong rain" ← sai!
  explanation: string;            // Tại sao dùng heavy không dùng strong
  example: SenseExample;
}

type CollocationCategory =
  | 'adj+noun'        // heavy rain, strong wind
  | 'verb+noun'       // make a mistake, do homework
  | 'adv+adj'         // deeply concerned, highly recommended
  | 'verb+adv'        // rain heavily, sleep soundly
  | 'noun+noun'       // bus stop, traffic jam
  | 'verb+prep'       // depend on, consist of
  ;
```

### Data Source

```ts
// src/data/collocations.ts — MỚI (~150 collocations, 6 categories)

// Focus on common mistakes for Vietnamese learners:
// - make vs do (make a decision, do homework)
// - strong vs heavy (strong wind, heavy rain)
// - high vs tall (high temperature, tall building)
// - big vs large vs great (big mistake, large number, great success)
```

### UI

```ts
// src/features/word-usage/pages/CollocationsPage.tsx — MỚI

// Layout:
// ┌─────────────────────────────────┐
// │ 🔍 Search collocations...       │
// ├─────────────────────────────────┤
// │ [adj+noun] [verb+noun] [all]    │  ← category filter
// ├─────────────────────────────────┤
// │ ✅ heavy rain     mưa to        │
// │ ❌ strong rain                   │
// │ "It was heavy rain all day"     │
// │ 💡 heavy dùng cho rain, snow,   │
// │    traffic — KHÔNG dùng strong  │
// ├─────────────────────────────────┤
// │ ✅ make a mistake  phạm lỗi     │
// │ ❌ do a mistake                  │
// │ ...                              │
// └─────────────────────────────────┘

// Hiển thị ✅ đúng vs ❌ sai → giúp nhớ
```

---

## FEATURE 5: Context-dependent Grammar (Batch P13-3)

### Data Model

```ts
// src/features/word-usage/models.ts — THÊM

interface GrammarPattern {
  id: string;                      // "remember-ving-vs-to-v"
  pattern: string;                 // "remember + V-ing vs remember + to V"
  category: GrammarCategory;
  forms: GrammarForm[];
  commonMistake: string;           // Vietnamese
  memoryTip: string;               // Vietnamese
  quiz?: GrammarQuiz;
}

interface GrammarForm {
  structure: string;               // "remember + V-ing"
  meaning: string;                 // "nhớ đã làm gì (quá khứ)"
  example: SenseExample;
  usage: string;                   // Vietnamese giải thích khi nào dùng
}

type GrammarCategory =
  | 'verb-pattern'     // remember/stop/try + V-ing vs to V
  | 'used-to'          // used to, be used to, get used to
  | 'conditional'      // if + present → future, if + past → would
  | 'reported-speech'  // say vs tell, tense changes
  | 'passive'          // active ↔ passive transformation
  ;

interface GrammarQuiz {
  items: GrammarQuizItem[];
}

interface GrammarQuizItem {
  sentence: string;                // "I remember _____ (lock) the door."
  options: string[];               // ["locking", "to lock"]
  correct: number;                 // 0
  explanation: string;             // Vietnamese
}
```

### Data Source

```ts
// src/data/grammarPatterns.ts — MỚI (~30 patterns)

// Priority patterns for Vietnamese learners:
// verb-pattern: remember, stop, try, forget, regret + V-ing vs to V
// used-to: used to V, be used to V-ing, get used to V-ing
// conditional: zero, first, second, third conditional
// reported-speech: say/tell rules, tense backshift
// passive: basic passive, passive with modals, get passive
```

### UI

```ts
// src/features/word-usage/pages/GrammarPatternsPage.tsx — MỚI

// Layout:
// ┌─────────────────────────────────────┐
// │ [Verb Patterns] [Used to] [If...]   │
// ├─────────────────────────────────────┤
// │ remember + V-ing vs remember + to V │
// ├─────────────────────────────────────┤
// │ ┌─────────────┬─────────────┐      │
// │ │ remember     │ remember    │      │
// │ │ + V-ing      │ + to V      │      │
// │ ├─────────────┼─────────────┤      │
// │ │ nhớ đã làm  │ nhớ phải    │      │
// │ │ (quá khứ)   │ làm (tương  │      │
// │ │             │ lai)        │      │
// │ ├─────────────┼─────────────┤      │
// │ │ "I remember │ "Remember   │      │
// │ │  meeting    │  to call    │      │
// │ │  him"       │  me"        │      │
// │ └─────────────┴─────────────┘      │
// │ 💡 V-ing = đã xảy ra rồi          │
// │    to V = chưa làm, cần nhớ       │
// │ [🧩 Thử quiz]                      │
// └─────────────────────────────────────┘
```

### Quiz Integration (P13-3)

```ts
// src/features/word-usage/components/UsageQuizSession.tsx — MỚI

// Tích hợp quiz cho cả 3 loại:
// 1. Confusing Pairs quiz — fill correct word
// 2. Collocation quiz — chọn collocation đúng
// 3. Grammar quiz — chọn form đúng

// Reuse QuizSession pattern nhưng customize cho usage context
// XP: 10 per correct (higher than vocab vì khó hơn)
```

---

## Navigation Integration

```ts
// src/routes/index.tsx — UPDATE

// Thêm /word-usage routes (đặt trước wildcard routes)

// src/components/BottomNav.tsx hoặc HomePage — UPDATE
// Thêm entry point "📖 Cách dùng từ" vào navigation
// Icon: 📖 hoặc BookOpen từ Lucide
```

---

## File Structure Tổng Hợp

```
src/features/word-usage/           ← MỚI toàn bộ
├── models.ts                      ← All type definitions
├── constants.ts                   ← Shared constants
├── pages/
│   ├── WordUsageHubPage.tsx       ← Hub overview
│   ├── MultiMeaningListPage.tsx   ← Browse multi-meaning words
│   ├── MultiMeaningDetailPage.tsx ← Single word deep dive
│   ├── ConfusingPairsPage.tsx     ← Browse pairs
│   ├── ConfusingPairDetailPage.tsx ← Single pair + quiz
│   ├── PhrasalVerbsPage.tsx       ← Browse + search (P13-2)
│   ├── CollocationsPage.tsx       ← Browse + search (P13-2)
│   └── GrammarPatternsPage.tsx    ← Browse + quiz (P13-3)
├── components/
│   ├── MultiMeaningCard.tsx       ← Sense display (reusable)
│   ├── ConfusingPairCard.tsx      ← Side-by-side comparison
│   ├── PairQuizInline.tsx         ← Mini fill-in-blank
│   ├── PhrasalVerbItem.tsx        ← Expandable list item (P13-2)
│   ├── CollocationItem.tsx        ← ✅/❌ display (P13-2)
│   ├── GrammarCompareCard.tsx     ← Side-by-side grammar (P13-3)
│   └── UsageQuizSession.tsx       ← Unified quiz (P13-3)
└── hooks/
    ├── useMultiMeaning.ts         ← Fetch + cache logic
    └── useUsageSearch.ts          ← Search across all features

src/services/
├── multiMeaningService.ts         ← MỚI: Dictionary + AI enrichment
└── wordEnrichmentService.ts       ← UPDATE: thêm multi-meaning flag

src/data/                          ← Static seed data
├── confusingPairs.ts              ← ~50 pairs
├── phrasalVerbs.ts                ← ~200 verbs (P13-2)
├── collocations.ts                ← ~150 collocations (P13-2)
└── grammarPatterns.ts             ← ~30 patterns (P13-3)

src/db/database.ts                 ← UPDATE: thêm 4 tables
src/db/models.ts                   ← UPDATE: thêm types
src/routes/index.tsx               ← UPDATE: thêm /word-usage routes
```

---

## Dependencies Mới

Không cần dependency mới — tất cả dùng stack có sẵn (React, Tailwind, Dexie, Gemini, Dictionary API).

---

## Batch Implementation Order

### P13-1: Multi-meaning + Confusing Pairs
1. Dexie schema update (4 tables mới)
2. `models.ts` — all type definitions
3. `multiMeaningService.ts` — Dictionary + Gemini enrichment
4. `MultiMeaningCard.tsx` + tích hợp WordDetail
5. `confusingPairs.ts` static data (~50 pairs)
6. `ConfusingPairCard.tsx` + `PairQuizInline.tsx`
7. `WordUsageHubPage.tsx` + `MultiMeaning*Page.tsx` + `ConfusingPairs*Page.tsx`
8. Routes registration

### P13-2: Phrasal Verbs + Collocations
1. `phrasalVerbs.ts` static data (~200 verbs)
2. `collocations.ts` static data (~150)
3. `PhrasalVerbsPage.tsx` + `PhrasalVerbItem.tsx`
4. `CollocationsPage.tsx` + `CollocationItem.tsx`
5. Search functionality (`useUsageSearch.ts`)

### P13-3: Grammar Patterns + Quiz Integration
1. `grammarPatterns.ts` static data (~30 patterns)
2. `GrammarPatternsPage.tsx` + `GrammarCompareCard.tsx`
3. `UsageQuizSession.tsx` — unified quiz cho cả 3 loại
4. XP integration cho usage quiz
5. Navigation entry point

---

## Edge Cases & Notes

- **Offline-first**: Static data đảm bảo app hoạt động không cần API key
- **Rate limit**: Multi-meaning enrichment dùng chung rate limiter với wordEnrichmentService (max 5 concurrent)
- **Cache invalidation**: 30-day TTL, same as existing enrichment
- **Performance**: Static data import lazy (dynamic import) để không tăng bundle initial
- **Vietnamese learner focus**: Tất cả examples, tips, explanations bằng tiếng Việt
- **Quiz XP**: 10 per correct (usage quiz khó hơn vocab quiz)
- **Search**: Client-side fuzzy search qua static data + cached Dexie data (không cần server)
