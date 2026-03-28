# Task: Implement Daily Challenge / Word of the Day for WordFlow app

## Context
WordFlow is a React + TypeScript English learning app using Vite, Dexie (IndexedDB), Zustand, React Router, Framer Motion, Tailwind CSS.

Key existing files:
- Database: `src/db/database.ts` (Dexie, currently version 1)
- Models: `src/db/models.ts`
- Routes: `src/routes/index.tsx` (lazy loaded)
- Dashboard: `src/features/dashboard/pages/DashboardPage.tsx`
- Event bus: `src/services/eventBus.ts` (mitt, has `daily_challenge:complete` event)
- Audio: `src/services/audioService.ts` (playWordAudio function)
- Toast: `src/stores/toastStore.ts`
- Vocab data: `src/data/vocabulary/_index.ts` exports `ALL_TOPICS: VocabTopic[]`
- Grammar data: `src/data/grammar/_index.ts` exports `ALL_GRAMMAR_LESSONS: GrammarLessonData[]`
- Bottom nav: `src/components/layout/BottomNav.tsx`
- XP engine: `src/services/xpEngine.ts`
- Progress store: `src/stores/progressStore.ts` (has `addXP` method)

## What to do

### 1. DB Migration v1→v2: Add `dailyChallenges` table

Update `src/db/database.ts`:
- Add `dailyChallenges` table to the class: `dailyChallenges!: Table<DailyChallengeLog, string>;`
- Add version(2) with ALL existing stores PLUS `dailyChallenges: 'date'`
- Keep version(1) definition as-is (Dexie needs both for migration)

Add to `src/db/models.ts`:
```typescript
export interface DailyChallengeLog {
  date: string;                    // "2026-03-28" — PK
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

### 2. Create feature module `src/features/daily-challenge/`

Structure:
```
src/features/daily-challenge/
├── components/
│   ├── DailyChallengeCard.tsx         ← Widget on Dashboard
│   ├── ChallengeTaskList.tsx          ← List of 3 tasks with checkmarks
│   ├── ChallengeWordTask.tsx          ← Task 1: Learn word (show word, meaning, IPA, example, audio button)
│   ├── ChallengeGrammarTask.tsx       ← Task 2: Multiple choice grammar question
│   └── ChallengeDictationTask.tsx     ← Task 3: Listen & type the word
├── hooks/
│   └── useDailyChallenge.ts           ← Core logic
└── pages/
    └── DailyChallengePage.tsx         ← Full page with 3 tasks
```

### 3. Hook: `useDailyChallenge.ts`

**Deterministic seed algorithm:**
```typescript
function getDailySeed(date: string): number {
  let hash = 0;
  for (const char of date) {
    hash = ((hash << 5) - hash) + char.charCodeAt(0);
    hash |= 0;
  }
  return Math.abs(hash);
}
```

**Selection logic:**
- Import ALL_TOPICS from vocabulary data, flatten all words into a single array
- Import ALL_GRAMMAR_LESSONS, flatten all exercises into a single array
- Use seed to deterministically pick: word = allWords[seed % allWords.length], exercise = allExercises[(seed * 7) % allExercises.length]
- Task 3 dictation uses the same word as Task 1

**State management:**
- On mount: get today's date string (YYYY-MM-DD), compute seed, select challenge
- Load existing DailyChallengeLog from Dexie (if any for today)
- Provide: currentChallenge, taskStates, completeTask(taskName), isCompleted
- When a task is completed: update Dexie record, award 15 XP via progressStore.addXP
- When ALL 3 tasks done: mark completed=true, award bonus 50 XP, emit `eventBus.emit('daily_challenge:complete', { date, score: xpEarned })`

### 4. Components

**DailyChallengeCard.tsx** (Dashboard widget):
- If not started: Show "🎯 Today's Challenge" with word preview, CTA button "Start Challenge"
- If in progress: Show progress (1/3, 2/3 tasks done), CTA "Continue"
- If completed: Show "✅ Challenge Complete!" with XP earned
- Links to `/daily-challenge`
- Style: Match existing dashboard cards (Card component, motion animations)

**DailyChallengePage.tsx:**
- Header with date and progress indicator
- `ChallengeTaskList` showing 3 tasks with status (todo/done)
- Active task component rendered based on which task is next
- When all done: show completion celebration with total XP

**ChallengeWordTask.tsx** (Task 1 - Learn Word):
- Display: word, IPA, meaning, example sentence
- Audio button using `playWordAudio` from audioService
- "I've learned this word" button to mark complete

**ChallengeGrammarTask.tsx** (Task 2 - Grammar Quiz):
- Show the grammar exercise (multiple choice)
- Use the exercise data structure from grammar lessons (has question, options, answer)
- Submit answer → show correct/incorrect → mark complete
- If the selected exercise type is not multiple choice, just show the question and options from the exercise

**ChallengeDictationTask.tsx** (Task 3 - Mini Dictation):
- Play audio of today's challenge word
- Text input to type what they hear
- Check: case-insensitive, trimmed comparison
- Show result (correct/incorrect with the correct answer)
- Mark complete after attempt (whether correct or not - it's practice)

### 5. Route: Add `/daily-challenge`

Update `src/routes/index.tsx`:
- Add lazy import for DailyChallengePage
- Add route: `{ path: 'daily-challenge', element: withSuspense(DailyChallengePage) }`

### 6. Dashboard integration

Update `src/features/dashboard/pages/DashboardPage.tsx`:
- Import DailyChallengeCard
- Add it between the Daily Goal card and Streak/XP widgets (prominent position)
- Wrap in motion.div with animation delay matching existing pattern

### 7. XP handling

- Each task completion: 15 XP via `useProgressStore.getState().addXP(15)`
- All 3 tasks done: bonus 50 XP + emit event
- Total possible per day: 95 XP
- Store xpEarned in DailyChallengeLog

## Important constraints
- Do NOT change existing UI/visual behavior
- Do NOT break existing functionality
- Do NOT modify BottomNav (no nav changes in this feature)
- Follow existing code patterns: lazy routes, motion animations, Card component, dark mode support
- Use existing audioService for audio playback
- Use existing toast system for notifications
- Grammar exercises have varying types. The exercise object from grammar JSON has `type` field. For the daily challenge, just use the exercise as-is with its question and options.
- Commit message: `feat: add daily challenge with 3-task system and dashboard widget`

## After implementing
Run `pnpm build` to verify no TypeScript errors.
