# Phase 14: Listening Pro + Hints — Technical Design

**Designer:** Marcus (Tech Lead)
**Date:** 2026-03-30
**Brief:** Alex — nâng cấp Listening với modes mới + hint system

---

## Tổng quan

Phase 14 mở rộng listening từ 4 modes (word/phrase/sentence/quiz) thành **11 modes** + **hint system** toàn cục. Chia thành **4 batches** để implement tuần tự:

- **P14-1:** Hint System + Audio Engine nâng cấp (foundation)
- **P14-2:** Fill-in-the-blank + Speed Listening + Listen & Choose
- **P14-3:** Conversation Listening + News/Story Listening
- **P14-4:** Accent Exposure + Note-taking Practice + Polish

**Nguyên tắc:** Reuse infrastructure có sẵn (audioService, eventBus, Dexie, XP system). Tất cả modes dùng Web Speech API TTS (không cần external audio files). Content generate bằng Gemini AI (reuse enrichmentService pattern).

---

## Hiện trạng

```
src/features/listening/
├── components/   (7 files — DictationInput, Player, Result, Summary, Quiz, QuizSession, ModeSelector)
├── hooks/        (3 files — useDictation, useDictationAudio, useListeningQuiz)
└── pages/        (2 files — ListeningPage, DictationSessionPage)
```

- 4 modes: word, phrase, sentence, quiz
- Audio: HTML5 Audio (audioUrl) → Web Speech API TTS fallback
- XP: 10/correct + 30 perfect bonus
- Data: 20 topics × 25-30 words từ `src/data/vocabulary/`
- **Chưa có:** hint system, speed control, conversation/story content

---

## BATCH 1: Hint System + Audio Engine (P14-1)

### 1.1 Audio Engine nâng cấp

Hiện `audioService.ts` chỉ có `playWordAudio()` + `stopAudio()`. Cần nâng cấp để support:
- Speed control (0.75x → 1x → 1.25x → 1.5x)
- Multiple voices (cho conversation)
- Callback khi audio kết thúc

```ts
// src/services/audioService.ts — NÂNG CẤP

interface PlayOptions {
  rate?: number;          // 0.5 - 2.0, default 1.0
  voice?: string;         // voice name hoặc 'male'|'female' shortcut
  lang?: string;          // default 'en-US'
  onEnd?: () => void;     // callback khi xong
  signal?: AbortSignal;   // cancel audio
}

export function playAudio(text: string, options?: PlayOptions): Promise<void> {
  // 1. Cancel current audio
  // 2. Nếu có audioUrl trong cache → HTML5 Audio với playbackRate = rate
  // 3. Fallback Web Speech API:
  //    - utterance.rate = rate ?? 0.9
  //    - utterance.voice = findVoice(voice) // prefer 'Google US English' hoặc tương đương
  //    - utterance.onend = onEnd
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  // Return English voices, grouped by accent (US/UK/AU)
}

// Giữ backward compat
export function playWordAudio(word: string, audioUrl?: string | null): Promise<void> {
  return playAudio(word, { rate: 0.9 });
}
```

### 1.2 Hint System

Hint áp dụng cho TẤT CẢ listening modes. Mỗi mode define hint types nào available.

```ts
// src/features/listening/types.ts — MỚI

type HintType = 'first-letter' | 'ipa' | 'meaning' | 'slow-replay';

interface HintConfig {
  type: HintType;
  label: string;         // Vietnamese label
  icon: string;          // emoji
  xpPenalty: number;     // trừ bao nhiêu XP
  available: boolean;    // có sẵn cho mode này không
}

interface HintState {
  usedHints: HintType[];  // hints đã dùng cho question hiện tại
  totalHintsUsed: number; // tổng hints cả session
  xpDeducted: number;     // tổng XP bị trừ
}

// Default hint configs
const HINT_CONFIGS: Record<HintType, Omit<HintConfig, 'available'>> = {
  'first-letter': { type: 'first-letter', label: 'Chữ cái đầu', icon: '🔤', xpPenalty: 2 },
  'ipa':          { type: 'ipa',          label: 'Phiên âm IPA', icon: '🗣️', xpPenalty: 3 },
  'meaning':      { type: 'meaning',      label: 'Nghĩa tiếng Việt', icon: '🇻🇳', xpPenalty: 4 },
  'slow-replay':  { type: 'slow-replay',  label: 'Nghe chậm 0.75x', icon: '🐢', xpPenalty: 1 },
};
```

