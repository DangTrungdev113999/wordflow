# Phase 11: Grammar Upgrade — Technical Design

**Designer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Brief:** Trung feedback — grammar đang toàn chữ, data tĩnh, khó đọc, cần pro hơn

---

## Tổng quan

Nâng cấp Grammar từ text-based thành visual + interactive. Giữ backward compat với 20 lessons hiện tại, mở rộng data model, thêm 7 features mới.

**Nguyên tắc:**
- Không breaking change — lessons cũ vẫn render, enrich dần
- Reuse libraries có sẵn: framer-motion, @dnd-kit, lottie-react, recharts, lucide-react
- Mobile-first, dark mode support
- Chia 3 batches để Sam code tuần tự

---

## Batch 1: Data Model + Visual Theory (P11-1)

### 1.1 Enhanced Data Model

Mở rộng `TheorySection` — backward compat (fields mới đều optional):

```ts
// src/lib/types.ts — UPDATE

interface SentencePart {
  text: string;
  role: 'subject' | 'verb' | 'object' | 'time' | 'auxiliary' | 'complement' | 'connector';
  tooltip?: string;  // giải thích khi tap
}

interface ColoredExample {
  parts: SentencePart[];
  vi: string;
  audio?: string;  // future: TTS
}

interface VerbConjugation {
  pronoun: string;          // "I", "You", "He/She/It", "We", "They"
  affirmative: string;      // "work", "works"
  negative: string;         // "don't work", "doesn't work"
  question: string;         // "Do I work?", "Does he work?"
  highlight?: 'base' | 'third-person' | 'irregular';
}

interface ConjugationTable {
  verb: string;             // base form: "work", "go", "be"
  tense: string;            // "Present Simple", "Past Simple"
  rows: VerbConjugation[];
  notes?: string;           // "Thêm -es sau o, s, x, z, ch, sh"
}

interface BeforeAfter {
  wrong: string;            // "He don't like pizza."
  correct: string;          // "He doesn't like pizza."
  wrongHighlight: number[]; // word indices sai: [1]
  correctHighlight: number[]; // word indices sửa: [1]
  explanation: string;      // "Dùng doesn't cho ngôi 3 số ít"
}

interface TheoryStep {
  title: string;
  content: string;          // markdown bold
  examples?: Array<{ en: string; vi: string }>;
  coloredExamples?: ColoredExample[];
  conjugation?: ConjugationTable;
  beforeAfter?: BeforeAfter[];
  visualType?: 'timeline' | 'diagram' | 'comparison';
  visualData?: Record<string, unknown>;  // flexible cho từng loại visual
}

// UPDATED TheorySection — backward compat
interface TheorySection {
  heading: string;
  content: string;
  examples: Array<{ en: string; vi: string }>;
  // NEW optional fields:
  coloredExamples?: ColoredExample[];
  conjugation?: ConjugationTable;
  beforeAfter?: BeforeAfter[];
  steps?: TheoryStep[];     // step-by-step breakdown
}

// Cheat sheet — mỗi lesson 1 cái
interface CheatSheet {
  title: string;
  formula: string;          // "S + V(s/es)", "S + did + not + V"
  keyPoints: string[];      // bullet points ngắn
  signalWords: string[];    // "always", "every day", etc.
  commonMistakes: string[]; // "He don't → He doesn't"
}

// UPDATED GrammarLessonData
interface GrammarLessonData {
  id: string;
  title: string;
  level: CEFRLevel;
  theory: { sections: TheorySection[] };
  exercises: GrammarExercise[];
  // NEW:
  cheatSheet?: CheatSheet;
}
```

### 1.2 Color System

Role-based color palette, consistent across app:

```ts
// src/features/grammar/constants/colors.ts — MỚI

export const ROLE_COLORS = {
  subject:    { bg: 'bg-blue-100 dark:bg-blue-900/40',    text: 'text-blue-700 dark:text-blue-300',    border: 'border-blue-300 dark:border-blue-700',    dot: '🔵' },
  verb:       { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700', dot: '🟠' },
  object:     { bg: 'bg-green-100 dark:bg-green-900/40',   text: 'text-green-700 dark:text-green-300',   border: 'border-green-300 dark:border-green-700',   dot: '🟢' },
  time:       { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700', dot: '🟣' },
  auxiliary:  { bg: 'bg-pink-100 dark:bg-pink-900/40',     text: 'text-pink-700 dark:text-pink-300',     border: 'border-pink-300 dark:border-pink-700',     dot: '🩷' },
  complement: { bg: 'bg-teal-100 dark:bg-teal-900/40',     text: 'text-teal-700 dark:text-teal-300',     border: 'border-teal-300 dark:border-teal-700',     dot: '🩵' },
  connector:  { bg: 'bg-gray-100 dark:bg-gray-800',        text: 'text-gray-600 dark:text-gray-400',     border: 'border-gray-300 dark:border-gray-700',     dot: '⚪' },
} as const;

export const ROLE_LABELS: Record<string, string> = {
  subject: 'Chủ ngữ',
  verb: 'Động từ',
  object: 'Tân ngữ',
  time: 'Thời gian',
  auxiliary: 'Trợ động từ',
  complement: 'Bổ ngữ',
  connector: 'Liên từ',
};
```

### 1.3 Visual Components

#### ColoredSentence.tsx — MỚI
```ts
// src/features/grammar/components/ColoredSentence.tsx

interface ColoredSentenceProps {
  parts: SentencePart[];
  vi?: string;
  interactive?: boolean;  // tap to see tooltip
  size?: 'sm' | 'md' | 'lg';
}

// Render:
// [She]🔵 [works]🟠 [at the office]🟢 [every day]🟣
// Mỗi part = rounded pill với bg color theo role
// Tap vào part → AnimatePresence tooltip hiện giải thích
// Legend nhỏ ở dưới (hideable)
```

#### ConjugationGrid.tsx — MỚI
```ts
// src/features/grammar/components/ConjugationGrid.tsx

interface ConjugationGridProps {
  table: ConjugationTable;
  highlightMode?: 'changes' | 'all';  // highlight chỗ khác biệt
}

// Render:
// ┌──────────┬────────────┬──────────────┬────────────────┐
// │ Pronoun  │ ✅ Khẳng định │ ❌ Phủ định   │ ❓ Nghi vấn     │
// ├──────────┼────────────┼──────────────┼────────────────┤
// │ I        │ work       │ don't work   │ Do I work?     │
// │ He/She   │ work**s**  │ doesn'**t**  │ **Does** he?   │
// └──────────┴────────────┴──────────────┴────────────────┘
//
// - Header row: emoji + Vietnamese label
// - highlight='changes': bold+color phần khác biệt (s, es, doesn't vs don't)
// - Row cho He/She/It có bg khác (highlight third-person)
// - Mobile: horizontal scroll hoặc stack layout
// - Notes hiển thị dưới bảng (nếu có)
// - Framer-motion stagger animation cho rows
```

Mobile layout (< 640px): Stack thành cards thay vì table:
```
┌─ I ─────────────────────┐
│ ✅ work                  │
│ ❌ don't work            │
│ ❓ Do I work?            │
└─────────────────────────┘
┌─ He/She/It ─────────────┐  ← highlighted bg
│ ✅ works                 │
│ ❌ doesn't work          │
│ ❓ Does he work?         │
└─────────────────────────┘
```

#### BeforeAfterCard.tsx — MỚI
```ts
// src/features/grammar/components/BeforeAfterCard.tsx

interface BeforeAfterCardProps {
  items: BeforeAfter[];
  animate?: boolean;
}

// Render side-by-side:
// ┌─ ❌ Sai ──────────┐  ┌─ ✅ Đúng ─────────┐
// │ He [don't] like   │  │ He [doesn't] like │
// │ pizza.             │  │ pizza.             │
// └───────────────────┘  └───────────────────┘
// 💡 Dùng doesn't cho ngôi 3 số ít
//
// - wrongHighlight/correctHighlight → word tại index đó có bg-red/bg-green
// - Mobile: stack vertical (sai trên, đúng dưới)
// - Framer-motion: wrong slides in first, then correct appears
// - Swipeable nếu nhiều items (framer-motion drag)
```

#### StepByStep.tsx — MỚI
```ts
// src/features/grammar/components/StepByStep.tsx

interface StepByStepProps {
  steps: TheoryStep[];
  lessonId: string;
}

// Render:
// Swipeable horizontal carousel (framer-motion drag + snap)
// Mỗi step = 1 card full-width:
//   - Step indicator: ●●○○ (dots) + "Bước 2/4"
//   - Title (bold)
//   - Content (renderBold)
//   - Nested components nếu có: ColoredSentence, ConjugationGrid, BeforeAfterCard
//   - Navigation: swipe hoặc arrow buttons
//
// Progress bar ở trên
// Auto-save step position vào localStorage
```

