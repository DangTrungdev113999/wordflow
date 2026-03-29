# Phase 9: UI/UX Audit — WordFlow

**Auditor:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Screens audited:** 18 features + global components + Lottie/animation system

---

## 🔴 ROOT CAUSE: Tại sao user không thấy animation

### 1. PageTransition bị vô hiệu hóa (Critical)

**File:** `App.tsx:54`

`<Outlet />` KHÔNG được wrap trong `<AnimatePresence>`. Điều này có nghĩa:
- **Exit animations** (defined trong `PageTransition.tsx`) là **dead code** — không bao giờ chạy
- **Entrance animations** có thể không re-trigger khi navigate vì thiếu `key={location.key}`
- Hiệu ứng page transition giữa các screens = ZERO

**Fix:**
```tsx
// App.tsx - layout component
import { AnimatePresence } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';

function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  
  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>
        {outlet}
      </div>
    </AnimatePresence>
  );
}
```

### 2. Lottie animations hoạt động — nhưng gần như vô hình

5 Lottie files đều valid và code import đúng. Vấn đề:
- **XPBurst** chỉ show khi `show=true` (sau khi earn XP)
- **StreakFire** chỉ show khi `streak > 0`
- **correct-check/wrong-shake** chỉ show sau khi submit answer
- **celebration** chỉ show ở SessionSummary/QuizSummary

→ User phải hoàn thành bài tập mới thấy Lottie. Thiếu animations ở loading, page entrance, button feedback, onboarding — nơi user tương tác đầu tiên.

### 3. Nhiều screens không có framer-motion

| Screen | framer-motion | Trạng thái |
|--------|--------------|------------|
| GrammarPage | ❌ Không có | Static hoàn toàn |
| LessonPage | ❌ Không có | Static hoàn toàn |
| SettingsPage | ❌ Không có | Static hoàn toàn |
| StatsPage | ❌ Không có | Static hoàn toàn |
| WritingPage (entire feature) | ❌ Không có | Static hoàn toàn |
| RoleplaySummary | ❌ Không có | Static hoàn toàn |
| DictationInput | ❌ Không có | Static hoàn toàn |
| DictationModeSelector | ❌ Không có | Static hoàn toàn |
| MediaHistory | ❌ Không có | Static hoàn toàn |

---

## 🟡 VẤN ĐỀ CHUNG (áp dụng toàn app)

### A. Design System thiếu
- **Không có color tokens** — raw Tailwind classes (`indigo-500`, `gray-900`) scatter khắp nơi. Thay đổi theme = sửa 150+ files
- **Không có custom font** — chỉ system font stack. Learning app cần personality hơn
- **Không có focus-visible styles** — keyboard users không thấy focus indicator → WCAG fail
- **Không có `prefers-reduced-motion`** — animations chạy bất kể user settings

### B. Common Components
- **Button.tsx** — thiếu `focus-visible:ring`, thiếu `whileHover`, thiếu loading state variant
- **Card.tsx** — `whileHover={{ y: -2 }}` mặc định trên TẤT CẢ cards → layout jank trong scroll lists. Nên opt-in
- **Modal.tsx** — thiếu `aria-modal`, `role="dialog"`, focus trap, Escape key handler → WCAG fail
- **PageTransition.tsx** — dùng không đồng nhất, nhiều pages tự viết motion.div riêng

### C. Responsive Issues lặp lại
- **`grid-cols-3` không responsive** — break layout trên mobile tại: DictationSessionSummary, PronunciationSummary, ReadingSummary, SentenceBuildingSummary, StudyPlannerPage
- **Hardcoded widths/heights** — `w-24 h-24`, `w-28 h-28`, `min-h-[120px]` không scale
- **`text-[10px]`/`text-[11px]`** xuất hiện ở 5+ files — quá nhỏ cho accessibility

### D. Destructive Actions không có confirmation
- CustomTopicsPage delete
- ConversationList delete (dùng `window.confirm`)
- RoleplayHeader end conversation
- MistakeCard delete
- MistakeJournalPage "Clear Mastered"
- GoalCard remove

---

## 📋 AUDIT TỪNG SCREEN

### 1. Dashboard

**Issues:**
- Hardcoded greeting "Good day! 👋" — nên time-based (Good morning/afternoon/evening)
- Không wrap trong PageTransition (tự viết inline motion.div)
- Spacing inconsistent: `space-y-4` vs `mb-2` vs `gap-3` vs `gap-2`
- Quick Start chỉ show 3 topics, không "View all"
- Không empty state khi chưa có topics
- Không skeleton loading

**Missing animations:** Streak count-up, StatsChart bar entrance, confetti khi daily goal 100%

**UX:** Pronunciation link tách biệt visually, không pull-to-refresh

### 2. StatsPage

**Issues:**
- ZERO framer-motion — hoàn toàn static
- Recharts `CartesianGrid stroke="#e5e7eb"` hardcoded → dark mode invisible
- Tooltip unstyled → white tooltip trên dark theme
- Badge count hardcoded `{badges.length}/10`
- Layout shift khi analytics load

