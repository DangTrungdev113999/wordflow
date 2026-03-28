# Phase 7: Interactive Learning Features — Architecture Design

## Tổng quan

3 features mới cho WordFlow:
1. **Daily Challenge v2** — nâng cấp từ 3 task cố định → dynamic mix exercises + streak system mạnh hơn
2. **Sentence Building** — exercise type mới, drag & drop xây dựng câu
3. **Learn from Media** — nhập URL → extract vocab + tạo quiz tự động

---

## Feature 1: 🎯 Daily Challenge v2

### Hiện trạng
- Đã có `src/features/daily-challenge/` với 3 task cố định: learnWord, grammarQuiz, dictation
- Seed-based chọn content theo ngày, XP 15/task + 50 bonus
- Streak tracking cơ bản trong `progressStore` (currentStreak, longestStreak)

### Approach — Nâng cấp, KHÔNG viết lại
Giữ nguyên cơ chế seed-based + daily persistence. Mở rộng thêm:
- **5 tasks/ngày** thay vì 3 (mix đa dạng hơn)
- **Task types mới**: sentence_building, media_vocab (khi Feature 2 & 3 xong)
- **Difficulty scaling** theo user CEFR level (từ userProfile.placement)
- **Streak rewards** — milestone bonuses (7 ngày, 30 ngày, 100 ngày)

### Files

| File | Action | Mô tả |
|------|--------|-------|
| `src/features/daily-challenge/useDailyChallenge.ts` | **Sửa** | Mở rộng TaskName type, thêm 5-task logic, difficulty filter |
| `src/features/daily-challenge/DailyChallengePage.tsx` | **Sửa** | Render 5 tasks, progress bar mới |
| `src/features/daily-challenge/ChallengeTaskList.tsx` | **Sửa** | 5 progress pills thay vì 3 |
| `src/features/daily-challenge/ChallengeSentenceBuildingTask.tsx` | **Tạo mới** | Wrapper cho SentenceBuilding exercise trong daily challenge |
| `src/features/daily-challenge/ChallengeMediaTask.tsx` | **Tạo mới** | Wrapper cho media vocab quiz trong daily challenge |
| `src/features/daily-challenge/streakRewards.ts` | **Tạo mới** | Streak milestone config + reward logic |
| `src/db/models.ts` | **Sửa** | Cập nhật DailyChallengeLog cho 5 tasks |

### Schema thay đổi

```typescript
// Cập nhật DailyChallengeLog
export interface DailyChallengeLog {
  date: string; // PK
  tasks: DailyChallengeTask[];
  completed: boolean;
  xpEarned: number;
}

export interface DailyChallengeTask {
  type: 'learnWord' | 'grammarQuiz' | 'dictation' | 'sentenceBuilding' | 'mediaVocab';
  contentId: string; // ID của word/exercise/media content
  completed: boolean;
  score?: number; // 0-100 cho các task có scoring
}

// Streak rewards config
export interface StreakMilestone {
  days: number;       // 7, 30, 100
  xpBonus: number;    // 100, 500, 2000
  badgeId: string;    // achievement badge
}
```

### Data Flow
1. User mở Daily Challenge → `useDailyChallenge` check date
2. Nếu chưa có challenge hôm nay → seed-based chọn 5 tasks (filter theo CEFR level)
3. Mỗi task hoàn thành → cập nhật IndexedDB + addXP
4. Hoàn thành 5/5 → bonus XP + check streak milestone
5. Streak update: so sánh với yesterday's log, nếu liên tục → increment

### Dexie Migration
```typescript
// Version 5 — upgrade daily challenges + add mediaSessions
this.version(5).stores({
  dailyChallenges: 'date', // PK giữ nguyên
}).upgrade(tx => {
  // Migrate old format {learnWord, grammarQuiz, dictation} → tasks[]
  return tx.table('dailyChallenges').toCollection().modify(challenge => {
    if (!Array.isArray(challenge.tasks)) {
      const oldTasks = challenge.tasks;
      challenge.tasks = [
        { type: 'learnWord', contentId: challenge.wordId || '', completed: oldTasks.learnWord },
        { type: 'grammarQuiz', contentId: '', completed: oldTasks.grammarQuiz },
        { type: 'dictation', contentId: '', completed: oldTasks.dictation },
      ];
      // Clean up legacy field after migration
      delete challenge.wordId;
    }
  });
});
```

