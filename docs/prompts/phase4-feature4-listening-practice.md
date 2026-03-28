# Task: Implement Listening Practice (Mini Dictation) for WordFlow app

## Context
WordFlow is a React + TypeScript English learning app using Vite, Dexie (IndexedDB), Zustand, React Router, Framer Motion, Tailwind CSS.

Key existing files:
- Event bus: `src/services/eventBus.ts` (has dictation:correct, dictation:incorrect, dictation:session_complete events)
- Audio: `src/services/audioService.ts` — `playWordAudio(word, audioUrl?)` plays Dictionary API audio or falls back to Web Speech API
- Vocab data: `src/data/vocabulary/_index.ts` → `ALL_TOPICS: VocabTopic[]` where VocabTopic = { topic, topicLabel, cefrLevel, words: VocabWord[] }
- VocabWord = { word, meaning, ipa, example, audioUrl: string | null }
- Types: `src/lib/types.ts` has `DictationMode = 'word' | 'phrase' | 'sentence'` and `SessionResult`
- Progress store: `src/stores/progressStore.ts` — `addXP(amount)`
- Daily log: `src/services/dailyLogService.ts`
- Toast: `src/stores/toastStore.ts`
- Routes: `src/routes/index.tsx` (lazy loaded pattern)
- Bottom nav: `src/components/layout/BottomNav.tsx` — currently 5 items (Home, Vocab, Grammar, Badges, Stats)
- Constants: `src/lib/constants.ts` has `TOPIC_ICONS` and `TOPIC_COLORS`
- DB models: `src/db/models.ts` — DailyLog interface

## What to do

### 1. Update DailyLog model

In `src/db/models.ts`, add optional fields to DailyLog:
```typescript
export interface DailyLog {
  // ... existing fields
  dictationAttempts?: number;
  dictationCorrect?: number;
}
```
No DB migration needed — these are non-indexed optional fields.

### 2. Create feature module `src/features/listening/`

Structure:
```
src/features/listening/
├── components/
│   ├── DictationPlayer.tsx            ← Audio playback button (big, tappable)
│   ├── DictationInput.tsx             ← Text input + submit button
│   ├── DictationResult.tsx            ← Correct/incorrect feedback with word details
│   ├── DictationModeSelector.tsx      ← Word / Phrase / Sentence tab selector
│   └── DictationSessionSummary.tsx    ← End-of-session stats
├── hooks/
│   ├── useDictation.ts                ← Session logic (select words, check answers, scoring)
│   └── useDictationAudio.ts           ← Audio playback wrapper using audioService
└── pages/
    ├── ListeningPage.tsx              ← Mode selection + topic selection
    └── DictationSessionPage.tsx       ← Active dictation session
```

### 3. Hook: `useDictationAudio.ts`

Simple wrapper around audioService:
```typescript
export function useDictationAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  async function play(word: string, audioUrl?: string | null) {
    setIsPlaying(true);
    try {
      await playWordAudio(word, audioUrl);
    } finally {
      // Small delay before setting isPlaying false for animation
      setTimeout(() => setIsPlaying(false), 500);
    }
  }

  return { play, isPlaying };
}
```

For sentence mode: use Web Speech API directly since Dictionary API only has single word audio:
```typescript
function playSentence(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // slightly slower for dictation
    window.speechSynthesis.speak(utterance);
  }
}
```

### 4. Hook: `useDictation.ts`

**Props:** topic (string), mode (DictationMode)

**Logic:**
- Load words from ALL_TOPICS for the given topic
- Shuffle and select 10 words (or fewer if topic has less)
- For each word, prepare the dictation target based on mode:
  - Word mode: `word.word` (e.g. "breakfast")
  - Phrase mode: extract 2-3 word chunk containing target word from `word.example`
  - Sentence mode: `word.example` (full sentence)

**Phrase extraction:**
```typescript
function extractPhrase(example: string, targetWord: string): string {
  const words = example.replace(/[.,!?;:'"]/g, '').split(/\s+/);
  const idx = words.findIndex(w => w.toLowerCase() === targetWord.toLowerCase());
  if (idx === -1) return targetWord;
  const start = Math.max(0, idx - 1);
  const end = Math.min(words.length, idx + 2);
  return words.slice(start, end).join(' ');
}
```

