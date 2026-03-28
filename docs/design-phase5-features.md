# Design: Phase 5 — 5 New Features

**Author:** Marcus (Tech Lead)  
**Date:** 2026-03-28  
**Status:** Pending Alex confirm

---

## Phân Tích Hiện Trạng — Cái Gì Đã Có

Trước khi thiết kế, cần hiểu app đã có gì:

| Feature | Hiện trạng | Cần làm thêm |
|---------|------------|---------------|
| Pronunciation | ✅ `useSpeechRecognition` hook + `PronunciationButton` trên flashcard | Cần **dedicated practice page** với session flow, scoring, history |
| Listening | ✅ `ListeningPage` + `useDictation` + word/phrase/sentence modes | Cần thêm **MC listening quiz** (nghe → chọn từ đúng) |
| Reading | ❌ Chưa có | Mới hoàn toàn |
| Analytics | ✅ `StatsPage` có charts (words/day, XP history) | Cần thêm **weak areas**, **accuracy trends**, **learning curve** |
| Import/Export | ✅ `DataExportImport` component + full JSON export/import | Cần thêm **CSV format** + **custom word lists** export |

---

## Sub-Phase A: Pronunciation Practice Page (P0)

### Mục tiêu
Trang riêng cho pronunciation practice với session flow, scoring chi tiết, và history.

### Architecture

```
src/features/pronunciation/
├── pages/
│   └── PronunciationPage.tsx        # Topic picker → practice session
├── components/
│   ├── PronunciationCard.tsx         # Word display + mic button + score
│   ├── PronunciationSession.tsx      # Session flow: iterate through words
│   └── PronunciationSummary.tsx      # Session results + per-word breakdown
└── hooks/
    └── usePronunciationSession.ts    # Session state, scoring, progress tracking
```

### Scoring System

```typescript
interface PronunciationScore {
  word: string;
  attempts: number;       // Số lần thử
  bestConfidence: number;  // Web Speech API confidence (0-1)
  passed: boolean;         // confidence >= 0.7 OR exact match
}
```

**Logic:**
1. User chọn topic → load 10 words (shuffle, prioritize low-score words)
2. Mỗi word: hiện word + IPA + meaning → user nhấn mic → nói → so sánh
3. So sánh logic (reuse `useSpeechRecognition`):
   - **Exact match:** alternatives includes target word → ✅ pass
   - **Fuzzy match:** Levenshtein distance ≤ 1 → ⚠️ "Close! Try again"
   - **Miss:** → ❌ show correct pronunciation, play audio
4. User có 3 attempts per word. Pass = ít nhất 1 attempt match
5. Session end → summary: passed/failed per word, overall accuracy

### DB Changes
Thêm vào `DailyLog`:
```typescript
pronunciationAttempts?: number;
pronunciationCorrect?: number;
```
(đã có field `pronunciationCorrect` dùng cho achievements)

### Route
`/pronunciation` — thêm vào BottomNav hoặc Dashboard quick actions

### Key Implementation Notes
- Reuse `useSpeechRecognition` hook — KHÔNG viết lại
- Reuse `enrichWord()` để fetch audio cho playback mẫu
- Thêm Levenshtein util vào `src/lib/utils.ts`
- EventBus: đã có `pronunciation:correct` / `pronunciation:incorrect` events

---

## Sub-Phase B: Listening Quiz Mode (P1)

### Mục tiêu
Thêm MC quiz mode cho Listening: nghe audio → chọn từ đúng trong 4 options.

### Architecture

Thêm vào existing `src/features/listening/`:
```
src/features/listening/
├── components/
│   ├── ...existing...
│   ├── ListeningQuiz.tsx            # MC quiz: 4 options
│   └── ListeningQuizSession.tsx     # Session wrapper
└── hooks/
    └── useListeningQuiz.ts          # Generate quiz items from vocab data
```

### Quiz Item Generation

```typescript
interface ListeningQuizItem {
  correctWord: VocabWord;      // Correct answer (play this audio)
  options: string[];           // 4 options (1 correct + 3 distractors)
}
```

**Distractor selection:**
- Từ cùng topic, cùng CEFR level
- Nếu không đủ → random từ topics khác cùng level
- Avoid: từ quá giống nhau (e.g., "walk" vs "walking")

### Flow
1. `DictationModeSelector` thêm mode mới: `quiz` (bên cạnh word/phrase/sentence)
2. Khi mode = `quiz`: render `ListeningQuizSession` thay vì `DictationSessionPage`
3. Play audio → user chọn 1 trong 4 → check → next
4. Session 10 questions → summary

