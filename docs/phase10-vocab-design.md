# Phase 10: Vocabulary Upgrade — Technical Design (Updated)

**Designer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Brief:** docs/phase10-vocab-upgrade-brief.md
**Base design:** docs/phase9-vocab-design.md (Phase 9 — giữ nguyên làm nền, Phase 10 bổ sung)

---

## Tổng quan

Phase 10 kế thừa toàn bộ Phase 9 design (multi-mode learning, enriched data, word mastery UI) và bổ sung **7 phương pháp học evidence-based** theo yêu cầu của Trung. Trọng tâm:

1. **Hình minh họa cho MỖI từ** (Dual Coding) — ưu tiên cao nhất
2. **AI Memory Hooks** (Keyword Method) — mnemonic cho mỗi từ
3. **Mixed Review / Interleaving Mode** — trộn từ across topics
4. **Active Recall trước xem đáp án** — tất cả modes quiz-first
5. **Context Learning nâng cao** — ≥3 ngữ cảnh mỗi từ
6. **Spaced Repetition mở rộng** — SM-2 áp dụng toàn bộ vocab (không chỉ mistake journal)
7. **Gamification tích hợp** — XP per mode, timed challenges, streak bonus

**Nguyên tắc:** Backward compatible, incremental enrichment, reuse infrastructure có sẵn (SM-2, eventBus, Dexie, enrichmentService).

---

## PHẦN MỚI 1: Word Image System (Dual Coding)

### Chiến lược ảnh — 3 tầng fallback

```
Priority 1: Unsplash API (free, 50 req/hour)
Priority 2: AI-generated description → Placeholder illustration (CSS/SVG)
Priority 3: Emoji icon theo topic category
```

### Image Service

```ts
// src/services/wordImageService.ts — MỚI

interface WordImage {
  url: string;
  source: 'unsplash' | 'placeholder' | 'emoji';
  alt: string;
  thumbUrl?: string;       // 200px for cards
  fullUrl?: string;        // 400px for detail
}

export async function getWordImage(word: string, meaning: string): Promise<WordImage> {
  // 1. Check Dexie cache (enrichedWords.imageData)
  // 2. Cache hit + not expired (30 days) → return
  // 3. Try Unsplash: GET /search/photos?query=${word}&per_page=1&orientation=squarish
  //    - Dùng word tiếng Anh làm query (chính xác hơn meaning tiếng Việt)
  //    - Nếu no results → retry với synonym (lấy từ enriched data)
  // 4. Unsplash fail/no key → return placeholder
  // 5. Cache result vào Dexie
}

// Batch prefetch khi user mở TopicPage
export async function prefetchTopicImages(words: VocabWord[]): Promise<void> {
  // Prefetch max 5 concurrent, throttle 1 req/sec (respect rate limit)
  // Chỉ fetch words chưa có cache
}
```

### Unsplash Config

```env
# .env (optional — app vẫn chạy không có key)
VITE_UNSPLASH_ACCESS_KEY=your_key_here
```

### Placeholder System (không cần API)

```ts
// src/services/wordImageService.ts

const TOPIC_EMOJI_MAP: Record<string, string> = {
  'food-drinks': '🍎',
  'animals': '🐾',
  'weather': '🌤️',
  'family': '👨‍👩‍👧',
  'colors': '🎨',
  // ... tất cả 21 topics
};

function getEmojiPlaceholder(topicId: string, word: string): WordImage {
  return {
    url: '', // empty — component render emoji
    source: 'emoji',
    alt: TOPIC_EMOJI_MAP[topicId] || '📝',
  };
}
```

### WordImage Component

```ts
// src/features/vocabulary/components/WordImage.tsx — MỚI

interface WordImageProps {
  word: string;
  meaning: string;
  topicId: string;
  size: 'sm' | 'md' | 'lg';   // 48px | 80px | 200px
  className?: string;
}

// Renders:
// - <img> nếu có URL (Unsplash) — lazy loading, blur placeholder
// - <div> với emoji lớn nếu fallback
// - Skeleton loading state khi đang fetch
```

