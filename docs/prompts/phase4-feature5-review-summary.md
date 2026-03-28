# Task: Implement Review Summary & Weak Words for WordFlow app

## Context
WordFlow is a React + TypeScript English learning app using Vite, Dexie (IndexedDB), Zustand, React Router, Framer Motion, Tailwind CSS.

Key files:
- DB: `src/db/database.ts` — Dexie with wordProgress table (WordProgress: wordId, easeFactor, interval, repetitions, nextReview, lastReview, status)
- Vocab data: `src/data/vocabulary/_index.ts` → `ALL_TOPICS: VocabTopic[]`, VocabWord = { word, meaning, ipa, example, audioUrl }
- Flashcard: `src/features/vocabulary/pages/FlashcardPage.tsx` — has inline session-complete UI with accuracy/XP stats
- Flashcard hook: `src/features/vocabulary/hooks/useFlashcard.ts` — exposes sessionStats { correct, incorrect, total }, isSessionComplete, sessionXP
- Quiz: `src/features/grammar/pages/QuizPage.tsx` — has inline quiz-complete UI with score/XP
- Dictation summary: `src/features/listening/components/DictationSessionSummary.tsx` — already has summary with incorrect answers review
- Toast: `src/stores/toastStore.ts`
- Progress store: `src/stores/progressStore.ts`
- Vocab store: `src/stores/vocabularyStore.ts` — has wordProgressMap
- Types: `src/lib/types.ts` — has SessionResult { wordId, correct, timeMs, userAnswer? }

## What to do

### 1. Create `src/services/weakWordsService.ts`

```typescript
export interface WeakWord {
  wordId: string;
  word: string;
  meaning: string;
  ipa: string;
  easeFactor: number;
  topic: string;
}

export async function getWeakWords(limit = 20): Promise<WeakWord[]> {
  // Query wordProgress from Dexie WHERE:
  //   easeFactor < 2.0
  //   OR (status === 'learning' AND repetitions === 0 AND lastReview > 0)
  // ORDER BY easeFactor ASC, limit results
  // Join with vocabulary data (ALL_TOPICS) to get word, meaning, ipa
  // Parse wordId format "topic:word" to find the matching vocab word
}

export function getSessionWeakWords(
  results: Array<{ wordId: string; correct: boolean }>,
  allWeakWords: WeakWord[]
): WeakWord[] {
  // Filter: words that were answered incorrectly in this session
  // OR words that are in the allWeakWords list
  // Return unique, prioritizing session incorrect ones first
}
```

### 2. Create `src/features/vocabulary/components/SessionSummary.tsx`

A reusable end-of-session overlay component:

**Props:**
```typescript
interface SessionSummaryProps {
  correct: number;
  total: number;
  accuracy: number;      // percentage 0-100
  xpEarned: number;
  weakWords: WeakWord[];  // from weakWordsService
  onPracticeWeakWords?: () => void;  // optional CTA
  onBack: () => void;
  onRetry: () => void;
  backLabel?: string;     // default "Word List"
  title?: string;         // default "Session Complete!"
}
```

**UI (matches existing card/motion patterns):**
```
┌─────────────────────────────────┐
│  🎉 Session Complete!            │
│                                  │
│  ✅ 8/10 correct                 │
│  📈 80% accuracy    ⭐ +120 XP   │
│                                  │
│  ── Weak Words ──────────────── │
│  ⚠️ breakfast  — bữa sáng       │
│  ⚠️ schedule   — lịch trình     │
│                                  │
│  [🔄 Practice Weak Words]       │
│  [Back]           [Study Again] │
└─────────────────────────────────┘
```

- Use motion.div with entry animation (opacity + scale, matching existing pattern)
- Stats grid: correct count, accuracy, XP (2 or 3 columns)
- WeakWordsList section (see below) only shown if weakWords.length > 0
- "Practice Weak Words" button navigates to flashcard with filtered words
- Match existing styling (rounded-2xl, dark mode, etc.)

### 3. Create `src/features/vocabulary/components/WeakWordsList.tsx`

A sub-component for displaying weak words:

**Props:**
```typescript
interface WeakWordsListProps {
  words: WeakWord[];
  maxShow?: number;  // default 5, with "Show more" toggle
}
```

**UI:**
- Header: "⚠️ Words to Review" with count
- Each word: word (bold) + IPA (gray) + meaning
- Yellow/amber left border or background tint for emphasis
- "Show all X words" toggle if more than maxShow

### 4. Create `src/features/grammar/components/QuizSummary.tsx`

Similar to SessionSummary but quiz-specific:

**Props:**
```typescript
interface QuizSummaryProps {
  lessonTitle: string;
  correctCount: number;
  totalQuestions: number;
  score: number;           // percentage
  xp: { totalXP: number; perfectBonus: number; lessonBonus: number };
  incorrectQuestions: Array<{ question: string; userAnswer: string; correctAnswer: string }>;
  onRetry: () => void;
  onBack: () => void;
}
```

**UI:**
- Same overall layout as SessionSummary
- Score + XP stats
- Incorrect questions review section (question, your answer vs correct answer)
- Retry + Back buttons

### 5. Integrate SessionSummary into FlashcardPage

Replace the inline `isSessionComplete` JSX in `src/features/vocabulary/pages/FlashcardPage.tsx` with `<SessionSummary>`:
- Import SessionSummary and getWeakWords
- When isSessionComplete: fetch weak words, render SessionSummary
- onPracticeWeakWords: navigate to flashcard page with weak word filter (use URL search param like `?weakWords=true` or pass through state)
- onBack: navigate to word list
- onRetry: navigate(0) to reload

For "Practice Weak Words" flow: 
- Navigate to `/vocabulary/${topic}/learn?weak=true`
- In useFlashcard hook, check for `weak` search param. If present, filter queue to only words with easeFactor < 2.0 or words that were answered incorrectly

### 6. Integrate QuizSummary into QuizPage

Replace the inline quiz-complete JSX in `src/features/grammar/pages/QuizPage.tsx` with `<QuizSummary>`:
- Import QuizSummary
- Track incorrect questions during quiz (question text, user answer, correct answer)
- When quiz.isComplete: render QuizSummary
- onRetry: reset quiz
- onBack: navigate to lesson page

### 7. Update useFlashcard to support weak words mode

In `src/features/vocabulary/hooks/useFlashcard.ts`:
- Check URL search params for `?weak=true`
- If weak mode: filter flashcard queue to only include words where:
  - wordProgress.easeFactor < 2.0
  - OR wordProgress.status === 'learning' with repetitions === 0
- This allows the "Practice Weak Words" CTA to actually work

## Important constraints
- Do NOT change any existing visual behavior EXCEPT replacing the inline completion UIs with the new summary components
- The new SessionSummary should look similar to the existing completion UI but enhanced with weak words
- Do NOT break existing functionality
- Follow existing code patterns: motion animations, dark mode, rounded cards
- The DictationSessionSummary already exists and works fine — do NOT modify it
- Commit message: `feat: add review summary with weak words for flashcard and quiz sessions`

## After implementing
Run `pnpm build` to verify no TypeScript errors.
