# Review: P10-1 Word Image System

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-29
**Commits:** 7d4ae87, 230ee71
**Status: NEEDS CHANGES** (3 medium issues)

---

## Tổng quan

Implementation tốt — 3-tier fallback hoạt động đúng, lazy loading + IntersectionObserver, cache design hợp lý, image preservation khi re-enrich rất thông minh. Code clean, readable. Tuy nhiên có vài issues cần fix trước khi merge.

---

## Issues cần fix

### 1. [Medium] Unsplash retry bị skip khi network throw
**File:** `src/services/wordImageService.ts` ~line 79-97

**Vấn đề:** Khi `fetchUnsplashImage(word)` throw (network fail, DNS error), catch block bắt luôn → không retry bằng `meaning`. Chỉ khi trả về `null` (no results) mới retry.

**Fix:** Tách try/catch cho từng call:
```ts
let photo: UnsplashResult | null = null;

// First try: English word
try {
  photo = await fetchUnsplashImage(word);
} catch {
  // network error, continue to retry
}

// Retry: Vietnamese meaning (if first returned null OR threw)
if (!photo) {
  try {
    photo = await fetchUnsplashImage(meaning);
  } catch {
    // give up, fallback to emoji
  }
}
```

### 2. [Medium] Empty EnrichedWordData có thể bị nhầm là "đã enrich"
**File:** `src/services/wordImageService.ts` ~line 151-160

**Vấn đề:** `cacheImageData` tạo entry với `updatedAt: 0` và data rỗng. Nếu `wordEnrichmentService` check `enrichedWords.get(word)` và thấy entry tồn tại, nó có thể skip enrichment vì nghĩ đã có data.

**Fix:** Thêm flag rõ ràng hoặc check `updatedAt > 0` trong enrichment service:
```ts
// Trong wordEnrichmentService.ts khi check cache:
const cached = await db.enrichedWords.get(word);
if (cached && cached.updatedAt > 0) {
  // Đã enrich thật → dùng cache
} else {
  // Chưa enrich hoặc chỉ có image stub → enrich
}
```

### 3. [Medium] Prefetch có thể vượt Unsplash rate limit khi gọi song song
**File:** `src/services/wordImageService.ts` — `prefetchTopicImages`

**Vấn đề:** Nếu user mở topic A rồi nhanh chóng mở topic B, 2 prefetch loops chạy song song, mỗi loop 1 req/sec → 2 req/sec → dễ hit 50 req/hour limit. Cũng không có cách cancel prefetch cũ.

**Fix:** Dùng module-level lock hoặc AbortController:
```ts
let currentPrefetchController: AbortController | null = null;

export async function prefetchTopicImages(words, topicId) {
  // Cancel previous prefetch
  currentPrefetchController?.abort();
  currentPrefetchController = new AbortController();
  const signal = currentPrefetchController.signal;

  for (const w of words) {
    if (signal.aborted) return;
    // ... existing logic
  }
}
```

---

## Minor Notes (không block merge)

- **Thiếu 1 topic trong TOPIC_EMOJI_MAP:** Có 20 entries, project có thể có 21 topics. Fallback `'📝'` cover được nhưng nên kiểm tra và bổ sung nếu thiếu.
- **`source: 'placeholder'` dead type:** WordImageData type cho phép `'placeholder'` nhưng không bao giờ produce. Nên xóa khỏi union type hoặc implement CSS/SVG placeholder tier.
- **Design spec nói retry bằng synonym (từ enriched data), impl dùng meaning (tiếng Việt).** Dùng meaning cũng OK vì đơn giản hơn và tránh circular dependency với enrichment. Chấp nhận.
- **Silent network failures** không log — nên thêm `console.warn` ít nhất để debug.

---

## Điểm tốt

- ✅ IntersectionObserver lazy loading — tránh fetch ảnh ngoài viewport
- ✅ In-flight request dedup — tránh fetch trùng
- ✅ Image data preservation khi re-enrich — rất thông minh
- ✅ Skeleton → fade-in transition mượt
- ✅ Dùng `thumbUrl` cho size sm, `url` cho md/lg — tiết kiệm bandwidth
- ✅ Prefetch fire-and-forget, không block UI
- ✅ TopicPage, FlashcardDeck, WordCard, WordDetail đều tích hợp đúng vị trí theo design

---

## Verdict

Fix 3 medium issues rồi em review lại. Estimated effort: ~30 phút.