#### Hint Hook

```ts
// src/features/listening/hooks/useHints.ts — MỚI

interface UseHintsOptions {
  availableHints: HintType[];  // mode quyết định hints nào có
  currentWord: VocabWord | null;
  onSlowReplay?: () => void;   // callback để phát lại chậm
}

export function useHints(options: UseHintsOptions) {
  // Returns:
  //   hints: HintConfig[]        — danh sách hints available + trạng thái used
  //   useHint(type): string|void — trả về hint value hoặc trigger slow replay
  //   hintState: HintState       — tracking
  //   resetHints(): void         — reset cho question mới
  //   getXPDeduction(): number   — tổng XP bị trừ

  // Logic useHint:
  // 'first-letter' → word[0] + '_'.repeat(word.length - 1)  // "B_____"
  // 'ipa'          → word.ipa                                 // "/ˈbred/"
  // 'meaning'      → word.meaning                            // "bánh mì"
  // 'slow-replay'  → call onSlowReplay(), mark used
}
```

#### Hint UI Component

```ts
// src/features/listening/components/HintBar.tsx — MỚI

interface HintBarProps {
  hints: HintConfig[];
  usedHints: HintType[];
  onUseHint: (type: HintType) => string | void;
  revealedValues: Record<HintType, string>;  // giá trị đã reveal
}

// Render:
// ┌──────────────────────────────────────────┐
// │ 💡 Gợi ý:                                │
// │ [🔤 Chữ cái đầu -2XP] [🗣️ IPA -3XP]    │
// │ [🇻🇳 Nghĩa VN -4XP]  [🐢 Nghe chậm -1XP]│
// │                                          │
// │ → B_____  (revealed first-letter)        │
// │ → /bred/  (revealed IPA)                 │
// └──────────────────────────────────────────┘
// Hint đã dùng → disable + show value
// Animation: fade in revealed value
```

#### Hint availability per mode

| Mode | first-letter | ipa | meaning | slow-replay |
|------|:---:|:---:|:---:|:---:|
| word | ✅ | ✅ | ✅ | ✅ |
| phrase | ❌ | ❌ | ✅ | ✅ |
| sentence | ❌ | ❌ | ✅ | ✅ |
| quiz | ❌ | ✅ | ❌ | ✅ |
| fill-blank | ✅ | ✅ | ✅ | ✅ |
| speed-listening | ❌ | ❌ | ✅ | ❌ |
| listen-choose | ❌ | ✅ | ❌ | ✅ |
| conversation | ❌ | ❌ | ✅ | ✅ |
| news-story | ❌ | ❌ | ✅ | ✅ |
| note-taking | ❌ | ❌ | ✅ | ✅ |

### 1.3 Tích hợp Hint vào modes hiện tại

Update `DictationSessionPage.tsx`:
- Thêm `<HintBar>` dưới `<DictationPlayer>`
- Pass `useHints()` hook
- XP final = `correctCount * 10 + perfectBonus - hintState.xpDeducted`
- `DictationSessionSummary` thêm dòng "Gợi ý đã dùng: X (-Y XP)"

### 1.4 XP Update

```ts
// src/lib/constants.ts — UPDATE
XP_VALUES = {
  ...existing,
  // Hint penalties (negative)
  hint_first_letter: -2,
  hint_ipa: -3,
  hint_meaning: -4,
  hint_slow_replay: -1,
};
```

### 1.5 Files P14-1

| File | Action | Mô tả |
|------|--------|--------|
| `src/services/audioService.ts` | UPDATE | Thêm PlayOptions, playAudio(), getAvailableVoices() |
| `src/features/listening/types.ts` | NEW | HintType, HintConfig, HintState, ListeningMode |
| `src/features/listening/hooks/useHints.ts` | NEW | Hint logic hook |
| `src/features/listening/components/HintBar.tsx` | NEW | Hint UI |
| `src/features/listening/pages/DictationSessionPage.tsx` | UPDATE | Tích hợp HintBar |
| `src/features/listening/components/DictationSessionSummary.tsx` | UPDATE | Hiển thị hint usage |
| `src/lib/constants.ts` | UPDATE | Hint XP penalties |
| `src/lib/types.ts` | UPDATE | Mở rộng DictationMode → ListeningMode |

---

## BATCH 2: Fill-in-blank + Speed Listening + Listen & Choose (P14-2)