### Hiển thị ảnh ở đâu

| Vị trí | Size | Behavior |
|--------|------|----------|
| FlashcardDeck — mặt trước | lg (200px) | Ảnh + word + IPA |
| TopicPage — word list items | sm (48px) | Thumbnail bên trái word |
| WordDetail page | lg (200px) | Ảnh lớn dưới pronunciation |
| Quiz options | không có | Chỉ text (tránh visual hint) |
| Match cards | sm (48px) | Optional — chỉ show cho word cards |
| SessionSummary — word list | sm (48px) | Thumbnail recap |

---

## PHẦN MỚI 2: AI Memory Hooks (Keyword Method)

### Concept

Mỗi từ có 1 "memory hook" — câu gợi nhớ liên kết âm thanh/hình ảnh tiếng Việt với nghĩa tiếng Anh.

**Ví dụ:**
- "breakfast" → "BREAK (phá vỡ) + FAST (nhịn ăn) → bữa sáng phá vỡ cơn đói sau đêm dài"
- "island" → "Đảo — nghe giống 'ai lần' → ai lần đầu ra đảo đều thích"
- "enough" → "Đủ — 'i nớp' → i nớp rồi, đủ rồi không ăn nữa"

### Enrichment Integration

Memory hook nằm trong `EnrichedWordData.mnemonic` (đã có trong Phase 9 design). Phase 10 nâng cấp prompt để hook chất lượng hơn:

```ts
// src/services/wordEnrichmentService.ts — UPDATE Gemini prompt

const ENRICHMENT_PROMPT = `
Given the English word "${word}" (Vietnamese meaning: "${meaning}"):

Return JSON:
{
  "partOfSpeech": "noun/verb/adj/adv/etc",
  "examples": ["5 natural sentences using this word, ranging A1-B1 difficulty, varied contexts"],
  "synonyms": ["up to 5 synonyms, ordered by frequency"],
  "antonyms": ["up to 3 antonyms"],
  "wordFamily": ["related word forms with part of speech, e.g. 'happy (adj)', 'happiness (n)'"],
  "collocations": ["5 common word pairings/phrases"],
  "mnemonic": "A memorable Vietnamese memory hook using one or more of these techniques:
    1. Sound association: find Vietnamese words that SOUND like the English word
    2. Visual story: create a vivid mental image connecting sound to meaning  
    3. Word breakdown: split compound words and explain each part
    4. Rhyme/rhythm: make it catchy and fun
    Keep it SHORT (1-2 sentences), FUNNY if possible, in Vietnamese.",
  "mnemonicType": "sound|visual|breakdown|rhyme",
  "frequency": 1-5
}
`;
```

### Memory Hook UI

```ts
// Hiển thị trong WordDetail.tsx và FlashcardDeck.tsx (mặt sau)

// WordDetail:
// ┌─────────────────────────────┐
// │ 💡 Mẹo ghi nhớ              │
// │ "BREAK + FAST = phá vỡ cơn  │
// │  đói → bữa sáng!"           │
// │                     [🔄 Tạo mới] │
// └─────────────────────────────┘

// Button "Tạo mới" → re-generate mnemonic (call Gemini again, không dùng cache)
```

---

## PHẦN MỚI 3: Mixed Review / Interleaving Mode

### Concept

Thay vì review theo từng topic, Mixed Review trộn từ từ NHIỀU topics → interleaving effect giúp nhớ lâu hơn.

### Route & Entry Point

```
/vocabulary/mixed-review → MixedReviewPage.tsx
```

**Entry:** Button "🔀 Mixed Review" trên VocabularyPage (cạnh topic list header).

### Word Selection Algorithm

