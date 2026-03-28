# Phase 7 Design Review — Alex

## Overall: ✅ APPROVED với minor fixes

Design chất lượng cao, architecture rõ ràng, giữ backward compatibility tốt. 3 features có implementation order logic (Sentence Building → Media → Daily Challenge v2).

---

## 🟢 Điểm tốt

1. **Approach đúng**: Nâng cấp Daily Challenge thay vì viết lại — giữ data cũ
2. **dnd-kit** là lựa chọn tốt — lightweight, React-first, touch support
3. **Reuse QuizRenderer** cho Media Quiz — tránh duplicate code
4. **Fallback strategy** cho URL extraction (text input luôn available)
5. **Edge cases** cover tốt: trùng từ (nanoid), JSON parse fail, CORS
6. **Sentence data format** clean, expandable theo topic + CEFR

---

## 🟡 Cần sửa trước khi code

### 1. DB Version sai
- Design ghi `version(3)` cho migration, nhưng DB hiện tại đã ở `version(4)`
- **Fix**: Dùng `version(5)` cho Phase 7 migration (thêm mediaSessions table + upgrade dailyChallenges)

### 2. DailyChallengeLog migration thiếu field
- Hiện tại có `wordId: string` — migration trong design chỉ handle `tasks` object → array, chưa migrate `wordId` thành `contentId` trong task đầu tiên
- **Fix**: Migration cần map `challenge.wordId` → `tasks[0].contentId`

### 3. Sentence data — cần đủ content cho MVP
- Cần ít nhất 3-4 topics × 10 sentences = 30-40 sentences để có trải nghiệm tốt
- Topics gợi ý: daily-life, travel, food, work (align với vocab topics hiện có)
- **Fix**: Sam tạo data files đủ, hoặc Marcus cung cấp sentence list

---

## 🟢 Không cần sửa (notes cho Sam)

- Touch sensor config `delay: 150, tolerance: 5` — OK cho mobile
- AI prompt truncate 3000 chars — hợp lý
- AllOrigins proxy + corsproxy.io backup — đủ reliable
- Rate limit 2 AI calls/session cho Media — OK với 5 req/min hiện tại

---

## Verdict

**APPROVED** ✅ — Marcus sửa 2 điểm DB version + migration, rồi Sam bắt đầu code theo thứ tự: Sentence Building → Learn from Media → Daily Challenge v2.