### 1.4 Cheat Sheet

```ts
// src/features/grammar/components/CheatSheetCard.tsx — MỚI

interface CheatSheetCardProps {
  sheet: CheatSheet;
  lessonId: string;
  onBookmark?: () => void;
}

// Render compact card:
// ┌─ 📝 Cheat Sheet ─────────────────┐
// │ Present Simple                    │
// │                                   │
// │ 📐 S + V(s/es)                   │
// │                                   │
// │ ✅ always, every day, usually     │
// │                                   │
// │ ⚠️ He don't → He doesn't         │
// │                                   │
// │ [🔖 Lưu]  [📤 Chia sẻ]          │
// └───────────────────────────────────┘
//
// Bookmark → save vào Dexie grammarBookmarks table
// Share → Web Share API (hoặc copy text)
// Hiện ở cuối LessonPage, trước nút Start Quiz
```

Dexie table cho bookmarks:
```ts
// src/db/database.ts — UPDATE
// Thêm table: grammarBookmarks: '&lessonId, createdAt'

interface GrammarBookmark {
  lessonId: string;
  createdAt: number;
}
```

Route cho bookmarks collection:
```
/grammar/bookmarks → BookmarkedSheetsPage.tsx
```

### 1.5 Updated LessonPage Layout

```
┌─────────────────────────────────┐
│ ← Present Simple     A1 badge  │
│    Best: 80% · 3 attempts      │
├─────────────────────────────────┤
│                                 │
│ [Step-by-Step nếu có steps]    │
│    Swipeable cards              │
│                                 │
│ — HOẶC —                       │
│                                 │
│ [Theory sections cũ]           │
│    + ColoredSentence            │
│    + ConjugationGrid            │
│    + BeforeAfterCard            │
│                                 │
├─────────────────────────────────┤
│ 📝 Cheat Sheet card            │
├─────────────────────────────────┤
│ [▶ Start Quiz (10 questions)]  │
└─────────────────────────────────┘
```

Logic: Nếu section có `steps` → render StepByStep. Nếu không → render theory sections cũ (backward compat) nhưng enrich với ColoredSentence/ConjugationGrid/BeforeAfterCard nếu data có.

### 1.6 Enrich 4 Lessons Đầu Tiên

Enrich data JSON cho 4 lessons phổ biến nhất (thêm coloredExamples, conjugation, beforeAfter, cheatSheet, steps):

1. `present-simple.json` — conjugation table + steps
2. `past-simple.json` — conjugation (regular + irregular) + timeline visual
3. `articles.json` — before/after + colored examples
4. `present-continuous.json` — conjugation + comparison với present simple

Format: thêm fields mới vào JSON file hiện có, KHÔNG xóa data cũ.

### 1.7 Files Summary — Batch 1

| File | Action | Description |
|------|--------|-------------|
| `src/lib/types.ts` | UPDATE | Thêm SentencePart, ColoredExample, VerbConjugation, ConjugationTable, BeforeAfter, TheoryStep, CheatSheet |
| `src/features/grammar/constants/colors.ts` | MỚI | ROLE_COLORS, ROLE_LABELS |
| `src/features/grammar/components/ColoredSentence.tsx` | MỚI | Color-coded sentence với tooltips |
| `src/features/grammar/components/ConjugationGrid.tsx` | MỚI | Bảng chia động từ visual |
| `src/features/grammar/components/BeforeAfterCard.tsx` | MỚI | Sai vs Đúng side-by-side |
| `src/features/grammar/components/StepByStep.tsx` | MỚI | Swipeable step carousel |
| `src/features/grammar/components/CheatSheetCard.tsx` | MỚI | Summary card + bookmark |
| `src/features/grammar/pages/LessonPage.tsx` | UPDATE | Integrate visual components |
| `src/features/grammar/pages/BookmarkedSheetsPage.tsx` | MỚI | Bookmarks collection page |
| `src/db/database.ts` | UPDATE | grammarBookmarks table |
| `src/db/models.ts` | UPDATE | GrammarBookmark interface |
| `src/routes/index.tsx` | UPDATE | /grammar/bookmarks route |
| `src/data/grammar/present-simple.json` | UPDATE | Enrich data |
| `src/data/grammar/past-simple.json` | UPDATE | Enrich data |
| `src/data/grammar/articles.json` | UPDATE | Enrich data |
| `src/data/grammar/present-continuous.json` | UPDATE | Enrich data |