```ts
// src/features/vocabulary/hooks/useMixedReview.ts — MỚI

interface MixedReviewConfig {
  wordCount: number;           // 10 | 15 | 20 | 30
  mode: LearningMode;          // flashcard | quiz | context (match không hợp mixed)
  sourceFilter: 'due' | 'weak' | 'random' | 'all';
}

function selectMixedWords(config: MixedReviewConfig): VocabWord[] {
  // 1. sourceFilter === 'due':
  //    - Query wordProgress WHERE nextReview <= now
  //    - Sort by nextReview ASC (most overdue first)
  //    - Limit to config.wordCount
  //
  // 2. sourceFilter === 'weak':
  //    - Query wordProgress WHERE easeFactor < 2.0
  //    - Sort by easeFactor ASC (weakest first)
  //
  // 3. sourceFilter === 'random':
  //    - Pool = all words from all topics
  //    - Random sample, BUT:
  //      - Max 3 words per topic (ensure diversity)
  //      - Prefer words from different CEFR levels
  //
  // 4. sourceFilter === 'all':
  //    - Combine: 40% due + 30% weak + 30% random
  //    - Deduplicate
  //
  // INTERLEAVING: Final list shuffled so consecutive words
  // are from DIFFERENT topics (Fisher-Yates with topic constraint)
}
```

### Interleaving Shuffle

```ts
// Đảm bảo không có 2 từ liên tiếp cùng topic
function interleaveShuffle(words: VocabWordWithTopic[]): VocabWordWithTopic[] {
  // 1. Group by topic
  // 2. Round-robin pick 1 từ mỗi topic
  // 3. Nếu 1 topic dư nhiều → scatter vào giữa
  // 4. Fallback: nếu impossible (1 topic chiếm >50%) → best effort shuffle
}
```

### Mixed Review UI

```
┌──────────────────────────────┐
│ 🔀 Mixed Review              │
│                              │
│ Words: [10] [15] [20] [30]  │
│ Source: [Due🔴] [Weak⚠️]     │
│         [Random🎲] [All📋]   │
│ Mode: [🃏Flash] [❓Quiz]     │
│       [📝Context]            │
│                              │
│ 📊 Stats:                    │
│ • 15 words due for review    │
│ • 8 weak words               │
│ • 523 total words            │
│                              │
│      [ Start Review 🚀 ]     │
└──────────────────────────────┘
```

### Daily Mixed Review (Auto-suggest)

```ts
// VocabularyPage.tsx — Banner khi có words due

// Nếu dueWords.length >= 5:
// ┌─────────────────────────────┐
// │ 🔔 15 từ cần ôn hôm nay!   │
// │ [Ôn ngay →]                 │
// └─────────────────────────────┘
// Click → MixedReviewPage với sourceFilter='due'
```

---

## PHẦN MỚI 4: Active Recall Enhancement

### Nguyên tắc

Tất cả learning modes phải yêu cầu user **recall trước** rồi mới xem đáp án. Không passive review.

### Thay đổi theo mode

**Flashcard (cải tiến):**
- Mặt trước: word + IPA + IMAGE + audio → user tự nhớ nghĩa
- KHÔNG hiện meaning ở mặt trước
- User flip → mặt sau hiện: meaning + examples + memory hook
- Sau đó rate: Again / Hard / Good / Easy
- *Thay đổi so với hiện tại:* Hiện tại đã đúng flow này. Giữ nguyên, chỉ thêm image vào mặt trước.

**Quiz (đã active recall by design):**
- Giữ nguyên — user phải chọn đáp án trước khi thấy correct answer

**Spelling (đã active recall by design):**
- Giữ nguyên — user phải gõ từ

**Context Fill-in-Blank (đã active recall by design):**
- Giữ nguyên — user phải chọn word

**Match (đã active recall by design):**
- Giữ nguyên — user phải recall associations

**WordDetail page (cải tiến):**
- Thêm "Quick Quiz" button: hide meaning → tap to reveal → self-rate
- Nằm ở top của WordDetail, trước khi show all info

```ts
// WordDetail.tsx — thêm ActiveRecallBanner component

// ┌─────────────────────────────┐
// │ 🧠 Bạn nhớ từ này không?    │
// │                             │
// │     [Hiện nghĩa]           │
// │                             │
// │ → Tự nhớ trước rồi check!  │
// └─────────────────────────────┘
// 
// Click "Hiện nghĩa" → fade in meaning + tất cả enriched data
// + Show self-rating: [Không nhớ 😕] [Nhớ mang máng 🤔] [Nhớ rõ 😎]
// → Update SM-2 based on self-rating
```

