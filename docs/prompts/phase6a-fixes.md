# Task: Fix Phase 6A review issues (3 critical + 4 important)

Read all files mentioned below carefully before making changes.

## 🔴 Critical Fixes

### C1. AbortController for fetch calls
**Files:** `src/services/ai/aiProvider.ts`, `src/services/ai/geminiProvider.ts`, `src/services/ai/groqProvider.ts`, `src/services/ai/aiService.ts`, `src/features/ai-chat/hooks/useAIChat.ts`

- Add optional `signal?: AbortSignal` to `AIProvider.chat()` config and `AIService.chat()` opts
- Pass `signal` to `fetch()` calls in both providers
- In `useAIChat.ts`: create AbortController ref, pass signal to aiService.chat(), abort on unmount cleanup and when sending new message

### C2. Rate limiter silent fail
**File:** `src/services/ai/rateLimiter.ts`

- After retry attempts exhausted, if `tryConsume()` still returns false, throw a `RateLimitExceededError`
- Export the error class from `aiProvider.ts` or rateLimiter.ts

### C3. Double-click race condition
**File:** `src/features/ai-chat/hooks/useAIChat.ts`

- Add a `useRef` flag (e.g. `isSendingRef`) that is set synchronously at the start of `sendMessage` before any async work
- Check this ref at the top of sendMessage instead of relying on `isLoading` state

## 🟡 Important Fixes

### I4. AISettings auto-test on mount
**File:** `src/features/settings/components/AISettings.tsx`

- When component mounts with an existing key, default status to `'untested'` instead of `'valid'`
- Auto-trigger `testConnection()` on mount if key exists
- Add `'untested'` to KeyStatus type and render it as neutral (e.g. "Chưa kiểm tra" with a gray icon)

### I5. formatContent regex too aggressive
**File:** `src/features/ai-chat/components/ChatBubble.tsx`

- Change regex from `/\n*❌[\s\S]*$/` to specifically match correction block pattern: lines starting with `❌` followed by `→` and `✅`
- Only strip lines that match the correction format `❌ ... → ✅ ... — ...`

### I6. Duplicate ApiError → extract to shared file
**Files:** `src/services/ai/aiProvider.ts`, `src/services/ai/geminiProvider.ts`, `src/services/ai/groqProvider.ts`

- Move `ApiError` class to `aiProvider.ts` and export it
- Import from `aiProvider.ts` in both providers
- Remove duplicate definitions

### I7. Delete conversation confirmation
**File:** `src/features/ai-chat/components/ConversationList.tsx`

- Add `window.confirm('Xóa cuộc trò chuyện này?')` before calling delete
- Also make delete button visible on mobile (not just hover)

## After fixing
- Run `pnpm build` to verify no TypeScript errors
- Fix any build errors
- Do NOT change any other files or features

Systematically debug: reproduce → hypothesize → verify each fix.