---

## Batch 2: Interactive Examples + Enhanced Quiz (P11-2)

### 2.1 Interactive Sentence Explorer

Upgrade ColoredSentence để interactive hơn:

```ts
// src/features/grammar/components/SentenceExplorer.tsx — MỚI

interface SentenceExplorerProps {
  parts: SentencePart[];
  vi: string;
  mode: 'explore' | 'quiz';  // explore = tap xem, quiz = tap chọn role
}

// Mode explore:
// Tap vào part → expand panel bên dưới:
//   - Role label (Chủ ngữ, Động từ...)
//   - Tooltip explanation
//   - Color legend
//   - AnimatePresence slide down
//
// Mode quiz:
// Hiện câu không color → user tap từng part chọn role
// → đúng thì tô màu, sai thì shake animation
// → hoàn thành khi tô hết → celebration
```

### 2.2 New Exercise Types

Thêm 2 exercise types mới cho grammar:

```ts
// src/lib/types.ts — UPDATE

interface RoleIdentifyExercise {
  type: 'role_identify';
  sentence: string;
  words: string[];           // split sentence thành words
  roles: string[];           // đáp án role cho mỗi word: ['subject', 'verb', 'object', ...]
  // User tap từng word → chọn role từ palette
}

interface TransformExercise {
  type: 'transform';
  instruction: string;       // "Chuyển sang phủ định", "Chuyển sang nghi vấn"
  original: string;          // "She works every day."
  answer: string[];          // ["She doesn't work every day.", "She does not work every day."]
  hints?: string[];          // ["Dùng doesn't cho ngôi 3"]
}

type GrammarExercise = MultipleChoiceExercise | FillBlankExercise
  | ErrorCorrectionExercise | SentenceOrderExercise
  | RoleIdentifyExercise | TransformExercise;
```

### 2.3 Exercise Components

```ts
// src/features/grammar/components/RoleIdentify.tsx — MỚI
// Render câu → user tap word → chọn role từ color palette
// Visual: words as chips, tap → popup role picker
// Correct → word nhận color, incorrect → shake + retry
// Score: % words identified correctly on first try

// src/features/grammar/components/TransformExercise.tsx — MỚI
// Show original sentence + instruction
// User type transformed sentence (input)
// Hints toggle (show/hide)
// Accept multiple valid answers
// Show diff highlight khi sai (original vs user input)
```

### 2.4 Enrich 4 Lessons Tiếp Theo

Thêm exercises mới (role_identify, transform) + coloredExamples cho:

5. `prepositions-place.json`
6. `prepositions-time.json`
7. `possessives.json`
8. `countable-uncountable.json`

### 2.5 Files Summary — Batch 2

| File | Action | Description |
|------|--------|-------------|
| `src/lib/types.ts` | UPDATE | RoleIdentifyExercise, TransformExercise |
| `src/features/grammar/components/SentenceExplorer.tsx` | MỚI | Interactive explore/quiz mode |
| `src/features/grammar/components/RoleIdentify.tsx` | MỚI | Role identification exercise |
| `src/features/grammar/components/TransformExercise.tsx` | MỚI | Sentence transformation exercise |
| `src/features/grammar/components/QuizRenderer.tsx` | UPDATE | Handle 2 types mới |
| `src/stores/grammarStore.ts` | UPDATE | Handle 2 exercise types mới |
| `src/data/grammar/*.json` (4 files) | UPDATE | Enrich data |

---

## Batch 3: Visual Infographics + Polish (P11-3)

### 3.1 Tense Timeline

```ts
// src/features/grammar/components/TenseTimeline.tsx — MỚI

interface TenseTimelineProps {
  tense: string;
  markers: Array<{
    position: 'past' | 'present' | 'future';
    label: string;
    type: 'point' | 'range' | 'repeated';
  }>;
  example?: ColoredExample;
}

// Render SVG/CSS timeline:
//
//   Past ─────────── Now ─────────── Future
//                     ↓
//            [repeated action dots]
//           "She works every day"
//
// Cho mỗi tense, visual khác nhau:
// - Present Simple: repeated dots quanh "Now"
// - Past Simple: single point trước "Now"
// - Present Continuous: range bar tại "Now"
// - Future Simple: point sau "Now"
// - Present Perfect: range từ Past đến Now
//
// Framer-motion animate markers khi appear
// Tap vào marker → tooltip giải thích
```

