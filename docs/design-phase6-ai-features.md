# Design: Phase 6 — AI-Powered Features

**Author:** Marcus (Tech Lead)  
**Date:** 2026-03-28  
**Status:** Pending Alex confirm

---

## 1. AI Provider Selection

### Đề xuất: Gemini (Primary) + Groq (Fallback)

| Provider | Free Tier | Ưu điểm | Nhược điểm |
|----------|-----------|----------|-------------|
| **Gemini 2.0 Flash** ✅ | 15 RPM, 1M TPD | Chất lượng cao, structured output, free tier rộng | Cần API key |
| **Groq** (fallback) | 30 RPM, 6K TPM (llama-3.1-8b) | Inference cực nhanh (<100ms) | Token limit thấp, model nhỏ hơn |
| Cloudflare Workers AI | 10K neurons/day | Serverless | Cần deploy Worker riêng, phức tạp |
| HuggingFace | Free inference | Nhiều model | Chậm, không stable |

**Quyết định:**
- **Primary:** Gemini 2.0 Flash — free 1M tokens/ngày, đủ ~500 conversations/day cho personal app
- **Fallback:** Groq (llama-3.1-8b-instant) — khi Gemini rate limit hoặc down
- Gọi REST API trực tiếp từ browser (cả 2 đều support CORS), KHÔNG cần backend
- API key lưu `localStorage` → config trong Settings page

---

## 2. Core AI Service Layer

Nền tảng chung cho cả 3 features — build trước, dùng chung.

### File Structure

```
src/services/ai/
├── aiProvider.ts          # Interface + types
├── geminiProvider.ts      # Gemini REST API client
├── groqProvider.ts        # Groq REST API client (OpenAI-compatible)
├── aiService.ts           # Orchestrator: routing, retry, fallback
├── promptTemplates.ts     # System prompts cho từng feature
└── rateLimiter.ts         # Client-side rate limiting
```

### Provider Interface

```typescript
// services/ai/aiProvider.ts

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  text: string;
  usage?: { inputTokens: number; outputTokens: number };
}

interface AIProvider {
  name: string;
  chat(messages: AIMessage[], config?: { maxTokens?: number; temperature?: number }): Promise<AIResponse>;
  isAvailable(): boolean;  // có API key hay không
}
```

### AI Service (Orchestrator)

```typescript
// services/ai/aiService.ts

class AIService {
  private providers: AIProvider[];  // [gemini, groq] — ordered by priority
  private rateLimiter: RateLimiter;

  async chat(messages: AIMessage[], opts?: { feature: string }): Promise<AIResponse> {
    await this.rateLimiter.acquire(opts?.feature);
    for (const provider of this.providers) {
      if (!provider.isAvailable()) continue;
      try {
        return await provider.chat(messages);
      } catch (e) {
        if (isRateLimitError(e)) continue;  // try next provider
        throw e;
      }
    }
    throw new AIUnavailableError('No AI provider available');
  }
}

export const aiService = new AIService();
```

### Rate Limiter
```typescript
// services/ai/rateLimiter.ts
// Token bucket: 10 req/min global, 5 req/min per feature
// Nếu vượt → queue request, hiện loading (không fail ngay)
```

### API Endpoints (gọi trực tiếp, không cần SDK)
- **Gemini:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={KEY}`
- **Groq:** `POST https://api.groq.com/openai/v1/chat/completions` (OpenAI-compatible format, header `Authorization: Bearer {KEY}`)

### Settings UI

```
src/features/settings/
└── components/
    └── AISettings.tsx     # [MỚI] Input Gemini key + Groq key (optional)
```

Hiển thị: input field cho API key, test connection button, status indicator (✅ connected / ❌ invalid).

---

## 3. Feature Designs

### 3.1 AI Tutor Chat

**Mô tả:** Chat tự do với AI để luyện tiếng Anh. AI sửa lỗi grammar/spelling, giải thích bằng tiếng Việt, gợi ý cách nói tự nhiên hơn.

#### File Structure

