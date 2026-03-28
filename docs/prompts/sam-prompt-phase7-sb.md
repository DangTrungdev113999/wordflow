## Task: Implement Sentence Building Feature (Phase 7)

Đọc file `docs/phase7-design.md` phần **Feature 2: Sentence Building** để nắm đầy đủ architecture và requirements.

### Summary
- Tạo feature module `src/features/sentence-building/` với drag & drop (dnd-kit)
- Word Bank (dưới) → Drop Zone (trên), reorder trong Drop Zone
- Hint system, difficulty levels, scoring
- Data files `src/data/sentences/` (4 topics × 10 sentences = 40 sentences minimum)
- Thêm route `/sentence-building` vào `src/routes/index.tsx`
- Thêm `SentenceBuildingExercise` type vào `src/lib/types.ts`

### Files to create/modify (theo design)
**Tạo mới:**
- `src/features/sentence-building/SentenceBuildingPage.tsx` — Page chính
- `src/features/sentence-building/SentenceBuildingExercise.tsx` — Core exercise với dnd-kit
- `src/features/sentence-building/WordChip.tsx` — Draggable word chip
- `src/features/sentence-building/DropZone.tsx` — Drop area
- `src/features/sentence-building/HintButton.tsx` — Hint logic
- `src/features/sentence-building/useSentenceBuilding.ts` — Hook: session state, scoring
- `src/features/sentence-building/SentenceBuildingSummary.tsx` — Kết quả session
- `src/data/sentences/daily-life.json` — 10 sentences
- `src/data/sentences/travel.json` — 10 sentences
- `src/data/sentences/food-drink.json` — 10 sentences
- `src/data/sentences/work.json` — 10 sentences
- `src/data/sentences/_index.ts` — Export ALL_SENTENCES

**Sửa:**
- `src/lib/types.ts` — Thêm SentenceBuildingExercise type
- `src/routes/index.tsx` — Thêm route /sentence-building

### Key Implementation Details
- Dùng `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` (đã install)
- `nanoid` cho unique ID per WordItem chip (handle trùng từ)
- Touch sensor config: `delay: 150, tolerance: 5`
- Tap word trong Drop Zone → trả về Word Bank
- Scoring: base 100 - (hintsUsed * 20) - (wrongAttempts * 10), min 0
- XP: 10 per sentence + accuracy bonus
- Normalize comparison: lowercase, trim
- Distractor words chỉ cho difficulty 'hard'

### Navigation
- Thêm Sentence Building vào sidebar/menu nếu có component navigation chung

### Constraints
- Design polished, production-grade UI, avoid generic AI look
- Look up latest docs for @dnd-kit trước khi implement (context7)
- Follow existing code patterns trong project (xem grammar feature, daily-challenge feature làm tham khảo)
- Verify everything works khi xong — chạy app dev mode, dùng Playwright navigate tới /sentence-building, screenshot kiểm tra UI render đúng, test drag & drop flow, không crash. Fix nếu có lỗi.
