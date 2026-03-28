# Review: Learn from Media (Phase 7 Feature 3)

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-28
**Status:** ❌ NEEDS CHANGES

---

## Critical

### 1. `useMediaLearning.ts:141,165` — Side effects trong setState updater → double execution

```typescript
setState(s => {
  if (correct) addXP(10);        // ← side effect trong pure function!
  db.mediaSessions.add(session);  // ← side effect!
  addXP(20);                      // ← side effect!
  return { ... };
});
```

React StrictMode gọi setState updater **2 lần** → double XP, double DB write.

**Fix:** Tách side effects ra khỏi setState:
```typescript
// Compute new state
const newState = computeNewState(state);
setState(newState);
// Side effects SAU setState
if (correct) addXP(10);
await db.mediaSessions.add(session);
```

---

## Medium

### 2. `useMediaLearning.ts:85,118` — Thiếu JSON parse retry

Design yêu cầu: *"try/catch + retry 1 lần nếu AI trả format sai"*. Hiện chỉ có try/catch, không retry.

**Fix:** Tạo helper:
```typescript
async function parseAIJson<T>(aiCall: () => Promise<string>, label: string): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await aiCall();
      return JSON.parse(raw);
    } catch (e) {
      if (attempt === 1) throw new Error(`Failed to parse ${label} after retry`);
    }
  }
}
```

### 3. `useMediaLearning.ts:49-52` — useState dùng sai cho side effect

```typescript
useState(() => {
  db.userProfile.get('default').then(p => { ... }); // anti-pattern!
});
```

**Fix:** Đổi thành `useEffect(() => { ... }, [])`.

---

## Low (optional)

- `MediaHistory.tsx:12` — Không re-fetch sau save session mới
- `MediaInput.tsx` — Textarea thiếu `maxLength={5000}`
- Thiếu backup proxy (corsproxy.io) — design mention nhưng không critical

---

## Đã OK

- ✅ 2 input modes (URL/Text) đúng design
- ✅ AI prompts match design word-for-word
- ✅ AllOrigins proxy + 5000 chars truncate + 3000 chars to AI
- ✅ Security: DOMParser chỉ extract text, no XSS
- ✅ Rate limiter 5 req/min/feature
- ✅ Dexie mediaSessions schema đúng
- ✅ Save to my words tạo "Media Vocab" topic tự động
- ✅ Code clean, không dead code
