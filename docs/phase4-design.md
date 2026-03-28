# Phase 4 — New Features Design

> Author: Marcus (Tech Lead)
> Date: 2026-03-28
> Based on: `docs/v2-brainstorm-marcus.md`

---

## Mục lục

1. [Tổng quan & Implementation Order](#1-tổng-quan--implementation-order)
2. [Feature 1: Event Bus (mitt)](#2-event-bus-mitt)
3. [Feature 2: Data Export/Import](#3-data-exportimport)
4. [Feature 3: Daily Challenge / Word of the Day](#4-daily-challenge--word-of-the-day)
5. [Feature 4: Listening Practice (Mini Dictation)](#5-listening-practice-mini-dictation)
6. [Feature 5: Review Summary & Weak Words](#6-review-summary--weak-words)
7. [Feature 6: Pronunciation Check](#7-pronunciation-check-speech-recognition)
8. [Feature 7: Onboarding & Placement Test](#8-onboarding--placement-test)
9. [Data Model Changes (tổng hợp)](#9-data-model-changes-tổng-hợp)

---

## 1. Tổng quan & Implementation Order

### Batches

**Batch 1 (Core) — làm trước, theo đúng thứ tự:**

| # | Feature | Depends on | Effort |
|---|---------|------------|--------|
| 1 | Event Bus (mitt) | — | S |
| 2 | Data Export/Import | — | S |
| 3 | Daily Challenge | Event Bus | M |
| 4 | Listening Practice | Event Bus | M |

**Batch 2 (Enhancement) — làm sau khi Batch 1 xong:**

| # | Feature | Depends on | Effort |
|---|---------|------------|--------|
| 5 | Review Summary & Weak Words | — | S |
| 6 | Pronunciation Check | — | M |
| 7 | Onboarding & Placement Test | — | S |

### Lý do thứ tự
- **Event Bus phải làm đầu tiên** — Daily Challenge và Listening Practice cần dispatch events để XP/achievements tự động xử lý
- **Export/Import song song được** với Event Bus (không phụ thuộc nhau)
- Daily Challenge + Listening Practice dùng Event Bus nên đi sau

---

## 2. Event Bus (mitt)

### Mục đích
Thay thế cách gọi trực tiếp `xpEngine` + `achievementEngine` rải rác trong code. Mỗi feature mới chỉ cần `emit` event, không cần biết XP/achievement logic.

### Package
```bash
pnpm add mitt
```
`mitt` — ~200 bytes, zero deps, TypeScript native.

### File mới: `src/services/eventBus.ts`

```typescript
import mitt from 'mitt';

// Tất cả event types trong app
type AppEvents = {
  'flashcard:correct': { wordId: string; rating: 0 | 2 | 4 | 5 };
  'flashcard:incorrect': { wordId: string };
  'quiz:complete': { lessonId: string; correct: number; total: number };
  'lesson:complete': { lessonId: string };
  'word:learned': { wordId: string };          // word chuyển từ new → learning
  'word:mastered': { wordId: string };         // word chuyển sang mastered
  'daily_goal:met': {};
  'streak:updated': { current: number };
  // Phase 4 events
  'dictation:correct': { wordId: string; mode: DictationMode };
  'dictation:incorrect': { wordId: string; mode: DictationMode };
  'dictation:session_complete': { correct: number; total: number; mode: DictationMode };
  'daily_challenge:complete': { date: string; score: number };
  'pronunciation:correct': { wordId: string };
  'pronunciation:incorrect': { wordId: string };
};

export type DictationMode = 'word' | 'phrase' | 'sentence';

export const eventBus = mitt<AppEvents>();
```

### File mới: `src/services/eventSubscribers.ts`

Đăng ký tất cả side-effects ở 1 chỗ. Gọi `initEventSubscribers()` trong `App.tsx` (1 lần khi mount).

```typescript
import { eventBus } from './eventBus';
import { calculateXP, calculateStreakBonus, calculateQuizXP } from './xpEngine';
import { checkAchievements } from './achievementEngine';
// ... import stores, db

export function initEventSubscribers(): void {
  // XP subscriber
  eventBus.on('flashcard:correct', ({ rating }) => {
    const action = rating === 5 ? 'flashcard_easy' : rating === 2 ? 'flashcard_hard' : 'flashcard_correct';
    const xp = calculateXP(action);
    // update progressStore + dailyLog
  });

  eventBus.on('quiz:complete', ({ correct, total }) => {
    const { totalXP } = calculateQuizXP(correct, total);
    // update progressStore + dailyLog
  });

  eventBus.on('dictation:correct', () => {
    const xp = calculateXP('dictation_correct');  // new XP action
    // update progressStore + dailyLog
  });

  eventBus.on('daily_challenge:complete', () => {
    const xp = calculateXP('daily_challenge_complete');  // new XP action
    // update progressStore + dailyLog
  });

  // Achievement subscriber
  eventBus.on('*', () => {
    // Sau mỗi event bất kỳ, build AchievementContext rồi check
    // Nếu có badge mới → toast + save
  });
}
```

### Refactor cần làm

**Files phải sửa (thay direct calls → emit):**
- `src/features/vocabulary/hooks/useFlashcard.ts` (hoặc component xử lý flashcard rating)
- `src/features/grammar/hooks/useQuiz.ts` (hoặc component xử lý quiz submit)
- `src/hooks/useDaily.ts` (streak updated → emit)

**Pattern trước:**
```typescript
// Trong flashcard component
const xp = calculateXP('flashcard_correct');
await updateXP(xp);
const newBadges = checkAchievements(context);
```

**Pattern sau:**
```typescript
// Trong flashcard component
eventBus.emit('flashcard:correct', { wordId, rating });
// XP + achievement tự xử lý trong subscribers
```

### XP Values bổ sung — thêm vào `constants.ts`

```typescript
// Thêm vào XP_VALUES
dictation_correct: 10,
dictation_session_perfect: 30,
daily_challenge_complete: 50,
pronunciation_correct: 5,
```

---

## 3. Data Export/Import

### Component Structure

```
src/features/settings/
├── components/
│   ├── DataExportImport.tsx     ← NEW
│   └── ... (existing)
├── pages/
│   └── SettingsPage.tsx         ← thêm DataExportImport vào đây
```

### File mới: `src/services/dataPortService.ts`

```typescript
export interface ExportData {
  version: 1;
  exportedAt: string;               // ISO timestamp
  app: 'WordFlow';
  data: {
    userProfile: UserProfile;
    wordProgress: WordProgress[];
    grammarLessons: GrammarLesson[];
    dailyLogs: DailyLog[];
    dictionaryCache: DictionaryCache[];
  };
}

export async function exportAllData(): Promise<ExportData> {
  // 1. Query tất cả Dexie tables
  // 2. Build ExportData object
  // 3. Return (component sẽ JSON.stringify + download)
}

export async function importData(json: string): Promise<{
  success: boolean;
  stats: { words: number; lessons: number; logs: number };
  errors: string[];
}> {
  // 1. JSON.parse + validate schema (check version, required fields)
  // 2. Validate data types (wordId format, number ranges, enum values)
  // 3. Confirm dialog trước khi overwrite (handled in component)
  // 4. Clear existing data + bulk insert (transaction)
  // 5. Return stats
}
```

### Component: `DataExportImport.tsx`

```
┌─────────────────────────────────┐
│  📦 Data Management             │
│                                 │
│  [📥 Export Data]               │  ← Download wordflow-backup-2026-03-28.json
│                                 │
│  [📤 Import Data]               │  ← File picker (.json only)
│                                 │
│  ⚠️ Import sẽ thay thế toàn bộ │
│  dữ liệu hiện tại.             │
│                                 │
│  Last export: 2026-03-28 10:00  │
└─────────────────────────────────┘
```

**Export flow:**
1. Click "Export Data"
2. `exportAllData()` → JSON string
3. Create Blob → `URL.createObjectURL` → trigger download
4. Filename: `wordflow-backup-YYYY-MM-DD.json`

**Import flow:**
1. Click "Import Data" → `<input type="file" accept=".json">`
2. Read file → `importData(json)`
3. Nếu validate fail → hiện errors
4. Nếu OK → confirm dialog: "Thay thế X words, Y lessons. Tiếp tục?"
5. User confirm → thực hiện import trong Dexie transaction
6. Reload app state (re-init stores)

### Validation rules
- `version` phải = 1
- `app` phải = "WordFlow"
- `userProfile` phải có đủ required fields
- `wordProgress[].wordId` phải match format "topic:word"
- `wordProgress[].easeFactor` phải >= 1.3
- `dailyLogs[].date` phải match format YYYY-MM-DD
- Nếu có field thừa → ignore (forward compatible)

---

## 4. Daily Challenge / Word of the Day

### Concept
Mỗi ngày 1 mini-challenge gồm 3 tasks. Deterministic (cùng ngày = cùng challenge). Không cần backend.

### Data Model — thêm table mới

```typescript
// src/db/models.ts — NEW
export interface DailyChallengeLog {
  date: string;                    // "2026-03-28" — PK
  wordId: string;                  // Từ được chọn cho ngày đó
  tasks: {
    learnWord: boolean;            // Task 1: học từ mới
    grammarQuiz: boolean;          // Task 2: trả lời 1 câu grammar
    dictation: boolean;            // Task 3: nghe gõ lại 1 từ
  };
  completed: boolean;              // cả 3 tasks done
  xpEarned: number;
}
```

**DB migration — version 2:**
```typescript
db.version(2).stores({
  // ... existing tables giữ nguyên
  dailyChallenges: 'date',        // NEW
});
```

### Component Structure

```
src/features/daily-challenge/          ← NEW feature module
├── components/
│   ├── DailyChallengeCard.tsx         ← Widget trên Dashboard
│   ├── ChallengeTaskList.tsx          ← Danh sách 3 tasks + progress
│   ├── ChallengeWordTask.tsx          ← Task 1: learn word
│   ├── ChallengeGrammarTask.tsx       ← Task 2: grammar question
│   └── ChallengeDictationTask.tsx     ← Task 3: mini dictation
├── hooks/
│   └── useDailyChallenge.ts           ← Logic chọn challenge + track progress
└── pages/
    └── DailyChallengePage.tsx         ← Full page với 3 tasks
```

### Route mới
```
/daily-challenge              → DailyChallengePage
```

### Algorithm chọn challenge — `useDailyChallenge.ts`

```typescript
function getDailySeed(date: string): number {
  // Simple hash: date string → stable number
  let hash = 0;
  for (const char of date) {
    hash = ((hash << 5) - hash) + char.charCodeAt(0);
    hash |= 0;
  }
  return Math.abs(hash);
}

function selectDailyChallenge(date: string) {
  const seed = getDailySeed(date);
  const allWords = getAllWords();                  // from built-in JSON data
  const allGrammarExercises = getAllExercises();   // from built-in JSON data

  const word = allWords[seed % allWords.length];
  const exercise = allGrammarExercises[(seed * 7) % allGrammarExercises.length];
  // Task 3 (dictation): dùng cùng word đã chọn

  return { word, exercise, dictationWord: word };
}
```

### Dashboard integration
`DailyChallengeCard` hiển thị trên `DashboardPage`:
- Chưa làm: highlight nổi bật, CTA "Start Today's Challenge"
- Đang làm: progress bar (1/3, 2/3)
- Đã xong: ✅ "Completed!" + XP earned

### XP
- Mỗi task hoàn thành: 15 XP
- Cả 3 tasks: bonus 50 XP (total = 15×3 + 50 = 95 XP)
- Emit: `eventBus.emit('daily_challenge:complete', { date, score })`

---

## 5. Listening Practice (Mini Dictation)

### Concept
Nghe audio → gõ lại từ/câu. 3 modes: Word / Phrase / Sentence. Tái sử dụng data + audio hiện có.

### Data Model
Không cần table mới. Dùng `WordProgress` hiện có + `DailyLog.wordsReviewed` để track.

Thêm vào `DailyLog`:
```typescript
// Mở rộng DailyLog — thêm fields (optional, backward compatible)
export interface DailyLog {
  // ... existing fields
  dictationAttempts?: number;      // NEW
  dictationCorrect?: number;       // NEW
}
```

**Không cần migration** — Dexie cho phép thêm fields không indexed mà không cần version bump. Chỉ cần handle `undefined` khi đọc.

### Component Structure

```
src/features/listening/                ← NEW feature module
├── components/
│   ├── DictationPlayer.tsx            ← Audio playback + replay button
│   ├── DictationInput.tsx             ← Text input + submit
│   ├── DictationResult.tsx            ← Đúng/sai + IPA + meaning
│   ├── DictationModeSelector.tsx      ← Word / Phrase / Sentence tabs
│   └── DictationSessionSummary.tsx    ← End-of-session stats
├── hooks/
│   ├── useDictation.ts                ← Session logic (next word, check answer, scoring)
│   └── useDictationAudio.ts           ← Audio playback (reuse audioService)
└── pages/
    ├── ListeningPage.tsx              ← Mode selection + topic selection
    └── DictationSessionPage.tsx       ← Active dictation session
```

### Routes mới
```
/listening                    → ListeningPage (chọn mode + topic)
/listening/:topic/practice    → DictationSessionPage
```

### Navigation — thêm vào bottom nav
Bottom nav hiện có 4 items. Thêm "Listening" → 5 items:
```
Dashboard | Vocabulary | Listening | Grammar | Stats
   🏠    |    📖     |    🎧    |   📝   |  📊
```
> 5 items bottom nav vẫn OK trên mobile. Hoặc nếu muốn giữ 4, gộp Listening vào trong Vocabulary page dưới dạng tab.
> **Recommendation:** Giữ bottom nav 4 items, thêm Listening icon thay chỗ Stats. Stats chuyển vào Dashboard hoặc Settings.

**Quyết định cuối:** Giữ 5 items. Nếu trên mobile quá chật, Sam điều chỉnh icon size/label.

### Flow chi tiết

**1. ListeningPage — chọn mode:**
```
┌─────────────────────────────┐
│  🎧 Listening Practice       │
│                              │
│  ┌────────┬────────┬───────┐ │
│  │  Word  │ Phrase │ Sent. │ │  ← Mode tabs
│  └────────┴────────┴───────┘ │
│                              │
│  Select topic:               │
│  [🏠 Daily Life]   20 words │
│  [🍔 Food & Drink] 25 words │
│  [✈️ Travel]       22 words │
│  ...                         │
└─────────────────────────────┘
```

**2. DictationSessionPage — core loop:**
```
┌─────────────────────────────┐
│  Word 3 of 10       [✕ End] │
│                              │
│        🔊                    │  ← Tap to play audio
│   (tap to listen again)      │
│                              │
│  ┌──────────────────────┐    │
│  │ Type what you hear   │    │  ← Text input
│  └──────────────────────┘    │
│                              │
│  [Check Answer]              │
│                              │
│  ━━━━━━━━━━━━░░░░░░░░░░     │  ← Progress bar
└─────────────────────────────┘
```

**3. After answer:**
```
┌─────────────────────────────┐
│  ✅ Correct!                 │
│                              │
│  breakfast  /ˈbrek.fəst/    │
│  bữa sáng                   │
│                              │
│  🔊 (play again)            │
│                              │
│  [Next Word →]               │
└─────────────────────────────┘
```

Sai thì hiện:
```
│  ❌ Not quite                │
│                              │
│  You typed: "brekfast"       │
│  Correct:   "breakfast"      │
│  /ˈbrek.fəst/ — bữa sáng   │
```

### Answer checking — `useDictation.ts`

```typescript
function checkAnswer(input: string, target: string): boolean {
  // Normalize: lowercase, trim, remove extra spaces
  const normalized = input.toLowerCase().trim().replace(/\s+/g, ' ');
  const expected = target.toLowerCase().trim().replace(/\s+/g, ' ');
  return normalized === expected;
}
```
- Case-insensitive
- Trim whitespace
- **Không** dùng fuzzy match — dictation cần chính xác

### Modes

| Mode | Source data | Ví dụ |
|------|-----------|-------|
| Word | `Word.word` | "breakfast" |
| Phrase | Rút 2-3 từ từ `Word.example` | "every day" |
| Sentence | `Word.example` đầy đủ | "I have breakfast at 7 AM every day." |

**Phrase extraction:** Split example sentence → lấy chunk 2-3 từ chứa target word.
```typescript
function extractPhrase(example: string, targetWord: string): string {
  const words = example.replace(/[.,!?]/g, '').split(' ');
  const idx = words.findIndex(w => w.toLowerCase() === targetWord.toLowerCase());
  if (idx === -1) return targetWord; // fallback
  const start = Math.max(0, idx - 1);
  const end = Math.min(words.length, idx + 2);
  return words.slice(start, end).join(' ');
}
```

### Audio
Reuse `audioService.ts`:
1. Try Dictionary API audio URL (cached in `DictionaryCache`)
2. Fallback → `speechSynthesis.speak()` (Web Speech API)
3. For sentences: chỉ dùng Web Speech API (Dictionary API chỉ có audio cho single words)

### XP
- Correct answer: 10 XP (emit `dictation:correct`)
- Full session (10 words, all correct): bonus 30 XP (emit `dictation:session_complete`)

---

## 6. Review Summary & Weak Words

### Concept
Sau mỗi session (flashcard/quiz/dictation) → hiện summary. Highlight "weak words". CTA practice lại.

### Component Structure

```
src/features/vocabulary/components/
├── SessionSummary.tsx               ← NEW: end-of-session summary
├── WeakWordsList.tsx                ← NEW: weak words section
└── ... (existing)

src/features/grammar/components/
├── QuizSummary.tsx                  ← NEW: quiz-specific summary
└── ... (existing)

src/features/listening/components/
├── DictationSessionSummary.tsx      ← Already planned above
└── ...
```

### File mới: `src/services/weakWordsService.ts`

```typescript
export interface WeakWord {
  wordId: string;
  word: string;
  meaning: string;
  easeFactor: number;
  failCount: number;              // Số lần trả lời sai gần đây
  lastReview: number;
}

export async function getWeakWords(limit = 20): Promise<WeakWord[]> {
  // Query: WordProgress WHERE
  //   easeFactor < 2.0
  //   OR (status = 'learning' AND repetitions = 0 AND lastReview > 0)
  // ORDER BY easeFactor ASC
  // JOIN với Word data để lấy word + meaning
}

export async function getSessionSummary(sessionResults: SessionResult[]): {
  correct: number;
  incorrect: number;
  accuracy: number;
  xpEarned: number;
  timeSpent: number;
  weakWords: WeakWord[];
  newWordsLearned: number;
} {
  // Aggregate session results
}
```

### UI: SessionSummary.tsx
```
┌─────────────────────────────────┐
│  🎉 Session Complete!            │
│                                  │
│  ✅ 8/10 correct    ⏱ 3m 20s    │
│  📈 80% accuracy    ⭐ +120 XP   │
│                                  │
│  ── Weak Words ──────────────── │
│  ⚠️ breakfast  — bữa sáng       │
│  ⚠️ schedule   — lịch trình     │
│                                  │
│  [🔄 Practice Weak Words]       │
│  [🏠 Back to Dashboard]         │
└─────────────────────────────────┘
```

**"Practice Weak Words"** → mở flashcard session filter chỉ weak words. Truyền wordIds qua route state hoặc Zustand.

### Route
Không cần route mới. `SessionSummary` là overlay/modal hiện sau khi session kết thúc. Controlled by state trong hook.

---

## 7. Pronunciation Check (Speech Recognition)

### Concept
Thêm nút "🎤 Speak" trong flashcard. User đọc từ → SpeechRecognition API so sánh.

### Browser Support
- ✅ Chrome, Edge (tốt)
- ⚠️ Safari (partial, cần webkit prefix)
- ❌ Firefox (không hỗ trợ)
→ **Feature detection required.** Ẩn nút nếu browser không hỗ trợ.

### Component Structure

```
src/features/vocabulary/components/
├── PronunciationButton.tsx          ← NEW: 🎤 button + recording logic
├── PronunciationResult.tsx          ← NEW: feedback UI
└── ... (existing)

src/hooks/
├── useSpeechRecognition.ts          ← NEW: wrapper cho Web Speech Recognition API
└── ...
```

### Hook: `useSpeechRecognition.ts`

```typescript
export function useSpeechRecognition() {
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  function startListening(lang = 'en-US'): Promise<string> {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      recognition.onresult = (event) => {
        // Lấy tất cả alternatives, check xem có match target không
        const results = Array.from(event.results[0])
          .map(alt => alt.transcript.toLowerCase().trim());
        resolve(results[0]);  // Return best result
      };

      recognition.onerror = (event) => reject(event.error);
      recognition.start();

      // Auto-stop sau 5 giây
      setTimeout(() => recognition.stop(), 5000);
    });
  }

  return { isSupported, startListening };
}
```

### Matching logic

```typescript
function checkPronunciation(spoken: string, target: string): {
  isCorrect: boolean;
  spokenText: string;
} {
  const normalizedSpoken = spoken.toLowerCase().trim();
  const normalizedTarget = target.toLowerCase().trim();

  // Exact match hoặc check alternatives từ SpeechRecognition
  const isCorrect = normalizedSpoken === normalizedTarget;

  return { isCorrect, spokenText: spoken };
}
```

> **Lưu ý:** SpeechRecognition API trả `maxAlternatives` kết quả. Check TẤT CẢ alternatives xem có match target không — tăng accuracy đáng kể.

### UI trong Flashcard

Thêm `PronunciationButton` vào flashcard BACK side (sau khi flip):
```
┌──────────────────────┐
│  breakfast            │
│  /ˈbrek.fəst/        │
│  bữa sáng            │
│                       │
│  🔊 Listen   🎤 Speak │  ← Speak button chỉ hiện khi isSupported
│                       │
│  [Again] [Hard] [Good] [Easy]
└──────────────────────┘
```

Click 🎤 → recording indicator → result:
- ✅ "Great pronunciation!" 
- ❌ "Try again. You said: 'brekfest'"

### XP
- Pronunciation correct: 5 XP (bonus nhỏ, khuyến khích dùng nhưng không bắt buộc)
- Emit: `eventBus.emit('pronunciation:correct', { wordId })`

---

## 8. Onboarding & Placement Test

### Concept
User mới lần đầu mở app → mini quiz 10 câu → xác định A1 hay A2 → set CEFR filter.

### Data Model

Thêm vào `UserProfile`:
```typescript
export interface UserProfile {
  // ... existing fields
  placementDone?: boolean;           // NEW — đã làm placement test chưa
  placementLevel?: CEFRLevel;        // NEW — kết quả test
}
```

Không cần migration — thêm optional fields.

### Component Structure

```
src/features/onboarding/               ← NEW feature module
├── components/
│   ├── PlacementQuiz.tsx              ← 10 câu quiz
│   ├── PlacementResult.tsx            ← Hiện kết quả + level
│   └── WelcomeScreen.tsx              ← Intro screen
├── data/
│   └── placement-questions.ts         ← 10 câu hardcoded (5 A1, 5 A2)
└── pages/
    └── OnboardingPage.tsx             ← Full flow: Welcome → Quiz → Result
```

### Route
```
/onboarding                  → OnboardingPage
```

### Flow

```
App start → check userProfile.placementDone
  → false (hoặc undefined): redirect /onboarding
  → true: normal Dashboard
```

**OnboardingPage flow:**

```
Step 1: WelcomeScreen
┌─────────────────────────────┐
│  🎓 Welcome to WordFlow!    │
│                              │
│  Let's find your level.      │
│  Quick 10-question quiz.     │
│                              │
│  [Let's Go! →]               │
│  [Skip — I'll start at A1]  │
└─────────────────────────────┘

Step 2: PlacementQuiz (10 câu multiple choice)
┌─────────────────────────────┐
│  Question 3/10               │
│                              │
│  She ___ to work every day. │
│                              │
│  ○ go                        │
│  ● goes                      │
│  ○ going                     │
│  ○ gone                      │
│                              │
│  [Next →]                    │
│  ━━━━━━━━░░░░░░░░░░░░░      │
└─────────────────────────────┘

Step 3: PlacementResult
┌─────────────────────────────┐
│  📊 Your Level: A2           │
│                              │
│  Score: 7/10 (70%)           │
│                              │
│  Great! We'll focus on A2    │
│  content for you.            │
│                              │
│  [Start Learning →]          │
│  [Redo Test]                 │
└─────────────────────────────┘
```

### Scoring
```typescript
// placement-questions.ts
const QUESTIONS = [
  // 5 câu A1 (dễ)
  { question: "...", options: [...], answer: 1, level: "A1" },
  // 5 câu A2 (khó hơn)
  { question: "...", options: [...], answer: 2, level: "A2" },
];

function calculateLevel(correctCount: number): CEFRLevel {
  return correctCount >= 5 ? 'A2' : 'A1';
}
```

### Settings integration
- Settings page: "Redo Placement Test" button
- CEFR filter trong vocabulary: default theo `placementLevel`, user có thể override

---

## 9. Data Model Changes (tổng hợp)

### DB Migration Plan

**Version 2** (Phase 4):
```typescript
db.version(2).stores({
  // Existing — giữ nguyên
  words: 'id, topic, cefrLevel',
  wordProgress: 'wordId, nextReview, status',
  grammarLessons: 'id, level, completed',
  dailyLogs: 'date',
  userProfile: 'id',
  dictionaryCache: 'word, cachedAt',
  // NEW
  dailyChallenges: 'date',
});
```

### New interfaces

```typescript
// Thêm vào src/db/models.ts

export interface DailyChallengeLog {
  date: string;
  wordId: string;
  tasks: {
    learnWord: boolean;
    grammarQuiz: boolean;
    dictation: boolean;
  };
  completed: boolean;
  xpEarned: number;
}
```

### Modified interfaces

```typescript
// UserProfile — thêm optional fields
export interface UserProfile {
  // ... existing
  placementDone?: boolean;
  placementLevel?: CEFRLevel;
}

// DailyLog — thêm optional fields
export interface DailyLog {
  // ... existing
  dictationAttempts?: number;
  dictationCorrect?: number;
}
```

### New types — thêm vào `src/lib/types.ts`

```typescript
export type DictationMode = 'word' | 'phrase' | 'sentence';

export interface SessionResult {
  wordId: string;
  correct: boolean;
  timeMs: number;
  userAnswer?: string;
}

export interface PlacementQuestion {
  question: string;
  options: string[];
  answer: number;
  level: CEFRLevel;
}
```

### New XP actions — thêm vào `xpEngine.ts`

```typescript
export type XPAction =
  | 'flashcard_correct'
  | 'flashcard_easy'
  | 'flashcard_hard'
  | 'quiz_correct'
  | 'quiz_perfect_score'
  | 'lesson_complete'
  | 'daily_goal_met'
  // Phase 4 NEW
  | 'dictation_correct'
  | 'dictation_session_perfect'
  | 'daily_challenge_complete'
  | 'pronunciation_correct';
```

### New achievements — thêm vào `achievements.json`

```json
[
  { "id": "dictation_10", "badge": "🎧", "title": "Keen Ear", "description": "Complete 10 dictation exercises", "condition": { "type": "dictationCount", "value": 10 } },
  { "id": "dictation_50", "badge": "🎵", "title": "Sound Master", "description": "Complete 50 dictation exercises", "condition": { "type": "dictationCount", "value": 50 } },
  { "id": "daily_challenge_7", "badge": "🏆", "title": "Weekly Champion", "description": "Complete 7 daily challenges", "condition": { "type": "challengeCount", "value": 7 } },
  { "id": "daily_challenge_30", "badge": "👑", "title": "Monthly Champion", "description": "Complete 30 daily challenges", "condition": { "type": "challengeCount", "value": 30 } },
  { "id": "pronunciation_10", "badge": "🗣️", "title": "Voice Learner", "description": "Practice pronunciation 10 times", "condition": { "type": "pronunciationCount", "value": 10 } }
]
```

→ Cần mở rộng `AchievementContext` và `checkAchievements` để handle new condition types.

---

## Summary cho Sam

**Tổng files mới cần tạo:** ~20 files
**Files cần sửa:** ~10 files
**Package mới:** `mitt` (1 package)
**DB migration:** Version 1 → 2 (thêm 1 table)

**Thứ tự code:**
1. `mitt` + `eventBus.ts` + `eventSubscribers.ts` → refactor existing calls
2. `dataPortService.ts` + `DataExportImport.tsx` (trong Settings)
3. `features/daily-challenge/` (full module)
4. `features/listening/` (full module) + bottom nav update
5. `SessionSummary` + `WeakWordsList` + `weakWordsService.ts`
6. `useSpeechRecognition` + `PronunciationButton` (trong flashcard)
7. `features/onboarding/` (full module) + routing guard
