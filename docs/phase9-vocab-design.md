# Phase 9: Vocabulary Upgrade — Technical Design

**Designer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Brief:** docs/phase9-vocab-upgrade-brief.md

---

## Tổng quan

Nâng cấp toàn diện Vocabulary feature từ flashcard-only thành multi-mode learning system với enriched data, 4 learning modes mới, word mastery UI, và UX improvements.

**Nguyên tắc thiết kế:**
- Backward compatible — không break data cũ
- Incremental enrichment — AI generate data on-demand, cache lại
- Reuse existing infrastructure — SM-2, eventBus, Dexie, enrichmentService
- Mobile-first responsive

---

## PART A: Data Enhancement

### A1. Enriched Word Type

```ts
// src/lib/types.ts — mở rộng VocabWord

interface VocabWord {
  // Existing fields (giữ nguyên)
  word: string;
  meaning: string;
  ipa: string;
  example: string;
  audioUrl: string | null;

  // New fields (optional cho backward compat)
  partOfSpeech?: string;           // "noun", "verb", "adjective", etc.
  examples?: string[];             // 3-5 example sentences (thay thế single example)
  synonyms?: string[];             // max 5
  antonyms?: string[];             // max 3
  wordFamily?: string[];           // e.g. ["happy", "happiness", "happily", "unhappy"]
  collocations?: string[];         // e.g. ["make a decision", "take a break"]
  imageUrl?: string | null;        // illustration URL
  frequency?: number;              // 1-5 (1=most common)
  mnemonic?: string;               // memory trick, AI-generated
}
```

**Backward compat:** Tất cả fields mới đều optional. Code đọc data cũ vẫn hoạt động bình thường. Field `example` (string) vẫn giữ, `examples` (array) là bổ sung.

### A2. Topic Data Format

```ts
// VocabTopic giữ nguyên structure, chỉ words bên trong enriched hơn
interface VocabTopic {
  topic: string;
  topicLabel: string;
  cefrLevel: CEFRLevel;
  words: VocabWord[];  // words giờ có thêm optional fields
}
```

**Không thay đổi JSON files hiện tại.** Thay vào đó:

### A3. On-Demand Enrichment Service

```ts
// src/services/wordEnrichmentService.ts — MỚI

interface EnrichedWordData {
  partOfSpeech: string;
  examples: string[];        // 3-5 câu
  synonyms: string[];
  antonyms: string[];
  wordFamily: string[];
  collocations: string[];
  mnemonic: string;
  imageUrl: string | null;
  frequency: number;
}

// Flow:
// 1. User mở WordDetail hoặc bắt đầu session
// 2. Check Dexie cache (table: enrichedWords, key: word string)
// 3. Cache hit → return cached data
// 4. Cache miss → call Gemini API to generate
// 5. Store in cache, TTL 30 days

export async function enrichWordData(word: string, meaning: string): Promise<EnrichedWordData>
export async function batchEnrichWords(words: VocabWord[]): Promise<Map<string, EnrichedWordData>>
```

**Gemini prompt template:**
```
Given the English word "${word}" (Vietnamese meaning: "${meaning}"):

Return JSON:
{
  "partOfSpeech": "noun/verb/adj/adv/etc",
  "examples": ["3-5 natural sentences using this word, A1-A2 difficulty"],
  "synonyms": ["up to 5 synonyms"],
  "antonyms": ["up to 3 antonyms"],
  "wordFamily": ["related word forms"],
  "collocations": ["common word pairings"],
  "mnemonic": "a fun/memorable trick to remember this word in Vietnamese",
  "frequency": 1-5 (1=very common daily word, 5=rare)
}
```

**Dexie table mới:**
```ts
// src/db/database.ts — thêm vào version 7
enrichedWords: 'word, updatedAt'  // key by word string
```

```ts
// src/db/models.ts
interface EnrichedWord {
  word: string;           // primary key
  data: EnrichedWordData;
  updatedAt: number;      // timestamp for TTL
}
```

### A4. Image Service

Dùng Unsplash API (free tier, 50 req/hour) cho word images:

```ts
// src/services/imageService.ts — MỚI

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export async function getWordImage(word: string): Promise<string | null> {
  // 1. Check enrichedWords cache for imageUrl
  // 2. Cache miss → fetch from Unsplash: /search/photos?query=${word}&per_page=1&orientation=squarish
  // 3. Return small URL (400px), cache in enrichedWords
  // 4. Fallback null nếu no results hoặc rate limit
}
```

**Fallback:** Nếu không có Unsplash key hoặc rate limit → show emoji icon based on topic (giữ behavior hiện tại).

---

## PART B: Learning Modes

Hiện tại chỉ có Flashcard. Thêm 4 modes mới. Tất cả modes share chung session infrastructure.

### B0. Session Architecture (shared)

```ts
// src/features/vocabulary/types.ts — MỚI

type LearningMode = 'flashcard' | 'quiz' | 'spelling' | 'match' | 'context';

interface SessionConfig {
  topicId: string;
  mode: LearningMode;
  wordCount: number;       // 5 | 10 | 15 | 20
  wordsFilter: 'all' | 'new' | 'weak' | 'due';
}

interface SessionResult {
  mode: LearningMode;
  words: SessionWordResult[];
  totalTime: number;
  accuracy: number;
  xpEarned: number;
}

interface SessionWordResult {
  wordId: string;
  word: string;
  correct: boolean;
  attempts: number;
  timeMs: number;
}
```

**Session flow chung:**
1. User chọn topic → SessionPicker modal (chọn mode + word count + filter)
2. Hook `useVocabSession(config)` load words, shuffle, manage state
3. Mode-specific component renders questions
4. Kết thúc → SessionSummary (đã có, mở rộng cho multi-mode)
5. SM-2 update cho mỗi word based on correct/incorrect

### B1. Quiz Mode

**Route:** `/vocabulary/:topic/quiz`

**Component:** `QuizSession.tsx`

**Gameplay:**
- Hiển thị 1 từ tiếng Anh, 4 options nghĩa tiếng Việt (hoặc ngược lại)
- 3 wrong options lấy random từ cùng topic (khác CEFR level nếu có)
- User chọn → immediate feedback (green/red + correct answer)
- 800ms delay → next question
- Progress bar ở top

**State:**
```ts
interface QuizState {
  currentIndex: number;
  options: string[];         // 4 options (1 correct + 3 distractors)
  selectedOption: string | null;
  showFeedback: boolean;
  direction: 'en-to-vi' | 'vi-to-en';  // alternate randomly
}
```

**Distractor generation:**
```ts
// Lấy 3 meanings random từ words khác trong cùng topic
// Nếu topic < 4 words → lấy từ topics khác cùng CEFR level
function generateDistractors(correctWord: VocabWord, pool: VocabWord[]): string[]
```

**Files:**
- `src/features/vocabulary/components/QuizSession.tsx` — MỚI
- `src/features/vocabulary/components/QuizOption.tsx` — MỚI (animated option button)
- `src/features/vocabulary/hooks/useQuizSession.ts` — MỚI
- `src/features/vocabulary/pages/QuizPage.tsx` — MỚI

### B2. Spelling Mode

**Route:** `/vocabulary/:topic/spelling`

**Component:** `SpellingSession.tsx`

**Gameplay:**
- Play audio (TTS) + show Vietnamese meaning
- User type từ tiếng Anh
- Real-time hint: show dashes cho mỗi letter (e.g. "_ _ _ _ _" cho "apple")
- Submit → check exact match (case-insensitive, trim whitespace)
- Wrong → show correct answer, highlight differences (red cho wrong chars)
- Cho phép 2 attempts trước khi reveal

**State:**
```ts
interface SpellingState {
  currentIndex: number;
  userInput: string;
  attempts: number;          // max 2
  showAnswer: boolean;
  letterHints: boolean[];    // reveal letters progressively on wrong attempts
}
```