```
src/features/ai-chat/
├── pages/
│   └── AIChatPage.tsx              # Conversation list + chat UI
├── components/
│   ├── ConversationList.tsx        # List conversations (sidebar/drawer)
│   ├── ChatBubble.tsx              # Message bubble (user/AI)
│   ├── ChatInput.tsx               # Text input + send button
│   ├── CorrectionHighlight.tsx     # Render ❌→✅ corrections inline
│   └── TopicSuggestions.tsx        # Gợi ý chủ đề khi bắt đầu conversation mới
└── hooks/
    └── useAIChat.ts                # Chat state, send message, manage conversations
```

#### System Prompt

```
You are a friendly English tutor for Vietnamese learners (CEFR {level}).

Rules:
- Reply in English. Keep sentences appropriate for the user's level.
- If the user makes grammar/spelling mistakes, correct them using this format:
  ❌ {wrong} → ✅ {correct} — {giải thích bằng tiếng Việt}
- Place corrections at the END of your reply, after your conversational response.
- If the user writes in Vietnamese, reply in English and translate key phrases.
- Be warm, encouraging, patient. Use emoji occasionally.
- Keep responses under 150 words.
- Suggest follow-up questions to keep the conversation going.
```

#### Data Models

```typescript
interface ChatConversation {
  id: string;              // crypto.randomUUID()
  title: string;           // Auto-generated from first message
  createdAt: number;
  updatedAt: number;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  corrections?: Correction[];
  timestamp: number;
}

interface Correction {
  wrong: string;
  correct: string;
  explanation: string;     // Tiếng Việt
}
```

#### Conversation Flow

```
1. User mở AI Chat → thấy list conversations + nút "New Chat"
2. New Chat → TopicSuggestions hiện gợi ý: "Talk about your day", "Describe your hobby", etc.
3. User gửi message → append to conversation history
4. Gọi aiService.chat() với:
   - System prompt (với user's CEFR level từ UserProfile)
   - Last 20 messages (trim cũ hơn để tiết kiệm tokens)
5. AI response → parse corrections (regex: ❌...→ ✅...—...)
6. Render: conversational text trước, corrections block riêng (CorrectionHighlight)
7. Save messages to IndexedDB
```

#### Token Management
- Max 20 messages trong context window (trim oldest, giữ system prompt)
- Estimated: ~200 tokens/message × 20 = 4K tokens/request → Gemini xử lý thoải mái

#### XP Rules
- +5 XP per message gửi
- +10 XP bonus nếu message không có correction (viết đúng hoàn toàn)
- EventBus: `emit('chat:message-sent', { corrections: number })`

---

### 3.2 Writing Practice

**Mô tả:** User chọn prompt → viết essay/đoạn văn → AI chấm điểm chi tiết + feedback + bản sửa.

#### File Structure

```
src/features/writing/
├── pages/
│   └── WritingPage.tsx             # Prompt picker → editor → feedback
├── components/
│   ├── PromptPicker.tsx            # Grid of prompts by level/type
│   ├── WritingEditor.tsx           # Textarea + word count + timer
│   ├── WritingFeedback.tsx         # Score breakdown + corrections + improved version
│   └── WritingHistory.tsx          # Past submissions list
└── hooks/
    └── useWritingPractice.ts       # Submit, get feedback, save
```

#### Writing Prompts (Built-in JSON)

```typescript
// src/data/writing-prompts.json

interface WritingPrompt {
  id: string;
  level: CEFRLevel;
  type: 'essay' | 'email' | 'story' | 'description';
  title: string;           // English
  titleVi: string;         // Vietnamese
  prompt: string;          // Full instructions in English
  promptVi: string;        // Vietnamese translation
  minWords: number;        // A1: 30, A2: 80
  maxWords: number;        // A1: 100, A2: 200
  hints: string[];         // Từ vựng/cấu trúc gợi ý
}
```