### Streak Rewards Config
```typescript
export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3,   xpBonus: 50,   badgeId: 'streak-3' },
  { days: 7,   xpBonus: 100,  badgeId: 'streak-7' },
  { days: 14,  xpBonus: 200,  badgeId: 'streak-14' },
  { days: 30,  xpBonus: 500,  badgeId: 'streak-30' },
  { days: 100, xpBonus: 2000, badgeId: 'streak-100' },
];
```

### Notes
- Giữ backward compatible — migration cần handle old format
- Task pool mở rộng được: khi có Sentence Building + Media xong, thêm vào pool
- XP per task giữ 15, bonus hoàn thành tăng lên 75 (cho 5 tasks)

---

## Feature 2: 🧩 Sentence Building

### Hiện trạng
- Đã có `SentenceOrderExercise` type + `SentenceOrder` component trong grammar
- Tap-based (không drag & drop), dùng `originalIndex` track từ trùng

### Approach — Feature module mới + nâng cấp UX
Tạo feature riêng vì Sentence Building có gameplay khác grammar quiz:
- **Drag & Drop** (dnd-kit) thay vì tap-only
- **Hint system** — gợi ý vị trí từ đầu tiên
- **Difficulty levels** — số từ tăng dần, có distractor words
- **Data riêng** — sentences.json theo topics + CEFR levels
- **Reuse** SentenceOrder logic pattern nhưng UX khác hoàn toàn

### Library: @dnd-kit
- Lightweight, React-first, accessible
- `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`
- Touch support tốt (mobile PWA)

### Files

| File | Action | Mô tả |
|------|--------|-------|
| `src/features/sentence-building/` | **Tạo mới** | Feature module |
| `src/features/sentence-building/SentenceBuildingPage.tsx` | **Tạo mới** | Page chính: chọn topic/difficulty → bắt đầu |
| `src/features/sentence-building/SentenceBuildingExercise.tsx` | **Tạo mới** | Core exercise component với dnd-kit |
| `src/features/sentence-building/WordChip.tsx` | **Tạo mới** | Draggable word chip component |
| `src/features/sentence-building/DropZone.tsx` | **Tạo mới** | Drop area cho câu đang xây dựng |
| `src/features/sentence-building/HintButton.tsx` | **Tạo mới** | Hint logic — reveal vị trí 1 từ, giảm XP |
| `src/features/sentence-building/useSentenceBuilding.ts` | **Tạo mới** | Hook: session state, scoring, progress |
| `src/features/sentence-building/SentenceBuildingSummary.tsx` | **Tạo mới** | Kết quả session: score, XP, review |
| `src/data/sentences/` | **Tạo mới** | JSON data files theo topic + level |
| `src/data/sentences/_index.ts` | **Tạo mới** | Export ALL_SENTENCES |
| `src/lib/types.ts` | **Sửa** | Thêm SentenceBuildingExercise type |
| `src/routes/` | **Sửa** | Thêm route /sentence-building |

### Data Format

```typescript
// src/lib/types.ts — thêm mới
export interface SentenceBuildingExercise {
  id: string;
  sentence: string;           // câu đúng hoàn chỉnh
  translation: string;        // nghĩa tiếng Việt (hint)
  words: string[];            // từ đã xáo trộn
  distractors?: string[];     // từ nhiễu (difficulty hard)
  topic: string;
  cefrLevel: CEFRLevel;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Data file mẫu: src/data/sentences/daily-life.json
{
  "topic": "daily-life",
  "topicLabel": "Daily Life",
  "sentences": [
    {
      "id": "dl-001",
      "sentence": "I usually wake up at seven o'clock.",
      "translation": "Tôi thường thức dậy lúc 7 giờ.",
      "words": ["wake", "I", "at", "o'clock", "usually", "seven", "up"],
      "distractors": [],
      "cefrLevel": "A1",
      "difficulty": "easy"
    },
    {
      "id": "dl-002",
      "sentence": "She has been working here since last year.",
      "translation": "Cô ấy đã làm việc ở đây từ năm ngoái.",
      "words": ["has", "since", "She", "here", "year", "been", "last", "working"],
      "distractors": ["was", "did"],
      "cefrLevel": "B1",
      "difficulty": "hard"
    }
  ]
}
```

