# WordFlow — Architecture & Tech Stack

## 1. Overview

WordFlow là **client-side SPA** (Single Page Application) — không cần backend server. Toàn bộ data (progress, stats, settings) lưu trên browser via IndexedDB. Vocabulary + grammar content là built-in JSON datasets, bundle cùng app.

**Lý do không cần backend:**
- Không có user auth (personal app)
- Dictionary API là free, gọi trực tiếp từ client
- Data là local-first — phù hợp learning app cá nhân
- Deploy đơn giản (static hosting)

---

## 2. Tech Stack

| Layer | Choice | Lý do |
|-------|--------|-------|
| **Framework** | React 19 + TypeScript | Ecosystem lớn, component-based phù hợp UI phức tạp (flashcard, quiz) |
| **Build** | Vite 6 | Nhanh, HMR tốt, config đơn giản |
| **Routing** | React Router v7 | Standard, hỗ trợ nested routes cho grammar lessons |
| **Styling** | Tailwind CSS 4 | Utility-first, responsive nhanh, dark/light theme dễ |
| **State** | Zustand | Lightweight (~1KB), đơn giản hơn Redux, đủ cho app này |
| **Local DB** | Dexie.js (IndexedDB wrapper) | Structured data, query mạnh, async, lưu được nhiều data |
| **Charts** | Recharts | React-native, đủ chart types (line, bar, pie) cho stats |
| **Audio** | Web Speech API + HTML5 Audio | Browser built-in TTS (fallback) + audio URL từ Dictionary API |
| **Icons** | Lucide React | Lightweight, consistent, tree-shakeable |
| **Animation** | Framer Motion | Flashcard flip, page transitions, progress animations |
| **Linting** | ESLint + Prettier | Standard |
| **Package Manager** | pnpm | Nhanh, disk-efficient |

### External API
- **Free Dictionary API**: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
  - Gọi trực tiếp từ client (CORS enabled)
  - Cache response vào IndexedDB để tránh gọi lại
  - Fallback: nếu API fail → dùng built-in data

---

## 3. Project Structure

```
wordflow/
├── public/
│   ├── favicon.ico
│   └── manifest.json          # PWA manifest
├── src/
│   ├── main.tsx                # Entry point
│   ├── App.tsx                 # Root component + router
│   ├── index.css               # Tailwind imports + global styles
│   │
│   ├── components/             # Shared UI components
│   │   ├── ui/                 # Primitives: Button, Card, Modal, Badge, ProgressBar
│   │   ├── layout/             # Header, Sidebar, BottomNav, ThemeToggle
│   │   └── common/             # AudioButton, FlipCard, QuizOption, StreakFire
│   │
│   ├── features/               # Feature modules (domain logic + UI)
│   │   ├── vocabulary/
│   │   │   ├── components/     # WordCard, FlashcardDeck, TopicList, WordDetail
│   │   │   ├── hooks/          # useFlashcard, useSpacedRepetition
│   │   │   └── pages/          # VocabularyPage, TopicPage, FlashcardPage, WordDetailPage
│   │   │
│   │   ├── grammar/
│   │   │   ├── components/     # LessonCard, QuizRenderer, FillBlank, ErrorCorrection, SentenceOrder
│   │   │   ├── hooks/          # useQuiz, useGrammarProgress
│   │   │   └── pages/          # GrammarPage, LessonPage, QuizPage
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/     # StreakWidget, XPBar, StatsChart, ActivityCalendar
│   │   │   └── pages/          # DashboardPage, StatsPage
│   │   │
│   │   └── achievements/
│   │       ├── components/     # BadgeCard, LevelProgress, AchievementList
│   │       └── pages/          # AchievementsPage
│   │
│   ├── stores/                 # Zustand stores
│   │   ├── vocabularyStore.ts  # Word list, current topic, flashcard state
│   │   ├── grammarStore.ts     # Lesson progress, quiz state
│   │   ├── progressStore.ts    # XP, streak, daily goals
│   │   └── settingsStore.ts    # Theme, daily word count, notifications
│   │
│   ├── db/                     # Dexie database
│   │   ├── database.ts         # DB schema + init
│   │   ├── models.ts           # TypeScript interfaces cho DB tables
│   │   └── migrations.ts       # Schema versioning
│   │
│   ├── services/               # Business logic (thuần function, không UI)
│   │   ├── spacedRepetition.ts # SM-2 algorithm implementation
│   │   ├── dictionaryApi.ts    # Free Dictionary API client + cache
│   │   ├── xpEngine.ts         # XP calculation rules
│   │   ├── achievementEngine.ts# Badge unlock logic
│   │   └── audioService.ts     # Audio playback (API audio + Web Speech fallback)
│   │
│   ├── data/                   # Built-in JSON datasets
│   │   ├── vocabulary/
│   │   │   ├── daily-life.json
│   │   │   ├── food-drink.json
│   │   │   ├── travel.json
│   │   │   ├── business.json
│   │   │   ├── technology.json
│   │   │   └── _index.ts       # Re-export all topics
│   │   │
│   │   ├── grammar/
│   │   │   ├── present-simple.json
│   │   │   ├── past-simple.json
│   │   │   ├── articles.json
│   │   │   └── _index.ts
│   │   │
│   │   └── achievements.json   # Badge definitions
│   │
│   ├── hooks/                  # Shared hooks
│   │   ├── useAudio.ts
│   │   ├── useTheme.ts
│   │   └── useDaily.ts         # Daily reset logic (streak check, new day)
│   │
│   ├── lib/                    # Utilities
│   │   ├── constants.ts        # XP values, streak rules, CEFR levels
│   │   ├── utils.ts            # Date helpers, formatters
│   │   └── types.ts            # Shared TypeScript types
│   │
│   └── routes/                 # Route definitions
│       └── index.tsx           # createBrowserRouter config
│
├── docs/
│   └── architecture.md         # This file
├── PROJECT.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── eslint.config.js
└── README.md
```