**Ví dụ prompts:**
```json
[
  {
    "id": "describe-daily-routine",
    "level": "A1",
    "type": "description",
    "title": "My Daily Routine",
    "titleVi": "Thói quen hàng ngày của tôi",
    "prompt": "Describe your daily routine. What do you do in the morning, afternoon, and evening?",
    "promptVi": "Mô tả thói quen hàng ngày. Bạn làm gì vào buổi sáng, chiều, và tối?",
    "minWords": 30,
    "maxWords": 100,
    "hints": ["wake up", "have breakfast", "go to work/school", "come home", "go to bed"]
  },
  {
    "id": "email-friend-invitation",
    "level": "A2",
    "type": "email",
    "title": "Invite a Friend",
    "titleVi": "Mời bạn đi chơi",
    "prompt": "Write an email to invite your friend to a birthday party this weekend. Include date, time, location, and what to bring.",
    "promptVi": "Viết email mời bạn đến tiệc sinh nhật cuối tuần. Ghi rõ ngày, giờ, địa điểm, và cần mang gì.",
    "minWords": 60,
    "maxWords": 150,
    "hints": ["Dear...", "I would like to invite you", "It will be at...", "Please bring...", "Looking forward to"]
  }
]
```

Cần seed **ít nhất 15 prompts** (5 per type: essay, email, description; mix A1/A2).

#### AI Feedback Format

Yêu cầu AI trả JSON structured:

```
You are an English writing tutor for Vietnamese learners (level {level}).

The student wrote about: "{promptTitle}"
Prompt: "{prompt}"

Student's writing:
"{userText}"

Evaluate and respond in this exact JSON format:
{
  "overallScore": <1-10>,
  "categories": {
    "grammar": {
      "score": <1-10>,
      "issues": [
        { "original": "<exact text from student>", "correction": "<corrected version>", "rule": "<grammar rule in Vietnamese>" }
      ]
    },
    "vocabulary": {
      "score": <1-10>,
      "feedback": "<feedback in Vietnamese>"
    },
    "coherence": {
      "score": <1-10>,
      "feedback": "<feedback in Vietnamese>"
    },
    "taskCompletion": {
      "score": <1-10>,
      "feedback": "<did they address the prompt fully? in Vietnamese>"
    }
  },
  "improvedVersion": "<rewritten version of student's text>",
  "encouragement": "<motivational message in Vietnamese>",
  "vocabSuggestions": ["<useful words/phrases they could have used>"]
}
```

#### Data Models

```typescript
interface WritingSubmission {
  id: string;              // crypto.randomUUID()
  promptId: string;
  content: string;         // User's text
  wordCount: number;
  feedback: WritingFeedback | null;  // null = pending/failed
  overallScore: number;
  submittedAt: number;
}

interface WritingFeedback {
  overallScore: number;
  categories: {
    grammar: { score: number; issues: GrammarIssue[] };
    vocabulary: { score: number; feedback: string };
    coherence: { score: number; feedback: string };
    taskCompletion: { score: number; feedback: string };
  };
  improvedVersion: string;
  encouragement: string;
  vocabSuggestions: string[];
}

interface GrammarIssue {
  original: string;
  correction: string;
  rule: string;
}
```

#### User Flow

```
1. WritingPage → PromptPicker: grid of prompts (filter by level, type)
2. User chọn prompt → WritingEditor:
   - Hiển thị prompt + hints
   - Textarea (auto-resize)
   - Word count indicator (min/max)
   - "Submit" button (disabled nếu < minWords)
3. Submit → loading spinner → aiService.chat() với feedback prompt
4. Parse JSON response → WritingFeedback component:
   - Overall score (circular progress)
   - Category breakdown (4 bars)
   - Grammar issues (expandable, highlight original → correction)
   - Improved version (toggle show/hide)
   - Encouragement message
5. Save to IndexedDB
6. WritingHistory: list past submissions, tap to review
```

#### XP Rules
- XP = overallScore × 10 (max 100 XP per submission)
- Bonus +20 XP nếu score >= 8
- EventBus: `emit('writing:submitted', { score, wordCount })`

---

### 3.3 Conversation Roleplay

