# Review: Sentence Building (Phase 7 Feature 2)

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-28
**Status:** ❌ NEEDS CHANGES

---

## Critical Bugs (PHẢI fix)

### 1. `SentenceBuildingPage.tsx:137` — addXP() gọi trong render body → duplicate XP

```tsx
// BUG: side effect trong render, mỗi re-render cộng XP lại
if (hook.isComplete) {
    addXP(hook.totalXP); // ← GỌI MỖI RENDER!
    return <SentenceBuildingSummary ... />;
}
```

**Fix:** Dùng useEffect:
```tsx
const [xpAdded, setXpAdded] = useState(false);
useEffect(() => {
  if (hook.isComplete && !xpAdded) {
    addXP(hook.totalXP);
    setXpAdded(true);
  }
}, [hook.isComplete, hook.totalXP, addXP, xpAdded]);
```

### 2. `useSentenceBuilding.ts:125-127` — Internal punctuation (dấu phẩy) không strip → 3 sentences KHÔNG BAO GIỜ đúng được

```ts
// BUG: chỉ strip cuối câu, dấu phẩy giữa câu vẫn còn
const correctWords = exercise.sentence
  .replace(/[.!?]+$/, '')  // "me," vs "me" → never match
  .split(/\s+/);
```

**Sentences bị ảnh hưởng:**
- `tr-008`: "Excuse me**,** could you..."
- `tr-009`: "If I had more money**,** I would..."
- `fd-010`: "If you had told me earlier**,** I would..."

**Fix:** Strip tất cả punctuation:
```ts
const correctWords = exercise.sentence
  .replace(/[.!?,;:'"]+/g, '')
  .split(/\s+/);
```

---

## Important Issues (NÊN fix)

### 3. `useSentenceBuilding.ts:129-136` — Dead code: `isCorrect` computed nhưng không dùng
Chỉ `orderCorrect` được dùng thực tế. Remove `isCorrect` block.

### 4. `SentenceBuildingExercise.tsx:91` — useCallback dependency `[state]` quá rộng
`state` là object mới mỗi render → memoization vô nghĩa.
**Fix:** Destructure dependencies cụ thể hoặc dùng useRef.

### 5. Inconsistent punctuation regex (3 chỗ khác nhau)
| Location | Regex |
|----------|-------|
| `createWordItems` (line 21) | `/[.!?,']+$/g` |
| `checkAnswer` (line 127) | `/[.!?]+$/` |
| `useHint` (line 186) | `/[.!?]+$/` |

**Fix:** Tạo shared helper function `stripPunctuation()`.

---

## Minor Issues

- `ViewState` type có `'summary'` nhưng không dùng → remove
- `originalIndex` trong WordItem không được reference ở đâu → dead code
- `_index.ts:15` spread `topic` redundant (đã có trong JSON)

---

## Checklist

| # | Item | Result |
|---|------|--------|
| 1 | Đúng design | ✅ |
| 2 | Code clean | ⚠️ Dead code, inconsistent regex |
| 3 | Architecture | ✅ Good separation |
| 4 | Security | ✅ |
| 5 | Performance | ❌ addXP trong render |
| 6 | Duplicate | ⚠️ Regex lặp 3 lần |
| 7 | dnd-kit | ✅ Đúng spec |
| 8 | Data | ✅ 40 sentences, 4 topics |
| 9 | Edge cases | ❌ 3 sentences broken |