---

## 4. Database Schema (Dexie/IndexedDB)

### Tables

```typescript
// db/models.ts

interface Word {
  id: string;                    // "topic:word" e.g. "food:apple"
  word: string;
  meaning: string;               // Nghĩa tiếng Việt
  ipa: string;                   // Phiên âm IPA
  audioUrl?: string;             // URL từ Dictionary API (cached)
  example: string;               // Ví dụ câu
  topic: string;                 // "daily-life" | "food" | ...
  cefrLevel: "A1" | "A2";
}

interface WordProgress {
  wordId: string;                // FK → Word.id
  easeFactor: number;            // SM-2: default 2.5
  interval: number;              // SM-2: days until next review
  repetitions: number;           // SM-2: consecutive correct
  nextReview: number;            // Timestamp
  lastReview: number;            // Timestamp
  status: "new" | "learning" | "review" | "mastered";
}

interface GrammarLesson {
  id: string;                    // "present-simple"
  title: string;
  level: "A1" | "A2";
  completed: boolean;
  bestScore: number;             // % accuracy
  attempts: number;
}

interface DailyLog {
  date: string;                  // "2025-03-27"
  wordsLearned: number;
  wordsReviewed: number;
  grammarCompleted: number;
  quizAccuracy: number;          // 0-100
  xpEarned: number;
  minutesSpent: number;
}

interface UserProfile {
  id: "default";                 // Singleton
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;        // For streak calculation
  dailyGoal: number;             // Words per day (default: 10)
  theme: "light" | "dark" | "system";
  badges: string[];              // Achievement IDs earned
  createdAt: number;
}
```

### Indexes
```typescript
// db/database.ts
const db = new Dexie("WordFlowDB");

db.version(1).stores({
  words: "id, topic, cefrLevel",
  wordProgress: "wordId, nextReview, status",
  grammarLessons: "id, level, completed",
  dailyLogs: "date",
  userProfile: "id"
});
```

---

## 5. Key Algorithms & Logic

### 5.1 SM-2 Spaced Repetition

```
// services/spacedRepetition.ts

Input: quality (0-5) — user's self-rating after seeing answer
  0-2 = incorrect/hard → reset
  3   = correct with difficulty
  4   = correct
  5   = perfect

Algorithm:
  if quality >= 3:
    if repetitions == 0: interval = 1
    elif repetitions == 1: interval = 6
    else: interval = round(interval * easeFactor)
    repetitions += 1
  else:
    repetitions = 0
    interval = 1

  easeFactor = max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
  nextReview = now + interval days
```

**Flashcard flow:**
1. Query words WHERE `nextReview <= now` OR `status = "new"` (limit daily goal)
2. Show front (word) → user taps to flip → show back (meaning, IPA, example)
3. User rates: "Again" (0) / "Hard" (2) / "Good" (4) / "Easy" (5)
4. Update WordProgress, award XP

### 5.2 XP Engine

