# Task: Fix Phase 4 Review Issues (Critical + Important)

## Context
WordFlow is a React + TypeScript app. Marcus (Tech Lead) reviewed Phase 4 and found 12 issues. Fix all Critical (3) and Important (5) issues below. Minor issues can be skipped.

## 🔴 CRITICAL FIXES

### Fix 1: Event subscribers double-registration (Memory Leak)

**File:** `src/services/eventSubscribers.ts`

Problem: `initEventSubscribers()` called in `useEffect` without guard. React strict mode → listeners register twice → XP doubles.

**Fix:** Add initialization guard at the top of `initEventSubscribers()`:
```typescript
let initialized = false;
export function initEventSubscribers() {
  if (initialized) return;
  initialized = true;
  // ... rest of existing code
}
```

### Fix 2: Import data loss on partial failure

**File:** `src/services/dataPortService.ts` → `performImport()`

Problem: Clears all tables then bulkAdds. If bulkAdd fails mid-way, Dexie transaction *should* rollback, but to be extra safe, ensure everything is in ONE transaction block.

**Fix:** Ensure `performImport` wraps ALL operations (clear + bulkAdd for ALL tables) in a single `db.transaction('rw', [all tables], async () => { ... })`. The transaction guarantees atomicity — if ANY step fails, ALL changes roll back. Also verify `bulkAdd` is used inside the transaction.

If the current code already uses a transaction, verify it includes ALL tables being modified. If not, fix it to include all.

### Fix 3: `dailyChallenges` table missing from Export/Import

**File:** `src/services/dataPortService.ts`

Problem: Export/Import doesn't include `dailyChallenges` table.

**Fix:**
1. Update `ExportData` interface: add `dailyChallenges?: DailyChallengeLog[]` to `data` (optional for backward compatibility)
2. In `exportAllData()`: query `db.dailyChallenges.toArray()` and include in export
3. In `importData()` validation: validate dailyChallenges if present (date format YYYY-MM-DD)
4. In `performImport()`: clear and bulkAdd dailyChallenges table (handle case where field is missing/empty for backward compat with old exports)

## 🟡 IMPORTANT FIXES

### Fix 4: Debounce wildcard achievement check

**File:** `src/services/eventSubscribers.ts` → wildcard `*` handler

Problem: Achievement check runs after EVERY event. 10 dictation answers = 10 expensive checks.

**Fix:** Debounce the wildcard handler. Simple approach:
```typescript
let achievementCheckTimer: ReturnType<typeof setTimeout> | null = null;

eventBus.on('*', () => {
  if (achievementCheckTimer) clearTimeout(achievementCheckTimer);
  achievementCheckTimer = setTimeout(async () => {
    // ... existing achievement check logic
  }, 300);
});
```

### Fix 5: Achievement context counts always 0

**File:** `src/services/eventSubscribers.ts` → wildcard handler, where `checkAchievements` is called

Problem: `dictationCount`, `challengeCount`, `pronunciationCount` are hardcoded to 0 → Phase 4 achievements never unlock.

**Fix:** Query actual counts from the database:
```typescript
// Inside the debounced achievement check:
const dailyLogs = await db.dailyLogs.toArray();
const dictationCount = dailyLogs.reduce((sum, log) => sum + (log.dictationCorrect ?? 0), 0);

const dailyChallenges = await db.dailyChallenges.where('completed').equals(1).count();
// Note: Dexie doesn't index boolean well, so use toArray and filter:
const allChallenges = await db.dailyChallenges.toArray();
const challengeCount = allChallenges.filter(c => c.completed).length;

// For pronunciation, we don't have a dedicated counter yet.
// Use a simple approach: count from badges or add to dailyLog.
// Simplest: add pronunciationCorrect to DailyLog (optional field) and sum it.
// OR just set to 0 for now and track it later (document as known limitation).
// For now, let's at least fix dictation and challenge counts.
```

For `pronunciationCount`: add optional `pronunciationCorrect?: number` field to DailyLog in models.ts, update the pronunciation:correct event handler to increment it via dailyLogService, then sum from dailyLogs here.

### Fix 6: useDictation stale state on session complete

**File:** `src/features/listening/hooks/useDictation.ts`

Problem: `answers` state not yet updated when session complete count is calculated (React async state).

**Fix:** Use a ref to track answers alongside state:
```typescript
const answersRef = useRef<Array<{correct: boolean}>>([]);

// In submitAnswer:
const newAnswer = { correct: isCorrect, /* ... */ };
answersRef.current = [...answersRef.current, newAnswer];
setAnswers(prev => [...prev, newAnswer]);

// When checking session complete, use answersRef.current instead of answers state:
const finalCorrect = answersRef.current.filter(a => a.correct).length;
```

### Fix 7: Speech Recognition "no-speech" hangs Promise

**File:** `src/hooks/useSpeechRecognition.ts`

Problem: If user doesn't speak, `onresult` never fires. 5s timeout calls `stop()` which triggers `onend`, but Promise never resolves/rejects.

**Fix:**
```typescript
let resolved = false;

recognition.onresult = (event: any) => {
  resolved = true;
  // ... existing resolve logic
};

recognition.onerror = (event: any) => {
  resolved = true;
  setError(event.error);
  setIsListening(false);
  reject(new Error(event.error));
};

recognition.onend = () => {
  setIsListening(false);
  if (!resolved) {
    reject(new Error('no-speech'));
  }
};
```

Also in `PronunciationButton.tsx`, catch the 'no-speech' error gracefully (show "Didn't hear anything, try again" instead of error).

### Fix 8: Onboarding routing guard byppassable

**File:** `src/App.tsx`

Problem: Guard only checks on mount (`[]` deps). User can type URL to bypass.

**Fix:** Add `location.pathname` to the useEffect deps so it re-checks on every navigation:
```typescript
useEffect(() => {
  async function checkOnboarding() {
    const profile = await db.userProfile.get('default');
    if (profile && !profile.placementDone && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
    }
  }
  checkOnboarding();
}, [location.pathname]); // Re-check on every route change
```

Make sure this doesn't conflict with the existing init useEffect. It can be a separate useEffect specifically for the routing guard.

## Constraints
- Fix ONLY the issues listed above
- Do NOT change any UI/visual behavior
- Do NOT break existing functionality
- Run `pnpm build` at the end to verify
- Commit message: `fix: resolve Phase 4 review issues (critical + important)`

## After implementing
Run `pnpm build` to verify no TypeScript errors.
