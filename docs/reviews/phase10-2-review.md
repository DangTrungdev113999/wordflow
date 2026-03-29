# Review: Phase 10-2 — Memory Hooks + Enhanced Enrichment

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Branch:** feature/phase10-2-memory-hooks
**Commits:** 7134178, 8537b6e, 8897fb0

---

## Status: NEEDS CHANGES (1 Medium)

### ✅ Những phần tốt

- **Gemini prompt** — cover đủ 4 kỹ thuật mnemonic, tiếng Việt, output structured
- **Temperature tuning** — 0.3 cho enrichment (consistent), 0.9 cho regenerate (creative) ✅
- **regenerateMnemonic()** — lightweight prompt riêng, concurrency control qua acquireSlot/releaseSlot, chỉ update mnemonic fields trong cache
- **Types** — `EnrichedExample`, `richExamples`, `mnemonicType` đúng design spec, optional cho backward compat
- **FlashcardDeck** — amber border card, Vietnamese short labels (Âm/Ảnh/Tách/Vần), conditional render
- **Validation** — `VALID_CONTEXTS`, `VALID_MNEMONIC_TYPES` sets để validate AI output

### 🔴 Issues cần fix

#### 1. [MEDIUM] Data loss khi lazy migration fail
**File:** `WordDetail.tsx:63-67`

Khi `forceReEnrich` fail (network error, AI quota), nó return `EMPTY_ENRICHMENT` (mnemonic trống). Nhưng `updatedAt` đã bị set 0 ở `wordEnrichmentService.ts:240` → data cũ (Phase 9 mnemonic) bị mất.

**Fix:** Fallback về data cũ khi re-enrich fail:
```tsx
if (data && needsReEnrichment(data)) {
  forceReEnrich(word.word, word.meaning).then((fresh) => {
    setAiData(needsReEnrichment(fresh) ? data : fresh); // giữ data cũ nếu fail
    setAiLoading(false);
  });
}
```

### 🟡 Nice-to-have (không block merge)

#### 2. [LOW] Race condition khi chuyển word nhanh
**File:** `WordDetail.tsx:52-72`

Không có stale-closure guard. Navigate nhanh giữa các words → callback cũ overwrite state word mới. Thêm cleanup flag:
```tsx
useEffect(() => {
  let cancelled = false;
  // ... in .then: if (cancelled) return;
  return () => { cancelled = true; };
}, [word.word, word.meaning]);
```

#### 3. [LOW] Duplicated logic
- `MNEMONIC_TYPE_LABELS` định nghĩa ở cả FlashcardDeck.tsx và WordDetail.tsx (khác value nhưng cùng concept)
- `useEffect` load mnemonic giống hệt ở FlashcardPage.tsx và CustomFlashcardPage.tsx → nên extract thành `useMnemonicForWord` hook

#### 4. [LOW] UI khác design spec nhẹ
- Missing 💡 emoji prefix trong "Mẹo ghi nhớ" header
- Button "Tạo mới" dùng icon-only thay vì labeled button

### Summary

Architecture tốt, prompt Gemini chất lượng, types đúng design. Chỉ cần fix data loss bug khi lazy migration fail là merge được. Các items low priority fix luôn hoặc để sau đều OK.

---

## Re-review (commit 325b52d)

### Status: NEEDS CHANGES (1 Medium)

### ✅ WordDetail.tsx — PASS
- `.catch()` trên tất cả promise chains ✅
- `cancelled` flag trong useEffect cleanup ✅
- Functional `setAiData(prev => ...)` bỏ dependency `aiData` ✅

### 🔴 useMnemonicForWord.ts — 3 issues (gộp 1 medium)

Hook mới extract đúng ý nhưng thiếu các pattern đã fix cho WordDetail cùng commit:

1. **Thiếu `.catch()`** (line 13) — `getCachedEnrichment` promise không handle reject
2. **Thiếu `cancelled` flag** (line 9-17) — navigate nhanh → stale mnemonic
3. **Dependency `[currentWord]` dùng object ref** (line 17) — mỗi render object mới → useEffect fire thừa. Đổi thành `[currentWord?.word]`

**Fix:**
```ts
useEffect(() => {
  let cancelled = false;
  if (!currentWord) { setMnemonic(undefined); setMnemonicType(undefined); return; }
  setMnemonic(undefined);
  setMnemonicType(undefined);
  getCachedEnrichment(currentWord.word).then((data) => {
    if (!cancelled) {
      setMnemonic(data?.mnemonic || undefined);
      setMnemonicType(data?.mnemonicType);
    }
  }).catch(() => {
    if (!cancelled) { setMnemonic(undefined); setMnemonicType(undefined); }
  });
  return () => { cancelled = true; };
}, [currentWord?.word]);
```

### ✅ FlashcardPage + CustomFlashcardPage — PASS

---

## Re-review lần 2 (commit c24ee38)

### Status: PASS ✅

`useMnemonicForWord.ts` đã fix đúng cả 3 issues:
- `.catch()` handle reject ✅
- `cancelled` flag với cleanup ✅
- Dependency `[currentWord?.word]` thay object ref ✅

**P10-2 Memory Hooks — approved to merge.** 🎉
