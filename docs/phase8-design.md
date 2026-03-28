# Phase 8: Tracking & Goals — Technical Design

## Overview
3 features: Study Planner, Mistake Journal, Achievement System Upgrade

---

## Feature 1: 📅 Study Planner

### Approach
Hệ thống đặt mục tiêu + lịch học + theo dõi progress. Tận dụng `dailyGoal` có sẵn trong settingsStore, mở rộng thành weekly goals + study scheduling. Dùng **local notifications** via `@capacitor/local-notifications` (hoặc browser Notification API cho web) để reminder.

### Data Model

```typescript
// src/models/StudyPlan.ts
interface StudyGoal {
  id: string;                    // nanoid
  type: 'daily' | 'weekly';
  metric: 'words' | 'xp' | 'minutes' | 'lessons' | 'quizAccuracy';
  target: number;                // e.g. 20 words/day, 100 xp/day
  current: number;               // auto-calculated from dailyLog
  createdAt: string;
}

interface StudySchedule {
  dayOfWeek: number;             // 0=Sun..6=Sat
  startTime: string;             // "09:00" (HH:mm)
  duration: number;              // minutes
  focus: string[];               // ['vocabulary', 'grammar', 'listening']
  reminderEnabled: boolean;
}

interface WeeklySnapshot {
  weekStart: string;             // ISO date (Monday)
  goals: { metric: string; target: number; achieved: number }[];
  totalMinutes: number;
  totalXp: number;
  daysActive: number;
}
```

### Store

```typescript
// src/stores/studyPlanStore.ts (Zustand + persist)
interface StudyPlanState {
  goals: StudyGoal[];
  schedule: StudySchedule[];
  weeklySnapshots: WeeklySnapshot[];
  
  // Actions
  addGoal(goal: Omit<StudyGoal, 'id' | 'current' | 'createdAt'>): void;
  removeGoal(id: string): void;
  updateSchedule(schedule: StudySchedule[]): void;
  snapshotWeek(): void;          // gọi mỗi tuần, archive progress
}
```

### Study Time Tracking
Field `minutesSpent` đã có trong DailyLog model nhưng chưa dùng. Implement:

```typescript
// src/hooks/useStudyTimer.ts
// - startTimer() khi user bắt đầu bất kỳ activity nào (quiz, lesson, dictation...)
// - pauseTimer() khi app blur / navigate away
// - stopTimer() khi hoàn thành session
// - Auto-update dailyLogService.updateLog({ minutesSpent: accumulated })
// - Dùng document.visibilitychange + window blur/focus events
```

### Files

| File | Action | Mô tả |
|------|--------|-------|
| `src/models/StudyPlan.ts` | **Tạo mới** | Interfaces cho StudyGoal, StudySchedule, WeeklySnapshot |
| `src/stores/studyPlanStore.ts` | **Tạo mới** | Zustand store, persist localStorage |
| `src/hooks/useStudyTimer.ts` | **Tạo mới** | Track study time, update dailyLog.minutesSpent |
| `src/hooks/useStudyProgress.ts` | **Tạo mới** | Hook tính progress cho mỗi goal (đọc dailyLog + studyPlan) |
| `src/services/reminderService.ts` | **Tạo mới** | Browser Notification API, schedule reminders theo StudySchedule |
| `src/features/study-planner/pages/StudyPlannerPage.tsx` | **Tạo mới** | Main page: goals overview + schedule + weekly chart |
| `src/features/study-planner/components/GoalCard.tsx` | **Tạo mới** | Card hiển thị 1 goal với progress bar (circular) |
| `src/features/study-planner/components/GoalForm.tsx` | **Tạo mới** | Form thêm/sửa goal (metric selector, target input) |
| `src/features/study-planner/components/WeeklySchedule.tsx` | **Tạo mới** | Grid 7 ngày, chọn slot + focus area |
| `src/features/study-planner/components/WeeklyChart.tsx` | **Tạo mới** | Recharts bar chart: actual vs target mỗi ngày |
| `src/features/study-planner/components/StudyTimerWidget.tsx` | **Tạo mới** | Floating widget nhỏ ở góc, hiện thời gian đang học |
| `src/services/dailyLogService.ts` | **Sửa** | Thêm logic update `minutesSpent` |
| `src/App.tsx` | **Sửa** | Thêm route `/study-planner`, mount StudyTimer |
| `src/components/Navbar.tsx` hoặc Sidebar | **Sửa** | Thêm nav link Study Planner |