### Hook Logic

```typescript
// useSentenceBuilding.ts
interface SentenceBuildingState {
  exercises: SentenceBuildingExercise[];
  currentIndex: number;
  availableWords: WordItem[];   // {word, id, isDistractor}
  placedWords: WordItem[];
  hintsUsed: number;
  results: ExerciseResult[];
  isComplete: boolean;
}

// WordItem cần unique id (uuid) vì có thể trùng từ
interface WordItem {
  id: string;          // nanoid() — unique per chip
  word: string;
  originalIndex: number;
  isDistractor: boolean;
}

// Scoring: base 100 - (hintsUsed * 20) - (wrongAttempts * 10), min 0
// XP: 10 per sentence + accuracy bonus
```

### Drag & Drop Flow
1. Words hiện ở **Word Bank** (phía dưới) — xáo trộn random
2. User drag word lên **Drop Zone** (phía trên) — sắp xếp thành câu
3. Trong Drop Zone, user có thể **reorder** bằng drag (sortable)
4. Tap word trong Drop Zone → trả về Word Bank
5. Nhấn "Check" → validate, hiện Lottie animation
6. Sai → highlight từ sai (đỏ), cho thử lại
7. Dùng Hint → reveal 1 từ đúng vị trí (lock, không drag được nữa)

### Notes
- `@dnd-kit/sortable` cho reorder trong Drop Zone
- Touch sensors: `useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })`
- Distractor words chỉ cho difficulty 'hard' — tối đa 2 từ nhiễu
- Normalize comparison: lowercase, trim, punctuation cuối câu tự thêm

---

## Feature 3: 📰 Learn from Media

### Approach — AI-powered content extraction + quiz generation
User nhập URL → app extract text → AI phân tích → tạo vocab list + quiz.
Client-side only (không có backend), nên cần proxy hoặc extraction service.

### Content Extraction Strategy

| Source | Method |
|--------|--------|
| **Bài báo (text)** | Dùng free extract API: `https://extractorapi.com` hoặc `mozilla/readability` qua web worker |
| **YouTube video** | YouTube transcript API (free): lấy captions/subtitles |
| **Podcast** | Không extract trực tiếp — yêu cầu user paste transcript hoặc dùng URL có transcript |

**Ưu tiên đơn giản:** Hỗ trợ 2 input modes:
1. **URL mode** — paste URL bài báo, app tự extract (dùng proxy API)
2. **Text mode** — paste text trực tiếp (YouTube transcript, podcast notes, bất kỳ text nào)

### AI Processing Pipeline

```
Input (text) → AI Extract Vocab → AI Generate Quiz → Display
```

1. **Extract Vocab**: AI nhận text + user CEFR level → trả về 10-15 từ đáng học
2. **Generate Quiz**: Từ vocab list → AI tạo quiz (multiple choice + sentence building + fill blank)
3. **Save**: Lưu media session vào IndexedDB để review lại

### Files

| File | Action | Mô tả |
|------|--------|-------|
| `src/features/learn-media/` | **Tạo mới** | Feature module |
| `src/features/learn-media/LearnMediaPage.tsx` | **Tạo mới** | Page chính: input URL/text → processing → results |
| `src/features/learn-media/MediaInput.tsx` | **Tạo mới** | URL/Text input form với tab switch |
| `src/features/learn-media/ContentExtractor.tsx` | **Tạo mới** | Hiển thị extracted content, loading state |
| `src/features/learn-media/MediaVocabList.tsx` | **Tạo mới** | Vocab cards extracted từ content |
| `src/features/learn-media/MediaQuiz.tsx` | **Tạo mới** | Quiz generated từ content — reuse QuizRenderer |
| `src/features/learn-media/useMediaLearning.ts` | **Tạo mới** | Hook: extraction → AI processing → quiz state |
| `src/features/learn-media/MediaSessionCard.tsx` | **Tạo mới** | Card cho saved sessions (history) |
| `src/features/learn-media/MediaHistory.tsx` | **Tạo mới** | List saved sessions |
| `src/services/ai/prompts.ts` | **Sửa** | Thêm vocab extraction + quiz generation prompts |
| `src/services/contentExtractor.ts` | **Tạo mới** | URL → text extraction logic |
| `src/db/models.ts` | **Sửa** | Thêm MediaSession model |
| `src/lib/types.ts` | **Sửa** | Thêm media-related types |
| `src/routes/` | **Sửa** | Thêm route /learn-media |