**Mô tả:** Đóng vai hội thoại với AI theo kịch bản thực tế (gọi món, hỏi đường, phỏng vấn...). AI ở trong vai, không sửa lỗi real-time — sửa ở cuối session.

#### File Structure

```
src/features/roleplay/
├── pages/
│   └── RoleplayPage.tsx            # Scenario picker + conversation + summary
├── components/
│   ├── ScenarioGrid.tsx            # Grid of scenario cards
│   ├── ScenarioCard.tsx            # Card with icon, title, description, level
│   ├── RoleplayChat.tsx            # Chat UI (in-character)
│   ├── RoleplayHeader.tsx          # Show scenario context, turn count, exit button
│   ├── HintButton.tsx              # "Gợi ý" — show suggested phrase
│   └── RoleplaySummary.tsx         # End-of-session: AI feedback + corrections
└── hooks/
    └── useRoleplay.ts              # Scenario state, conversation, summary generation
```

#### Scenarios (Built-in JSON)

```typescript
// src/data/scenarios.json

interface Scenario {
  id: string;
  title: string;
  titleVi: string;
  description: string;      // English, short
  descriptionVi: string;
  level: CEFRLevel;
  category: 'daily' | 'travel' | 'work' | 'social';
  icon: string;              // Emoji
  aiRole: string;            // System prompt context for AI
  userRole: string;          // Displayed to user
  userRoleVi: string;
  goal: string;              // What user should accomplish
  goalVi: string;
  suggestedPhrases: string[];  // Hints user can reveal
  maxTurns: number;          // 8-12
  openingLine: string;       // AI speaks first to set the scene
}
```

**Ví dụ scenarios:**
```json
[
  {
    "id": "restaurant-order",
    "title": "At a Restaurant",
    "titleVi": "Tại nhà hàng",
    "description": "Order food at a restaurant",
    "descriptionVi": "Gọi món tại nhà hàng",
    "level": "A1",
    "category": "daily",
    "icon": "🍽️",
    "aiRole": "You are a friendly waiter at a casual restaurant. The menu has: Burger ($8), Pasta ($10), Salad ($6), Soup ($5). Drinks: Water (free), Juice ($3), Coffee ($4). Be helpful and suggest popular items if asked.",
    "userRole": "You are a customer ordering food",
    "userRoleVi": "Bạn là khách hàng đang gọi món",
    "goal": "Order a main dish and a drink, ask about the price, and pay",
    "goalVi": "Gọi 1 món chính + 1 đồ uống, hỏi giá, thanh toán",
    "suggestedPhrases": ["Can I see the menu?", "I'd like to order...", "How much is...?", "Can I have the bill?"],
    "maxTurns": 10,
    "openingLine": "Welcome! Table for one? Right this way. Here's your menu. Can I get you something to drink while you decide?"
  },
  {
    "id": "hotel-checkin",
    "title": "Hotel Check-in",
    "titleVi": "Nhận phòng khách sạn",
    "description": "Check in at a hotel",
    "descriptionVi": "Làm thủ tục nhận phòng",
    "level": "A1",
    "category": "travel",
    "icon": "🏨",
    "aiRole": "You are a hotel receptionist. The guest has a reservation under their name for 2 nights, room 305 (standard room, $50/night). Breakfast is included (7-10 AM). Wi-Fi password: hotel2026. Check-out is at 11 AM.",
    "userRole": "You are a guest checking into a hotel",
    "userRoleVi": "Bạn là khách đang nhận phòng",
    "goal": "Check in, ask about breakfast time, Wi-Fi, and check-out time",
    "goalVi": "Nhận phòng, hỏi giờ ăn sáng, Wi-Fi, và giờ trả phòng",
    "suggestedPhrases": ["I have a reservation", "What time is breakfast?", "What's the Wi-Fi password?", "What time is check-out?"],
    "maxTurns": 8,
    "openingLine": "Good afternoon! Welcome to Sunrise Hotel. Do you have a reservation with us?"
  }
]
```

Cần seed **ít nhất 8 scenarios** (2 per category: daily, travel, work, social; mix A1/A2).