```
// services/xpEngine.ts

XP_VALUES = {
  flashcard_correct: 10,
  flashcard_easy: 15,
  flashcard_hard: 5,
  quiz_correct: 10,
  quiz_perfect_score: 50,      // Bonus: 100% on a quiz
  lesson_complete: 30,
  daily_goal_met: 100,         // Bonus khi đạt daily goal
  streak_bonus: (streak) => min(streak * 5, 50)  // Max 50 bonus/day
}

LEVELS = [
  { level: 1, xpRequired: 0, title: "Beginner" },
  { level: 2, xpRequired: 200, title: "Learner" },
  { level: 3, xpRequired: 500, title: "Explorer" },
  { level: 4, xpRequired: 1000, title: "Achiever" },
  { level: 5, xpRequired: 2000, title: "Scholar" },
  { level: 6, xpRequired: 4000, title: "Expert" },
  { level: 7, xpRequired: 7000, title: "Master" },
  { level: 8, xpRequired: 10000, title: "Legend" }
]
```

### 5.3 Streak Logic

```
// hooks/useDaily.ts — chạy khi app mở

On app open:
  today = formatDate(now)
  yesterday = formatDate(now - 1 day)

  if lastActiveDate == today:
    → do nothing (already active today)
  elif lastActiveDate == yesterday:
    → streak continues (don't increment yet — increment on first activity)
  else:
    → streak = 0 (broken)

On first activity of the day:
  if lastActiveDate != today:
    currentStreak += 1
    lastActiveDate = today
    longestStreak = max(longestStreak, currentStreak)
    create DailyLog for today
```

### 5.4 Achievement Engine

```
// services/achievementEngine.ts

Sau mỗi action → check all achievement conditions:

ACHIEVEMENTS = [
  { id: "streak_3",    condition: streak >= 3,        badge: "🔥 3-Day Streak" },
  { id: "streak_7",    condition: streak >= 7,        badge: "🔥 Week Warrior" },
  { id: "streak_30",   condition: streak >= 30,       badge: "🔥 Monthly Master" },
  { id: "words_50",    condition: totalWords >= 50,    badge: "📖 Bookworm" },
  { id: "words_100",   condition: totalWords >= 100,   badge: "🏆 Centurion" },
  { id: "words_500",   condition: totalWords >= 500,   badge: "🌟 Word Wizard" },
  { id: "grammar_10",  condition: lessonsCompleted >= 10, badge: "📝 Grammar Pro" },
  { id: "perfect_quiz",condition: quizScore == 100,    badge: "💯 Perfectionist" },
  { id: "first_word",  condition: totalWords >= 1,     badge: "🌱 First Steps" },
  { id: "night_owl",   condition: hour >= 22,          badge: "🦉 Night Owl" }
]

Khi unlock → toast notification + animate badge
```

---

## 6. Data Flow

### 6.1 Vocabulary Learning Flow
```
App Start
  → useDaily hook: check streak, reset daily counters
  → Load topics from built-in JSON (src/data/vocabulary/)
  → Load word progress from IndexedDB

User chọn topic
  → Filter words by topic + CEFR level
  → Query WordProgress: tách "due for review" vs "new words"
  → Prioritize: review words first, then new (up to daily goal)

Flashcard Session
  → Show word → User flips → Show answer + audio
  → User rates (Again/Hard/Good/Easy)
  → SM-2 update WordProgress in IndexedDB
  → XP awarded → check achievements → check daily goal

Word Detail (tap for more info)
  → Check IndexedDB cache for Dictionary API response
  → If miss → fetch from dictionaryapi.dev → cache response
  → Display: full definitions, IPA, audio, synonyms, examples
```

### 6.2 Grammar Quiz Flow
```
User chọn grammar lesson
  → Load lesson content from built-in JSON
  → Show theory page (markdown-like content)
  → User taps "Start Quiz"

Quiz Engine
  → Render questions by type:
    - multiple_choice: 4 options, 1 correct
    - fill_blank: text input, validate against answer(s)
    - error_correction: highlight error in sentence, pick fix
    - sentence_order: drag/tap to reorder words
  → Track correct/incorrect per question
  → After all questions → show score + XP earned
  → Update GrammarLesson progress in IndexedDB
```

---

## 7. Routing

```
/                          → DashboardPage (home)
/vocabulary                → TopicListPage (browse topics)
/vocabulary/:topic         → WordListPage (words in topic)
/vocabulary/:topic/learn   → FlashcardPage (study session)
/vocabulary/word/:word     → WordDetailPage (dictionary lookup)
/grammar                   → GrammarListPage (all lessons)
/grammar/:lessonId         → LessonPage (theory)
/grammar/:lessonId/quiz    → QuizPage
/stats                     → StatsPage (charts, history)
/achievements              → AchievementsPage (badges)
/settings                  → SettingsPage (theme, daily goal)
```

---

## 8. UI/UX Notes

