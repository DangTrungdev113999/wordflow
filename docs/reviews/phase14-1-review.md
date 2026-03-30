# Review: Phase 14-1 — Hint System + Audio Engine

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-30
**Branch:** feature/phase14-1-hints-audio
**Commit:** e16437e

---

## Status: NEEDS CHANGES (3 Medium)

### ✅ Những phần tốt

- **audioService** — PlayOptions interface đúng design, playAudio() với rate/voice/signal, backward compat ✅
- **types.ts** — HintType, HintConfig, HintState, HINT_CONFIGS, MODE_HINT_AVAILABILITY — exact match design ✅
- **HintBar** — UI color-coded, AnimatePresence animation, disabled states ✅
- **DictationSessionPage** — integration clean, XP formula đúng `max(0, base - deducted)` ✅
- **Summary** — hint usage display đúng spec ✅

### 🔴 Issues cần fix

#### 1. [MEDIUM] Tailwind hover dead CSS
**File:** `HintBar.tsx:79`

Dynamic class `hover:${colors.activeBg}` → Tailwind purge không detect → hover styles bị mất.

**Fix:** Define full `hover:` variants trong HINT_COLORS object:
```ts
const HINT_COLORS = {
  'first-letter': { ..., hoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-900/40' },
  // ...
};
```

#### 2. [MEDIUM] Slow-replay chỉ trigger 1 lần
**File:** `useHints.ts:26-27`

Early return khi hint đã dùng → slow-replay không thể re-trigger. User cần nghe chậm nhiều lần (chỉ trừ XP lần đầu).

**Fix:** Special-case slow-replay — vẫn gọi `onSlowReplay()` khi đã used:
```ts
if (type === 'slow-replay' && usedHintsForCurrent.includes(type)) {
  onSlowReplay?.();
  return; // no additional penalty
}
```

#### 3. [MEDIUM] Unused import trong multiMeaningService
**File:** `multiMeaningService.ts:4`

`import { aiService }` không dùng → lint flag. Xóa.

### 🟡 Nice-to-have (không block merge)

#### 4. [LOW] Duplicate XP penalties
`constants.ts:22-26` và `HINT_CONFIGS` (types.ts) cùng define penalties. `useHints` chỉ đọc HINT_CONFIGS → constants.ts bị orphan. Nên single source of truth.

#### 5. [LOW] playAudio chưa check audioUrl cache
Design spec nói check audioUrl → HTML5 Audio với playbackRate. Hiện chỉ dùng Speech API. OK cho P14-1 nhưng cần cho P14-2+.

### Summary

Architecture đúng design, types/configs/availability matrix chính xác. 3 medium bugs cần fix: Tailwind hover broken, slow-replay one-shot, unused import. Fix xong merge được.
