# Sub-Phase C: Reading Comprehension — Implementation Guide

**Author:** Marcus (Tech Lead)
**Date:** 2026-03-28
**Ref:** `docs/design-phase5-features.md` Section "Sub-Phase C"

---

## Tổng quan

Feature mới hoàn toàn: đoạn văn ngắn theo CEFR level + câu hỏi comprehension. Content hardcoded (24 passages).

---

## 1. File Structure

```
src/features/reading/
├── data/
│   └── passages.ts                  # Hardcoded 24 passages
├── pages/
│   ├── ReadingPage.tsx              # Passage list, filter by level
│   └── ReadingSessionPage.tsx       # Read + answer questions
├── components/
│   ├── PassageCard.tsx              # Preview card in list
│   ├── PassageReader.tsx            # Full text + highlighted vocab
│   ├── ComprehensionQuiz.tsx        # Questions after reading
│   ├── VocabPopup.tsx              # Tap-to-define popup for highlighted words
│   └── ReadingSummary.tsx           # Score + review
└── hooks/
    └── useReadingSession.ts         # Session state management
```

---

## 2. Data Format

```typescript
// src/features/reading/data/passages.ts

export interface ReadingQuestion {
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  question: string;
  options?: string[];          // For MC (4 options)
  answer: number | boolean | string;  // MC: index, TF: bool, fill: string
  explanation: string;
}

export interface ReadingPassage {
  id: string;                  // e.g. "a1-daily-routine"
  title: string;
  level: CEFRLevel;
  topic: string;               // Match ALL_TOPICS topic key
  text: string;                // 80-350 words depending on level
  wordCount: number;
  highlightedWords: string[];  // Vocab words to highlight (from ALL_TOPICS)
  questions: ReadingQuestion[];
}

export const READING_PASSAGES: ReadingPassage[] = [
  // 6 per level × 4 levels = 24 passages
  // A1: 80-120 words, 4 questions each
  // A2: 120-180 words, 4 questions each
  // B1: 180-250 words, 5 questions each
  // B2: 250-350 words, 5 questions each
];
```

### Content Generation

Sam dùng Claude Code để generate 24 passages. **Requirements:**
- Mỗi passage liên quan đến 1 topic trong `ALL_TOPICS`
- `highlightedWords` phải match actual words trong topic data
- Questions mix: 2 MC + 1 TF + 1 fill-blank (A1/A2), 2 MC + 2 TF + 1 fill-blank (B1/B2)
- Văn phong phù hợp CEFR level (A1 = simple present, short sentences; B2 = complex structures)
- Nội dung tự nhiên, không quá academic

### Suggested Topic Distribution

| Level | Topics |
|-------|--------|
| A1 | daily-life, family, food-drink, shopping, home, clothing |
| A2 | travel, education, sports, entertainment, transportation, communication |
| B1 | technology, health, work, nature, time-numbers, emotions |
| B2 | business, environment, education (advanced), technology (advanced), health (advanced), communication (advanced) |

---

## 3. Pages

### 3.1 `ReadingPage.tsx` — Passage List

**Layout:**
- Header: "Reading" + BookOpenText icon
- Level filter: pill buttons (All / A1 / A2 / B1 / B2) — similar to `DictationModeSelector` style
- Grid of `PassageCard` components

**Filter logic:**
```typescript
const [levelFilter, setLevelFilter] = useState<CEFRLevel | 'all'>('all');
const filtered = levelFilter === 'all'
  ? READING_PASSAGES
  : READING_PASSAGES.filter(p => p.level === levelFilter);
```

### 3.2 `ReadingSessionPage.tsx` — Read + Quiz

**2-phase UI:**
1. **Reading phase:** Show `PassageReader` + "Start Quiz" button at bottom
2. **Quiz phase:** Show `ComprehensionQuiz` (one question at a time)
3. **Summary phase:** Show `ReadingSummary`

```typescript
type SessionPhase = 'reading' | 'quiz' | 'summary';
```

---

## 4. Components

### 4.1 `PassageCard.tsx`

```typescript
interface Props {
  passage: ReadingPassage;
}
```

- Card with: title, level badge, topic icon, word count, question count
- Click → navigate to `/reading/${passage.id}`
- Style: giống topic cards trong `ListeningPage`

### 4.2 `PassageReader.tsx`

```typescript
interface Props {
  passage: ReadingPassage;
  onStartQuiz: () => void;
}
```

- Render `passage.text` as paragraphs (split on `\n\n`)
- Words in `highlightedWords[]`: render with underline + indigo color
- Tap highlighted word → show `VocabPopup`
- "Start Quiz" button at bottom (sticky hoặc end of text)

**Highlight logic:**
```typescript
// Split text into tokens, check each against highlightedWords (case-insensitive)
// Wrap matching tokens in <button> with onClick
function renderHighlightedText(text: string, words: string[], onWordTap: (word: string) => void) {
  // Split by word boundaries, preserve punctuation
  // Match whole words only (not substrings)
}
```

### 4.3 `VocabPopup.tsx`

```typescript
interface Props {
  word: string;
  onClose: () => void;
}
```

- Floating popup (absolute positioned near tapped word hoặc bottom sheet mobile)
- Show: word, IPA, meaning (lookup from `ALL_TOPICS` data)
- Play audio button (reuse `useDictationAudio`)
- Tap outside → close