- **Mobile-first responsive**: app chủ yếu dùng trên mobile browser
- **Bottom navigation**: Dashboard / Vocabulary / Grammar / Stats (mobile)
- **Sidebar navigation**: desktop
- **Dark/Light theme**: Tailwind `dark:` classes, toggle in settings
- **Flashcard animation**: Framer Motion 3D flip (rotateY)
- **Toast notifications**: khi earn XP, unlock badge, complete daily goal
- **Loading states**: skeleton screens, not spinners
- **Empty states**: illustration + CTA khi chưa có data

---

## 9. Build & Deploy

- **Dev**: `pnpm dev` → Vite dev server (localhost:5173)
- **Build**: `pnpm build` → static files in `dist/`
- **Deploy**: Vercel / Netlify / GitHub Pages (static hosting)
- **PWA** (optional Phase 3): service worker cho offline support, add-to-homescreen

---

## 10. Phase Mapping → Files

### Phase 1 — Foundation (MVP)
- Setup: `vite.config.ts`, `tailwind.config.ts`, `package.json`, `tsconfig.json`
- DB: `src/db/*`
- Data: `src/data/vocabulary/*.json` (ít nhất 3 topics, 20-30 words mỗi topic)
- Services: `spacedRepetition.ts`, `dictionaryApi.ts`, `audioService.ts`
- Features: `src/features/vocabulary/*`, `src/features/dashboard/` (basic)
- Components: `src/components/ui/*`, `src/components/layout/*`, `src/components/common/FlipCard.tsx`
- Routing: tất cả vocabulary routes + dashboard

### Phase 2 — Grammar & Quiz
- Data: `src/data/grammar/*.json` (5-10 lessons)
- Services: `xpEngine.ts`
- Features: `src/features/grammar/*`
- Components: `QuizRenderer`, `FillBlank`, `ErrorCorrection`, `SentenceOrder`
- Stores: `grammarStore.ts` update

### Phase 3 — Gamification & Polish
- Services: `achievementEngine.ts`
- Features: `src/features/achievements/*`
- Data: `src/data/achievements.json`
- Stats: charts with Recharts
- PWA: `manifest.json`, service worker
- UI: animations, responsive polish, theme toggle
- Data seeding: expand to 500+ words, 20+ grammar lessons

---

## 11. Data Format Examples

### Vocabulary JSON
```json
// src/data/vocabulary/daily-life.json
{
  "topic": "daily-life",
  "topicLabel": "Daily Life",
  "cefrLevel": "A1",
  "words": [
    {
      "word": "breakfast",
      "meaning": "bữa sáng",
      "ipa": "/ˈbrek.fəst/",
      "example": "I have breakfast at 7 AM every day.",
      "audioUrl": null
    },
    {
      "word": "morning",
      "meaning": "buổi sáng",
      "ipa": "/ˈmɔːr.nɪŋ/",
      "example": "Good morning! How are you?",
      "audioUrl": null
    }
  ]
}
```

### Grammar JSON
```json
// src/data/grammar/present-simple.json
{
  "id": "present-simple",
  "title": "Present Simple Tense",
  "level": "A1",
  "theory": {
    "sections": [
      {
        "heading": "Cấu trúc",
        "content": "**Khẳng định:** S + V(s/es)\n**Phủ định:** S + do/does + not + V\n**Nghi vấn:** Do/Does + S + V?",
        "examples": [
          { "en": "She **works** every day.", "vi": "Cô ấy làm việc mỗi ngày." },
          { "en": "I **don't like** coffee.", "vi": "Tôi không thích cà phê." }
        ]
      }
    ]
  },
  "exercises": [
    {
      "type": "multiple_choice",
      "question": "She ___ to school every day.",
      "options": ["go", "goes", "going", "gone"],
      "answer": 1
    },
    {
      "type": "fill_blank",
      "question": "They ___ (not/play) tennis on Mondays.",
      "acceptedAnswers": ["don't play", "do not play"]
    },
    {
      "type": "error_correction",
      "sentence": "He don't like pizza.",
      "correctSentence": "He doesn't like pizza.",
      "errorIndex": [1]
    },
    {
      "type": "sentence_order",
      "words": ["every", "she", "morning", "runs"],
      "answer": "She runs every morning."
    }
  ]
}
```

---

## 12. Edge Cases & Notes

- **Offline**: IndexedDB works offline. Dictionary API calls fail gracefully → dùng built-in data
- **Data loss**: IndexedDB có thể bị clear bởi browser. Phase 3 có thể thêm export/import JSON
- **Dictionary API rate limit**: Không documented, nhưng cache aggressively để giảm calls
- **Audio**: Một số từ không có audio từ API → fallback Web Speech API (`speechSynthesis`)
- **Mobile Safari**: IndexedDB có quirks ở private mode → detect và warn user
- **SM-2 timezone**: Dùng local date (không UTC) cho "ngày mới" — user học ở VN timezone
