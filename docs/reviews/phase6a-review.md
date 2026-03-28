# Code Review: Phase 6A — AI Service Layer + AI Chat + AI Hub

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-28
**Commit:** 39ec48e — feat: add Phase 6A — AI service layer, AI Chat, AI Hub, and navigation update
**Files:** 26 files, +2465 lines

---

## Status: NEEDS CHANGES

---

## 🔴 Critical (phải fix)

### 1. AbortController cho fetch — memory leak
- **Files:** `geminiProvider.ts`, `groqProvider.ts`, `useAIChat.ts`
- **Vấn đề:** Fetch không có AbortController → nếu user rời page hoặc unmount component, request vẫn chạy → memory leak, state update trên unmounted component
- **Fix:** Thêm AbortController vào provider `chat()` method (accept `signal` param). Trong `useAIChat`, tạo AbortController ref, pass signal vào `aiService.chat()`, abort on cleanup

### 2. Rate limiter `acquire()` silent fail
- **File:** `rateLimiter.ts` lines 49-56, 62-69
- **Vấn đề:** Sau 2 lần retry (`delay` + `tryConsume`), nếu vẫn fail thì `tryConsume()` return false nhưng code không check → request đi qua dù rate limit
- **Fix:** Sau retry cuối, nếu `tryConsume()` return false → throw `RateLimitError`

### 3. `sendMessage` race condition — double-click
- **File:** `useAIChat.ts`
- **Vấn đề:** `isLoading` check dùng stale closure value. Double-click nhanh có thể gửi 2 request vì cả 2 đều thấy `isLoading = false`
- **Fix:** Dùng `useRef` cho loading state hoặc `sendingRef.current` flag set đồng bộ trước async logic

---

## 🟡 Important (nên fix)

### 4. AISettings default status `'valid'` khi có key
- **File:** `AISettings.tsx` — `ProviderCard` line `useState<KeyStatus>(() => (key ? 'valid' : 'none'))`
- **Vấn đề:** Có key trong localStorage → auto set 'valid' mà chưa test. Key cũ/hết hạn sẽ hiện ✅ sai
- **Fix:** Default là `'untested'` hoặc auto-test khi mount (gọi `testConnection()` trong useEffect nếu key exists)

### 5. `formatContent` regex quá aggressive
- **File:** `ChatBubble.tsx` line 11 — `content.replace(/\n*❌[\s\S]*$/, '')`
- **Vấn đề:** Strip mọi thứ từ ký tự ❌ đầu tiên trở đi. Nếu AI dùng ❌ trong conversational text (ví dụ "That's ❌ wrong approach"), toàn bộ phần sau bị cắt
- **Fix:** Regex cần chặt hơn — match block correction pattern `❌...→...✅` thay vì bất kỳ ❌ nào

### 6. Duplicate `ApiError` class
- **Files:** `geminiProvider.ts:6`, `groqProvider.ts:7`
- **Vấn đề:** Cùng class `ApiError` define 2 lần
- **Fix:** Extract sang `aiProvider.ts` hoặc file common, import dùng chung

### 7. Xóa conversation không confirm
- **File:** `useAIChat.ts` → `deleteConversation`
- **Vấn đề:** Delete trực tiếp không hỏi user. Mất toàn bộ conversation history
- **Fix:** Thêm confirm dialog trước khi xóa (có thể handle ở `ConversationList.tsx`)

---

## ✅ OK (không cần sửa)

### AI Service Layer
- `aiProvider.ts` — Interface đúng design ✅
- `geminiProvider.ts` — URL, model, format đúng ✅
- `groqProvider.ts` — OpenAI-compatible đúng ✅
- `aiService.ts` — Fallback logic, singleton ✅
- `promptTemplates.ts` — 4 prompts khớp design, thêm "valid JSON only" — cải tiến tốt ✅

### Database
- `database.ts` — Version 4, 4 tables mới, backward-compatible ✅
- `models.ts` — Tất cả interfaces đúng design ✅

### AI Chat
- `useAIChat.ts` — 20-message context, parseCorrections, XP, EventBus đúng ✅
- `AIChatPage.tsx` — Layout, AIKeyRequired check, `navigate()` dùng đúng (handleNewChat) ✅
- `ChatInput.tsx` — Auto-resize, Enter/Shift+Enter ✅
- `ConversationList.tsx` — List, relative time ✅
- `CorrectionHighlight.tsx` — Visual đúng design ✅
- `TopicSuggestions.tsx` — 6 gợi ý, grid ✅

### AI Hub + Navigation + Settings
- `AIHubPage.tsx` — 3 cards, Writing + Roleplay "Sắp có" ✅
- `AIKeyRequired.tsx` — Banner + link ✅
- `AISettings.tsx` — 2 providers, show/hide, test, collapsible, warning — khớp Section 11 ✅
- `SettingsPage.tsx` — Import + section id="ai" ✅

### Routes + Events
- `routes/index.tsx` — 3 routes đúng ✅
- `eventBus.ts` — 3 events mới ✅
- `constants.ts` — XP values đúng ✅

---

## Lưu ý về review trước

Review trước mình report bug `window.location.href` ở AIChatPage — nhưng xem lại code thì `handleNewChat` đã dùng `navigate()` đúng. `useAIChat.sendMessage` cũng dùng `navigate()`. Bug này **không tồn tại** (có thể đã fix hoặc report sai). Đã bỏ khỏi list.

Nav restructure (BottomNav/Sidebar gom thành 4 tab) — defer sang phase sau, không block.

---

## Verdict

Fix **3 critical + 4 important** items rồi báo lại. Code quality overall tốt, architecture đúng design.

