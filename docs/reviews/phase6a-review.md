# Code Review: Phase 6A — AI Service Layer + AI Chat + AI Hub

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-28
**Commit:** 39ec48e — feat: add Phase 6A — AI service layer, AI Chat, AI Hub, and navigation update
**Files:** 26 files, +2465 lines

---

## Status: NEEDS CHANGES (3 issues)

---

## Issue 1 — BUG: Full page reload khi chọn conversation
- **File:** `src/features/ai-chat/pages/AIChatPage.tsx` ~line 42
- **Vấn đề:** Dùng `window.location.href = /ai-chat/${id}` → full page reload, mất React state
- **Fix:** Đổi sang `navigate(`/ai-chat/${id}`)` dùng `useNavigate()` từ React Router (hook đã import trong useAIChat)
- **Severity:** Medium — UX kém, app reload mỗi lần chuyển conversation

## Issue 2 — DESIGN MISMATCH: BottomNav chưa restructure
- **File:** `src/components/layout/BottomNav.tsx`
- **Vấn đề:** Design đề xuất 4 tab: Dashboard / Learn / AI / Stats. Code hiện có 5 tab: Home / Vocab / Listen / Grammar / AI. Chưa gom vào tab "Learn"
- **Severity:** Low — Có thể defer sang phase sau, nhưng ghi nhận khác design

## Issue 3 — DESIGN MISMATCH: Sidebar chưa restructure
- **File:** `src/components/layout/Sidebar.tsx`
- **Vấn đề:** Tương tự BottomNav — 9 mục riêng lẻ thay vì gom theo cấu trúc design
- **Severity:** Low — Có thể defer

---

## Files OK (24/26)

### AI Service Layer ✅
- `aiProvider.ts` — Interface AIProvider, AIMessage, AIResponse khớp design
- `geminiProvider.ts` — URL, model gemini-2.0-flash, localStorage key đúng
- `groqProvider.ts` — OpenAI-compatible format, Bearer auth đúng
- `aiService.ts` — Fallback [gemini → groq], rateLimiter, singleton OK
- `rateLimiter.ts` — Token bucket 10 req/min global, 5 req/min per feature OK
- `promptTemplates.ts` — 4 prompts khớp design, thêm "valid JSON only" cho structured output — cải tiến tốt

### Database ✅
- `database.ts` — Version 4, 4 tables mới, backward-compatible
- `models.ts` — Tất cả interfaces đúng design

### AI Chat ✅
- `useAIChat.ts` — 20-message context, parseCorrections regex ❌→✅—, XP +5/+10, EventBus OK
- `ChatBubble.tsx` — User/AI phân biệt, strip corrections render riêng OK
- `ChatInput.tsx` — Auto-resize, Enter/Shift+Enter OK
- `ConversationList.tsx` — List, new chat, delete, relative time OK
- `CorrectionHighlight.tsx` — Wrong (đỏ gạch) → correct (xanh), explanation OK
- `TopicSuggestions.tsx` — 6 gợi ý, grid, click gửi OK

### AI Hub + Navigation ✅
- `AIHubPage.tsx` — 3 cards, Writing + Roleplay "Sắp có" OK
- `AIKeyRequired.tsx` — Banner + link /settings#ai OK
- `AISettings.tsx` — 2 providers, show/hide, test connection, 4 status, debounce 500ms, collapsible instructions, security warning — khớp 100% Section 11
- `SettingsPage.tsx` — Import AISettings, section id="ai" OK

### Routes + Events ✅
- `routes/index.tsx` — /ai, /ai-chat, /ai-chat/:conversationId OK
- `eventBus.ts` — 3 events mới đúng payload types
- `constants.ts` — XP values đúng

---

## Verdict

**Issue #1 (window.location.href) phải fix** — đây là bug ảnh hưởng UX.

Issue #2-3 (nav restructure) có thể defer — không ảnh hưởng functionality, AI tab đã được thêm đúng. Tuy nhiên sẽ cần restructure khi thêm nhiều features hơn.

Fix issue #1 xong thì PASS.