### Audio Source
- Dùng `enrichWord()` để fetch audio URL từ Free Dictionary API
- Fallback: `SpeechSynthesis` API (browser TTS) nếu không có audio file

### Key Implementation Notes
- Reuse `DictationModeSelector` — chỉ thêm 1 option `quiz`
- Reuse `SessionSummary` cho kết quả
- Distractor logic: simple random pick, filter out correct answer

---

## Sub-Phase C: Reading Comprehension (P2)

### Mục tiêu
Đoạn văn ngắn theo CEFR level + câu hỏi comprehension.

### Architecture

```
src/features/reading/
├── data/
│   └── passages.json               # Curated reading passages
├── pages/
│   ├── ReadingPage.tsx              # Passage list by level
│   └── ReadingSessionPage.tsx       # Read + answer questions
├── components/
│   ├── PassageCard.tsx              # Preview card
│   ├── PassageReader.tsx            # Full text + highlighted vocab
│   ├── ComprehensionQuiz.tsx        # Questions after reading
│   └── ReadingSummary.tsx           # Score + review
└── hooks/
    └── useReadingSession.ts
```

### Data Format

```typescript
interface ReadingPassage {
  id: string;
  title: string;
  level: CEFRLevel;
  topic: string;                    // Link to vocab topic
  text: string;                     // 100-300 words
  wordCount: number;
  highlightedWords: string[];       // Vocab words to highlight in text
  questions: ReadingQuestion[];
}

interface ReadingQuestion {
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  question: string;
  options?: string[];               // For MC
  answer: number | string | boolean;
  explanation: string;              // Show after answering
}
```

### Content — Hardcoded (6 passages per level)

| Level | Word Count | Topic Examples |
|-------|-----------|----------------|
| A1 | 80-120 | Daily routine, family, shopping |
| A2 | 120-180 | Travel, food, school |
| B1 | 180-250 | Technology, health, work |
| B2 | 250-350 | Environment, business, culture |

**Tổng: 24 passages** — mỗi passage 4-5 câu hỏi (MC + T/F + fill-blank mix)

### UI Flow
1. `/reading` — grid view passages, filter by level
2. Click passage → read full text (highlighted vocab words tappable → show meaning)
3. "Start Quiz" → 4-5 comprehension questions
4. Summary → score + review incorrect

### Vocab Highlighting
- Words trong `highlightedWords[]` render với underline + tap-to-define
- Tap → popup mini card: word, IPA, meaning (from local vocab data)

### Key Implementation Notes
- **Content là hardcoded** — tương tự grammar lessons
- Sam viết passages hoặc dùng Claude Code generate
- Reuse `MultipleChoice` component cho MC questions
- Thêm `TrueFalse` component (simple)
- Route: `/reading`, `/reading/:passageId`

---

## Sub-Phase D: Enhanced Progress Analytics (P3)

### Mục tiêu
Mở rộng StatsPage hiện có với: weak areas, accuracy trends, learning curve, skill breakdown.

### Architecture

Thêm vào existing `src/features/dashboard/`:
```
src/features/dashboard/
├── components/
│   ├── ...existing...
│   ├── WeakAreasChart.tsx           # Topics/words user struggles with
│   ├── AccuracyTrend.tsx            # Accuracy over time (line chart)
│   ├── SkillRadar.tsx               # Radar chart: vocab/grammar/listening/pronunciation
│   ├── LearningHeatmap.tsx          # Calendar heatmap (like GitHub contributions)
│   └── WordMasteryBreakdown.tsx     # Pie chart: new/learning/review/mastered
└── hooks/
    └── useAnalytics.ts              # Aggregate data from IndexedDB
```

### Data Sources (Tất cả đã có trong IndexedDB)

| Metric | Source |
|--------|--------|
| Words per status | `wordProgress` table → count by status |
| Quiz accuracy | `dailyLogs` → `quizAccuracy` field |
| Weak topics | `wordProgress` → group by topic → avg easeFactor |
| Learning streak | `dailyLogs` → consecutive dates |
| Skill balance | `dailyLogs` → wordsLearned / grammarCompleted / dictationAttempts / pronunciationCorrect |
| Activity heatmap | `dailyLogs` → date + total activity |

### New Components Detail

**1. WeakAreasChart** — Bar chart horizontal
- Group `wordProgress` by topic
- Sort by avg `easeFactor` ascending (lowest = weakest)
- Show top 5 weakest topics