**Files:**
- `src/features/vocabulary/components/SpellingSession.tsx` — MỚI
- `src/features/vocabulary/components/SpellingInput.tsx` — MỚI (animated input + letter diff)
- `src/features/vocabulary/hooks/useSpellingSession.ts` — MỚI
- `src/features/vocabulary/pages/SpellingPage.tsx` — MỚI

### B3. Match Game

**Route:** `/vocabulary/:topic/match`

**Component:** `MatchGame.tsx`

**Gameplay:**
- Grid of cards: left column = English words, right column = Vietnamese meanings
- 6 pairs per round (hoặc ít hơn nếu topic nhỏ)
- User tap word → tap matching meaning (highlight selected)
- Correct pair → fade out with success animation
- Wrong pair → shake + red flash, both deselect
- Timer counting up, show final time
- Khi clear hết → completion animation + stats

**State:**
```ts
interface MatchState {
  pairs: Array<{ word: string; meaning: string; id: string }>;
  cards: Array<{ id: string; text: string; type: 'word' | 'meaning'; paired: boolean }>;
  selectedCard: string | null;
  matchedPairs: string[];      // ids of matched pairs
  attempts: number;
  startTime: number;
  mistakes: number;
}
```

**Layout:**
```
Mobile (< 640px):     Desktop (≥ 640px):
2 columns, 6 rows    4 columns, 3 rows
[word1] [meaning3]   [w1] [w2] [m1] [m2]
[word2] [meaning1]   [w3] [m3] [m4] [m5]
...                   ...
```

**Files:**
- `src/features/vocabulary/components/MatchGame.tsx` — MỚI
- `src/features/vocabulary/components/MatchCard.tsx` — MỚI (individual card with flip/fade animation)
- `src/features/vocabulary/hooks/useMatchGame.ts` — MỚI
- `src/features/vocabulary/pages/MatchPage.tsx` — MỚI

### B4. Context Fill-in-Blank

**Route:** `/vocabulary/:topic/context`

**Component:** `ContextSession.tsx`

**Gameplay:**
- Show example sentence với target word replaced by "______"
- Show Vietnamese meaning as hint
- 4 word options (1 correct + 3 distractors from same topic)
- User chọn → fill vào blank → feedback
- Nếu word có field `examples[]` → dùng random example
- Nếu chỉ có `example` → dùng đó
- Nếu enriched data available → dùng enriched examples

**State:**
```ts
interface ContextState {
  currentIndex: number;
  sentence: string;          // with "______" placeholder
  options: string[];         // 4 word options
  selectedOption: string | null;
  showFeedback: boolean;
}
```

**Sentence preparation:**
```ts
function prepareSentence(word: VocabWord, enriched?: EnrichedWordData): string {
  // Pick a random example from examples[] or example
  // Replace the target word (case-insensitive) with "______"
  // If word not found in sentence → fallback to generic template
}
```

**Files:**
- `src/features/vocabulary/components/ContextSession.tsx` — MỚI
- `src/features/vocabulary/hooks/useContextSession.ts` — MỚI
- `src/features/vocabulary/pages/ContextPage.tsx` — MỚI

---

## PART C: Word Mastery System UI

SM-2 tracking đã có. Cần thêm UI layer.

### C1. Topic Progress

**TopicList card enhancement:**
```
┌─────────────────────────────┐
│ 🍎 Food & Drinks       A1  │
│ 25 words                    │
│ ████████░░░░░░░░  12/25     │
│ 🟢8 mastered  🔵3 review   │
│              🟡1 learning   │
└─────────────────────────────┘
```

**Data source:** Query `wordProgress` table, group by status cho topic words.

```ts
// src/features/vocabulary/hooks/useTopicProgress.ts — MỚI

interface TopicProgress {
  total: number;
  new: number;
  learning: number;
  review: number;
  mastered: number;
  percentMastered: number;   // mastered / total * 100
}

function useTopicProgress(topicId: string): TopicProgress
function useAllTopicProgress(): Map<string, TopicProgress>  // for topic list
```

### C2. Word Status Indicators

Trong TopicPage (word list), mỗi word card hiển thị status:

| Status | Color | Icon | Label |
|--------|-------|------|-------|
| new | gray | ○ | New |
| learning | amber | ◐ | Learning |
| review | blue | ◑ | Review |
| mastered | green | ● | Mastered |

