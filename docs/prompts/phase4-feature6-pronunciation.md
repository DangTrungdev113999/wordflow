# Task: Implement Pronunciation Check for WordFlow app

## Context
WordFlow is a React + TypeScript English learning app using Vite, Dexie (IndexedDB), Zustand, React Router, Framer Motion, Tailwind CSS.

Key files:
- Flashcard deck: `src/features/vocabulary/components/FlashcardDeck.tsx` — renders front/back of flashcard with AudioButton and rating buttons
- Event bus: `src/services/eventBus.ts` — has `pronunciation:correct` and `pronunciation:incorrect` events
- Progress store: `src/stores/progressStore.ts` — has `addXP(amount)`
- Types: `src/lib/types.ts`
- Constants: `src/lib/constants.ts` — XP_VALUES has `pronunciation_correct: 5`

## What to do

### 1. Create `src/hooks/useSpeechRecognition.ts`

```typescript
interface SpeechRecognitionResult {
  transcript: string;
  alternatives: string[];
  confidence: number;
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Feature detection: check both standard and webkit prefix
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  async function startListening(lang = 'en-US'): Promise<SpeechRecognitionResult> {
    return new Promise((resolve, reject) => {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.lang = lang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;  // Get multiple alternatives for better matching
      recognition.continuous = false;

      setIsListening(true);
      setError(null);

      recognition.onresult = (event: any) => {
        const result = event.results[0];
        const alternatives = Array.from({ length: result.length }, (_, i) => 
          (result[i] as any).transcript.toLowerCase().trim()
        );
        resolve({
          transcript: alternatives[0],
          alternatives,
          confidence: result[0].confidence,
        });
      };

      recognition.onerror = (event: any) => {
        setError(event.error);
        setIsListening(false);
        reject(new Error(event.error));
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();

      // Auto-stop after 5 seconds
      setTimeout(() => {
        try { recognition.stop(); } catch {}
      }, 5000);
    });
  }

  return { isSupported, isListening, error, startListening };
}
```

### 2. Create `src/features/vocabulary/components/PronunciationButton.tsx`

A 🎤 button that appears on the flashcard BACK side.

**Props:**
```typescript
interface PronunciationButtonProps {
  word: string;      // target word to match against
  wordId: string;    // for event bus emission
}
```

**Behavior:**
- Only render if `isSupported` from useSpeechRecognition
- On tap: start listening, show recording indicator (pulsing red dot or mic animation)
- When result received: check ALL alternatives against target word (case-insensitive)
- If ANY alternative matches: correct ✅
- If none match: incorrect ❌
- Show PronunciationResult inline

**UI states:**
- Idle: 🎤 "Speak" button (small, subtle, next to AudioButton)
- Listening: pulsing animation, "Listening..." text
- Result: show PronunciationResult

### 3. Create `src/features/vocabulary/components/PronunciationResult.tsx`

Inline feedback shown after pronunciation attempt:

**Props:**
```typescript
interface PronunciationResultProps {
  isCorrect: boolean;
  spokenText: string;     // what the user said (best transcript)
  targetWord: string;     // what they should have said
  onDismiss: () => void;
}
```

**UI:**
- Correct: green text "✅ Great pronunciation!" with small checkmark animation
- Incorrect: red text "❌ Try again" + "You said: '{spokenText}'" + "Expected: '{targetWord}'"
- Auto-dismiss after 3 seconds, or tap to dismiss
- Compact inline display (not a modal)

### 4. Integrate into FlashcardDeck.tsx

Update `src/features/vocabulary/components/FlashcardDeck.tsx`:
- Add `wordId` prop (needed for event emission): `wordId?: string`
- In the `back` section of FlipCard, add PronunciationButton between the word details and bottom
- Position: below the example sentence, above the rating buttons area
- The FlashcardDeck already has AudioButton on the front — PronunciationButton goes on the back

The back section should look like:
```
meaning (bold)
IPA
example (italic)
[🔊 Listen] [🎤 Speak]   ← AudioButton + PronunciationButton side by side
```

### 5. Update FlashcardPage to pass wordId

In `src/features/vocabulary/pages/FlashcardPage.tsx`:
- Pass `wordId={topicId + ':' + currentWord.word}` to FlashcardDeck
- Or construct it however the wordId format works in the app

### 6. XP and events

In PronunciationButton:
- On correct: `eventBus.emit('pronunciation:correct', { wordId })` — the event subscriber handles XP (5 XP)
- On incorrect: `eventBus.emit('pronunciation:incorrect', { wordId })`
- Use existing event subscriber in eventSubscribers.ts (should already handle pronunciation events from Feature 1 setup)

Check that `src/services/eventSubscribers.ts` handles `pronunciation:correct`. If not, add:
```typescript
eventBus.on('pronunciation:correct', () => {
  const xp = XP_VALUES.pronunciation_correct; // 5
  useProgressStore.getState().addXP(xp);
});
```

## Important constraints
- Do NOT change any existing visual behavior except adding the pronunciation button to flashcard back
- Feature detection is CRITICAL — never show the button if browser doesn't support SpeechRecognition
- Firefox will not support this — the button simply won't appear
- Safari needs webkit prefix — handle it
- Check ALL alternatives from SpeechRecognition, not just the first one
- The button should be subtle/optional — it's a bonus feature, not required for flashcard flow
- Auto-stop recording after 5 seconds to prevent hanging
- Commit message: `feat: add pronunciation check with speech recognition on flashcards`

## After implementing
Run `pnpm build` to verify no TypeScript errors.