#### System Prompt (During Roleplay)

```
You are roleplaying as: {aiRole}

Rules:
- Stay in character at ALL times. Never break character.
- Use natural, conversational English appropriate for level {level}.
- Keep responses short (1-3 sentences) to maintain conversation flow.
- After every 2-3 turns, introduce a small new element to keep it interesting.
- If user seems stuck (very short or confused response), give a gentle in-character hint.
- Do NOT correct grammar during the roleplay.
- After {maxTurns} turns, naturally wrap up the conversation.
```

#### Summary Prompt (After Roleplay Ends)

```
You just had a roleplay conversation with a Vietnamese English learner (level {level}).
Scenario: {title}
Goal: {goal}

Conversation:
{messages}

Provide a performance review in this JSON format:
{
  "goalCompleted": <true/false>,
  "goalFeedback": "<did they accomplish the goal? in Vietnamese>",
  "fluency": <1-10>,
  "fluencyFeedback": "<Vietnamese>",
  "grammarIssues": [
    { "original": "<what user said>", "correction": "<correct version>", "explanation": "<Vietnamese>" }
  ],
  "usefulPhrases": ["<phrases they used well>"],
  "phrasesToLearn": ["<phrases they should practice>"],
  "overallFeedback": "<encouraging summary in Vietnamese>"
}
```

#### Data Models

```typescript
interface RoleplaySession {
  id: string;
  scenarioId: string;
  messages: RoleplayMessage[];
  status: 'in-progress' | 'completed';
  summary?: RoleplaySummary | null;
  startedAt: number;
  completedAt?: number;
}

interface RoleplayMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface RoleplaySummary {
  goalCompleted: boolean;
  goalFeedback: string;
  fluency: number;
  fluencyFeedback: string;
  grammarIssues: { original: string; correction: string; explanation: string }[];
  usefulPhrases: string[];
  phrasesToLearn: string[];
  overallFeedback: string;
}
```

#### User Flow

```
1. RoleplayPage → ScenarioGrid: scenarios by category, show level badge
2. User chọn scenario → RoleplayChat:
   - Header: scenario title, user's role (Vietnamese), goal, turn counter
   - AI speaks first (openingLine)
   - User replies → aiService.chat() with roleplay system prompt
   - HintButton: tap → reveal next suggestedPhrase (không gọi AI)
3. After maxTurns OR user taps "End Conversation":
   - Loading → aiService.chat() with summary prompt + full conversation
   - RoleplaySummary:
     - Goal completed? ✅/❌
     - Fluency score (progress bar)
     - Grammar corrections (expandable list)
     - Useful phrases (highlight green)
     - Phrases to learn (highlight yellow)
     - Overall feedback (Vietnamese)
4. Save session to IndexedDB
```

#### Token Management
- Roleplay max 12 turns = ~24 messages → ~5K tokens/request, OK cho Gemini
- Summary request gửi full conversation → ~6K tokens, vẫn OK

#### XP Rules
- +50 XP per completed roleplay
- +20 bonus nếu goalCompleted = true
- +10 bonus nếu fluency >= 7
- EventBus: `emit('roleplay:completed', { scenarioId, goalCompleted, fluency })`

---

## 4. DB Migration

**Dexie version 3 → version 4:**

```typescript
this.version(4).stores({
  // Existing — unchanged
  words: 'id, topic, cefrLevel',
  wordProgress: 'wordId, nextReview, status',
  grammarLessons: 'id, level, completed',
  dailyLogs: 'date',
  userProfile: 'id',
  dictionaryCache: 'word, cachedAt',
  dailyChallenges: 'date',
  customTopics: '++id, name, createdAt',
  customWords: '++id, topicId, word, createdAt',

  // NEW — Phase 6
  chatConversations: 'id, updatedAt',
  chatMessages: 'id, conversationId, timestamp',
  writingSubmissions: 'id, promptId, submittedAt',
  roleplaySessions: 'id, scenarioId, completedAt',
});
```

Thêm types vào `db/models.ts`. Backward-compatible (thêm tables, không sửa existing).

