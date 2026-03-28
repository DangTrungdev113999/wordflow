# Phase 4 — Manual Test Plan

> Tester: Trung (hoặc bất kỳ ai có browser)
> Prereq: `pnpm dev` → mở localhost trên Chrome/Safari
> Thời gian ước tính: 15-20 phút

---

## Trước khi test

- Clear IndexedDB (DevTools → Application → Storage → Clear site data) để test fresh state
- Mở DevTools Console để catch runtime errors

---

## 1. Onboarding & Placement Test (Feature 7)

**Test fresh user flow:**
- [ ] Mở app lần đầu → tự redirect sang `/onboarding`
- [ ] WelcomeScreen hiện đúng → click "Let's Go"
- [ ] Quiz 10 câu hiện, progress bar chạy đúng
- [ ] Hoàn thành quiz → hiện level (A1 hoặc A2) + score
- [ ] Click "Start Learning" → về Dashboard
- [ ] Navigate thử URL khác (vd `/vocabulary`) → KHÔNG bị redirect về onboarding nữa

**Test skip flow:**
- [ ] Clear data → mở lại → click "Skip" → level = A1, về Dashboard

**Test redo:**
- [ ] Settings → "Redo Placement Test" → quay lại quiz

---

## 2. Event Bus (Feature 1)

> Không test riêng — verify qua các feature khác. Mở Console, check KHÔNG có lỗi liên quan event/XP.

- [ ] Flashcard session → XP cộng đúng (không double)
- [ ] Quiz complete → XP cộng đúng
- [ ] Achievement toast hiện khi đạt milestone

---

## 3. Data Export/Import (Feature 2)

**Export:**
- [ ] Settings → click "Export Data" → file `.json` download
- [ ] Mở file JSON → check có đủ: userProfile, wordProgress, grammarLessons, dailyLogs, dictionaryCache, dailyChallenges

**Import:**
- [ ] Học vài từ + làm quiz (tạo data)
- [ ] Export → ghi nhận số liệu
- [ ] Clear site data → import file vừa export
- [ ] Confirm dialog hiện stats đúng → Confirm
- [ ] App reload → data khôi phục đúng (XP, words learned, streaks)

**Import validation:**
- [ ] Thử import file JSON bậy (vd `{"foo":"bar"}`) → hiện validation errors, KHÔNG mất data

---

## 4. Daily Challenge (Feature 3)

- [ ] Dashboard → Daily Challenge widget hiện
- [ ] Click vào → `/daily-challenge` với 3 tasks
- [ ] Task 1 (Learn Word): xem từ → mark done → +15 XP toast
- [ ] Task 2 (Grammar Quiz): trả lời câu hỏi → mark done → +15 XP toast
- [ ] Task 3 (Mini Dictation): nghe + gõ từ → mark done → +15 XP toast
- [ ] Hoàn thành cả 3 → bonus +50 XP toast (check Console: KHÔNG có double XP)
- [ ] Reload page → progress vẫn saved
- [ ] Quay lại ngày mai (hoặc đổi system date) → challenge mới

---

## 5. Listening Practice (Feature 4)

- [ ] Bottom nav có icon 🎧 "Listen"
- [ ] Click → `/listening` hiện danh sách topics
- [ ] Chọn topic → chọn mode (Word / Phrase / Sentence)
- [ ] Audio phát đúng (Dictionary API hoặc Web Speech fallback)
- [ ] Gõ answer → check correct/incorrect feedback
- [ ] Hoàn thành session → summary hiện (correct/total, accuracy, XP)
- [ ] Perfect session → bonus XP

**Edge cases:**
- [ ] Phrase mode: target là 2-3 từ chứa target word
- [ ] Sentence mode: target là full example sentence
- [ ] Case-insensitive check (vd "Hello" = "hello")

---

## 6. Review Summary & Weak Words (Feature 5)

- [ ] Hoàn thành flashcard session → SessionSummary overlay hiện
- [ ] Stats đúng: correct/total, accuracy%, XP earned
- [ ] Nếu có weak words (easeFactor < 2.0) → WeakWordsList hiện
- [ ] Click "Practice Weak Words" → flashcard session chỉ với weak words (`?weak=true`)
- [ ] Quiz complete → QuizSummary hiện với incorrect questions review

---

## 7. Pronunciation Check (Feature 6)

> Chỉ test trên Chrome/Safari. Firefox → nút mic KHÔNG hiện (expected).

- [ ] Flashcard back side → thấy 🎤 mic button (cạnh 🔊 listen)
- [ ] Click 🎤 → pulsing animation + "Listening..."
- [ ] Nói đúng từ → ✅ feedback + "You said: ..."  + 5 XP
- [ ] Nói sai → ❌ feedback
- [ ] KHÔNG nói gì (im lặng 5s) → button trở về idle (KHÔNG stuck ở listening)
- [ ] Firefox → mic button ẩn hoàn toàn

---

## 8. Cross-feature Integration

- [ ] XP bar trên Dashboard cộng dồn đúng từ tất cả nguồn
- [ ] Achievement badges unlock khi đạt milestones (vd: 10 dictation correct)
- [ ] Bottom nav 5 items: Home, Vocab, Listen, Grammar, Badges — tất cả navigate đúng
- [ ] Dark mode toggle vẫn hoạt động bình thường
- [ ] Mobile responsive: test trên Chrome DevTools mobile view

---

## 9. Console Check

- [ ] Không có unhandled Promise rejections
- [ ] Không có React key warnings
- [ ] Không có "undefined" property access errors
- [ ] Event subscriber KHÔNG fire duplicate (check XP logs)

---

## Bugs Found

| # | Feature | Mô tả | Severity | Screenshot |
|---|---------|--------|----------|------------|
|   |         |        |          |            |

---

_Test xong tick hết checkboxes, ghi bugs (nếu có) vào bảng cuối, báo lại team._
