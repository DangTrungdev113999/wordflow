# UX Overhaul Proposal — WordFlow

**Author:** Marcus (Tech Lead)
**Date:** 2026-04-01
**Status:** DRAFT — chờ Alex + Trung confirm

---

## 1. Phân tích UX hiện tại — Vấn đề

### 1.1 Information Overload
- **14 items sidebar** — user mở app thấy ngay 14 mục, không biết bắt đầu từ đâu
- **50+ routes** — navigation sâu, dễ lạc
- **Bottom nav mobile chỉ 5/14** — 9 features còn lại phải mở hamburger menu → hidden features = unused features

### 1.2 Tool Collection, không phải Learning Experience
- App bày hết tools ra: "đây là flashcard, đây là quiz, đây là listening" — giống toolbox
- Thiếu **guided flow**: user tự quyết định học gì, bao nhiêu, khi nào → cognitive overload
- Không có **learning path** — user không biết mình đang ở đâu trong hành trình học

### 1.3 Features rời rạc
- Vocabulary, Grammar, Listening, Reading — 4 skills tách biệt, không liên kết
- Học vocab "food" xong → không có gợi ý "giờ hãy đọc đoạn văn về food" hay "nghe hội thoại về ordering food"
- Mỗi feature tự có UI flow riêng, không nhất quán

### 1.4 Dashboard = Stats dump
- Dashboard hiện tại: greeting + daily goal + streak + stats chart
- Thiếu **actionable next step** — user thấy stats nhưng không biết "giờ làm gì?"
- Quick Start chỉ hiện 3 topics đầu, không personalized

### 1.5 Vấn đề mobile
- Sidebar 64px chiếm diện tích trên desktop
- Bottom nav chỉ 5 items → 60% features bị ẩn
- Nhiều page có nested navigation (tabs trong page) → double nav layers

---

## 2. Information Architecture mới

### 2.1 Nguyên tắc thiết kế
1. **Lesson-first, not tool-first** — user thấy "bài học", không phải "công cụ"
2. **Progressive disclosure** — chỉ hiện gì cần, khi cần
3. **Connected learning** — mỗi skill kết nối với nhau trong 1 lesson
4. **Max 5 nav items** — cả desktop lẫn mobile

### 2.2 Navigation mới — 5 tabs

```
┌─────────────────────────────────────────┐
│  🏠 Home  │  📚 Learn  │  🔄 Review  │  🤖 AI  │  👤 Me  │
└─────────────────────────────────────────┘
```

| Tab | Chứa gì | Thay thế |
|-----|---------|----------|
| **🏠 Home** | Today's session, streak, next lesson | Dashboard |
| **📚 Learn** | Learning path (units → lessons), Browse by skill | Vocabulary, Grammar, Listening, Reading, Word Usage, Sentence Building |
| **🔄 Review** | Due reviews (SM-2), Mistake Journal, Mixed Review | Mistake Journal, Mixed Review |
| **🤖 AI** | AI Chat, Writing, Roleplay, Learn from Media | AI Hub, Writing, Roleplay, Learn from Media |
| **👤 Me** | Stats, Achievements, Study Planner, Settings | Statistics, Achievements, Study Planner, Settings |

**Từ 14 → 5 nav items.** Mọi feature vẫn còn, chỉ tổ chức lại.

### 2.3 Feature Mapping chi tiết

#### 🏠 Home (thay Dashboard)
- Today's Session card (xem Section 4)
- Streak + XP bar
- Continue learning (last incomplete lesson)
- Due reviews count (badge)
- Daily Challenge

#### 📚 Learn
**Level 1: Learning Path** (default view)
```
Unit 1: Getting Started
  ├── Lesson 1.1: Greetings & Self-intro
  │   └── [Vocab: greetings] → [Grammar: to be] → [Listening: intro dialogue] → [Quiz]
  ├── Lesson 1.2: Numbers & Dates  
  │   └── [Vocab: numbers] → [Grammar: ordinals] → [Listening: phone numbers] → [Quiz]
  └── Lesson 1.3: Daily Routine
      └── [Vocab: daily activities] → [Grammar: present simple] → [Reading: my day] → [Quiz]

Unit 2: Food & Shopping
  ├── Lesson 2.1: Food Vocabulary
  ├── Lesson 2.2: At the Restaurant
  └── Lesson 2.3: Shopping
  
... (structured by CEFR A1 → A2 → B1)
```

**Level 2: Browse by Skill** (tab hoặc toggle)
- Khi user muốn tự chọn, có thể browse theo skill: Vocabulary | Grammar | Listening | Reading | Word Usage
- Giữ nguyên pages hiện tại, chỉ đổi entry point

**Key insight:** Lesson = bundle of activities from different skills, tied together by theme. Không phải tạo content mới — chỉ **bundle existing content** thành lessons.

#### 🔄 Review
- **Due Today** — SM-2 due words, prioritized (xem `useReviewSchedule`)
- **Mistake Journal** — existing feature
- **Mixed Review** — existing feature
- **Review Schedule** — 7-day forecast