**Answer checking:**
```typescript
function checkAnswer(input: string, target: string): boolean {
  const normalized = input.toLowerCase().trim().replace(/\s+/g, ' ');
  const expected = target.toLowerCase().trim().replace(/\s+/g, ' ');
  return normalized === expected;
}
```

**State:**
- currentIndex, answers[], isComplete, sessionResults
- submitAnswer(input) → check, record result, emit events, advance
- On correct: emit `eventBus.emit('dictation:correct', { wordId, mode })`
- On incorrect: emit `eventBus.emit('dictation:incorrect', { wordId, mode })`
- On session complete: emit `eventBus.emit('dictation:session_complete', { correct, total, mode })`
- XP: 10 per correct, 30 bonus if all correct (perfect session)
- Update dailyLog: increment dictationAttempts and dictationCorrect

### 5. Components

**DictationPlayer.tsx:**
- Large circular audio button (🔊) with tap-to-play
- Pulse animation when playing
- "Tap to listen" text below, changes to "Tap to listen again" after first play

**DictationInput.tsx:**
- Text input with placeholder "Type what you hear..."
- Submit button (or Enter key)
- Disabled state when checking/showing result

**DictationResult.tsx:**
- Correct: green ✅ with the word, IPA, meaning
- Incorrect: red ❌ showing "You typed: X" vs "Correct: Y" + IPA + meaning
- "Next" button to advance

**DictationModeSelector.tsx:**
- 3 tabs/pills: Word | Phrase | Sentence
- Active tab highlighted (indigo)
- Match existing UI style

**DictationSessionSummary.tsx:**
- Score: X/Y correct
- Accuracy percentage
- XP earned
- List of incorrect words for review
- "Practice Again" and "Back to Listening" buttons

### 6. Pages

**ListeningPage.tsx:**
- Header: "🎧 Listening Practice"
- Mode selector (DictationModeSelector)
- Topic grid (similar to VocabularyPage topic list): show topic icon, name, word count
- Click topic → navigate to `/listening/:topic/practice?mode=word`

**DictationSessionPage.tsx:**
- Read topic from URL params, mode from query string (default 'word')
- Progress indicator: "Word 3 of 10"
- DictationPlayer for current word
- DictationInput
- DictationResult (shown after answer submitted)
- When all done: show DictationSessionSummary
- Exit button (✕) to quit early → confirm dialog

### 7. Routes

Update `src/routes/index.tsx`:
- Add lazy imports for ListeningPage and DictationSessionPage
- Add routes:
  - `{ path: 'listening', element: withSuspense(ListeningPage) }`
  - `{ path: 'listening/:topic/practice', element: withSuspense(DictationSessionPage) }`

### 8. Bottom Nav update

Update `src/components/layout/BottomNav.tsx`:
- Replace Stats (BarChart2) with Listening (Headphones from lucide-react)
- New nav items order: Home | Vocab | Listening | Grammar | Badges
- Stats page is still accessible from Dashboard/other links, just not in bottom nav

```typescript
import { LayoutDashboard, BookOpen, Headphones, PenTool, Trophy } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/vocabulary', label: 'Vocab', icon: BookOpen },
  { to: '/listening', label: 'Listen', icon: Headphones },
  { to: '/grammar', label: 'Grammar', icon: PenTool },
  { to: '/achievements', label: 'Badges', icon: Trophy },
];
```

### 9. Event subscribers update

In `src/services/eventSubscribers.ts`, add handlers for dictation events if not already present:
- `dictation:correct` → award 10 XP, update dailyLog
- `dictation:session_complete` → if all correct, award 30 bonus XP

## Important constraints
- Do NOT change any existing UI/visual behavior (except BottomNav as specified)
- Do NOT break existing functionality
- Follow existing code patterns: lazy routes, motion animations, dark mode support
- Use existing audioService for playback
- Use existing toast system
- Reuse existing styling patterns (Card, rounded-2xl, border, etc.)
- Answer checking must be EXACT (no fuzzy matching) — case-insensitive + trim only
- For sentences, Web Speech API only (no Dictionary API audio for full sentences)
- Commit message: `feat: add listening practice with dictation modes and bottom nav`

## After implementing
Run `pnpm build` to verify no TypeScript errors.