**Đã có trong WordCard** (`status` prop) — chỉ cần đảm bảo TopicPage truyền đúng data.

### C3. TopicPage Enhancement

Thêm vào TopicPage:
1. **Progress ring** ở header (circular, animated)
2. **Filter tabs**: All | New | Learning | Review | Mastered
3. **Sort**: Alphabetical | Mastery | Frequency | Last seen
4. **Session Picker button** (xem B0) thay vì chỉ "Start Flashcards"

```
┌──────────────────────────────┐
│ 🍎 Food & Drinks            │
│ ┌────┐                      │
│ │ 48%│ 12/25 mastered       │
│ └────┘                      │
│                              │
│ [All] [New] [Learning] [...] │
│ Sort: [Mastery ▾]           │
│                              │
│ ┌─ apple ────── 🟢 ────┐   │
│ │ /ˈæp.əl/ — quả táo   │   │
│ └───────────────────────┘   │
│ ┌─ bread ────── 🟡 ────┐   │
│ ...                         │
│                              │
│ [▶ Start Learning]          │
└──────────────────────────────┘
```

**Files sửa:**
- `src/features/vocabulary/pages/TopicPage.tsx` — SỬA (thêm progress, filters, sort)
- `src/features/vocabulary/components/TopicHeader.tsx` — MỚI (progress ring + stats)
- `src/features/vocabulary/components/WordFilterBar.tsx` — MỚI

### C4. Session Picker Modal

Khi user nhấn "Start Learning" trên TopicPage:

```
┌──────────────────────────────┐
│   Choose Learning Mode       │
│                              │
│ 🃏 Flashcard    — flip cards │
│ ❓ Quiz         — pick answer│
│ ✍️ Spelling     — type word  │
│ 🔗 Match        — pair up    │
│ 📝 Context      — fill blank │
│                              │
│ Words: [5] [10] [15] [20]   │
│ Filter: [All▾]              │
│                              │
│      [ Start Session ]       │
└──────────────────────────────┘
```

**Files:**
- `src/features/vocabulary/components/SessionPicker.tsx` — MỚI

---

## PART D: UX/UI Improvements

### D1. Word Detail Page Enhancement

Route: `/vocabulary/word/:word` (đã có)

**Hiện tại:** Basic dictionary definitions + synonyms from enrichmentService.

**Nâng cấp layout:**
```
┌──────────────────────────────┐
│ ← Back                      │
│                              │
│ 🔊 apple        noun        │
│ /ˈæp.əl/        🟢 Mastered │
│ quả táo                     │
│                              │
│ [image placeholder/emoji]    │
│                              │
│ 📖 Examples                  │
│ • She ate a red apple.       │
│ • Apple pie is my favorite.  │
│ • An apple a day keeps...    │
│                              │
│ 🔄 Synonyms: fruit          │
│ ↔️ Antonyms: —               │
│                              │
│ 👨‍👩‍👧 Word Family              │
│ apple → apples              │
│                              │
│ 🤝 Collocations             │
│ apple pie, apple juice       │
│                              │
│ 💡 Memory Trick              │
│ "Apple giống Á-Pồ..."       │
│                              │
│ 📊 Your Progress             │
│ Status: Mastered             │
│ Times reviewed: 12           │
│ Last seen: 2 days ago        │
│ Next review: Tomorrow        │
└──────────────────────────────┘
```

**Data sources:**
- Base data: `VocabWord` from topic JSON
- Enriched data: `wordEnrichmentService` (cached in Dexie)
- Progress: `wordProgress` from Dexie
- Dictionary: existing `enrichmentService` (definitions)

**Files sửa:**
- `src/features/vocabulary/components/WordDetail.tsx` — SỬA (major overhaul)
- `src/features/vocabulary/components/WordProgressCard.tsx` — MỚI
- `src/features/vocabulary/components/WordImage.tsx` — MỚI

### D2. Vocabulary Search Enhancement

**Hiện tại:** WordSearch component filter theo word text, chỉ trong VocabularyPage.

