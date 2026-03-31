# Review: Phase 14-4 — Accent Exposure + Note-taking + Polish

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-04-01
**Branch:** feature/phase14-4-polish
**Commit:** 40b0d67

---

## Status: NEEDS CHANGES (3 Medium)

### ✅ Những phần tốt

- **AccentExposure** — 3 accents, 12 items (4/accent), voice selection, compare panel ✅
- **NoteTaking** — Gemini scoring, content reuse từ listeningContentService, 2-phase UI ✅
- **ListeningPage redesign** — 4 categories đúng design ✅
- **DictationModeSelector** — category labels organized ✅
- **Types/events/routes** — đúng, ListeningMode mở rộng ✅

### 🔴 Issues cần fix

#### 1. [MEDIUM] Pitch fallback không wire vào playAudio
**File:** `useAccentExposure.ts:12`

`pitch` defined per accent config (US 1.0, UK 1.1, AU 0.95) nhưng **không pass vào `playAudio()`**. Design spec: pitch là fallback khi không có accent-specific voice. Thiếu pitch → tất cả accents nghe giống nhau trên devices không có accent voices.

**Fix:** Thêm `pitch` vào PlayOptions của audioService và pass khi gọi:
```ts
playAudio(word, { voice: config.voice, pitch: config.pitch, rate: 0.9 });
```

#### 2. [MEDIUM] Dead `seenAccents` state — mutated directly
**File:** `useAccentExposure.ts:97, 138-139`

`useState<Set>` mutated via `.add()` → React không detect. Và accent count đã derive từ `answers` ở line 190 → `seenAccents` là dead code.

**Fix:** Xóa `seenAccents` state + lines 138-139.

#### 3. [MEDIUM] ListeningStats defined nhưng không dùng
**File:** `models.ts:290`, `ListeningPage.tsx`

Design spec §4.3 yêu cầu stats section (total XP, best streak) ở bottom ListeningPage. `ListeningStats` interface có nhưng không consume.

**Fix:** Thêm simple stats display, hoặc defer sang follow-up (nhưng cần note TODO).

### 🟡 Nice-to-have

#### 4. [LOW] NoteTaking hint index = -1
`NoteTakingSession.tsx:49` — `currentParagraphIndex = -1` ban đầu → meaning hint undefined. Dùng `Math.max(0, idx)`.

#### 5. [LOW] Compare panel same IPA cho 3 accents
`AccentExposureSession.tsx:348` — VocabWord chỉ có 1 IPA. Known data limitation.

#### 6. [LOW] modeBreakdown dùng `Record<string>` thay vì `Record<ListeningMode>`
`models.ts:296`

### Summary

Core logic solid — accent exposure, Gemini note scoring, page redesign đúng design. 3 medium issues: pitch fallback thiếu (quan trọng nhất — ảnh hưởng UX), dead state, stats chưa implement. Fix xong → Phase 14 complete!