### Schema mới

```typescript
// src/db/models.ts — thêm
export interface MediaSession {
  id: string;              // nanoid
  createdAt: string;       // ISO date
  sourceType: 'url' | 'text';
  sourceUrl?: string;
  title: string;           // extracted hoặc user-provided
  originalText: string;    // truncate nếu quá dài (max 5000 chars)
  extractedVocab: MediaVocabWord[];
  quizExercises: GrammarExercise[];  // reuse existing types
  quizScore?: number;
  completed: boolean;
}

export interface MediaVocabWord {
  word: string;
  meaning: string;          // Vietnamese
  ipa: string;
  contextSentence: string;  // câu trong bài gốc chứa từ này
  cefrLevel: CEFRLevel;
  example: string;          // câu ví dụ khác
}

// Dexie table
this.version(5).stores({
  // ... existing tables
  mediaSessions: 'id, createdAt',
});
```

### AI Prompts

```typescript
// Vocab Extraction Prompt
export function mediaVocabExtractionPrompt(text: string, level: CEFRLevel): string {
  return `You are a vocabulary extraction assistant for English learners.

User's level: ${level}

Analyze this text and extract 10-15 vocabulary words that are:
- Appropriate for ${level} level learners (slightly above their level to challenge)
- Important for understanding the text
- Useful in everyday English

Text:
"""
${text.slice(0, 3000)}
"""

Return JSON array:
[{
  "word": "string",
  "meaning": "Vietnamese meaning",
  "ipa": "IPA pronunciation",
  "contextSentence": "exact sentence from text containing this word",
  "cefrLevel": "A1|A2|B1|B2",
  "example": "another example sentence"
}]

Return ONLY valid JSON, no markdown.`;
}

// Quiz Generation Prompt
export function mediaQuizGenerationPrompt(vocab: MediaVocabWord[], level: CEFRLevel): string {
  return `Generate 8 quiz exercises from these vocabulary words for ${level} level learners.

Words: ${JSON.stringify(vocab.map(v => v.word))}

Create a mix of:
- 3 multiple_choice (test word meaning)
- 2 fill_blank (test usage in context)
- 2 sentence_order (test sentence structure)
- 1 error_correction

Return JSON array matching these TypeScript types exactly:
- MultipleChoice: { type: "multiple_choice", question: string, options: string[4], answer: number }
- FillBlank: { type: "fill_blank", question: string (use ___ for blank), acceptedAnswers: string[] }
- SentenceOrder: { type: "sentence_order", words: string[], answer: string }
- ErrorCorrection: { type: "error_correction", sentence: string, correctSentence: string, errorIndex: number[] }

Return ONLY valid JSON array, no markdown.`;
}
```

### Content Extraction Service

```typescript
// src/services/contentExtractor.ts
export async function extractFromUrl(url: string): Promise<{ title: string; text: string }> {
  // Option 1: AllOrigins proxy (free, no key needed)
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  const html = await fetch(proxyUrl).then(r => r.text());
  
  // Parse với DOMParser + heuristic extraction
  const doc = new DOMParser().parseFromString(html, 'text/html');
  
  // Remove scripts, styles, nav, footer, ads
  const removeSelectors = ['script', 'style', 'nav', 'footer', 'header', 'aside', '.ad', '.sidebar'];
  removeSelectors.forEach(sel => doc.querySelectorAll(sel).forEach(el => el.remove()));
  
  const title = doc.querySelector('title')?.textContent || 'Untitled';
  const article = doc.querySelector('article') || doc.querySelector('main') || doc.body;
  const text = article?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 5000) || '';
  
  return { title, text };
}

// Fallback: user paste text directly
export function processDirectText(text: string): { title: string; text: string } {
  const firstLine = text.split('\n')[0].slice(0, 100);
  return { title: firstLine, text: text.slice(0, 5000) };
}
```

