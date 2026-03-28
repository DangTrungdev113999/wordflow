# Phase 4 Code Review — Marcus

> Reviewer: Marcus (Tech Lead)
> Date: 2026-03-28
> Scope: 7 features, ~50 files

---

## Tổng quan

Code quality tốt, follow đúng design doc, build clean. Dưới đây là issues cần fix trước khi merge, chia theo mức độ.

---

## 🔴 CRITICAL — Phải fix

### 1. Event Subscribers đăng ký nhiều lần (Memory Leak)

**File:** `src/App.tsx` → `initEventSubscribers()`

`initEventSubscribers()` gọi trong `useEffect` **không có cleanup**. Nếu React strict mode (dev) hoặc component remount → đăng ký listeners nhiều lần → XP tính double, achievement check chạy lặp.

**Fix:**
```typescript
// eventSubscribers.ts
let initialized = false;
export function initEventSubscribers() {
  if (initialized) return;
  initialized = true;
  // ... existing code
}
```
Hoặc tốt hơn: return cleanup function để `useEffect` gọi `eventBus.all.clear()` khi unmount.

### 2. Import không thực sự validate trước khi confirm

**File:** `src/services/dataPortService.ts` → `importData()`

Hàm `importData()` validate rồi return `success: true`, nhưng **chỉ check structure, không check data integrity**. Khi user confirm, `performImport()` clear ALL tables rồi mới bulkAdd. Nếu bulkAdd fail giữa chừng (ví dụ duplicate key) → Dexie transaction rollback, nhưng data cũ đã bị clear → **user mất data**.

**Fix:** `performImport()` nên clone current data trước khi clear, hoặc import vào temp tables rồi swap. Ít nhất nên wrap tất cả trong 1 Dexie transaction (đã có) VÀ đảm bảo `bulkAdd` dùng `{ allKeys: true }` để fail-fast.

### 3. `dailyChallenges` table thiếu trong `exportAllData` / `importData`

**File:** `src/services/dataPortService.ts`

Export/Import chỉ handle 5 tables (userProfile, wordProgress, grammarLessons, dailyLogs, dictionaryCache). Table `dailyChallenges` (mới thêm DB v2) **không được export/import** → user backup sẽ mất daily challenge history.

**Fix:** Thêm `dailyChallenges` vào `ExportData.data` interface, `exportAllData()`, `importData()` validation, và `performImport()`.

---

## 🟡 IMPORTANT — Nên fix

### 4. Wildcard achievement listener quá tốn

**File:** `src/services/eventSubscribers.ts` → `eventBus.on('*', ...)`

Wildcard `*` chạy sau **MỖI** event. Mỗi lần: query progressStore + grammarStore + chạy `checkAchievements()`. Với dictation session 10 từ → 10 events `dictation:correct` + 10 wildcard checks. Tệ hơn: mỗi wildcard check lại gọi `Object.values(lessonProgress)` → O(n) mỗi lần.

**Fix:** Debounce wildcard handler (200-300ms) hoặc chỉ check achievements khi session complete events (`quiz:complete`, `dictation:session_complete`, `daily_challenge:complete`).

### 5. `dictationCount`, `challengeCount`, `pronunciationCount` luôn = 0

**File:** `src/services/eventSubscribers.ts` → wildcard handler

Achievement context truyền `dictationCount: 0, challengeCount: 0, pronunciationCount: 0` hardcoded. Phase 4 achievements sẽ **không bao giờ unlock**.

**Fix:** Query từ DB hoặc track trong progressStore. Ví dụ:
```typescript
const dictationCount = await db.dailyLogs
  .where('dictationCorrect').above(0).count();
```

### 6. `useDictation` — session complete count bị lệch 1

**File:** `src/features/listening/hooks/useDictation.ts` → `next()`

```typescript
const next = useCallback(() => {
  // ...
  const finalCorrect = answers.filter(a => a.correct).length;
  eventBus.emit('dictation:session_complete', { correct: finalCorrect, total, mode });
```

`answers` state chưa bao gồm answer cuối cùng (vì `submitAnswer` gọi `setAnswers` → async state update). `next()` gọi ngay sau `submitAnswer` → `answers` thiếu item cuối → `finalCorrect` sai.

**Fix:** Dùng ref để track answers hoặc pass `finalCorrect` qua closure:
```typescript
const answersRef = useRef<AnswerResult[]>([]);
// Trong submitAnswer: answersRef.current = [...answersRef.current, result];
// Trong next: const finalCorrect = answersRef.current.filter(...)
```

### 7. Speech Recognition — không handle "no-speech" timeout

**File:** `src/hooks/useSpeechRecognition.ts`

5s timeout gọi `recognition.stop()` nhưng nếu user không nói gì → `onresult` không fire → Promise **không bao giờ resolve/reject** (chỉ `onend` fire). Button stuck ở listening state mãi mãi.

**Fix:** Thêm `onend` handler mà reject nếu chưa có result:
```typescript
let resolved = false;
recognition.onresult = (...) => { resolved = true; resolve(...); };
recognition.onend = () => {
  setIsListening(false);
  if (!resolved) reject(new Error('no-speech'));
};
```