---

## 5. Routes (Thêm mới)

```
/ai-chat                    → AIChatPage (conversation list + new chat)
/ai-chat/:conversationId    → AIChatPage (existing conversation)
/writing                    → WritingPage (prompt picker + editor + feedback)
/writing/:submissionId      → WritingPage (review past submission)
/roleplay                   → RoleplayPage (scenario grid)
/roleplay/:scenarioId       → RoleplayPage (active session)
```

---

## 6. Navigation Update

**Hiện tại:** BottomNav = Dashboard / Vocabulary / Grammar / Stats

**Đề xuất:** Thêm "AI" tab → mở AI Hub page

```
BottomNav: Dashboard / Learn / AI / Stats

/learn → gom Vocabulary + Grammar + Pronunciation + Listening + Reading + Daily Challenge
/ai    → AI Hub page (grid 3 cards):
  - 💬 AI Chat
  - ✍️ Writing Practice
  - 🎭 Roleplay
```

```
src/features/ai-hub/
└── pages/
    └── AIHubPage.tsx       # Grid of 3 AI feature cards, link to each
```

---

## 7. Complete New File Structure

```
src/
├── services/
│   └── ai/                              # [MỚI] Core AI layer
│       ├── aiProvider.ts
│       ├── geminiProvider.ts
│       ├── groqProvider.ts
│       ├── aiService.ts
│       ├── promptTemplates.ts
│       └── rateLimiter.ts
│
├── features/
│   ├── ai-hub/                          # [MỚI] AI features landing
│   │   └── pages/AIHubPage.tsx
│   │
│   ├── ai-chat/                         # [MỚI] Feature 1
│   │   ├── pages/AIChatPage.tsx
│   │   ├── components/
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── CorrectionHighlight.tsx
│   │   │   └── TopicSuggestions.tsx
│   │   └── hooks/useAIChat.ts
│   │
│   ├── writing/                         # [MỚI] Feature 2
│   │   ├── pages/WritingPage.tsx
│   │   ├── components/
│   │   │   ├── PromptPicker.tsx
│   │   │   ├── WritingEditor.tsx
│   │   │   ├── WritingFeedback.tsx
│   │   │   └── WritingHistory.tsx
│   │   └── hooks/useWritingPractice.ts
│   │
│   ├── roleplay/                        # [MỚI] Feature 3
│   │   ├── pages/RoleplayPage.tsx
│   │   ├── components/
│   │   │   ├── ScenarioGrid.tsx
│   │   │   ├── ScenarioCard.tsx
│   │   │   ├── RoleplayChat.tsx
│   │   │   ├── RoleplayHeader.tsx
│   │   │   ├── HintButton.tsx
│   │   │   └── RoleplaySummary.tsx
│   │   └── hooks/useRoleplay.ts
│   │
│   └── settings/
│       └── components/
│           └── AISettings.tsx           # [MỚI] API key config
│
├── data/
│   ├── writing-prompts.json             # [MỚI] 15+ prompts
│   └── scenarios.json                   # [MỚI] 8+ scenarios
│
├── db/
│   ├── database.ts                      # [SỬA] version 4 + new tables
│   └── models.ts                        # [SỬA] new interfaces
│
└── routes/
    └── index.tsx                         # [SỬA] add new routes
```

---

## 8. Dependencies

**Không cần thêm package mới.**

- AI API: `fetch()` trực tiếp (REST)
- UUID: `crypto.randomUUID()` (browser built-in)
- JSON parsing: built-in

---

## 9. Implementation Order