### 2.1 ListeningMode type mở rộng

```ts
// src/lib/types.ts — UPDATE (từ P14-1)
export type ListeningMode =
  | 'word' | 'phrase' | 'sentence' | 'quiz'     // existing
  | 'fill-blank' | 'speed' | 'listen-choose';   // P14-2
```

### 2.2 Fill-in-the-blank

Nghe câu, 1-2 từ bị ẩn, gõ từ bị thiếu.

```ts
// src/features/listening/hooks/useFillBlank.ts — MỚI

interface FillBlankItem {
  word: VocabWord;
  sentence: string;           // câu gốc (từ example hoặc enriched)
  blankedSentence: string;    // "I eat a _____ for breakfast."
  answers: string[];          // ["banana"] — có thể nhiều đáp án chấp nhận
  blankPositions: number[];   // index của word bị blank
}

export function useFillBlank(topic: string) {
  // Chọn 10 words random
  // Mỗi word: lấy example sentence → blank target word
  // Nếu word xuất hiện nhiều lần → chỉ blank 1 lần
  // Accept: case-insensitive, trim whitespace
  // Returns: same shape as useDictation
}
```

**Component:**
```ts
// src/features/listening/components/FillBlankSession.tsx — MỚI

// UI:
// ┌────────────────────────────────┐
// │ 🔊 [Play]  🐢 [Slow]          │
// │                                │
// │ "I eat a _______ for breakfast"│
// │                                │
// │ [__________] [Submit]          │
// │                                │
// │ 💡 Hints: [🔤 -2] [🗣️ -3]     │
// └────────────────────────────────┘
// Blank word highlighted (yellow bg, dashed border)
// Input auto-focus, Enter to submit
```

### 2.3 Speed Listening

Nghe từ/câu với tốc độ tăng dần. Mỗi round tốc độ tăng.

```ts
// src/features/listening/hooks/useSpeedListening.ts — MỚI

interface SpeedRound {
  speed: number;          // 0.75 | 1.0 | 1.25 | 1.5
  label: string;          // "Chậm" | "Bình thường" | "Nhanh" | "Rất nhanh"
  items: DictationItem[]; // 3 items per round
  bonusXP: number;        // 0 | 2 | 5 | 8
}

const SPEED_LEVELS = [
  { speed: 0.75, label: 'Chậm',          bonusXP: 0 },
  { speed: 1.0,  label: 'Bình thường',   bonusXP: 2 },
  { speed: 1.25, label: 'Nhanh',         bonusXP: 5 },
  { speed: 1.5,  label: 'Rất nhanh',     bonusXP: 8 },
];

export function useSpeedListening(topic: string) {
  // 12 items total: 3 per round × 4 rounds
  // Round 1: speed 0.75x → Round 2: 1.0x → Round 3: 1.25x → Round 4: 1.5x
  // Input: gõ lại word/phrase đã nghe
  // XP: base 10 + speed bonus per round
  // Sai 3 lần liên tiếp → offer giảm speed
}
```

**Component:**
```ts
// src/features/listening/components/SpeedListeningSession.tsx — MỚI

// UI:
// ┌──────────────────────────────┐
// │ ⚡ Speed Listening             │
// │ Round 2/4 — 🏃 Bình thường    │
// │ ┌──────────────────────────┐ │
// │ │ ●●● ○○○ ○○○ ○○○         │ │  ← progress dots per round
// │ └──────────────────────────┘ │
// │                              │
// │     🔊 [Play]                │
// │     [__________] [Submit]    │
// │                              │
// │ Speed: ▰▰▱▱  1.0x           │  ← speed indicator bar
// │ 💡 Hints: [🇻🇳 -4]           │
// └──────────────────────────────┘
```

### 2.4 Listen & Choose (Multiple Choice nâng cấp)

Khác với quiz hiện tại (nghe word → chọn meaning), Listen & Choose:
- Nghe câu/phrase → chọn word/phrase đúng đã nghe
- Hoặc nghe word → chọn câu chứa word đó