### 3. Onboarding

**Issues:**
- Không progress indicator (3-step flow nhưng user không biết)
- Không back button từ quiz
- Skip button quá subtle (`text-gray-400`, touch target < 44px)
- Emoji branding `🎓` thay vì logo
- PlacementQuiz: không answer feedback, option key={index}
- PlacementResult: LEVEL_MESSAGES chỉ cover A1/A2

**Missing animations:** Option selection không bounce, quiz result entrance

### 4. Vocabulary

**Issues:**
- Không search/filter
- Section separation yếu (chỉ `pt-2`)
- TopicList re-animate mỗi lần mount (kể cả navigate back)
- Topic cards thiếu progress indication (learned/mastered count)
- Delete button CustomTopics `opacity-0 group-hover:opacity-100` → invisible trên mobile
- FlashcardPage `navigate(0)` gây full page reload
- 404 state quá minimal

**Missing animations:** Topic progress bars, card entrance stagger

### 5. Grammar

**Issues:**
- ZERO framer-motion — chết lặng
- Hardcoded A1/A2 filter — không scale lên B1/B2
- Không completion overview
- Section headers uppercase inconsistent với VocabularyPage
- LessonPage: renderBold() conflict với whitespace-pre-line
- QuizPage: "Next →" button push content xuống

### 6. Achievements

**Issues:**
- 30+ BadgeCards animate đồng thời — CPU intensive, chaotic
- Không stagger delay
- Filter strip thiếu scroll indicator
- Category progress bar `h-1` quá mỏng
- Hardcoded `pb-24` cho navbar

**Missing animations:** Unlock celebration, filter switch transition, progress bar scroll-into-view

### 7. Settings

**Issues:**
- ZERO framer-motion
- Theme buttons thiếu `aria-pressed`, `role="radio"`
- Daily goal 5 buttons cramped trên 320px screens
- "Redo Placement Test" không warning overwrite
- DataExportImport thiếu Card wrapper → visual inconsistent
- Version hardcoded "v0.1.0"
- Không section labels/dividers

### 8. AI Chat

**Issues:**
- Magic numbers: `h-[calc(100vh-4rem)]`, `max-w-[88%]`, textarea maxHeight `120`
- Error message generic, không retry button
- `window.confirm` cho delete
- Delete button `opacity-0` trên mobile
- TopicSuggestions grid thiếu responsive
- Dùng emoji ❌✅ thay vì icon system

**Missing animations:** Message entrance, sidebar toggle, correction display

### 9. AI Hub

**Issues:**
- Grid không responsive columns (luôn 1 col)
- Arrow icon `text-gray-300` fail WCAG contrast
- Unavailable features `opacity-60` nhưng vẫn clickable
- Cards chỉ `transition-colors`, thiếu hover lift

**Missing animations:** Page load, staggered card entrance

### 10. Daily Challenge

**Issues:**
- `text-[11px]` custom size
- Task list `overflow-x-auto` thiếu scroll indicator
- Massive conditional color chain trong GrammarTask
- DictationTask audio button thiếu loading/playing state
- DailyChallengeCard returns `null` khi loading (blank screen)
- error_correction/sentence_order show answer ngay, không interactive

**Missing animations:** Task completion celebration, button feedback, loading skeleton

### 11. Listening

**Issues:**
- **CRITICAL:** `grid grid-cols-3` breaks trên mobile (DictationSessionSummary)
- DictationPlayer button `w-24 h-24` cố định
- DictationInput + DictationModeSelector: ZERO animations
- Non-selected answers `opacity-40` quá subtle
- Không keyboard shortcuts cho quiz (1-4 keys)

### 12. Pronunciation

**Issues:**
- `animate-pulse` trên red button → **seizure risk**
- Instruction text `text-xs` quá nhỏ
- Button `w-20 h-20` cố định
- **CRITICAL:** `grid grid-cols-3` breaks trên mobile (PronunciationSummary)
- Error silently caught
- `startListening('en-US')` hardcoded locale

**Missing animations:** Perfect score celebration, IPA items stagger

### 13. Reading

**Issues:**
- **CRITICAL:** `grid grid-cols-3` breaks trên mobile (ReadingSummary)
- Không phase transition animation (reading→quiz→summary)
- Multiple choice immediate submit, không confirm
- VocabPopup "Definition not found" styling giống success
- Empty state minimal

**Missing animations:** Paragraph stagger, word highlight feedback, phase switch transition

### 14. Roleplay

**Issues:**
- Magic numbers: textarea `120`, `max-w-[88%]`
- End conversation **thiếu confirmation dialog**
- RoleplaySummary: ZERO framer-motion
- `text-[10px]` arbitrary size
- Grid thiếu `lg:grid-cols-3`
- HintButton disabled state chỉ `opacity-40`

**Missing animations:** RoleplaySummary toàn bộ, message entrance, grammar expand/collapse

### 15. Writing

