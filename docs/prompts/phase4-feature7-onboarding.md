# Task: Implement Onboarding & Placement Test for WordFlow app

## Context
WordFlow is a React + TypeScript English learning app using Vite, Dexie (IndexedDB), Zustand, React Router, Framer Motion, Tailwind CSS.

Key files:
- App: `src/App.tsx` — main layout with Header, BottomNav, Sidebar, Outlet
- Routes: `src/routes/index.tsx` — lazy loaded routes under App layout
- DB: `src/db/database.ts` — Dexie, has `userProfile` table, `initializeUserProfile()` function
- Models: `src/db/models.ts` — UserProfile interface (id, xp, level, currentStreak, longestStreak, lastActiveDate, dailyGoal, theme, badges, createdAt)
- Settings: `src/features/settings/pages/SettingsPage.tsx`
- Types: `src/lib/types.ts` — has CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2'
- Progress bar: `src/components/ui/ProgressBar.tsx`
- Button: `src/components/ui/Button.tsx`

## What to do

### 1. Update UserProfile model

In `src/db/models.ts`, add optional fields to UserProfile:
```typescript
export interface UserProfile {
  // ... existing fields
  placementDone?: boolean;
  placementLevel?: CEFRLevel;
}
```
No DB migration needed — optional fields, non-indexed.

### 2. Create placement questions data

Create `src/features/onboarding/data/placement-questions.ts`:

```typescript
import type { CEFRLevel } from '../../../lib/types';

export interface PlacementQuestion {
  question: string;
  options: string[];
  answer: number;   // index of correct option (0-based)
  level: CEFRLevel;
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // 5 A1 questions (basic)
  { question: 'She ___ a teacher.', options: ['am', 'is', 'are', 'be'], answer: 1, level: 'A1' },
  { question: 'I ___ breakfast every morning.', options: ['has', 'have', 'having', 'had'], answer: 1, level: 'A1' },
  { question: '___ you like coffee?', options: ['Does', 'Do', 'Is', 'Are'], answer: 1, level: 'A1' },
  { question: 'They ___ from Japan.', options: ['is', 'am', 'are', 'be'], answer: 2, level: 'A1' },
  { question: 'He ___ to school by bus.', options: ['go', 'goes', 'going', 'gone'], answer: 1, level: 'A1' },

  // 5 A2 questions (elementary)
  { question: 'I ___ to London last summer.', options: ['go', 'went', 'have gone', 'going'], answer: 1, level: 'A2' },
  { question: 'She is ___ than her sister.', options: ['tall', 'taller', 'tallest', 'more tall'], answer: 1, level: 'A2' },
  { question: 'We ___ dinner when the phone rang.', options: ['have', 'had', 'were having', 'are having'], answer: 2, level: 'A2' },
  { question: 'You ___ wear a seatbelt in the car.', options: ['can', 'must', 'might', 'would'], answer: 1, level: 'A2' },
  { question: 'I have ___ finished my homework.', options: ['yet', 'already', 'still', 'since'], answer: 1, level: 'A2' },
];

export function calculatePlacementLevel(correctCount: number): CEFRLevel {
  return correctCount >= 5 ? 'A2' : 'A1';
}
```

### 3. Create onboarding components

**`src/features/onboarding/components/WelcomeScreen.tsx`:**
- Friendly welcome screen with app logo/emoji (🎓)
- "Welcome to WordFlow!" heading
- Brief description: "Let's find your English level with a quick 10-question quiz."
- Two buttons:
  - "Let's Go! →" (primary, starts quiz)
  - "Skip — I'll start at A1" (secondary/text, skips to A1)
- Nice motion animation on entry
- Center-aligned, clean design

**`src/features/onboarding/components/PlacementQuiz.tsx`:**

Props:
```typescript
interface PlacementQuizProps {
  onComplete: (correctCount: number, totalQuestions: number) => void;
}
```

- Shows one question at a time
- Progress bar ("Question 3/10")
- Multiple choice (4 options) with radio-style selection
- "Next →" button after selecting
- Track answers, calculate correct count
- On last question: call onComplete with results
- motion animations for question transitions (AnimatePresence)
- Can't go back (forward only)

**`src/features/onboarding/components/PlacementResult.tsx`:**

Props:
```typescript
interface PlacementResultProps {
  level: CEFRLevel;
  score: number;           // correct count
  totalQuestions: number;
  onStartLearning: () => void;
  onRedoTest: () => void;
}
```

- Show determined level prominently (big badge)
- Score: "7/10 correct"
- Encouraging message based on level:
  - A1: "You're just getting started! We'll build your foundation."
  - A2: "Great! You have a solid base. Let's level up!"
- "Start Learning →" button (primary)
- "Redo Test" link/button (secondary)
- Celebration animation (confetti emoji or motion effect)

### 4. Create `src/features/onboarding/pages/OnboardingPage.tsx`

Full-page flow (no Header/BottomNav/Sidebar — fullscreen):

State machine with 3 steps: 'welcome' | 'quiz' | 'result'

Flow:
1. **welcome** → user clicks "Let's Go" → move to 'quiz'. User clicks "Skip" → save placementDone=true, placementLevel='A1', navigate to '/'
2. **quiz** → PlacementQuiz runs → onComplete receives score → calculate level → move to 'result'
3. **result** → "Start Learning" → save to Dexie (placementDone=true, placementLevel), navigate to '/'. "Redo Test" → back to 'quiz'

Saving to Dexie:
```typescript
import { db } from '../../../db/database';

await db.userProfile.update('default', {
  placementDone: true,
  placementLevel: level,
});
```

### 5. Route and routing guard

**Add route in `src/routes/index.tsx`:**
- Add lazy import for OnboardingPage
- Add route: `{ path: 'onboarding', element: withSuspense(OnboardingPage) }`

**Routing guard in `src/App.tsx`:**
- On mount (in useEffect), check if user has done placement:
  - Query `db.userProfile.get('default')` 
  - If `!profile.placementDone` → navigate to '/onboarding'
- Use `useNavigate()` for redirect
- Only redirect if current path is NOT already '/onboarding' (avoid infinite loop)
- The onboarding page should work WITHOUT Header/BottomNav — add '/onboarding' to the `isFullscreen` check:
  ```typescript
  const isFullscreen = location.pathname.includes('/learn') || location.pathname.includes('/quiz') || location.pathname === '/onboarding';
  ```

### 6. Settings: "Redo Placement Test" button

In `src/features/settings/pages/SettingsPage.tsx`:
- Add a new section at the bottom (before DataExportImport if it exists)
- "Placement Test" section with:
  - Current level display (if set)
  - "Redo Test" button → navigates to '/onboarding'
- When user redoes test, the onboarding flow will overwrite placementDone/placementLevel

### 7. Fullscreen layout for onboarding

The OnboardingPage should be a clean, focused experience:
- No header, no bottom nav, no sidebar
- Centered content with max-width
- Background: gradient or clean white/dark
- Mobile-friendly (it's the first thing new users see)

## Important constraints
- Do NOT change any existing visual behavior except adding fullscreen check for onboarding
- Do NOT break existing functionality
- The routing guard should be non-blocking — if profile doesn't exist yet (first load), wait for initializeUserProfile() before checking
- Follow existing code patterns: motion animations, dark mode, existing component library
- Placement questions should be reasonable ESL questions (A1 = very basic, A2 = elementary)
- The onboarding is optional (skip button available) — never force users
- Commit message: `feat: add onboarding with placement test and routing guard`

## After implementing
Run `pnpm build` to verify no TypeScript errors.