### 8. Onboarding routing guard chỉ check 1 lần

**File:** `src/App.tsx`

```typescript
useEffect(() => {
  async function init() {
    // ...
    if (profile && !profile.placementDone && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
    }
  }
  init();
}, []);
```

Empty deps `[]` → chỉ check khi mount. Nếu user navigate manually (type URL) → bypass được. Nên dùng route guard component wrapper hoặc check trong router loader.

---

## 🟢 MINOR — Nice to have

### 9. `extractPhrase` fragile khi word không tìm thấy trong example

**File:** `src/features/listening/hooks/useDictation.ts`

Nếu `word.word` có dạng plural/conjugated mà example dùng base form → `indexOf` return -1 → fallback về chỉ `targetWord`. Dictation phrase mode sẽ degrade thành word mode cho những từ đó.

**Suggestion:** Dùng case-insensitive partial match hoặc stemming đơn giản.

### 10. Placement questions — tất cả `answer` đều là index 1 hoặc 2

**File:** `src/features/onboarding/data/placement-questions.ts`

8/10 câu có `answer: 1`, 2 câu có `answer: 2`. User có thể chọn đáp án thứ 2 mọi câu và đạt ≥5 → auto A2. Cần đa dạng hóa answer distribution.

### 11. `DictationMode` type định nghĩa 2 nơi

- `src/services/eventBus.ts`: `export type DictationMode = 'word' | 'phrase' | 'sentence'`
- `src/lib/types.ts` (có thể cũng define)

**Suggestion:** Chỉ export từ 1 nơi (`types.ts`), re-export nếu cần.

### 12. BottomNav 5 items — Settings mất entry point trên mobile

BottomNav có 5 items (Home, Vocab, Listen, Grammar, Badges). Settings chỉ accessible qua Sidebar (desktop). Mobile users phải tìm Settings ở đâu?

**Suggestion:** Thêm Settings icon vào Header hoặc Dashboard page.

---

## ✅ Những gì làm tốt

- **Event Bus architecture** clean, centralized, đúng pattern
- **Dexie transaction** trong import — đúng approach
- **Speech Recognition** feature detection + webkit prefix handling tốt
- **Daily Challenge** deterministic seed logic — smart, không cần backend
- **Component structure** consistent across features, reusable SessionSummary
- **Type safety** — AppEvents type map cho mitt, proper generics

---

## Verdict

**Chưa merge được.** Fix 3 critical issues (#1, #2, #3) trước. Important issues (#4-#8) nên fix cùng lượt. Minor có thể để sau.

Sau khi fix → ping lại mình review lần 2.

---

## 🔴 CRITICAL bổ sung (từ Mia's review)

### 13. Daily Challenge XP double-count

**File:** `src/features/daily-challenge/hooks/useDailyChallenge.ts`

`completeTask()` gọi `useProgressStore.getState().addXP(bonus)` trực tiếp **VÀ** `eventBus.emit('daily_challenge:complete')` → subscriber trong `eventSubscribers.ts` lại gọi `addXP(XP_VALUES.daily_challenge_complete)` lần nữa. User nhận 100 XP thay vì 50.

Tương tự, task XP 15/task cũng gọi `addXP(taskXP)` trực tiếp — không qua event bus. Inconsistent với pattern Event Bus đã thiết kế.

**Fix:** Bỏ tất cả `addXP()` trực tiếp trong `useDailyChallenge.ts`. Chỉ emit events, để subscriber xử lý XP:
```typescript
// Thêm event type mới
'daily_challenge:task_complete': { date: string; task: TaskName; wordId: string };

// Trong completeTask():
eventBus.emit('daily_challenge:task_complete', { date: today, task: taskName, wordId: word.word });
if (allDone) {
  eventBus.emit('daily_challenge:complete', { date: today, score: newXP });
}
// KHÔNG gọi addXP() trực tiếp
```

---

## Tổng hợp: 13 issues (updated)

| # | Issue | Severity | Source |
|---|-------|----------|--------|
| 1 | Event subscribers duplicate registration | 🔴 Critical | Marcus |
| 2 | Import data loss risk | 🔴 Critical | Marcus |
| 3 | dailyChallenges thiếu export/import | 🔴 Critical | Marcus |
| 13 | Daily Challenge XP double-count | 🔴 Critical | Mia |
| 4 | Wildcard achievement debounce | 🟡 Important | Marcus |
| 5 | Achievement counts hardcoded 0 | 🟡 Important | Marcus + Mia |
| 6 | Dictation session count off-by-1 | 🟡 Important | Marcus + Mia |
| 7 | Speech Recognition no-speech hang | 🟡 Important | Marcus |
| 8 | Onboarding routing guard bypass | 🟡 Important | Marcus + Mia |
| 9 | extractPhrase fragile matching | 🟢 Minor | Marcus |
| 10 | Placement answer distribution | 🟢 Minor | Marcus |
| 11 | DictationMode type duplicate | 🟢 Minor | Marcus |
| 12 | Settings mobile entry point | 🟢 Minor | Marcus |