### Data Flow
1. User vào Study Planner → GoalForm để set goals (daily 20 words, weekly 500 xp...)
2. WeeklySchedule để pick ngày giờ học + focus areas
3. reminderService đăng ký browser notifications theo schedule
4. Khi học → useStudyTimer tự chạy, update minutesSpent vào dailyLog
5. useStudyProgress hook đọc dailyLog + goals → tính % completion
6. GoalCard + WeeklyChart render progress real-time
7. Mỗi Monday → snapshotWeek() archive tuần trước vào weeklySnapshots

### Notes
- Browser Notification API cần user permission → prompt lần đầu khi enable reminder
- Study timer: dùng `performance.now()` cho chính xác, persist vào sessionStorage để không mất khi re-render
- Weekly snapshot: trigger qua useEffect check ngày đầu tuần, hoặc khi mở app

---

## Feature 2: 🔄 Mistake Journal

### Approach
Centralized mistake tracking system. Hiện tại mỗi feature track lỗi riêng → cần 1 service aggregate tất cả mistakes vào 1 chỗ. Implement **spaced repetition** (SM-2 simplified) cho mistake review — tương tự weakWordsService nhưng cho tất cả loại lỗi.

### Data Model

```typescript
// src/models/Mistake.ts
type MistakeType = 'vocabulary' | 'grammar' | 'spelling' | 'sentence_order' | 'listening' | 'reading' | 'writing';

interface Mistake {
  id: string;                    // nanoid
  type: MistakeType;
  source: string;                // feature gốc: 'quiz', 'grammar-quiz', 'dictation', 'sentence-building', 'writing', 'media-quiz', 'reading'
  question: string;              // câu hỏi / context gốc
  userAnswer: string;            // câu trả lời sai
  correctAnswer: string;         // đáp án đúng
  explanation?: string;          // giải thích (nếu có)
  createdAt: string;
  
  // Spaced repetition fields
  easeFactor: number;            // default 2.5, min 1.3
  interval: number;              // days, default 1
  nextReview: string;            // ISO date
  reviewCount: number;           // default 0
  lastReviewResult?: 'forgot' | 'hard' | 'good' | 'easy';
}

interface MistakeStats {
  totalMistakes: number;
  byType: Record<MistakeType, number>;
  topPatterns: { pattern: string; count: number }[];  // "subject-verb agreement", "article usage"...
  reviewedToday: number;
  dueForReview: number;
}
```

### Store & Service

```typescript
// src/stores/mistakeStore.ts (Zustand + persist)
interface MistakeState {
  mistakes: Mistake[];
  
  addMistake(mistake: Omit<Mistake, 'id' | 'createdAt' | 'easeFactor' | 'interval' | 'nextReview' | 'reviewCount'>): void;
  reviewMistake(id: string, result: 'forgot' | 'hard' | 'good' | 'easy'): void;  // update SM-2 fields
  getDueForReview(): Mistake[];
  getStats(): MistakeStats;
  deleteMistake(id: string): void;
  clearResolved(): void;         // xóa mistakes đã master (interval > 30 days)
}

// src/services/mistakeCollector.ts
// - Hook vào event bus (eventSubscribers pattern)
// - Khi quiz/grammar/dictation/etc kết thúc → extract incorrect answers → addMistake()
// - Normalize format từ mỗi feature khác nhau
```