```ts
// src/features/listening/hooks/useListenChoose.ts — MỚI

type ListenChooseVariant = 'word-to-sentence' | 'sentence-to-word';

interface ListenChooseQuestion {
  audio: string;            // text để phát audio
  audioRate: number;        // speed
  question: string;         // "Bạn vừa nghe từ nào?" / "Câu nào chứa từ vừa nghe?"
  options: string[];        // 4 lựa chọn
  correctIndex: number;
  word: VocabWord;          // reference word
}

export function useListenChoose(topic: string, variant?: ListenChooseVariant) {
  // 10 questions, alternating variants
  // Variant 1 (word-to-sentence): play word → chọn sentence chứa word
  // Variant 2 (sentence-to-word): play sentence → chọn word đã nghe trong sentence
  // Distractors: similar CEFR level words/sentences
}
```

### 2.5 Route + ListeningPage Update

```ts
// src/routes/index.tsx — UPDATE
{ path: 'listening/:topic/fill-blank',    element: <FillBlankPage /> }
{ path: 'listening/:topic/speed',         element: <SpeedListeningPage /> }
{ path: 'listening/:topic/listen-choose', element: <ListenChoosePage /> }
```

```ts
// ListeningPage.tsx — UPDATE DictationModeSelector
// Thêm 3 mode buttons mới:
// [Word] [Phrase] [Sentence] [Quiz]
// [Fill-blank] [Speed] [Listen & Choose]   ← NEW row
// Tooltip mỗi mode giải thích cách chơi
```

### 2.6 Files P14-2

| File | Action | Mô tả |
|------|--------|--------|
| `src/features/listening/hooks/useFillBlank.ts` | NEW | Fill-in-blank logic |
| `src/features/listening/hooks/useSpeedListening.ts` | NEW | Speed listening logic |
| `src/features/listening/hooks/useListenChoose.ts` | NEW | Listen & Choose logic |
| `src/features/listening/components/FillBlankSession.tsx` | NEW | Fill-blank UI |
| `src/features/listening/components/SpeedListeningSession.tsx` | NEW | Speed listening UI |
| `src/features/listening/components/ListenChooseSession.tsx` | NEW | Listen & Choose UI |
| `src/features/listening/pages/FillBlankPage.tsx` | NEW | Route page |
| `src/features/listening/pages/SpeedListeningPage.tsx` | NEW | Route page |
| `src/features/listening/pages/ListenChoosePage.tsx` | NEW | Route page |
| `src/features/listening/pages/ListeningPage.tsx` | UPDATE | Thêm mode buttons |
| `src/features/listening/components/DictationModeSelector.tsx` | UPDATE | Thêm 3 modes |
| `src/lib/types.ts` | UPDATE | ListeningMode |
| `src/routes/index.tsx` | UPDATE | 3 routes mới |

---

## BATCH 3: Conversation + News/Story Listening (P14-3)

### 3.1 AI Content Generation

Conversation và News/Story cần content dài hơn → generate bằng Gemini AI.

```ts
// src/services/listeningContentService.ts — MỚI

interface ConversationContent {
  id: string;
  topic: string;
  title: string;              // "At the Coffee Shop"
  cefrLevel: CEFRLevel;
  speakers: Speaker[];        // [{name: 'Anna', voice: 'female'}, {name: 'Tom', voice: 'male'}]
  lines: ConversationLine[];  // [{speaker: 'Anna', text: '...', translation: '...'}, ...]
  questions: ComprehensionQuestion[];
  keyVocab: string[];         // words from topic used in conversation
  durationEstimate: number;   // seconds
}

interface ConversationLine {
  speaker: string;
  text: string;
  translation: string;        // Vietnamese
  highlightWords?: string[];  // key vocab in this line
}

interface ComprehensionQuestion {
  question: string;           // Vietnamese (test comprehension)
  options: string[];          // 4 options in Vietnamese
  correctIndex: number;
  explanation: string;        // giải thích đáp án
  relatedLine: number;        // index của line liên quan
}

interface StoryContent {
  id: string;
  topic: string;
  title: string;              // "A Day at the Market"
  cefrLevel: CEFRLevel;
  paragraphs: string[];       // 3-5 paragraphs
  translation: string[];      // Vietnamese per paragraph
  questions: ComprehensionQuestion[];
  keyVocab: string[];
  durationEstimate: number;
}

// Generate + cache vào Dexie
export async function generateConversation(topic: string, words: VocabWord[]): Promise<ConversationContent> {
  // Gemini prompt: tạo dialogue 8-12 lines, dùng ≥5 words từ topic
  // CEFR A1-B1 level
  // 4 comprehension questions
  // Cache: Dexie table `listeningContent`, TTL 30 ngày
}

export async function generateStory(topic: string, words: VocabWord[]): Promise<StoryContent> {
  // Gemini prompt: viết story/news 3-5 paragraphs, dùng ≥8 words từ topic
  // CEFR A1-B1
  // 5 comprehension questions
  // Cache: Dexie table `listeningContent`, TTL 30 ngày
}
```