---

## PHẦN MỚI 5: Context Learning Nâng Cao

### Mục tiêu: Mỗi từ xuất hiện trong ≥3 ngữ cảnh khác nhau

### Enhanced Enrichment Prompt

```ts
// examples field trong enrichment prompt — yêu cầu đa dạng context

"examples": [
  "1 câu về daily life / routine",
  "1 câu về work / school context", 
  "1 câu về social / conversation context",
  "1 câu về news / formal context (B1 level)",
  "1 câu dialogue ngắn (2 turns)"
]

// Mỗi example có context tag để UI group/filter
```

### Enhanced Enriched Data

```ts
// Mở rộng EnrichedWordData

interface EnrichedExample {
  sentence: string;
  context: 'daily' | 'work' | 'social' | 'formal' | 'dialogue';
  translation?: string;        // Vietnamese translation (optional)
}

interface EnrichedWordData {
  // ... existing fields ...
  examples: string[];                // giữ backward compat
  richExamples?: EnrichedExample[];  // new — structured examples
}
```

### Context Mode Enhancement

Context Fill-in-Blank mode (Phase 9 B4) nâng cấp:
- Show context tag icon: 🏠 daily, 💼 work, 💬 social, 📰 formal, 🗣️ dialogue
- Nếu word có richExamples → ưu tiên dùng, đa dạng context
- Progress: track mỗi word đã correct trong bao nhiêu contexts → "Context Mastery"

```ts
// Context mastery: word "learned in context" khi correct trong ≥3 contexts khác nhau
interface ContextProgress {
  wordId: string;
  contextsCorrect: Set<string>;   // {'daily', 'work', 'social'}
  contextMastered: boolean;        // true khi >= 3
}
```

---

## PHẦN MỚI 6: Spaced Repetition Mở Rộng

### Hiện trạng
- SM-2 đã implement trong `spacedRepetition.ts`
- Áp dụng cho flashcard sessions và mistake journal
- `wordProgress` table track: easeFactor, interval, repetitions, nextReview, status

### Mở rộng Phase 10

**1. SM-2 cho TẤT CẢ modes (không chỉ flashcard):**

```ts
// Rating mapping mở rộng (đã có trong Phase 9 design Part J)
// Phase 10 chuẩn hóa:

const MODE_RATING_MAP = {
  flashcard: { easy: 5, good: 4, hard: 2, again: 0 },
  quiz: { correctFirst: 5, correctSecond: 3, wrong: 0 },
  spelling: { correctFirst: 5, withHints: 3, wrong: 0 },
  match: { noMistake: 4, withMistake: 2 },
  context: { correct: 5, wrong: 0 },
  mixedReview: { /* same as underlying mode */ },
};
```

**2. Review Schedule Dashboard:**

Thêm section trên VocabularyPage:

```
┌─────────────────────────────┐
│ 📅 Review Schedule          │
│                             │
│ Today: 15 words due 🔴      │
│ Tomorrow: 8 words           │
│ This week: 42 words         │
│                             │
│ Forecast (7 days):          │
│ ▇▇▇▅▃▂▇                    │
│ M T W T F S S               │
│                             │
│ [Start Today's Review →]    │
└─────────────────────────────┘
```

```ts
// src/features/vocabulary/hooks/useReviewSchedule.ts — MỚI

interface ReviewSchedule {
  dueToday: number;
  dueTomorrow: number;
  dueThisWeek: number;
  forecast: number[];          // 7 days, count per day
  overdueCount: number;        // past due
}

function useReviewSchedule(): ReviewSchedule {
  // Query wordProgress, group by nextReview date
}
```

**3. Auto-add to review queue:**
- Mỗi word học lần đầu (bất kỳ mode nào) → tự động tạo wordProgress entry
- First review: 1 day after first learn
- Subsequent: SM-2 intervals

---

