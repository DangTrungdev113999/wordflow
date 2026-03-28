# WordFlow v2 — Marcus's Feature & Architecture Proposals

## A. Architecture Improvements

### 1. Data Export/Import
**Vấn đề:** IndexedDB có thể bị xóa bởi browser (clear data, private mode). User mất toàn bộ progress.
**Đề xuất:**
- Export progress → JSON file (download)
- Import từ JSON file (restore)
- Đặt trong Settings, UI đơn giản: 2 buttons "Export Data" / "Import Data"
**Effort:** Nhỏ. Serialize Dexie tables → JSON blob → download. Import thì validate + upsert.

### 2. Service Layer Refactor — Event Bus
**Vấn đề:** Hiện tại XP, achievements, daily log đang được gọi rải rác. Khi thêm feature mới (listening, writing...) sẽ phải duplicate logic award XP + check achievements ở nhiều chỗ.
**Đề xuất:** Thêm một event bus nhẹ (mitt hoặc custom EventEmitter):
- Mỗi activity dispatch event: `{ type: "flashcard_correct", wordId, quality }`
- `xpEngine` và `achievementEngine` subscribe events → tự xử lý
- Dễ extend: thêm feature mới chỉ cần dispatch event, không sửa engine
**Effort:** Trung bình. Refactor services + stores.

---

## B. Feature Proposals (xếp theo priority)

### 🥇 1. Listening Practice (Mini Dictation)
**Mô tả:** Nghe audio → gõ lại từ/câu. Rất quan trọng cho beginner — kết nối phát âm với spelling.
**Flow:**
- Chọn topic → app phát audio 1 từ (hoặc câu ngắn từ examples)
- User gõ lại → so sánh (case-insensitive, trim)
- Hiện kết quả: đúng/sai + IPA + nghĩa
- 3 modes: Word only / Short phrase / Full sentence (từ example sentences có sẵn)
**Tech:** Dùng lại `audioService.ts` + Web Speech API. Data đã có (words + examples). Chỉ cần UI mới + scoring logic.
**Effort:** Trung bình. Tái sử dụng data + audio hiện có.

### 🥇 2. Daily Challenge / Word of the Day
**Mô tả:** Mỗi ngày 1 mini-challenge tổng hợp: 1 từ mới + 1 câu grammar + 1 listening. Tạo habit loop mạnh hơn streak.
**Flow:**
- Dashboard hiện "Daily Challenge" card nổi bật
- 3 mini-tasks (~2 phút): learn 1 word + 1 grammar question + 1 dictation
- Hoàn thành → bonus XP + badge riêng (Daily Champion)
- Deterministic: cùng ngày = cùng challenge (seed by date)
**Tech:** Chọn random word + grammar exercise dựa trên date seed. Không cần backend.
**Effort:** Nhỏ-Trung bình.

### 🥈 3. Pronunciation Check (Speech Recognition)
**Mô tả:** User đọc từ → app so sánh với đáp án bằng Web Speech Recognition API.
**Flow:**
- Flashcard mode thêm nút "🎤 Speak"
- User đọc → SpeechRecognition API trả text → so sánh với target word
- Feedback: ✅ correct / ❌ try again + hiện IPA
**Lưu ý:**
- `webkitSpeechRecognition` hỗ trợ tốt trên Chrome/Edge, kém trên Firefox/Safari
- Accuracy không 100% nhưng đủ tốt cho beginner words đơn giản
- Cần feature detection + graceful fallback (ẩn nút nếu browser không hỗ trợ)
**Effort:** Trung bình. Browser API có sẵn nhưng cần handle edge cases.

### 🥈 4. Vocabulary Context — Example Sentences với Highlight
**Mô tả:** Mở rộng word detail: thêm 2-3 example sentences, highlight target word, cho user tap để xem nghĩa từng từ trong câu.
**Flow:**
- Word detail page hiện thêm "More Examples" section
- Mỗi câu: highlight target word, dịch nghĩa bên dưới
- Tap vào từ khác trong câu → mini popup nghĩa (gọi Dictionary API hoặc built-in glossary)
**Tech:** Enrich JSON data với thêm examples. Tap-to-lookup dùng Dictionary API (đã có cache).
**Effort:** Trung bình. Cần enrich data + UI mới.

### 🥈 5. Review Summary & Weak Words
**Mô tả:** Sau mỗi session (flashcard/quiz), hiện summary chi tiết + highlight "weak words" (những từ user hay sai).
**Flow:**
- End of session → màn hình summary: đúng/sai, thời gian, XP earned
- "Weak Words" section: từ có easeFactor thấp hoặc repetitions = 0 nhiều lần
- CTA: "Practice Weak Words" → flashcard session chỉ với weak words
**Tech:** Query WordProgress WHERE easeFactor < 2.0 OR status = "learning" với lastReview gần.
**Effort:** Nhỏ. Data đã có, chỉ cần UI.

### 🥉 6. Onboarding & Placement Test
**Mô tả:** User mới vào app → mini quiz 10 câu để xác định level (A1 hay A2). Cá nhân hóa content từ đầu.
**Flow:**
- First launch → "Let's find your level!" → 10 câu mixed (vocab + grammar)
- Score < 50% → A1, >= 50% → A2
- Set CEFR filter mặc định dựa trên kết quả
- User có thể redo hoặc override trong Settings
**Effort:** Nhỏ. 10 câu hardcoded + simple scoring.

### 🥉 7. Spaced Writing Practice
**Mô tả:** Cho user viết câu dùng từ vừa học. Beginner-friendly: cho template/gợi ý, user điền.
**Flow:**
- Sau khi học 1 từ → prompt: "Write a sentence using '{word}'"
- Gợi ý structure: "I ___ every ___." 
- Không cần AI check — chỉ cần chứa target word + minimum length
- Lưu lại sentences → "My Sentences" collection (motivation)
**Tech:** Simple text input + validation (contains word, min 3 words).
**Effort:** Nhỏ.

---

## C. KHÔNG recommend (cho beginner app)

- **AI chatbot / conversation practice**: Quá phức tạp cho beginner, cần backend + API costs
- **Social/leaderboard**: Scope creep, cần auth + backend
- **Video lessons**: Heavy content creation, không phù hợp client-only app
- **Translate feature**: Google Translate đã có, không cần reinvent

---

## D. Đề xuất Priority cho Phase 4

Nếu chỉ chọn 3 features cho phase tiếp:
1. **Data Export/Import** (bảo vệ user data — phải có)
2. **Daily Challenge** (tăng engagement, effort nhỏ, ROI cao)
3. **Listening Practice** (skill mới quan trọng nhất cho beginner, tái sử dụng data hiện có)

Stretch goals (nếu còn time):
4. Review Summary & Weak Words
5. Pronunciation Check