### 3.2 Dexie Schema Update

```ts
// src/db/database.ts — UPDATE
listeningContent: '&id, topic, type, createdAt'

interface ListeningContentRecord {
  id: string;             // `conv_${topic}_${hash}` hoặc `story_${topic}_${hash}`
  topic: string;
  type: 'conversation' | 'story';
  content: ConversationContent | StoryContent;
  createdAt: number;
}
```

### 3.3 Conversation Listening

```ts
// src/features/listening/hooks/useConversationListening.ts — MỚI

export function useConversationListening(topic: string) {
  // 1. Check cache → nếu có conversation cho topic → dùng luôn
  // 2. Cache miss → generate via listeningContentService
  // 3. Play flow:
  //    - Auto-play line by line (speaker A → B → A → ...)
  //    - Mỗi line: play audio → pause 1s → next line
  //    - Dùng different voices cho different speakers
  //    - User có thể pause/replay
  // 4. Sau khi nghe xong → comprehension quiz (4 questions)
  // 5. XP: 15/đúng (harder than dictation)
}
```

**Component:**
```ts
// src/features/listening/components/ConversationSession.tsx — MỚI

// Phase 1 — Listening:
// ┌────────────────────────────────┐
// │ 🎧 Conversation: At the Café   │
// │ 👩 Anna  👨 Tom                 │
// │ ─────────────────────────────  │
// │ 👩 "Hello! Can I have a..."    │  ← highlighted current line
// │ 👨 "Sure! What size..."        │
// │ 👩 "A large, please."          │  ← greyed = upcoming
// │                                │
// │    ⏮️  ▶️/⏸️  ⏭️               │  ← playback controls
// │    Speed: [0.75x] [1x] [1.25x]│
// │                                │
// │ 💡 Hints: [🇻🇳 Dịch -4XP]     │
// └────────────────────────────────┘
// Tap line → replay that line
// Toggle: show/hide Vietnamese translation

// Phase 2 — Quiz:
// ┌────────────────────────────────┐
// │ ❓ Anna muốn gọi gì?          │
// │                                │
// │ [A] Cà phê lớn               │
// │ [B] Trà sữa                   │
// │ [C] Nước cam                   │
// │ [D] Cà phê nhỏ               │
// │                                │
// │ 💡 Hints: [🐢 Nghe lại -1XP]  │
// └────────────────────────────────┘
```

### 3.4 News/Story Listening

```ts
// src/features/listening/hooks/useStoryListening.ts — MỚI

export function useStoryListening(topic: string) {
  // Tương tự conversation nhưng:
  // - 1 speaker (narrator voice)
  // - Longer content (3-5 paragraphs)
  // - 5 comprehension questions
  // - Key vocab highlighted
  // - Paragraph-by-paragraph playback
  // XP: 15/đúng + 20 bonus all correct
}
```

**Component:**
```ts
// src/features/listening/components/StorySession.tsx — MỚI

// Phase 1 — Listening:
// ┌────────────────────────────────┐
// │ 📰 Story: A Day at the Market  │
// │ ─────────────────────────────  │
// │ Paragraph 1/4                  │
// │                                │
// │ "Every morning, Mrs. Lan goes  │
// │  to the market. She buys fresh │
// │  vegetables and fruit..."      │
// │                                │
// │    ⏮️  ▶️/⏸️  ⏭️               │
// │    Speed: [0.75x] [1x] [1.25x]│
// │                                │
// │ 📝 Key words: market, fresh,   │
// │    vegetables, fruit            │
// │ 💡 [🇻🇳 Bản dịch -4XP]        │
// └────────────────────────────────┘

// Phase 2 — Quiz (same as conversation)
```

### 3.5 Files P14-3