#### 🤖 AI
- AI Chat (existing)
- Writing Practice (existing)
- Roleplay (existing)
- Learn from Media (existing)
- Pronunciation (move từ Dashboard)

#### 👤 Me
- **Profile** — level, total XP, streak record
- **Statistics** (existing)
- **Achievements** (existing)
- **Study Planner** (existing)
- **Settings** (existing)

---

## 3. Learning Flow — User Journey

### 3.1 First-time User
```
Onboarding (existing) → Placement Test → Assign starting unit
→ Home: "Chào mừng! Bài học đầu tiên của bạn"
→ Tap → Lesson 1.1 starts (fullscreen)
→ [Vocab phase] → [Grammar phase] → [Practice phase] → [Quiz phase]
→ Complete → XP + Achievement → Back to Home
→ Home: "Tiếp tục: Lesson 1.2" hoặc "Hôm nay đủ rồi! 🎉"
```

### 3.2 Returning User (daily session)
```
Open app → Home
├── "5 từ cần ôn tập" → Tap → Review session (fullscreen)
├── "Tiếp tục: Lesson 2.3" → Tap → Lesson flow
├── "Daily Challenge" → Tap → Challenge
└── "Bạn đã học 15 phút hôm nay" → Progress feedback
```

### 3.3 Lesson Flow (fullscreen)
```
Lesson Start → Progress bar (0%)
→ Phase 1: Vocabulary (flashcard new words, 3-5 words)
   → Image + word + pronunciation + mnemonic
   → Mini quiz: match word ↔ meaning
→ Phase 2: Grammar (nếu có)
   → Rule explanation (short, visual)
   → Fill-in-blank practice
→ Phase 3: Skills Practice (1-2 activities)
   → Listening exercise / Reading passage / Sentence building
   → Context-appropriate cho theme
→ Phase 4: Final Quiz
   → Mixed questions from all phases
   → 80% pass threshold
→ Complete: XP breakdown, achievements, next lesson preview
```

### 3.4 Session Length
- **Target: 5-10 phút/lesson** — mobile-friendly, micro-learning
- Mỗi lesson 15-20 activities
- User có thể pause/resume

---

## 4. Home Screen mới

### 4.1 Layout

```
┌──────────────────────────────┐
│ 🔥 5 ngày │ 1,240 XP │ Lv.8 │  ← Streak + XP + Level bar
├──────────────────────────────┤
│                              │
│  📝 Phiên học hôm nay        │  ← Today's Session Card
│  ┌────────────────────────┐  │
│  │ 🔄 5 từ cần ôn tập     │──│── Tap → Review session  
│  │ 📚 Lesson 2.3: Shopping│──│── Tap → Continue lesson
│  │ 🎯 Daily Challenge     │──│── Tap → Challenge
│  └────────────────────────┘  │
│                              │
│  📊 Hôm nay                  │  ← Today's Progress
│  ████████░░ 15/20 phút       │
│  Đã học: 8 từ, 2 bài        │
│                              │
│  💡 Gợi ý                    │  ← Smart Suggestion
│  "Thử roleplay ordering      │
│   food — liên quan bài vừa   │
│   học!"                      │
│                              │
│  🏆 Thành tựu gần đây        │  ← Latest Achievement
│  "Streak Master — 5 ngày!" 🎉│
│                              │
└──────────────────────────────┘
```

### 4.2 Today's Session Card — Logic
```ts
function getTodaySession(): SessionItem[] {
  const items: SessionItem[] = [];
  
  // 1. Due reviews (highest priority)
  const dueCount = getDueReviewCount();
  if (dueCount >= 3) {
    items.push({ type: 'review', count: dueCount, priority: 1 });
  }
  
  // 2. Continue last lesson (if incomplete)
  const lastLesson = getIncompleteLesson();
  if (lastLesson) {
    items.push({ type: 'continue', lesson: lastLesson, priority: 2 });
  }
  
  // 3. Next lesson in path
  const nextLesson = getNextLesson();
  if (!lastLesson && nextLesson) {
    items.push({ type: 'next', lesson: nextLesson, priority: 3 });
  }
  
  // 4. Daily challenge (if not done today)
  if (!isDailyChallengeComplete()) {
    items.push({ type: 'challenge', priority: 4 });
  }
  
  return items.slice(0, 3); // Max 3 items
}
```

### 4.3 Smart Suggestions
- Dựa trên lesson vừa hoàn thành → gợi ý AI practice liên quan
- Dựa trên weak areas → gợi ý ôn tập targeted
- Dựa trên thời gian → "Buổi tối rảnh? Thử nghe podcast!"

---

## 5. Technical Implementation Strategy

### 5.1 Phân chia Phases

**Phase A: Navigation Restructure** (ít rủi ro nhất, làm trước)
- Đổi Sidebar 14 items → 5-tab Bottom Nav (cả desktop lẫn mobile)
- Tạo container pages cho mỗi tab (Home, Learn, Review, AI, Me)
- Move existing pages vào đúng tab
- Existing features KHÔNG thay đổi logic — chỉ đổi navigation entry point