### Data Flow
1. User nhập URL hoặc paste text
2. URL mode → `extractFromUrl()` qua proxy → lấy text
3. Text gửi AI → `mediaVocabExtractionPrompt` → nhận vocab list (JSON parse)
4. Vocab gửi AI → `mediaQuizGenerationPrompt` → nhận quiz exercises (JSON parse)
5. Hiển thị vocab list → user review → bắt đầu quiz
6. Quiz dùng lại `QuizRenderer` component từ grammar feature
7. Hoàn thành → save MediaSession vào IndexedDB
8. Vocab có thể "Save to my words" → thêm vào customWords table

### Notes
- AI call: 2 requests per media session (vocab + quiz) — rate limiter cần handle
- JSON parsing cần try/catch + retry 1 lần nếu AI trả format sai
- Content max 5000 chars (tránh token quá lớn)
- URL extraction là best-effort — fallback luôn có text input
- "Save to my words" tạo CustomTopic "Media Vocab" tự động

---

## Shared Changes

### Routes Update
```typescript
// src/routes/ — thêm
{ path: '/sentence-building', lazy: () => import('../features/sentence-building/SentenceBuildingPage') },
{ path: '/learn-media', lazy: () => import('../features/learn-media/LearnMediaPage') },
{ path: '/learn-media/:sessionId', lazy: () => import('../features/learn-media/LearnMediaPage') },
```

### Navigation Update
Thêm 2 mục mới vào sidebar/menu:
- 🧩 Sentence Building → `/sentence-building`
- 📰 Learn from Media → `/learn-media`

### Dependencies cần install
```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities nanoid
```
- `@dnd-kit/core` — drag & drop engine
- `@dnd-kit/sortable` — sortable trong Drop Zone
- `@dnd-kit/utilities` — CSS transform utils
- `nanoid` — unique ID cho WordItem chips

### Achievements mới
Thêm vào `src/data/achievements.json`:
```json
[
  { "id": "streak-3", "title": "3-Day Streak", "description": "Học 3 ngày liên tiếp", "icon": "🔥", "xpReward": 50 },
  { "id": "streak-14", "title": "2-Week Warrior", "description": "Streak 14 ngày", "icon": "⚔️", "xpReward": 200 },
  { "id": "streak-100", "title": "Centurion", "description": "Streak 100 ngày!", "icon": "🏛️", "xpReward": 2000 },
  { "id": "sentence-master", "title": "Sentence Master", "description": "Hoàn thành 50 sentence building", "icon": "🧩", "xpReward": 300 },
  { "id": "media-explorer", "title": "Media Explorer", "description": "Học từ 10 bài báo/video", "icon": "📰", "xpReward": 300 },
  { "id": "media-first", "title": "First Article", "description": "Hoàn thành media lesson đầu tiên", "icon": "📖", "xpReward": 50 }
]
```

---

## Implementation Order

1. **Feature 2: Sentence Building** — độc lập, không phụ thuộc gì
2. **Feature 3: Learn from Media** — cần AI prompts, độc lập
3. **Feature 1: Daily Challenge v2** — nâng cấp sau khi Feature 2 & 3 xong (để thêm task types mới vào pool)

Sam nên code theo thứ tự này để tránh dependency conflicts.

> **MVP Data Requirement:** Sentence Building cần ít nhất 30-40 sentences cho launch (3-4 topics × 10 sentences mỗi topic). Ưu tiên topics: daily-life, travel, food-drink, work.

---

## Edge Cases & Risks

| Risk | Mitigation |
|------|------------|
| dnd-kit touch lag trên mobile | Touch sensor config với delay + tolerance |
| AI trả JSON sai format | Try/catch + regex cleanup + 1 retry |
| URL extraction fail (CORS, paywall) | Fallback: text input mode luôn available |
| AllOrigins proxy down | Thêm backup: `corsproxy.io` |
| Content quá dài | Truncate 5000 chars, AI chỉ nhận 3000 |
| Trùng từ trong sentence building | nanoid unique ID per chip, track bằng id không bằng word |
| Old daily challenge data migration | Dexie version upgrade handler |
| Rate limit khi dùng Learn from Media nhiều | 2 AI calls/session, rate limiter đã có 5 req/min/feature |
