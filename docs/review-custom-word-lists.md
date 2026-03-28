# Code Review: Custom Word Lists (Phase C)

**Reviewer:** Marcus (Tech Lead)  
**Date:** 2026-03-28  
**Commit:** c90ca22  
**Verdict:** ✅ PASS

---

## Checklist

| Item | Status | Notes |
|------|--------|-------|
| DB migration v3 | ✅ | `customTopics` (++id, name, createdAt) + `customWords` (++id, topicId, word, createdAt) |
| customTopicService | ✅ | Clean CRUD: createTopic, deleteTopic, getTopics, addWord, removeWord, getWords |
| searchWord | ✅ | Free Dictionary API, 5s timeout, graceful fallback, extract IPA/audio/def/example |
| deleteTopic transaction | ✅ | Wraps topic + words + progress deletion in Dexie transaction — data consistency |
| CreateTopicModal | ✅ | Name input + emoji picker (24 options), maxLength=40, clean form handling |
| WordSearch | ✅ | 500ms debounce, Enter shortcut, loading spinner, not-found state |
| AddWordCard | ✅ | Shows word/IPA/meaning/example, audio play, Add button → "Added" state |
| CustomTopicsPage | ✅ | List view, create CTA, empty state, delete with hover reveal, staggered animation |
| CustomTopicDetailPage | ✅ | Word list with status badges, search + add, Start Flashcards, remove words |
| CustomFlashcardPage | ✅ | Reuses FlashcardDeck + SessionSummary, enriched audio, weak words integration |
| useCustomFlashcard | ✅ | SM2 spaced repetition, event bus integration, daily goal tracking, due-word filtering |
| Routes | ✅ | 3 new routes: /custom, /custom/:topicId, /custom/:topicId/learn |
| VocabularyPage integration | ✅ | Shows top 3 custom topics + create CTA on main vocabulary page |
| TypeScript | ✅ | `tsc --noEmit` pass |
| Unit tests | ✅ | 44/44 pass |

## Architecture Notes

- **Good:** `useCustomFlashcard` properly reuses `calculateSM2` + `eventBus` — consistent with existing flashcard flow
- **Good:** Word IDs use `custom-{topicId}:{word}` prefix — no collision with built-in vocab progress
- **Good:** Debounced search prevents API flooding
- **Good:** Delete button uses `opacity-0 group-hover:opacity-100` — clean UX pattern

## Minor Suggestions (backlog)

1. **Delete confirmation:** `handleDelete` in CustomTopicsPage deletes immediately without confirm dialog. Nên thêm confirm modal vì xóa topic = xóa tất cả words + progress. Không critical cho phase này nhưng important cho UX.

2. **Duplicate word check:** `addWord` service không check duplicate word trong cùng topic. UI check via `existingWords` Set nhưng nếu gọi service trực tiếp có thể tạo duplicate. Nên thêm unique constraint hoặc check trong service.

3. **`getWords` trong `loadTopics`:** CustomTopicsPage gọi `getWords` cho mỗi topic để đếm. Nếu nhiều topics, N+1 query. Nên thêm `getTopicWordCounts()` dùng Dexie `count()` thay vì `toArray().length`.