**Phase B: Home Screen** 
- Replace Dashboard → Home mới
- Today's Session Card
- Smart Suggestions engine
- Progress tracking UI

**Phase C: Learning Path**
- Tạo Lesson data model (unit → lesson → activities)
- Lesson flow engine (fullscreen, phases, progress)
- Bundle existing activities thành lessons
- Content mapping: topic → lesson mapping

**Phase D: Lesson Flow**
- Fullscreen lesson experience
- Phase transitions (vocab → grammar → practice → quiz)
- Progress persistence
- XP + achievement integration

### 5.2 Data Model mới

```ts
// Lesson system
interface Unit {
  id: string;
  title: string;           // "Getting Started"
  cefrLevel: 'A1' | 'A2' | 'B1';
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  unitId: string;
  title: string;           // "Greetings & Self-intro"
  theme: string;           // "greetings"
  order: number;
  estimatedMinutes: number; // 5-10
  phases: LessonPhase[];
  requiredScore: number;    // 0.8 (80%)
}

interface LessonPhase {
  type: 'vocab' | 'grammar' | 'listening' | 'reading' | 'practice' | 'quiz';
  // References to existing content
  vocabTopicId?: string;    // Link to existing vocab topic
  grammarLessonId?: string; // Link to existing grammar lesson
  listeningType?: string;   // Link to existing listening mode
  readingPassageId?: string;
  config: Record<string, unknown>;
}

interface LessonProgress {
  lessonId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  currentPhase: number;
  score: number;
  completedAt?: number;
  xpEarned: number;
}
```

### 5.3 Migration Strategy
- **Không xóa feature nào** — tất cả vẫn accessible qua "Browse by Skill"
- **Không đổi existing routes** — chỉ thêm routes mới, redirect cũ
- **Progressive enhancement** — Learning Path là layer mới on top, features cũ vẫn hoạt động
- **Feature flag** — `ENABLE_LEARNING_PATH=true` để toggle

### 5.4 Existing Component Reuse
- `FlashcardDeck` → reuse trong Lesson vocab phase
- `QuizSession` → reuse trong Lesson quiz phase  
- `ContextFillSession` → reuse trong Lesson practice phase
- `GrammarLesson` → reuse trong Lesson grammar phase
- Listening components → reuse trong Lesson listening phase
- **Không rewrite — chỉ compose** vào Lesson flow

---

## 6. Risks & Considerations

### 6.1 Content Gap
- Learning Path cần content mapping: topic X đi với grammar Y đi với listening Z
- Hiện tại content không có relationship → cần tạo mapping data
- **Mitigation:** Bắt đầu với 5-10 lessons, mở rộng dần

### 6.2 Backward Compatibility
- Users đã quen sidebar navigation
- Existing progress data phải preserved
- **Mitigation:** "Browse by Skill" giữ nguyên access path cũ

### 6.3 Scope Creep
- Redesign LỚN, dễ bị feature creep
- **Mitigation:** Phase A (navigation) ship trước, validate, rồi mới làm B-D

### 6.4 Mobile-first
- Bottom tab nav works trên cả mobile + desktop (Duolingo style)
- Desktop có thể mở rộng tab thành sidebar nhỏ hơn (icon + label)

---

## 7. Tham khảo

| App | Điểm học hỏi |
|-----|-------------|
| **Duolingo** | Learning path (journey map), lesson = mixed activities, daily streak, 5 bottom tabs |
| **Busuu** | Structured curriculum, lesson = vocab+grammar+conversation, review tab |
| **Babbel** | Theme-based lessons, review manager, speech practice integrated |
| **Anki** | SM-2 review system (WordFlow đã có), daily due count |

### Duolingo Navigation (5 tabs)
1. Learn (learning path/journey)
2. Practice (review hub)
3. Leaderboard (social)
4. Shop (gamification)
5. Profile

### WordFlow adapted (5 tabs)
1. 🏠 Home (today's session, continue learning)
2. 📚 Learn (learning path + browse by skill)
3. 🔄 Review (due reviews, mistakes, mixed)
4. 🤖 AI (chat, writing, roleplay, media)
5. 👤 Me (stats, achievements, planner, settings)

---

## 8. Thứ tự ưu tiên (Recommended)

1. **Phase A: Navigation Restructure** — 1-2 ngày code
   - Impact cao nhất, risk thấp nhất
   - Ngay lập tức giảm overwhelm từ 14 → 5
   
2. **Phase B: Home Screen** — 1-2 ngày code
   - Replace dashboard với actionable home
   - Today's Session Card

3. **Phase C: Learning Path data + UI** — 3-5 ngày code
   - Data model, 5-10 lessons pilot
   - Learning path UI (unit list → lesson list)

4. **Phase D: Lesson Flow** — 3-5 ngày code
   - Fullscreen lesson experience
   - Phase transitions, compose existing components

**Total estimate: ~2 tuần cho full overhaul**

---

*Proposal này focus vào UX architecture + information flow. Visual design (colors, typography, animations) giữ nguyên hệ thống Tailwind + Framer Motion hiện tại.*
