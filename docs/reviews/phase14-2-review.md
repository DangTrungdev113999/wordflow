# Review: Phase 14-2 — Fill-in-blank + Speed Listening + Listen & Choose

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-30
**Branch:** feature/phase14-2-new-modes
**Commit:** 02d4af8

---

## Status: NEEDS CHANGES (2 Critical + 2 Medium)

### 🔴🔴 CRITICAL — Build-breaking

#### 1. [P1] Duplicate `ListeningMode` type
**File:** `src/lib/types.ts:6-8`

Có 2 khai báo `ListeningMode` → `TS2300: Duplicate identifier`. Xóa khai báo cũ (line 8).

#### 2. [P1] Duplicate `playAudio` function
**File:** `src/services/audioService.ts:98-109`

Đã có `playAudio()` ở line 35 (async, Promise, AbortSignal). Commit thêm bản mới ở line 98 (sync, đơn giản) → `TS2393: Duplicate function`. Xóa bản mới, dùng bản có sẵn.

### 🔴 Issues cần fix

#### 3. [P2] Fallback blanking không có word boundary
**File:** `useFillBlank.ts:58`

Primary `blankWord()` dùng `\b` regex nhưng fallback dùng raw `String.replace()` → "at" blank "**at**tention".

**Fix:** Dùng cùng regex `\b` cho fallback.

#### 4. [P2] `isPlaying` desync
**Files:** `SpeedListeningSession.tsx:67-73`, `ListenChooseSession.tsx:72-77`

`finally + setTimeout(500ms)` desync với actual speech duration. Dùng Promise resolution hoặc `onEnd` callback — không cần cả hai.

### 🟡 Nice-to-have

#### 5. [LOW] Triple shuffle — extract shared util
3 hooks đều có Fisher-Yates giống nhau.

#### 6. [LOW] Speed bar không fill 100%
`SpeedListeningSession.tsx:105` — max 1.5x chỉ show 66.7%. Sửa formula: `((speed - 0.75) / 0.75) * 100`.

#### 7. [LOW] Hint slow-replay và main play desync isPlaying
`FillBlankSession.tsx:39-40` — `playSentence()` track isPlaying nhưng hint `playAudio()` không.

### Summary

2 P1 build-breaking phải fix ngay. 2 P2 logic bugs. Fix 4 items đó là merge được.