**Nâng cấp:**
- Search across ALL topics (built-in + custom)
- Search by word OR meaning (Vietnamese)
- Debounce 300ms (đã có)
- Show results grouped by topic
- Click result → navigate to WordDetailPage

**Files sửa:**
- `src/features/vocabulary/components/WordSearch.tsx` — SỬA (search by meaning, cross-topic results)

### D3. Animations

Thêm framer-motion cho components mới:

| Component | Animation |
|-----------|-----------|
| SessionPicker | Modal slide-up + mode cards stagger |
| QuizOption | Scale on select, color transition on feedback |
| SpellingInput | Shake on wrong, letter reveal stagger |
| MatchCard | 3D flip on match, shake on mismatch, fade-out on paired |
| ContextSession | Blank fill animation (word slides into place) |
| TopicHeader progress ring | Animated arc on mount |
| WordFilterBar | layoutId indicator slide |
| WordDetail sections | Stagger fade-in |

**prefers-reduced-motion:** Tất cả animations phải respect `prefers-reduced-motion` media query (đã có global rule từ Phase 9 Batch 4).

---

## PART E: Routes & Navigation

### New Routes
```
/vocabulary/:topic/quiz       → QuizPage
/vocabulary/:topic/spelling   → SpellingPage
/vocabulary/:topic/match      → MatchPage
/vocabulary/:topic/context    → ContextPage
```

### Updated Routes (giữ nguyên path, thay đổi behavior)
```
/vocabulary/:topic            → TopicPage (enhanced with progress + filter + session picker)
/vocabulary/:topic/learn      → FlashcardPage (giữ nguyên)
/vocabulary/word/:word        → WordDetailPage (enhanced)
```

**Router config:** Thêm 4 routes mới vào `src/router.tsx`.

---

## PART F: Dexie Schema Migration

```ts
// src/db/database.ts — version 7

this.version(7).stores({
  // Existing tables giữ nguyên
  words: 'id, topic, cefrLevel',
  wordProgress: 'wordId, nextReview, status',
  // ...all existing tables...

  // New table
  enrichedWords: 'word, updatedAt'
}).upgrade(tx => {
  // No data migration needed — enrichedWords starts empty
  // Old data backward compatible
});
```

---

## PART G: File List Summary

### Files MỚI (tạo mới)

```
src/features/vocabulary/types.ts                    — LearningMode, SessionConfig, SessionResult types
src/services/wordEnrichmentService.ts               — Gemini-based word enrichment + cache
src/services/imageService.ts                        — Unsplash image fetch (optional)

src/features/vocabulary/components/SessionPicker.tsx — Mode + word count selector modal
src/features/vocabulary/components/TopicHeader.tsx   — Progress ring + topic stats
src/features/vocabulary/components/WordFilterBar.tsx — Filter tabs + sort dropdown
src/features/vocabulary/components/WordProgressCard.tsx — Progress stats in WordDetail
src/features/vocabulary/components/WordImage.tsx     — Image display with fallback

src/features/vocabulary/components/QuizSession.tsx   — Quiz gameplay component
src/features/vocabulary/components/QuizOption.tsx    — Individual quiz option button
src/features/vocabulary/hooks/useQuizSession.ts      — Quiz session logic
src/features/vocabulary/pages/QuizPage.tsx            — Quiz route page

src/features/vocabulary/components/SpellingSession.tsx   — Spelling gameplay
src/features/vocabulary/components/SpellingInput.tsx      — Animated letter input
src/features/vocabulary/hooks/useSpellingSession.ts      — Spelling session logic
src/features/vocabulary/pages/SpellingPage.tsx            — Spelling route page

src/features/vocabulary/components/MatchGame.tsx     — Match game board
src/features/vocabulary/components/MatchCard.tsx     — Individual match card
src/features/vocabulary/hooks/useMatchGame.ts        — Match game logic
src/features/vocabulary/pages/MatchPage.tsx          — Match route page

src/features/vocabulary/components/ContextSession.tsx — Fill-in-blank gameplay
src/features/vocabulary/hooks/useContextSession.ts    — Context session logic
src/features/vocabulary/pages/ContextPage.tsx          — Context route page

src/features/vocabulary/hooks/useTopicProgress.ts    — Topic mastery progress hook
src/features/vocabulary/hooks/useVocabSession.ts     — Shared session base hook
```