### Spaced Repetition Logic (SM-2 Simplified)
```
reviewMistake(result):
  if result == 'forgot': interval = 1, easeFactor -= 0.2
  if result == 'hard': interval *= 1.2, easeFactor -= 0.15  
  if result == 'good': interval *= easeFactor
  if result == 'easy': interval *= easeFactor * 1.3, easeFactor += 0.15
  easeFactor = max(1.3, easeFactor)
  nextReview = today + interval days
```

### Files

| File | Action | Mô tả |
|------|--------|-------|
| `src/models/Mistake.ts` | **Tạo mới** | Interfaces Mistake, MistakeStats, MistakeType |
| `src/stores/mistakeStore.ts` | **Tạo mới** | Zustand store + SM-2 review logic |
| `src/services/mistakeCollector.ts` | **Tạo mới** | Event listener, normalize + collect mistakes từ tất cả features |
| `src/features/mistake-journal/pages/MistakeJournalPage.tsx` | **Tạo mới** | Main page: tabs Review / Browse / Stats |
| `src/features/mistake-journal/components/MistakeReviewSession.tsx` | **Tạo mới** | Flashcard-style review: hiện question → user nhớ/không → flip → rate |
| `src/features/mistake-journal/components/MistakeList.tsx` | **Tạo mới** | Browse tất cả mistakes, filter by type/source, sort by date/frequency |
| `src/features/mistake-journal/components/MistakeCard.tsx` | **Tạo mới** | Card 1 mistake: type badge, question, answers, next review date |
| `src/features/mistake-journal/components/MistakeStats.tsx` | **Tạo mới** | Charts: mistakes by type (pie), trend over time (line), top patterns |
| `src/features/mistake-journal/components/PatternAnalysis.tsx` | **Tạo mới** | Group mistakes theo pattern (e.g. "article errors", "tense errors") — regex-based hoặc keyword matching |
| `src/services/eventSubscribers.ts` | **Sửa** | Thêm subscriber cho mistakeCollector |
| `src/App.tsx` | **Sửa** | Thêm route `/mistake-journal` |
| `src/components/Navbar.tsx` | **Sửa** | Thêm nav link + badge count (due for review) |

### Integration Points — Cần sửa các features hiện tại

| Feature | File cần sửa | Thay đổi |
|---------|--------------|----------|
| Vocabulary Quiz | `src/features/vocabulary/hooks/useQuizSession.ts` | Emit event khi quiz end với incorrect words |
| Grammar Quiz | `src/features/grammar/hooks/useGrammarQuiz.ts` | Emit event khi quiz end với incorrect answers |
| Dictation | `src/features/listening/hooks/useDictation.ts` | Emit event với incorrectAnswers |
| Reading | `src/features/reading/hooks/useReadingSession.ts` | Emit event với incorrect comprehension answers |
| Sentence Building | `src/features/sentence-building/useSentenceBuilding.ts` | Emit event với wrong attempts |
| Writing | `src/features/writing/hooks/useWritingPractice.ts` | Emit event với GrammarIssue[] |
| Media Quiz | `src/features/learn-media/useMediaLearning.ts` | Emit event với incorrect quiz results |

### Data Flow
1. User làm quiz/grammar/dictation/etc → kết thúc session
2. Feature emit event `mistakes:collected` qua event bus với raw data
3. mistakeCollector lắng nghe → normalize → mistakeStore.addMistake()
4. User vào Mistake Journal → thấy tất cả mistakes aggregated
5. Tab "Review" → getDueForReview() → flashcard review → rate → SM-2 update interval
6. Tab "Stats" → getStats() → charts + pattern analysis
7. Navbar badge hiện số mistakes due for review

---

## Feature 3: 🏅 Achievement System Upgrade

### Approach
Mở rộng achievement system hiện tại. Thêm achievements mới cho Phase 6-7 features + Study Planner + Mistake Journal. Thêm **tiers** (bronze/silver/gold) cho progressive achievements. **Social sharing** qua Web Share API. Không làm leaderboard (cần backend).