| File | Action | Mô tả |
|------|--------|--------|
| `src/services/listeningContentService.ts` | NEW | AI content generation + cache |
| `src/features/listening/hooks/useConversationListening.ts` | NEW | Conversation logic |
| `src/features/listening/hooks/useStoryListening.ts` | NEW | Story logic |
| `src/features/listening/components/ConversationSession.tsx` | NEW | Conversation UI |
| `src/features/listening/components/StorySession.tsx` | NEW | Story UI |
| `src/features/listening/components/ComprehensionQuiz.tsx` | NEW | Shared quiz cho cả 2 |
| `src/features/listening/components/PlaybackControls.tsx` | NEW | Shared audio controls |
| `src/features/listening/pages/ConversationPage.tsx` | NEW | Route page |
| `src/features/listening/pages/StoryPage.tsx` | NEW | Route page |
| `src/db/database.ts` | UPDATE | `listeningContent` table |
| `src/db/models.ts` | UPDATE | ListeningContentRecord type |
| `src/routes/index.tsx` | UPDATE | 2 routes mới |
| `src/features/listening/pages/ListeningPage.tsx` | UPDATE | 2 mode buttons mới |

---

## BATCH 4: Accent Exposure + Note-taking + Polish (P14-4)

### 4.1 Accent Exposure

```ts
// src/features/listening/hooks/useAccentExposure.ts — MỚI

type Accent = 'us' | 'uk' | 'au';

interface AccentQuestion {
  word: VocabWord;
  accent: Accent;
  accentLabel: string;    // "🇺🇸 American" | "🇬🇧 British" | "🇦🇺 Australian"
}

export function useAccentExposure(topic: string) {
  // 12 items: 4 per accent (US, UK, AU)
  // Mỗi item: play word với accent → user gõ lại
  // Sau mỗi word: show tất cả 3 accents side-by-side để so sánh
  // XP: 10/đúng + 5 bonus cho accent mới (first time nghe accent đó)
  
  // Voice selection:
  // US → prefer voice.name includes 'US' hoặc 'American'
  // UK → prefer voice.name includes 'UK' hoặc 'British'  
  // AU → prefer voice.name includes 'AU' hoặc 'Australian'
  // Fallback: thay đổi pitch slightly (US: pitch 1.0, UK: 1.1, AU: 0.95)
}
```

**Component:**
```ts
// src/features/listening/components/AccentExposureSession.tsx — MỚI

// UI:
// ┌────────────────────────────────┐
// │ 🗣️ Accent Exposure              │
// │ Round 2/3 — 🇬🇧 British         │
// │ ─────────────────────────────  │
// │                                │
// │     🔊 [Play]                  │
// │     [__________] [Submit]      │
// │                                │
// │ Compare accents:               │  ← show sau khi submit
// │ 🇺🇸 [▶️] /ˈwɔː.tɚ/            │
// │ 🇬🇧 [▶️] /ˈwɔː.tə/            │
// │ 🇦🇺 [▶️] /ˈwoː.tə/            │
// │                                │
// │ 💡 Hints: [🔤 -2] [🗣️ -3]     │
// └────────────────────────────────┘
```

### 4.2 Note-taking Practice

```ts
// src/features/listening/hooks/useNoteTaking.ts — MỚI

interface NoteTakingSession {
  content: StoryContent;      // reuse story content
  userNotes: string;          // free-form text
  keyPoints: string[];        // AI-generated key points (correct answers)
  matchedPoints: number;      // how many key points user captured
}

export function useNoteTaking(topic: string) {
  // 1. Generate/fetch story content (reuse listeningContentService)
  // 2. Play story (2-3 paragraphs, shorter than full story mode)
  // 3. User ghi notes free-form trong textarea
  // 4. Submit → AI compare notes với key points
  // 5. Score: matched key points / total key points
  // XP: 20 per matched key point (max 5 points = 100 XP)
  
  // Key points matching:
  // - Gemini prompt compare user notes vs key points
  // - Return which points were captured (fuzzy match)
  // - Show feedback: ✅ captured | ❌ missed per point
}
```

**Component:**
```ts
// src/features/listening/components/NoteTakingSession.tsx — MỚI

// Phase 1 — Listen:
// ┌────────────────────────────────┐
// │ 📝 Note-taking Practice         │
// │ ─────────────────────────────  │
// │ 🔊 Playing... (1:23 / 2:45)   │
// │    ⏮️  ▶️/⏸️  ⏭️               │
// │ ─────────────────────────────  │
// │ 📝 Your notes:                 │
// │ ┌──────────────────────────┐  │
// │ │ (type while listening)   │  │  ← textarea, auto-resize
// │ │                          │  │
// │ │                          │  │
// │ └──────────────────────────┘  │
// │                                │
// │ [Submit Notes]                 │
// │ 💡 [🇻🇳 Nghĩa -4XP] [🐢 -1XP] │
// └────────────────────────────────┘

// Phase 2 — Results:
// ┌────────────────────────────────┐
// │ 📊 Key Points: 3/5 captured    │
// │                                │
// │ ✅ Mrs. Lan goes to market     │
// │ ✅ She buys vegetables         │
// │ ❌ She meets her neighbor       │
// │ ✅ Prices are higher today     │
// │ ❌ She plans to cook soup       │
// │                                │
// │ Your notes:                    │
// │ "lan go market, buy vegetable, │
// │  price high today"             │
// └────────────────────────────────┘
```