**Simple approach:** Bottom popup (fixed bottom), animated slide up. Đừng overcomplicate positioning.

### 4.4 `ComprehensionQuiz.tsx`

```typescript
interface Props {
  questions: ReadingQuestion[];
  onComplete: (results: Array<{ correct: boolean; userAnswer: string }>) => void;
}
```

- One question at a time, progress bar
- **MC questions:** Reuse pattern từ `ListeningQuiz` (4 option buttons, A/B/C/D labels)
  - KHÔNG reuse grammar `MultipleChoice` component (nó có submit button riêng, khác UX)
  - Copy pattern: tap to select + instant feedback
- **True/False:** 2 buttons (True / False), same instant feedback pattern
- **Fill blank:** Text input + submit button, case-insensitive compare
- After answering: show explanation, "Next" button (hoặc auto-advance cho correct)

### 4.5 `ReadingSummary.tsx`

```typescript
interface Props {
  passage: ReadingPassage;
  results: Array<{ correct: boolean; questionIndex: number }>;
  onBack: () => void;
  onRetry: () => void;
}
```

- Score: X/Y correct, accuracy %, XP earned
- Review incorrect: show question + correct answer + explanation
- "Back to Reading" + "Try Again" buttons
- Reuse styling pattern từ `DictationSessionSummary`

---

## 5. Hook: `useReadingSession.ts`

```typescript
interface UseReadingSession {
  phase: SessionPhase;
  passage: ReadingPassage | null;
  currentQuestionIndex: number;
  results: Array<{ correct: boolean; userAnswer: string }>;
  correctCount: number;
  xpEarned: number;
  startQuiz: () => void;
  submitAnswer: (correct: boolean, userAnswer: string) => void;
  nextQuestion: () => void;
}
```

- XP: 10 per correct answer + 20 bonus perfect score
- Emit events: `reading:correct`, `reading:incorrect`, `reading:session_complete`

**EventBus updates:**
Add to `eventBus.ts` AppEvents:
```typescript
'reading:correct': { passageId: string };
'reading:incorrect': { passageId: string };
'reading:session_complete': { correct: number; total: number; passageId: string };
```

---

## 6. Routing

Thêm vào `src/routes/index.tsx`:
```typescript
const ReadingPage = lazy(() => import('../features/reading/pages/ReadingPage').then(m => ({ default: m.ReadingPage })));
const ReadingSessionPage = lazy(() => import('../features/reading/pages/ReadingSessionPage').then(m => ({ default: m.ReadingSessionPage })));

// In children:
{ path: 'reading', element: withSuspense(ReadingPage) },
{ path: 'reading/:passageId', element: withSuspense(ReadingSessionPage) },
```

---

## 7. Navigation

Thêm "Reading" vào:
- **BottomNav:** `{ to: '/reading', label: 'Read', icon: BookOpenText }` — thêm sau "Listen"
- **Sidebar:** `{ to: '/reading', label: 'Reading', icon: BookOpenText }` — thêm sau Vocabulary

Import `BookOpenText` từ `lucide-react`.

⚠️ **BottomNav đang có 5 items** (Home, Vocab, Listen, Grammar, Badges). Thêm Reading = 6. Options:
- **Option A:** Replace "Badges" trong BottomNav (achievements accessible từ Stats/Settings)
- **Option B:** Group "Listen" + "Read" under "Practice" — nhưng cần rework
- **Recommend Option A** — đơn giản nhất. Sidebar vẫn giữ full list.

---

## 8. DailyLog Update (Optional)

Có thể thêm field vào DailyLog:
```typescript
readingCompleted?: number;  // passages completed today
```

Nhưng **skip cho MVP** — không thêm DB migration. Chỉ track qua eventBus + XP.

---

## 9. Reuse Checklist

- ✅ Card styling từ `ListeningPage` topic cards
- ✅ `Badge` component cho CEFR level
- ✅ `TOPIC_ICONS`, `TOPIC_COLORS` constants
- ✅ `useDictationAudio` cho audio playback trong VocabPopup
- ✅ `ALL_TOPICS` data cho word lookup
- ✅ Lottie animations (correct/wrong)
- ✅ `motion` from framer-motion cho transitions
- ❌ KHÔNG reuse grammar `MultipleChoice` (khác UX pattern)

---

## 10. Tests

- `useReadingSession` hook: phase transitions, scoring, XP calculation
- Passage data validation: all passages have required fields, questions have valid answers
- Highlight logic: words correctly identified in text

Estimate: 8-12 test cases.

---

## Summary cho Sam

1. **Generate 24 passages** dùng Claude Code — đây là phần tốn thời gian nhất
2. Tạo feature folder `src/features/reading/` với 5 components + 1 hook + 2 pages
3. Highlighted words: tap-to-define popup (bottom sheet style)
4. Quiz: instant feedback (tap to answer), KHÔNG dùng grammar MultipleChoice
5. Routes: `/reading` + `/reading/:passageId`
6. Navigation: thêm vào BottomNav (replace Badges) + Sidebar
7. EventBus: thêm `reading:correct/incorrect/session_complete`
8. Unit tests cho hook + passage data validation