```
Step 1: AI Service Layer
  → aiProvider.ts, geminiProvider.ts, groqProvider.ts
  → aiService.ts, rateLimiter.ts
  → AISettings.tsx (Settings page)
  → DB migration v4

Step 2: AI Tutor Chat
  → useAIChat.ts hook
  → ChatBubble, ChatInput, CorrectionHighlight, TopicSuggestions, ConversationList
  → AIChatPage.tsx
  → promptTemplates.ts (chat prompt)

Step 3: Writing Practice
  → writing-prompts.json (seed data)
  → useWritingPractice.ts hook
  → PromptPicker, WritingEditor, WritingFeedback, WritingHistory
  → WritingPage.tsx
  → promptTemplates.ts (writing prompt)

Step 4: Conversation Roleplay
  → scenarios.json (seed data)
  → useRoleplay.ts hook
  → ScenarioGrid, ScenarioCard, RoleplayChat, RoleplayHeader, HintButton, RoleplaySummary
  → RoleplayPage.tsx
  → promptTemplates.ts (roleplay + summary prompts)

Step 5: Integration
  → AIHubPage.tsx
  → Navigation update (Learn / AI tabs)
  → Routes update
  → XP/Achievement events (EventBus integration)
```

---

## 10. Edge Cases & Notes

1. **No API Key:** Non-AI features 100% hoạt động. AI features hiện banner "Cần cài đặt API key" + link Settings
2. **Rate Limit:** Queue + loading indicator. Cả 2 providers fail → "Hết lượt hôm nay, thử lại mai"
3. **JSON Parse Fail:** AI trả JSON không valid → retry 1 lần với prompt "respond in valid JSON only". Fail lần 2 → hiện raw text
4. **Offline:** AI features disabled, hiện "Cần kết nối internet"
5. **Token Limits:** Chat: max 20 messages context. Writing: max 500 words input. Roleplay: max 12 turns
6. **API Key Security:** localStorage OK cho personal app. Hiện warning "Không chia sẻ API key"
7. **CORS:** Gemini API + Groq API đều support browser CORS ✅
8. **Gemini capacity:** Free 1M tokens/day ≈ 500 conversations — dư sức cho 1 người dùng

---

*Design by Marcus — pending Alex confirm*

---

## 11. AI Settings / API Key UI (Bổ sung)

Yêu cầu từ Trung: trang Settings phải có hướng dẫn lấy key ngay trong UI, kèm link trực tiếp.

### File Structure

```
src/features/settings/
└── components/
    └── AISettings.tsx           # [MỚI] Full API key management UI
```

### UI Layout

```
┌─────────────────────────────────────────────┐
│  ⚙️ Cài đặt AI                              │
│                                             │
│  ╔═══════════════════════════════════════╗   │
│  ║  🤖 Gemini (Chính)                    ║   │
│  ║                                       ║   │
│  ║  API Key:                             ║   │
│  ║  [•••••••••••••••••] [👁️] [Test]      ║   │
│  ║                                       ║   │
│  ║  📋 Cách lấy key:                     ║   │
│  ║  1. Truy cập Google AI Studio         ║   │
│  ║  2. Đăng nhập bằng tài khoản Google   ║   │
│  ║  3. Nhấn "Create API Key"             ║   │
│  ║  4. Copy key và dán vào ô trên        ║   │
│  ║                                       ║   │
│  ║  🔗 Lấy key tại đây                   ║   │
│  ║  https://aistudio.google.com/apikey   ║   │
│  ║                                       ║   │
│  ║  Status: ✅ Đã kết nối                 ║   │
│  ╚═══════════════════════════════════════╝   │
│                                             │
│  ╔═══════════════════════════════════════╗   │
│  ║  ⚡ Groq (Dự phòng — không bắt buộc)  ║   │
│  ║                                       ║   │
│  ║  API Key:                             ║   │
│  ║  [                        ] [👁️] [Test]║   │
│  ║                                       ║   │
│  ║  📋 Cách lấy key:                     ║   │
│  ║  1. Truy cập Groq Console             ║   │
│  ║  2. Đăng ký tài khoản (miễn phí)      ║   │
│  ║  3. Vào Settings → API Keys           ║   │
│  ║  4. Nhấn "Create API Key"             ║   │
│  ║  5. Copy key và dán vào ô trên        ║   │
│  ║                                       ║   │
│  ║  🔗 Lấy key tại đây                   ║   │
│  ║  https://console.groq.com/keys        ║   │
│  ║                                       ║   │
│  ║  Status: ⚪ Chưa cài đặt              ║   │
│  ╚═══════════════════════════════════════╝   │
│                                             │
│  ⚠️ API key chỉ lưu trên thiết bị này.     │
│  Không chia sẻ key với người khác.          │
│                                             │
│  ℹ️ Cả hai provider đều miễn phí.           │
│  Gemini: ~1M tokens/ngày                   │
│  Groq: ~6K tokens/phút                     │
└─────────────────────────────────────────────┘
```