### Achievements Mới

```json
[
  // Grammar achievements
  { "id": "grammar_starter", "name": "Grammar Rookie", "description": "Complete 1 grammar lesson", "icon": "📖", "condition": { "type": "grammarLessonsCompleted", "value": 1 } },
  { "id": "grammar_master", "name": "Grammar Master", "description": "Complete all grammar lessons", "icon": "🎓", "condition": { "type": "grammarLessonsCompleted", "value": 24 } },
  { "id": "grammar_perfect", "name": "Perfect Grammar", "description": "Score 100% on a grammar quiz", "icon": "💯", "condition": { "type": "grammarPerfectQuiz", "value": 1 } },
  
  // Writing achievements  
  { "id": "first_essay", "name": "First Words", "description": "Submit your first writing", "icon": "✍️", "condition": { "type": "writingSubmissions", "value": 1 } },
  { "id": "prolific_writer", "name": "Prolific Writer", "description": "Submit 20 writings", "icon": "📝", "condition": { "type": "writingSubmissions", "value": 20 } },
  
  // Sentence Building achievements
  { "id": "sentence_builder", "name": "Sentence Builder", "description": "Complete 10 sentence building exercises", "icon": "🧩", "condition": { "type": "sentenceBuildingCount", "value": 10 } },
  { "id": "sentence_perfect", "name": "Perfect Order", "description": "Complete a sentence with no wrong attempts", "icon": "✨", "condition": { "type": "sentenceBuildingPerfect", "value": 1 } },
  
  // Media achievements
  { "id": "media_explorer", "name": "Media Explorer", "description": "Learn from 5 media sources", "icon": "📰", "condition": { "type": "mediaSessionCount", "value": 5 } },
  { "id": "media_addict", "name": "Media Addict", "description": "Learn from 25 media sources", "icon": "🗞️", "condition": { "type": "mediaSessionCount", "value": 25 } },
  
  // Daily Challenge achievements
  { "id": "challenge_week", "name": "Weekly Warrior", "description": "7-day challenge streak", "icon": "🔥", "condition": { "type": "challengeStreak", "value": 7 } },
  { "id": "challenge_month", "name": "Monthly Champion", "description": "30-day challenge streak", "icon": "🏆", "condition": { "type": "challengeStreak", "value": 30 } },
  
  // Study Planner achievements
  { "id": "goal_setter", "name": "Goal Setter", "description": "Set your first study goal", "icon": "🎯", "condition": { "type": "goalsCreated", "value": 1 } },
  { "id": "goal_achiever", "name": "Goal Achiever", "description": "Meet all daily goals in a week", "icon": "⭐", "condition": { "type": "weeklyGoalsMet", "value": 7 } },
  { "id": "study_hour", "name": "Dedicated Student", "description": "Study for 60 minutes total", "icon": "⏰", "condition": { "type": "totalMinutesStudied", "value": 60 } },
  { "id": "study_marathon", "name": "Study Marathon", "description": "Study for 600 minutes total", "icon": "🏃", "condition": { "type": "totalMinutesStudied", "value": 600 } },
  
  // Mistake Journal achievements
  { "id": "mistake_learner", "name": "Learning from Mistakes", "description": "Review 10 mistakes", "icon": "🔄", "condition": { "type": "mistakesReviewed", "value": 10 } },
  { "id": "mistake_master", "name": "Mistake Master", "description": "Master 50 mistakes (interval > 30 days)", "icon": "🧠", "condition": { "type": "mistakesMastered", "value": 50 } },
  
  // Tier system - overall progress
  { "id": "bronze_scholar", "name": "Bronze Scholar", "description": "Earn 500 XP", "icon": "🥉", "condition": { "type": "totalXp", "value": 500 }, "tier": "bronze" },
  { "id": "silver_scholar", "name": "Silver Scholar", "description": "Earn 2000 XP", "icon": "🥈", "condition": { "type": "totalXp", "value": 2000 }, "tier": "silver" },
  { "id": "gold_scholar", "name": "Gold Scholar", "description": "Earn 5000 XP", "icon": "🥇", "condition": { "type": "totalXp", "value": 5000 }, "tier": "gold" }
]
```

