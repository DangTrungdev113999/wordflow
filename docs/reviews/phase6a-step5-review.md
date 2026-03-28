# Code Review: Phase 6A Step 5 — Writing Practice + Conversation Roleplay

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-28
**Commit:** 620f5ab — feat: add Writing Practice and Conversation Roleplay features
**Files:** 18 files, +1973 lines

---

## Status: NEEDS CHANGES (2 issues)

---

## Issues

### 1. RoleplayPage — Missing `relative` class (Medium)
- **File:** `RoleplayPage.tsx` ~line 46
- **Vấn đề:** Parent div chứa overlay `absolute inset-0` nhưng thiếu `relative` → overlay position sai
- **Fix:** Thêm `relative` vào parent div

### 2. RoleplayPage — Route `:scenarioId` không được handle (Medium)
- **File:** `RoleplayPage.tsx`
- **Vấn đề:** Route `/roleplay/:scenarioId` đã đăng ký nhưng page không dùng `useParams()` để load scenario theo URL. Nếu user bookmark/share link `/roleplay/restaurant-order` sẽ không auto-load scenario
- **Fix:** Thêm `useParams()`, nếu có scenarioId thì auto-start scenario đó

---

## OK (16/18 files)

### Writing Practice ✅
- `writing-prompts.json` — 15 prompts, 3 types, mix A1/A2, đúng interface
- `useWritingPractice.ts` — JSON parse + retry, XP đúng, EventBus, AbortController OK
- `PromptPicker.tsx` — Filter level/type OK
- `WritingEditor.tsx` — Word count, minWords, hints OK
- `WritingFeedback.tsx` — Circular score, 4 categories, grammar issues, improved version OK
- `WritingHistory.tsx` — List + score + date OK
- `WritingPage.tsx` — Full flow + useParams OK

### Conversation Roleplay ✅
- `scenarios.json` — 8 scenarios, 4 categories, mix A1/A2, đúng interface
- `useRoleplay.ts` — openingLine, turns, maxTurns, summary, JSON parse + retry, XP, EventBus, AbortController, isSendingRef OK
- `ScenarioGrid.tsx` — Category filter OK
- `ScenarioCard.tsx` — Icon, title, level badge OK
- `RoleplayChat.tsx` — In-character, typing indicator OK
- `RoleplayHeader.tsx` — Title, turns, exit, goal OK
- `HintButton.tsx` — Reveal phrases one-by-one OK
- `RoleplaySummary.tsx` — Goal, fluency, grammar, phrases OK

### Routes + AIHub ✅
- Routes: 4 new routes OK
- AIHubPage: 3 features active OK

---

Fix 2 issues rồi PASS.
