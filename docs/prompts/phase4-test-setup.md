# Task: Setup Test Infrastructure + Write Phase 4 Tests

## Context
WordFlow is a React 19 + TypeScript app using Vite, Dexie (IndexedDB), Zustand, React Router, Framer Motion.
Currently has NO test framework. Need to setup vitest + testing-library and write tests for Phase 4 features.

## Part 1: Setup Test Infrastructure

### Install dependencies
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom fake-indexeddb
```

### Configure vitest

Create `vitest.config.ts` (or add to existing vite config):
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

### Create test setup file `src/test/setup.ts`
```typescript
import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: () => {},
    cancel: () => {},
    getVoices: () => [],
  },
});
```

### Add test script to package.json
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

## Part 2: Write Tests for Phase 4 Features

### Test 1: `src/services/__tests__/eventBus.test.ts`
- Test eventBus emits and receives events with correct payload types
- Test wildcard listener fires on any event
- Test unsubscribe works

### Test 2: `src/services/__tests__/eventSubscribers.test.ts`
- Test `initEventSubscribers()` initializes only once (guard flag)
- Test `flashcard:correct` event → addXP called with correct amount based on rating
- Test `quiz:complete` event → addXP called with calculated quiz XP
- Test `daily_challenge:complete` event → addXP called with bonus amount
- Test `dictation:correct` → addXP(10)
- Test `pronunciation:correct` → addXP(5)
- Mock progressStore.addXP and toastStore.addToast

### Test 3: `src/services/__tests__/dataPortService.test.ts`
- Test `exportAllData()` returns correct structure (version, app, data fields)
- Test `importData()` validates: correct JSON passes, wrong version fails, wrong app fails
- Test `importData()` validates: wordId format ("topic:word"), easeFactor >= 1.3, date format
- Test `importData()` returns stats (word count, lesson count, log count)
- Test `performImport()` clears and inserts data (use fake-indexeddb)
- Test backward compat: import without dailyChallenges field works

### Test 4: `src/services/__tests__/weakWordsService.test.ts`
- Test `getWeakWords()` returns words with easeFactor < 2.0
- Test sorting by easeFactor ASC
- Test limit parameter

### Test 5: `src/features/daily-challenge/hooks/__tests__/useDailyChallenge.test.ts`
- Test `getDailySeed()` is deterministic (same date → same seed)
- Test different dates produce different seeds
- Test word/exercise selection is deterministic
- Test `completeTask()` awards 15 XP per task
- Test completing all 3 tasks emits `daily_challenge:complete` event (NOT direct addXP for bonus)

### Test 6: `src/features/listening/hooks/__tests__/useDictation.test.ts`
- Test `checkAnswer()` — exact match, case-insensitive, trim whitespace
- Test `extractPhrase()` — extracts 2-3 word chunk containing target word
- Test session complete count uses ref (not stale state)
- Test correct answer emits `dictation:correct` event
- Test perfect session emits `dictation:session_complete`

### Test 7: `src/hooks/__tests__/useSpeechRecognition.test.ts`
- Test `isSupported` returns false when SpeechRecognition not in window
- Test `isSupported` returns true when window.SpeechRecognition exists
- Test `isSupported` returns true when window.webkitSpeechRecognition exists (Safari)

### Test 8: `src/features/onboarding/data/__tests__/placement-questions.test.ts`
- Test `PLACEMENT_QUESTIONS` has exactly 10 questions
- Test 5 are A1 and 5 are A2
- Test all have 4 options
- Test all answer indices are valid (0-3)
- Test `calculatePlacementLevel()`: <5 correct → A1, >=5 → A2

### Test 9: `src/services/__tests__/achievementEngine.test.ts`
- Test new condition types: `dictationCount`, `challengeCount`, `pronunciationCount`
- Test achievements unlock when counts meet thresholds
- Test already-earned badges are not re-awarded

### Test 10: `src/services/__tests__/xpEngine.test.ts`
- Test new XP actions return correct values: dictation_correct=10, dictation_session_perfect=30, daily_challenge_complete=50, pronunciation_correct=5

## Important constraints
- Use vitest globals (describe, it, expect) — no need to import
- Use `@testing-library/react` renderHook for custom hooks
- Use `fake-indexeddb` for Dexie tests (imported in setup.ts)
- Mock external dependencies (stores, audio, etc.) as needed
- Keep tests focused on logic — don't test UI rendering heavily
- For hooks that use React Router, mock `useParams`/`useSearchParams`/`useNavigate`
- Tests should be independent (reset Dexie between tests if needed)
- All tests must pass: `pnpm test` exits 0
- Commit message: `test: setup vitest + testing-library and add Phase 4 tests`

## After implementing
Run `pnpm test` to verify all tests pass.
Run `pnpm build` to verify no TypeScript errors.