### New Condition Types cần thêm vào achievementEngine

```typescript
// Thêm vào AchievementContext:
grammarLessonsCompleted: number;    // từ grammarStore
grammarPerfectQuiz: number;         // quiz 100%
writingSubmissions: number;         // từ writing history
sentenceBuildingPerfect: number;    // sessions with 0 wrong attempts
challengeStreak: number;            // từ daily challenge store
goalsCreated: number;               // từ studyPlanStore
weeklyGoalsMet: number;             // tính từ weeklySnapshots
totalMinutesStudied: number;        // tính từ dailyLogs tổng minutesSpent
mistakesReviewed: number;           // từ mistakeStore
mistakesMastered: number;           // mistakes với interval > 30
totalXp: number;                    // từ progressStore
```

### Social Sharing

```typescript
// src/services/shareService.ts
// Dùng Web Share API (navigator.share)
// Fallback: copy to clipboard

interface ShareData {
  title: string;       // "I earned Gold Scholar on WordFlow!"
  text: string;        // "🥇 Gold Scholar — Earned 5000 XP learning English!"
  url?: string;        // app URL (optional)
  image?: string;      // generated badge image (canvas → blob)
}

async function shareAchievement(achievement: Achievement): Promise<void> {
  const shareData = {
    title: `I earned ${achievement.name} on WordFlow!`,
    text: `${achievement.icon} ${achievement.name} — ${achievement.description}`,
  };
  
  if (navigator.canShare?.(shareData)) {
    await navigator.share(shareData);
  } else {
    await navigator.clipboard.writeText(`${shareData.text}`);
    toast.success('Copied to clipboard!');
  }
}
```

### Files

| File | Action | Mô tả |
|------|--------|-------|
| `src/data/achievements.json` | **Sửa** | Thêm ~20 achievements mới (Phase 6-7 + Phase 8) |
| `src/services/achievementEngine.ts` | **Sửa** | Thêm condition types mới, mở rộng `buildContext()` |
| `src/services/shareService.ts` | **Tạo mới** | Web Share API + clipboard fallback |
| `src/features/achievements/components/BadgeCard.tsx` | **Sửa** | Thêm share button, tier indicator (bronze/silver/gold border) |
| `src/features/achievements/components/AchievementShareModal.tsx` | **Tạo mới** | Preview + share modal |
| `src/features/achievements/components/TierBadge.tsx` | **Tạo mới** | Visual tier indicator component |
| `src/features/achievements/pages/AchievementsPage.tsx` | **Sửa** | Group by category, filter by tier, progress overview |

### Data Flow
1. User hoàn thành activity → event bus → achievementEngine.checkAchievements()
2. buildContext() đọc thêm data từ grammarStore, writingHistory, studyPlanStore, mistakeStore
3. Match condition → unlock → toast + confetti
4. User vào AchievementsPage → xem badges grouped by category
5. Click share trên badge → ShareModal → Web Share API / clipboard

---

## Thứ tự Implement

1. **Mistake Journal** (Feature 2) — nền tảng, các feature khác reference
2. **Study Planner** (Feature 1) — independent, dùng study timer
3. **Achievement Upgrade** (Feature 3) — cuối cùng, vì cần data từ Feature 1 + 2

## Dependencies Mới
- `nanoid` — đã có trong project
- Không cần thêm package mới (dùng Recharts có sẵn, Browser APIs)

## Navigation
Thêm vào sidebar/navbar:
- 📅 Study Planner → `/study-planner`
- 🔄 Mistake Journal → `/mistake-journal` (với badge count)
- 🏅 Achievements → đã có, cập nhật content