### Files SỬA (modify existing)

```
src/lib/types.ts                    — Extend VocabWord with optional fields
src/db/models.ts                    — Add EnrichedWord interface
src/db/database.ts                  — Version 7 + enrichedWords table

src/router.tsx                      — Add 4 new routes

src/features/vocabulary/pages/TopicPage.tsx           — Progress header, filters, session picker
src/features/vocabulary/components/TopicList.tsx       — Progress bar + mastery stats on cards
src/features/vocabulary/components/WordDetail.tsx      — Rich layout with enriched data
src/features/vocabulary/components/WordSearch.tsx      — Cross-topic + meaning search
src/features/vocabulary/components/SessionSummary.tsx  — Support multi-mode stats
```

---

## PART H: Implementation Order

**Batch 1 — Foundation (làm trước):**
1. Types + Dexie migration (types.ts, models.ts, database.ts)
2. wordEnrichmentService.ts (Gemini integration + cache)
3. useTopicProgress.ts hook
4. TopicHeader + WordFilterBar components
5. TopicPage enhancement (progress, filters, sort)
6. TopicList card enhancement (progress bar)

**Batch 2 — Quiz Mode:**
7. useVocabSession.ts (shared session base)
8. SessionPicker.tsx modal
9. QuizSession + QuizOption + useQuizSession
10. QuizPage + route

**Batch 3 — Spelling Mode:**
11. SpellingSession + SpellingInput + useSpellingSession
12. SpellingPage + route

**Batch 4 — Match Game:**
13. MatchGame + MatchCard + useMatchGame
14. MatchPage + route

**Batch 5 — Context Mode:**
15. ContextSession + useContextSession
16. ContextPage + route

**Batch 6 — Word Detail + Polish:**
17. WordDetail overhaul (enriched data, progress card, image)
18. WordSearch enhancement (cross-topic, by meaning)
19. SessionSummary multi-mode support
20. imageService.ts (optional, Unsplash)
21. Animations polish

---

## PART I: Dependencies

**Không cần thêm npm packages mới.** Tất cả dùng libraries đã có:
- `framer-motion` — animations
- `dexie` + `dexie-react-hooks` — IndexedDB
- `zustand` — state management
- `recharts` — progress charts (nếu cần)
- Gemini API — đã configured cho AI features khác
- Web Speech API — TTS (đã có)

**Optional (nếu muốn images):**
- Unsplash API key (free tier) — thêm vào `.env` as `VITE_UNSPLASH_ACCESS_KEY`

---

## PART J: Edge Cases & Notes

1. **Empty enrichment:** Nếu Gemini API fail → WordDetail vẫn show base data (graceful degradation)
2. **Small topics:** Topics < 4 words → Quiz/Context lấy distractors từ topics khác cùng CEFR level
3. **Match game:** Cần ≥ 3 words. Nếu topic < 3 → disable Match mode trong SessionPicker
4. **Custom topics:** Cũng support tất cả modes. Custom words dùng cùng enrichment pipeline
5. **Offline:** enrichedWords cache trong IndexedDB → works offline sau lần đầu enrich
6. **Rate limiting:** Gemini calls throttle max 5 concurrent. Batch enrich khi user mở TopicPage (prefetch)
7. **SM-2 mapping cho modes mới:**
   - Quiz: correct first try = rating 5, correct second = 3, wrong = 0
   - Spelling: correct first try = 5, correct with hints = 3, wrong = 0
   - Match: all pairs correct = 4 cho mỗi word, mistakes = 2
   - Context: correct = 5, wrong = 0
8. **Word count options:** 5/10/15/20. Nếu topic có ít hơn selected count → dùng tất cả words available
9. **Duplicate word IDs:** Giữ convention `${topicId}:${word.word}` — không đổi