### Component Props & Logic

```typescript
// AISettings.tsx

interface ProviderConfig {
  id: 'gemini' | 'groq';
  name: string;
  label: string;            // "Chính" | "Dự phòng"
  icon: string;             // emoji
  keyUrl: string;           // Direct link to get API key
  steps: string[];          // Step-by-step instructions (Vietnamese)
  required: boolean;        // Gemini = true, Groq = false
  placeholder: string;      // "AIza..." | "gsk_..."
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'gemini',
    name: 'Gemini',
    label: 'Chính',
    icon: '🤖',
    keyUrl: 'https://aistudio.google.com/apikey',
    steps: [
      'Truy cập Google AI Studio',
      'Đăng nhập bằng tài khoản Google',
      'Nhấn "Create API Key"',
      'Copy key và dán vào ô trên',
    ],
    required: true,
    placeholder: 'AIza...',
  },
  {
    id: 'groq',
    name: 'Groq',
    label: 'Dự phòng — không bắt buộc',
    icon: '⚡',
    keyUrl: 'https://console.groq.com/keys',
    steps: [
      'Truy cập Groq Console',
      'Đăng ký tài khoản (miễn phí)',
      'Vào Settings → API Keys',
      'Nhấn "Create API Key"',
      'Copy key và dán vào ô trên',
    ],
    required: false,
    placeholder: 'gsk_...',
  },
];
```

### Key Features

1. **Show/Hide toggle (👁️):** Input type password ↔ text
2. **Test button:** Gọi API nhẹ (Gemini: list models, Groq: list models) để verify key hợp lệ
3. **Status indicator:**
   - ✅ Đã kết nối (key valid, test passed)
   - ❌ Key không hợp lệ (test failed)
   - ⚪ Chưa cài đặt (no key)
   - 🔄 Đang kiểm tra... (testing)
4. **Auto-save:** Lưu vào localStorage ngay khi user nhập (debounce 500ms)
5. **Instructions collapsible:** Default mở cho provider chưa có key, đóng cho đã có key
6. **Link mở tab mới:** `target="_blank" rel="noopener noreferrer"`

### Test Connection Endpoints

```typescript
// Gemini — lightweight test
GET https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}
// Success: 200 + list of models
// Invalid key: 400 or 403

// Groq — lightweight test  
GET https://api.groq.com/openai/v1/models
Headers: { Authorization: 'Bearer {API_KEY}' }
// Success: 200 + list of models
// Invalid key: 401
```

### localStorage Keys

```typescript
const STORAGE_KEYS = {
  geminiApiKey: 'wordflow_gemini_api_key',
  groqApiKey: 'wordflow_groq_api_key',
};
```

### AI Features — No Key State

Khi user chưa nhập API key, các trang AI (Chat, Writing, Roleplay) hiển thị:

```
┌─────────────────────────────────────┐
│                                     │
│  🔑 Cần cài đặt API Key            │
│                                     │
│  Để sử dụng tính năng AI, bạn cần  │
│  cài đặt API key miễn phí.         │
│                                     │
│  [Cài đặt ngay →]                  │
│  (link to /settings#ai)            │
│                                     │
└─────────────────────────────────────┘
```

Component: `AIKeyRequired.tsx` (shared, dùng chung cho 3 feature pages)

```
src/components/common/
└── AIKeyRequired.tsx        # [MỚI] Banner "cần API key" + link Settings
```

### Route

Settings page đã có (`/settings`). Thêm section AI vào, anchor `#ai` để deep link.

---

*Bổ sung by Marcus — theo yêu cầu Trung*