**Issues:**
- **ZERO framer-motion toàn feature** — WritingPage, WritingEditor, WritingFeedback, WritingHistory đều static
- Circular score `w-28 h-28` quá lớn trên mobile
- Issues section auto-expanded, overwhelming
- Textarea `resize-none` ngăn user resize
- Word count colors không có label (colorblind unfriendly)
- Không draft auto-save
- Không confirmation khi discard

### 16. Sentence Building

**Issues:**
- **CRITICAL:** `grid grid-cols-3` breaks trên mobile (Summary)
- TouchSensor delay 150ms feels sluggish
- Progress bar thiếu easing
- `animate-shake` hardcoded CSS thay vì framer-motion
- DropZone `min-h-[120px]` hardcoded
- Không undo button

### 17. Learn Media

**Issues:**
- **CRITICAL:** textarea `rows={8}` quá cao trên mobile
- MediaHistory expand/collapse ZERO animation
- `text-xs` instruction quá nhỏ
- Score color-only → colorblind unfriendly
- Thiếu error state cho extraction failure

### 18. Mistake Journal

**Issues:**
- MistakeReview `grid-cols-4` rating buttons **không stack trên mobile**
- "Tap to reveal" assumes touch device
- Flashcard **thiếu 3D flip animation**
- Delete không confirmation
- "Clear Mastered" destructive action thiếu confirmation
- Chart hex colors không match theme
- `useMemo` with `[]` dependency never updates

### 19. Study Planner

**Issues:**
- `grid-cols-3` stat cards **cramped trên mobile**
- WeeklySchedule 7-column grid **quá tight trên mobile**
- `text-[10px]` custom size
- StudyTimer `minWidth: 180` inline hardcoded
- GoalCard remove thiếu confirmation
- GoalForm validation silent
- Chart axis colors hardcoded

---

## 🎯 HƯỚNG DẪN IMPLEMENT CHO SAM

### Thứ tự ưu tiên

**Batch 1 — Critical fixes (làm trước):**
1. Fix `App.tsx` — thêm `AnimatePresence` + location key cho page transitions
2. Fix tất cả `grid-cols-3` → `grid-cols-1 sm:grid-cols-3` (5 summary files + StudyPlanner + MistakeReview)
3. Fix `animate-pulse` seizure risk → dùng framer-motion thay thế (PronunciationCard)
4. Fix delete button invisible trên mobile (CustomTopicsPage, ConversationList)
5. Thêm confirmation dialogs cho 6 destructive actions (dùng styled Modal, không `window.confirm`)

**Batch 2 — Animation gaps (thêm framer-motion cho screens thiếu):**
6. GrammarPage + LessonPage — staggered card entrance, section fade-in
7. SettingsPage — section entrance animation
8. StatsPage — chart entrance, number count-up
9. WritingPage (toàn feature) — phase transition, feedback entrance, editor focus
10. RoleplaySummary — score entrance, section stagger
11. DictationInput + DictationModeSelector — mode switch transition
12. MediaHistory — expand/collapse animation

**Batch 3 — UX improvements:**
13. Onboarding progress indicator (step dots)
14. Vocabulary search/filter
15. PlacementQuiz answer feedback
16. Loading skeletons cho screens thiếu (DailyChallengeCard, AI Chat, etc.)
17. MistakeReview flashcard 3D flip animation
18. Time-based greeting trên Dashboard

**Batch 4 — Design system & accessibility:**
19. Tạo color tokens (CSS custom properties) thay thế raw Tailwind colors
20. Thêm `focus-visible:ring` cho Button, Card, interactive elements
21. Fix Modal accessibility (aria-modal, focus trap, Escape key)
22. Thêm `prefers-reduced-motion` media query cho tất cả animations
23. Fix Recharts dark mode colors
24. Replace `text-[10px]`/`text-[11px]` bằng minimum `text-xs` (12px)

**Batch 5 — Polish:**
25. Custom heading font
26. Celebration animations (daily goal, perfect score, achievement unlock)
27. Textarea responsive sizing (Learn Media, AI Chat)
28. Card.tsx `whileHover` opt-in thay vì default

### Lottie mở rộng đề xuất

Hiện có 5 Lottie files cho reward/feedback. Nên thêm:
- **loading-spinner.json** — thay thế text "Loading..."
- **page-empty.json** — empty state illustration
- **confetti.json** — daily goal completion, achievement unlock
- **typing-indicator.json** — AI chat typing
- **onboarding-welcome.json** — thay thế emoji 🎓

---

## Tóm tắt

| Severity | Count | Ví dụ |
|----------|-------|-------|
| 🔴 Critical | 8 | AnimatePresence missing, grid-cols-3 break, seizure risk |
| 🟠 High | 15 | Zero animation screens, no confirmation dialogs, WCAG fails |
| 🟡 Medium | 20 | Missing loading states, hardcoded values, UX gaps |
| 🟢 Low | 12 | Custom font, polish animations, minor spacing |

**Ước tính effort:** ~3-4 ngày cho Batch 1+2, thêm 2-3 ngày cho Batch 3+4+5
