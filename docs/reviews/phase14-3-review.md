# Review: Phase 14-3 — Conversation + News/Story Listening

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-31
**Branch:** feature/phase14-3-ai-content
**Commit:** ab92549

---

## Status: NEEDS CHANGES (1 Critical + 3 Medium)

### ✅ Những phần tốt

- **listeningContentService** — Gemini prompt structured, cache Dexie 30 ngày, flow đúng design
- **Conversation/Story hooks** — multi-voice, paragraph-by-paragraph, comprehension quiz đúng flow
- **ConversationSession** — 2-phase UI, speaker lines, translation toggle
- **StorySession** — paragraph progress, key vocab highlight
- **ComprehensionQuiz** — shared component, explanation per question
- **PlaybackControls** — speed selector, prev/next/play
- **Dexie schema** — version bump đúng, listeningContent table
- **Types** — ConversationContent, StoryContent match design

### 🔴 Issues cần fix

#### 1. [P1] Perfect bonus XP hiển thị nhưng không award
**Files:** `useConversationListening.ts:214`, `useStoryListening.ts:196`, `eventSubscribers.ts:92-104`

UI tính `correctCount * 15 + perfectBonus(20)` nhưng subscriber chỉ award `questionsCorrect * 15`. `listening_comprehension_perfect: 20` trong constants không dùng.

**Fix:** Thêm perfect bonus check trong eventSubscribers:
```ts
if (questionsCorrect === totalQuestions) {
  addXP(XP_VALUES.listening_comprehension_perfect);
}
```

#### 2. [P2] JSON parse không có protection
**File:** `listeningContentService.ts:111, 170`

`JSON.parse(response.text)` không try/catch. Gemini hay wrap output trong `` ```json ``. Cần strip markdown fences + try/catch.

#### 3. [P2] Không validate AI response
**File:** `listeningContentService.ts:112-122, 171-183`

Trust blindly `parsed.speakers`, `parsed.lines`, etc. AI omit 1 field → crash ở render. Cần check required arrays exist + length > 0.

#### 4. [P2] Dynamic Tailwind classes bị purge
**File:** `ComprehensionQuiz.tsx:73, 131, 153, 191, 236`

`` text-${accentColor}-600 `` → purge không detect. Cần lookup map với full class strings.

### 🟡 Nice-to-have

#### 5. [LOW] playAll luôn restart từ đầu thay vì resume
`useConversationListening.ts:142`, `useStoryListening.ts:127`

#### 6. [LOW] Cache key thiếu CEFR level
`listeningContentService.ts:17, 34` — key chỉ `conv_${topic}`, nên thêm level

#### 7. [LOW] Unused import AnimatePresence
`ConversationSession.tsx:3`

### Summary

Architecture đúng design, UI 2-phase clean. 1 P1 XP bug + 3 P2 robustness issues cần fix. Fix xong merge được.
