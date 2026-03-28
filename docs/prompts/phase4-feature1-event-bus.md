# Task: Implement Event Bus (mitt) for WordFlow app

## Context
WordFlow is a React + TypeScript English learning app using Vite, Dexie (IndexedDB), Zustand, React Router, Framer Motion, Tailwind CSS.

## What to do

### 1. Install mitt
```bash
pnpm add mitt
```

### 2. Create `src/services/eventBus.ts`
```typescript
import mitt from 'mitt';

export type DictationMode = 'word' | 'phrase' | 'sentence';

type AppEvents = {
  'flashcard:correct': { wordId: string; rating: 0 | 2 | 4 | 5 };
  'flashcard:incorrect': { wordId: string };
  'quiz:complete': { lessonId: string; correct: number; total: number };
  'lesson:complete': { lessonId: string };
  'word:learned': { wordId: string };
  'word:mastered': { wordId: string };
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

export type AppEventTypes = AppEvents;
export const eventBus = mitt<AppEvents>();
```

### 3. Create `src/services/eventSubscribers.ts`
Register all side-effects in one place. Call `initEventSubscribers()` once in `App.tsx`.

The subscribers should:
- Listen to `flashcard:correct` → calculate XP based on rating (rating===5 → flashcard_easy, rating===2 → flashcard_hard, else flashcard_correct), call `addXP` on progressStore, and log via dailyLogService
- Listen to `quiz:complete` → calculate quiz XP via `calculateQuizXP`, call `addXP`, log via `logQuizCompleted`
- Listen to `daily_goal:met` → award `XP_VALUES.daily_goal_met` bonus XP
- Listen to `streak:updated` → (placeholder for future use)
- Listen to `word:learned` → `incrementWordsLearned()` on progressStore
- Listen to `word:mastered` → (placeholder)
- After ANY event (`*`), check achievements using existing `checkAchievements` from achievementEngine, and show toast for new badges

Important: The subscribers need access to Zustand stores. Use `useProgressStore.getState()` (outside React) to read/write store state.

### 4. Add new XP values to `src/lib/constants.ts`
Add to XP_VALUES:
```
dictation_correct: 10,
dictation_session_perfect: 30,
daily_challenge_complete: 50,
pronunciation_correct: 5,
```
Note: XP_VALUES currently uses `as const`. The new values should be added alongside existing ones. `streak_bonus` is a function, so the type needs to handle both number and function values.

### 5. Update `src/services/xpEngine.ts`
Add new XPAction types: `'dictation_correct' | 'dictation_session_perfect' | 'daily_challenge_complete' | 'pronunciation_correct'`

### 6. Update `src/lib/types.ts`
- Add `DictationMode` type: `'word' | 'phrase' | 'sentence'`
- Add `SessionResult` interface: `{ wordId: string; correct: boolean; timeMs: number; userAnswer?: string; }`
- Add new achievement condition types to `AchievementDefinition.condition.type`: `'dictationCount' | 'challengeCount' | 'pronunciationCount'`
- Add new fields to `AchievementContext`: `dictationCount: number; challengeCount: number; pronunciationCount: number;`

### 7. Update `src/data/achievements.json`
Add these new achievements:
```json
{ "id": "dictation_10", "badge": "🎧", "title": "Keen Ear", "description": "Complete 10 dictation exercises", "condition": { "type": "dictationCount", "value": 10 } },
{ "id": "dictation_50", "badge": "🎵", "title": "Sound Master", "description": "Complete 50 dictation exercises", "condition": { "type": "dictationCount", "value": 50 } },
{ "id": "daily_challenge_7", "badge": "🏆", "title": "Weekly Champion", "description": "Complete 7 daily challenges", "condition": { "type": "challengeCount", "value": 7 } },
{ "id": "daily_challenge_30", "badge": "👑", "title": "Monthly Champion", "description": "Complete 30 daily challenges", "condition": { "type": "challengeCount", "value": 30 } },
{ "id": "pronunciation_10", "badge": "🗣️", "title": "Voice Learner", "description": "Practice pronunciation 10 times", "condition": { "type": "pronunciationCount", "value": 10 } }
```

### 8. Update `src/services/achievementEngine.ts`
Add cases for new condition types: `dictationCount`, `challengeCount`, `pronunciationCount`.

### 9. Refactor `src/features/vocabulary/hooks/useFlashcard.ts`
Replace direct XP/log calls with eventBus.emit:
- Instead of directly calling `addXP`, `incrementWordsLearned`, `logWordLearned`, etc.
- Emit `eventBus.emit('flashcard:correct', { wordId, rating })` or `eventBus.emit('flashcard:incorrect', { wordId })`
- Emit `eventBus.emit('word:learned', { wordId })` when word is new
- Emit `eventBus.emit('daily_goal:met', {})` when daily goal is met
- The subscribers handle XP, logging, achievements automatically
- Keep the SM2 calculation and wordProgress update in the hook (that's domain logic, not side-effects)
- Keep `recordAnswer(isCorrect)` for session stats

### 10. Refactor `src/features/grammar/pages/QuizPage.tsx`
Replace direct XP calls with:
- `eventBus.emit('quiz:complete', { lessonId, correct: correctCount, total: totalCount })`
- Keep `updateLessonProgress` (domain logic)
- The subscriber handles XP calculation and dailyLog

### 11. Update `src/hooks/useAchievements.ts`
This hook currently checks achievements on every render based on state changes. With Event Bus, achievement checking moves to eventSubscribers (on `*` event). So this hook should be simplified or removed, and `initEventSubscribers` handles it.

Actually, keep `useAchievements.ts` but simplify it — the event subscriber will handle new badge detection. The hook can still do initial load checking.

### 12. Initialize in `src/App.tsx`
Add `initEventSubscribers()` call in App component (useEffect, run once).

## Important constraints
- Do NOT change any UI/visual behavior
- Do NOT break existing functionality
- All existing tests should still pass
- The app should work exactly the same as before, just with event-driven architecture under the hood
- Commit message: `feat: add event bus (mitt) and refactor XP/achievement to event-driven`

## After implementing
Run `pnpm build` to verify no TypeScript errors.