### 3.2 Grammar Visual Cards

```ts
// src/features/grammar/components/GrammarVisual.tsx — MỚI

interface GrammarVisualProps {
  type: 'timeline' | 'diagram' | 'comparison' | 'formula';
  data: Record<string, unknown>;
}

// Dispatcher component — render visual phù hợp:
// - timeline → TenseTimeline
// - diagram → StructureDiagram (tree-like sentence structure)
// - comparison → ComparisonTable (2 tenses side-by-side)
// - formula → FormulaCard (S + V + O pattern, animated)

// ComparisonTable.tsx — MỚI
// Side-by-side 2 tenses:
// ┌─ Present Simple ──┬─ Present Continuous ─┐
// │ S + V(s/es)       │ S + am/is/are + Ving │
// │ habits, facts     │ happening now         │
// │ She works         │ She is working        │
// └───────────────────┴──────────────────────┘

// FormulaCard.tsx — MỚI
// Animated formula builder:
// [S] + [V(s/es)] → appears step by step
// Tap each part → color + expand
```

### 3.3 Grammar Progress Dashboard

```ts
// src/features/grammar/components/GrammarDashboard.tsx — MỚI

// Hiện trên GrammarPage (thay header đơn giản):
// - Recharts: completion % by level (A1, A2)
// - Streak/recent activity
// - Weak areas (low-score lessons)
// - Total bookmarked cheat sheets
// - "Continue" button → last incomplete lesson
```

### 3.4 Enrich 12 Lessons Còn Lại

Thêm visual data cho tất cả lessons chưa enrich:
- `there-is-are`, `imperative`, `conjunctions`, `question-words`, `wh-questions`, `adverbs-frequency`
- `comparatives`, `modals`, `future-simple`, `past-continuous`, `present-perfect`, `conditionals-zero`

Mỗi lesson ít nhất có: cheatSheet + 2 coloredExamples + beforeAfter.
Tense lessons thêm: conjugation + timeline visual.

### 3.5 Files Summary — Batch 3

| File | Action | Description |
|------|--------|-------------|
| `src/features/grammar/components/TenseTimeline.tsx` | MỚI | SVG/CSS timeline visual |
| `src/features/grammar/components/GrammarVisual.tsx` | MỚI | Visual dispatcher |
| `src/features/grammar/components/ComparisonTable.tsx` | MỚI | 2 tenses side-by-side |
| `src/features/grammar/components/FormulaCard.tsx` | MỚI | Animated formula builder |
| `src/features/grammar/components/GrammarDashboard.tsx` | MỚI | Progress dashboard |
| `src/features/grammar/pages/GrammarPage.tsx` | UPDATE | Integrate dashboard |
| `src/data/grammar/*.json` (12 files) | UPDATE | Enrich data |

---

## Implementation Notes

### Backward Compatibility
- Tất cả fields mới đều OPTIONAL
- LessonPage check: có `steps` → StepByStep, có `coloredExamples` → ColoredSentence, không có gì mới → render cũ
- Exercises mới chỉ xuất hiện trong lessons được enrich

### Mobile Considerations
- ConjugationGrid: table trên desktop, stacked cards trên mobile (< 640px)
- BeforeAfterCard: side-by-side desktop, vertical stack mobile
- StepByStep: swipe gesture + arrow buttons
- Tooltips: tap (không hover) cho mobile

### Performance
- Lazy load components (React.lazy) — visual components nặng hơn text
- JSON lessons vẫn static import (small, ~5KB mỗi file)
- Lottie animations: load on demand, reuse existing celebration/feedback jsons
- Recharts dashboard: lazy load chỉ khi GrammarPage mount

### Dark Mode
- Tất cả color palette có dark variant
- SVG timeline dùng currentColor + CSS variables
- Card backgrounds: white/gray-900

### Dependencies
- KHÔNG cần thêm dependency mới
- Reuse: framer-motion (animations, gestures, carousel), @dnd-kit (potential role drag), recharts (dashboard), lottie-react (feedback), lucide-react (icons)