### 4.3 Polish — ListeningPage nâng cấp

```ts
// ListeningPage.tsx — REDESIGN

// Chia modes thành categories:
// ┌────────────────────────────────┐
// │ 🎧 Listening Practice           │
// │ ─────────────────────────────  │
// │                                │
// │ 📝 Dictation                   │
// │ [Word] [Phrase] [Sentence]     │
// │                                │
// │ 🧩 Interactive                  │
// │ [Quiz] [Fill-blank] [Choose]   │
// │                                │
// │ 🏋️ Challenge                    │
// │ [Speed] [Accent]               │
// │                                │
// │ 📖 Comprehension               │
// │ [Conversation] [Story] [Notes] │
// │                                │
// │ ─────────────────────────────  │
// │ 🏆 Stats: 1,234 XP earned      │
// │ 🔥 Best streak: 15             │
// └────────────────────────────────┘
```

### 4.4 Listening Stats Tracking

```ts
// src/db/models.ts — UPDATE
interface ListeningStats {
  totalSessions: number;
  totalCorrect: number;
  totalXP: number;
  hintsUsed: number;
  bestStreak: number;
  modeBreakdown: Record<ListeningMode, { sessions: number; correct: number }>;
  accentExposure: Record<Accent, number>;  // times heard each accent
}
```

### 4.5 Files P14-4

| File | Action | Mô tả |
|------|--------|--------|
| `src/features/listening/hooks/useAccentExposure.ts` | NEW | Accent logic |
| `src/features/listening/hooks/useNoteTaking.ts` | NEW | Note-taking logic |
| `src/features/listening/components/AccentExposureSession.tsx` | NEW | Accent UI |
| `src/features/listening/components/NoteTakingSession.tsx` | NEW | Note-taking UI |
| `src/features/listening/pages/AccentPage.tsx` | NEW | Route page |
| `src/features/listening/pages/NoteTakingPage.tsx` | NEW | Route page |
| `src/features/listening/pages/ListeningPage.tsx` | UPDATE | Redesign với categories |
| `src/db/models.ts` | UPDATE | ListeningStats |
| `src/routes/index.tsx` | UPDATE | 2 routes mới |

---

## Tổng kết Dependencies

### External dependencies mới: KHÔNG CÓ
Tất cả dùng Web Speech API (built-in) + Gemini AI (đã có).

### Batch order (PHẢI theo thứ tự):
1. **P14-1** — Foundation (audio engine + hints) ← mọi batch sau đều dùng
2. **P14-2** — 3 modes đơn giản (reuse vocab data, không cần AI content)
3. **P14-3** — 2 modes cần AI content generation
4. **P14-4** — 2 modes còn lại + polish

### XP Summary

| Mode | Base XP/correct | Perfect bonus | Hint penalty |
|------|:---:|:---:|:---:|
| word/phrase/sentence | 10 | 30 (10/10) | -1 to -4 |
| quiz | 10 | 30 | -1 to -4 |
| fill-blank | 10 | 30 | -1 to -4 |
| speed | 10 + speed bonus (0-8) | 30 | -1 to -4 |
| listen-choose | 10 | 30 | -1 to -4 |
| conversation | 15 | 20 (4/4) | -1 to -4 |
| news-story | 15 | 20 (5/5) | -1 to -4 |
| accent | 10 + 5 new accent | 30 | -1 to -4 |
| note-taking | 20/key point | — | -1 to -4 |

### Event Bus — Listening events mới

```ts
'listening:hint_used'       → { mode, hintType, xpPenalty }
'listening:speed_round'     → { round, speed, correct }
'listening:conversation'    → { topic, questionsCorrect }
'listening:story'           → { topic, questionsCorrect }
'listening:accent'          → { accent, correct }
'listening:notes_scored'    → { matchedPoints, totalPoints }
```