## PHẦN MỚI 7: Gamification Tích Hợp

### XP per Mode

```ts
const MODE_XP = {
  flashcard: { base: 5, perfectBonus: 3 },      // per word
  quiz: { base: 8, perfectBonus: 5 },
  spelling: { base: 10, perfectBonus: 7 },       // hardest → most XP
  match: { base: 6, speedBonus: 10 },            // bonus if < 30s
  context: { base: 8, perfectBonus: 5 },
  mixedReview: { multiplier: 1.5 },              // 1.5x XP for mixed
};
```

### Timed Challenge Mode

Thêm option "⏱️ Timed" vào SessionPicker cho Quiz và Spelling modes:

```ts
interface TimedConfig {
  enabled: boolean;
  secondsPerWord: number;     // Quiz: 10s, Spelling: 15s
}

// UI: countdown timer bar ở top
// Hết giờ → auto-skip, count as wrong
// Bonus XP nếu answer < 50% time limit
```

### Streak Bonus

```ts
// Trong session: consecutive correct answers → streak multiplier
// 3 streak → 1.2x XP
// 5 streak → 1.5x XP  
// 10 streak → 2x XP
// Wrong answer → reset streak

// UI: flame icon 🔥 + streak count khi >= 3
```

---

## CẬP NHẬT Phase 9 Design

### Dexie Schema → Version 7 (mở rộng)

```ts
// src/db/database.ts

this.version(7).stores({
  // Existing tables giữ nguyên
  words: 'id, topic, cefrLevel',
  wordProgress: 'wordId, nextReview, status',
  // ...all existing...

  // New / updated
  enrichedWords: 'word, updatedAt',        // Phase 9
  contextProgress: 'wordId',               // Phase 10 — track context mastery
});
```

```ts
// src/db/models.ts — thêm

interface ContextProgressEntry {
  wordId: string;
  contextsCorrect: string[];    // ['daily', 'work', 'social']
  updatedAt: number;
}
```

### Updated File List (Phase 10 additions)

**Files MỚI bổ sung (ngoài Phase 9 list):**

```
src/services/wordImageService.ts                     — Image fetch + cache + fallback
src/features/vocabulary/components/WordImage.tsx      — Image display component (đã có trong P9, nâng cấp)
src/features/vocabulary/components/ActiveRecallBanner.tsx — Quiz-first banner cho WordDetail
src/features/vocabulary/components/MixedReviewPicker.tsx  — Mixed review config UI
src/features/vocabulary/components/ReviewSchedule.tsx     — Review forecast dashboard
src/features/vocabulary/components/StreakIndicator.tsx    — In-session streak display
src/features/vocabulary/components/TimerBar.tsx           — Countdown timer cho timed mode

src/features/vocabulary/hooks/useMixedReview.ts      — Mixed review word selection + interleaving
src/features/vocabulary/hooks/useReviewSchedule.ts   — Review forecast data
src/features/vocabulary/hooks/useContextProgress.ts  — Context mastery tracking

src/features/vocabulary/pages/MixedReviewPage.tsx    — Mixed review entry page
```

**Files SỬA bổ sung:**

```
src/services/wordEnrichmentService.ts  — Nâng cấp prompt (memory hooks, rich examples, context tags)
src/features/vocabulary/components/FlashcardDeck.tsx — Thêm image mặt trước + memory hook mặt sau
src/features/vocabulary/components/SessionPicker.tsx — Thêm timed option
src/features/vocabulary/pages/VocabularyPage.tsx     — Due review banner + Mixed Review button + Review Schedule
src/features/vocabulary/components/WordDetail.tsx     — ActiveRecallBanner + Memory Hook section
src/features/vocabulary/components/SessionSummary.tsx — Streak stats + mode-specific XP breakdown
```

### Updated Route

```
/vocabulary/mixed-review → MixedReviewPage (MỚI)
```

---

## Implementation Order (Phase 10)

Phase 9 batches giữ nguyên. Phase 10 additions chạy song song hoặc sau:

**Batch P10-1 — Image System (ưu tiên cao nhất theo Trung):**
1. `wordImageService.ts` — Unsplash + fallback logic
2. `WordImage.tsx` component
3. Tích hợp vào FlashcardDeck (mặt trước), TopicPage (thumbnails), WordDetail
4. Prefetch logic khi mở TopicPage

**Batch P10-2 — Memory Hooks + Enhanced Enrichment:**
5. Update `wordEnrichmentService.ts` prompt — better mnemonics + richExamples
6. Memory Hook UI trong WordDetail + FlashcardDeck mặt sau
7. "Tạo mới" button (re-generate mnemonic)

**Batch P10-3 — Mixed Review / Interleaving:**
8. `useMixedReview.ts` hook — word selection + interleaving shuffle
9. `MixedReviewPicker.tsx` UI
10. `MixedReviewPage.tsx` + route
11. Due review banner trên VocabularyPage

**Batch P10-4 — Active Recall + Context Enhancement:**
12. `ActiveRecallBanner.tsx` cho WordDetail
13. Rich examples trong enrichment (context tags)
14. `useContextProgress.ts` + Dexie table
15. Context mode hiển thị context tags

**Batch P10-5 — Gamification + Polish:**
16. `useReviewSchedule.ts` + `ReviewSchedule.tsx` dashboard
17. `TimerBar.tsx` + timed option trong SessionPicker
18. `StreakIndicator.tsx` + streak XP multiplier
19. Mode-specific XP trong SessionSummary
20. Mixed review 1.5x XP multiplier

---

## Edge Cases & Notes Bổ Sung

1. **Unsplash rate limit:** 50 req/hour free tier. Prefetch max 25 words/topic. Nếu hit limit → graceful fallback emoji, retry sau 1h
2. **Image relevance:** Một số abstract words (e.g. "happiness", "because") khó tìm ảnh phù hợp. Gemini có thể suggest search term tốt hơn → thêm `imageSearchTerm` vào EnrichedWordData
3. **Memory hook quality:** Gemini không phải lúc nào cũng tạo hook hay. "Tạo mới" button cho user re-roll. Cũng có thể cho user edit/save custom hook
4. **Interleaving constraint:** Nếu user chỉ học 1 topic → mixed review chỉ có words từ 1 topic → interleaving không áp dụng. UI nên note "Học thêm topics để Mixed Review hiệu quả hơn"
5. **Timed mode accessibility:** Timed mode là OPTIONAL. Default OFF. Người dùng mới không nên bị áp lực thời gian
6. **Context progress storage:** Dùng Dexie table riêng (contextProgress) thay vì nhồi vào wordProgress — tách concerns
7. **Backward compat enrichment:** Nếu enrichedWords cache cũ không có richExamples/mnemonicType → refetch khi user mở WordDetail (lazy migration)
8. **Image cache invalidation:** enrichedWords.imageData có TTL 30 ngày. Sau 30 ngày → refetch ảnh mới (Unsplash URLs có thể expire)

---

## Tổng Kết: 7 Phương Pháp → Feature Mapping

| # | Phương pháp | Feature trong app | Batch |
|---|------------|-------------------|-------|
| 1 | Dual Coding | WordImage — ảnh minh họa mỗi từ | P10-1 |
| 2 | Spaced Repetition | SM-2 mở rộng all modes + Review Schedule | P10-5 |
| 3 | Keyword Method | AI Memory Hooks trong enrichment | P10-2 |
| 4 | Active Recall | Quiz-first trong tất cả modes + ActiveRecallBanner | P10-4 |
| 5 | Context Learning | Rich examples + context tags + context mastery | P10-4 |
| 6 | Interleaving | Mixed Review mode + interleaving shuffle | P10-3 |
| 7 | Gamification | XP per mode + timed challenge + streak bonus | P10-5 |

---

## Dependencies

**Không cần thêm npm packages.** Tất cả dùng libraries đã có.

**Optional env vars:**
```env
VITE_UNSPLASH_ACCESS_KEY=xxx   # Cho word images (app vẫn chạy không có)
```
