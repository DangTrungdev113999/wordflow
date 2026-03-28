# Task: Implement Phase 6A — AI Chat + AI Hub + Navigation Update

Read `docs/design-phase6-ai-features.md` for full design spec.

## What's ALREADY DONE (don't redo):
- `src/services/ai/` — all 6 files (aiProvider, geminiProvider, groqProvider, aiService, promptTemplates, rateLimiter) ✅
- `src/components/common/AIKeyRequired.tsx` ✅
- `src/features/settings/components/AISettings.tsx` — EXISTS but has build error (useRef needs argument)
- `src/db/database.ts` — version 4 with chatConversations, chatMessages, writingSubmissions, roleplaySessions ✅
- `src/db/models.ts` — ChatConversation, ChatMessage, Correction, WritingSubmission, WritingFeedback, RoleplaySession, RoleplaySummary types ✅

## What to implement NOW:

### 1. Fix AISettings.tsx build error
- Line 97: `useRef<ReturnType<typeof setTimeout>>()` needs an argument → `useRef<ReturnType<typeof setTimeout> | undefined>(undefined)`

### 2. AI Tutor Chat (Section 3.1 in design doc)
Create these files:
- `src/features/ai-chat/hooks/useAIChat.ts` — Chat state, send message, manage conversations, parse corrections
- `src/features/ai-chat/components/ConversationList.tsx` — List conversations sidebar/drawer
- `src/features/ai-chat/components/ChatBubble.tsx` — Message bubble (user/AI)
- `src/features/ai-chat/components/ChatInput.tsx` — Text input + send button
- `src/features/ai-chat/components/CorrectionHighlight.tsx` — Render ❌→✅ corrections inline
- `src/features/ai-chat/components/TopicSuggestions.tsx` — Gợi ý chủ đề khi conversation mới
- `src/features/ai-chat/pages/AIChatPage.tsx` — Conversation list + chat UI

Key behavior:
- System prompt from `promptTemplates.chatSystemPrompt(level)`, level from UserProfile
- Max 20 messages in context window
- Parse corrections with regex: `❌...→ ✅...—...`
- Save messages to IndexedDB (db.chatConversations, db.chatMessages)
- XP: +5 per message, +10 bonus if no corrections
- EventBus: `emit('chat:message_sent', { corrections: number })`
- Check `aiService.hasAnyProvider()` → show AIKeyRequired if false

### 3. AI Hub Page (Section 6 in design doc)
- `src/features/ai-hub/pages/AIHubPage.tsx` — Grid of 3 AI feature cards:
  - 💬 AI Chat → /ai-chat
  - ✍️ Writing Practice → /writing (coming soon badge)
  - 🎭 Roleplay → /roleplay (coming soon badge)

### 4. Navigation Update (Section 6 in design doc)
- Update `src/components/layout/BottomNav.tsx`:
  - Replace Reading tab with AI tab: `{ to: '/ai', label: 'AI', icon: Sparkles }`
  - Keep: Home / Vocab / Listen / Grammar / AI
- Update `src/components/layout/Sidebar.tsx` (if exists) similarly

### 5. Routes Update
- Add to `src/routes/index.tsx`:
  - `/ai` → AIHubPage
  - `/ai-chat` → AIChatPage
  - `/ai-chat/:conversationId` → AIChatPage

### 6. Settings Page
- Ensure AISettings component is mounted in SettingsPage (check if already done)

## Design Requirements
- Design polished, production-grade UI, avoid generic AI look
- Follow existing patterns in the codebase (Tailwind, lucide-react icons, framer-motion)
- Mobile-first, dark mode support
- Vietnamese UI text where user-facing

## After implementing
- Run `pnpm build` to verify no TypeScript errors
- Fix any build errors found