**2. AccuracyTrend** — Line chart
- Last 30 days `quizAccuracy` from `dailyLogs`
- Smoothed moving average (3-day window)

**3. SkillRadar** — Radar/spider chart
- 4 axes: Vocabulary, Grammar, Listening, Pronunciation
- Score 0-100 based on recent activity + accuracy
- Dùng `recharts` `RadarChart` (đã có recharts)

**4. LearningHeatmap** — Calendar grid
- Last 90 days
- Color intensity based on `xpEarned` per day
- Custom component (no extra library)

**5. WordMasteryBreakdown** — Donut/pie chart
- 4 segments: new, learning, review, mastered
- Dùng `recharts` `PieChart`

### Key Implementation Notes
- `useAnalytics` hook: single source — aggregate all data, memoize
- Recharts đã có — không thêm library mới
- LearningHeatmap: custom CSS grid, không dùng library
- StatsPage layout: giữ existing charts + thêm new sections bên dưới

---

## Sub-Phase E: Enhanced Import/Export (P4)

### Mục tiêu
Thêm CSV format + custom word lists vào existing export/import.

### Architecture

Mở rộng `src/services/dataPortService.ts`:
```typescript
// New exports
export async function exportCustomTopicsCSV(topicId: number): Promise<string>
export async function exportCustomTopicsJSON(topicId: number): Promise<object>
export async function importCustomTopicsCSV(csv: string, topicName: string): Promise<ImportResult>
export async function importCustomTopicsJSON(json: string): Promise<ImportResult>
```

### CSV Format

```csv
word,meaning,ipa,example
breakfast,bữa sáng,/ˈbrek.fəst/,I have breakfast at 7 AM every day.
morning,buổi sáng,/ˈmɔːr.nɪŋ/,Good morning! How are you today?
```

### UI Changes

Thêm vào `CustomTopicDetailPage`:
- **Export button** (dropdown: CSV / JSON)
- **Import button** (accept .csv / .json)

Thêm vào `SettingsPage` > `DataExportImport`:
- **Export Custom Lists** — export all custom topics as single JSON
- **Import Custom Lists** — import JSON with multiple topics

### Validation
- CSV: parse with regex (no library needed), validate required columns
- JSON: reuse existing validation pattern
- Duplicate word check: skip words already in topic

### Key Implementation Notes
- CSV parser: simple `split(',')` + handle quoted values — KHÔNG thêm library
- Export filename: `wordflow-{topicName}-{date}.csv`
- Import preview: show word count + first 3 words before confirming

---

## Thứ Tự Implement

| Sub-Phase | Feature | Effort | Priority |
|-----------|---------|--------|----------|
| A | Pronunciation Practice Page | 2-3h | P0 |
| B | Listening Quiz Mode | 1.5-2h | P1 |
| C | Reading Comprehension | 3-4h | P2 |
| D | Enhanced Analytics | 2-3h | P3 |
| E | Enhanced Import/Export | 1-1.5h | P4 |

**Tổng estimate:** 10-14h

**Recommend:** Implement A→B→E→D→C
- A+B là core learning features, ưu tiên cao
- E nhẹ nhất, làm sớm
- D mở rộng existing page, moderate
- C nhiều content cần generate, để cuối

---

## Routing Summary

```
/pronunciation                    # NEW — topic picker + practice
/listening/:topic/practice?mode=quiz  # MODIFIED — thêm quiz mode
/reading                         # NEW — passage list
/reading/:passageId              # NEW — read + quiz
/stats                           # MODIFIED — thêm analytics sections
/settings                        # MODIFIED — thêm custom list export/import
```

## Navigation Changes

Thêm "Pronunciation" vào Sidebar + BottomNav (hoặc group dưới "Practice" section)
Thêm "Reading" vào Sidebar + BottomNav

---

## Lưu Ý Cho Sam

1. **Reuse existing hooks/components** — đặc biệt `useSpeechRecognition`, `enrichWord`, `SessionSummary`, `MultipleChoice`
2. **Reading passages:** Dùng Claude Code generate 24 passages theo format. Đảm bảo từ vựng trong passages match `ALL_TOPICS` data
3. **Analytics:** Không thêm library mới. Recharts + custom CSS đủ dùng
4. **CSV parser:** Viết tay, KHÔNG thêm papaparse hay library nào
5. **Test:** Chạy lại 44 unit + 37 E2E tests sau mỗi sub-phase
6. **Levenshtein distance:** Viết util đơn giản (~20 lines), không cần library
