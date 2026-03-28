# Design: API Data Sources — Thay Thế Hardcoded Data

**Author:** Marcus (Tech Lead)  
**Date:** 2026-03-28  
**Status:** Pending Alex confirm

---

## Hiện Trạng

- **Vocabulary:** 20 topics × 20-25 words = ~450 từ, hardcoded trong `src/data/vocabulary/*.json`
  - Mỗi word: `word`, `meaning` (tiếng Việt), `ipa`, `example`, `audioUrl` (all null)
- **Grammar:** 20 lessons hardcoded trong `src/data/grammar/*.json`
  - Mỗi lesson: theory (sections + examples) + exercises (MC, fill-blank, error-correction, sentence-order)
- **Dictionary lookup:** Đã dùng Free Dictionary API (`dictionaryapi.dev`) cho word detail page

---

## 1. Vocabulary APIs — Research

### 1.1 Free Dictionary API (đang dùng) ✅
- **URL:** `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- **Data:** definitions, IPA, audio (UK+US mp3), examples, synonyms, part of speech
- **Limit:** Unlimited, free, no API key
- **Thiếu:** Không có meaning tiếng Việt, không có word lists theo topic, không có CEFR level

### 1.2 WordsAPI (via RapidAPI) ⭐ RECOMMEND
- **URL:** `https://wordsapiv1.p.rapidapi.com/words/{word}`
- **Data:** definitions, pronunciation (IPA), syllables, frequency, synonyms, antonyms, categories, **word relationships** (typeOf, hasTypes, partOf, similarTo)
- **Limit:** Free tier = 2,500 req/day. $10/mo = 25K/day
- **Điểm mạnh:** Frequency data (biết từ phổ biến/hiếm), hierarchical relationships
- **Thiếu:** Không có audio, không có tiếng Việt, không group theo topic

### 1.3 Datamuse API ✅ FREE
- **URL:** `https://api.datamuse.com/words?ml={word}&md=dpf`
- **Data:** related words, definitions, part of speech, frequency, rhymes, sounds-like
- **Limit:** 100K req/day, free, no API key
- **Điểm mạnh:** Tìm từ liên quan, synonyms, rhymes — tốt cho **word discovery**
- **Thiếu:** Không có IPA, audio, tiếng Việt, examples

### 1.4 Wordnik API
- **URL:** `https://api.wordnik.com/v4/word.json/{word}/definitions`
- **Data:** definitions (nhiều nguồn), examples, pronunciations, audio, related words, random words
- **Limit:** Free = 100 req/hour. $10/mo = 1K/hour
- **Điểm mạnh:** Audio pronunciation, multiple definition sources, example sentences
- **Thiếu:** Không có tiếng Việt, API key cần đợi 1-7 ngày

### 1.5 Không có API nào cung cấp:
- ❌ **Meaning tiếng Việt** — không API nào có sẵn EN→VI
- ❌ **Word lists theo topic + CEFR level** — không API nào organize theo cách này
- ❌ **Grammar exercises** — không có API nào cho sẵn

---

## 2. Grammar Data — Research

### Kết luận: KHÔNG có API cho grammar exercises

Không tồn tại API free/affordable nào cung cấp:
- Grammar theory (rules, explanations)
- Exercises (MC, fill-blank, sentence-order)
- Theo CEFR level

**Lý do:** Grammar content là intellectual property, các platform (Duolingo, British Council, Cambridge) đều giữ private.

### Giải pháp khả thi cho grammar:
1. **Giữ local** (recommend) — data hiện tại đã tốt
2. **Dùng LLM API** (OpenAI/Gemini) để generate exercises on-the-fly — chi phí cao, latency cao, cần validate output
3. **Build backend + CMS** — tự quản lý content, overkill cho phase này

---

## 3. Đề Xuất Approach — Hybrid Model

### Layer 1: Core Data — GIỮ LOCAL ✅
Giữ hardcoded cho:
- **Vocabulary topics + word lists** — vì cần topic organization + CEFR level + tiếng Việt
- **Grammar lessons + exercises** — vì không có API nào cung cấp
- **Achievement definitions** — static config

**Lý do:** Đây là curated content, cần control chất lượng. Không API nào cho đủ data theo format cần thiết.

### Layer 2: Enrichment — FETCH TỪ API 🔄
Dùng API để **bổ sung** data cho local words:

```
Local word: { word: "breakfast", meaning: "bữa sáng", ipa: "/ˈbrek.fəst/" }
                    ↓ enrich via API
Enriched:   { ...local, audio: "https://...mp3", definitions: [...], synonyms: [...], examples: [...] }
```

**APIs dùng:**
| Data | API | Khi nào |
|------|-----|---------|
| Audio pronunciation | Free Dictionary API | Khi user mở word detail |
| English definitions | Free Dictionary API | Khi user mở word detail |
| Example sentences | Free Dictionary API | Khi user mở word detail |
| Synonyms/Related | Datamuse | Khi user mở word detail |
| Word frequency | WordsAPI (optional) | Background enrichment |

### Layer 3: Discovery — MỞ RỘNG TỪ VỰNG 🆕
Thêm feature "Explore" cho user tìm từ mới ngoài local data:

```
User search "kitchen tools" → Datamuse API → related words
→ User chọn word → Free Dictionary API → full detail
→ User thêm vào custom word list
```

---

## 4. Implementation Plan

### Phase A: Audio Enrichment (P0)
- Khi load flashcard, gọi Free Dictionary API lấy audio URL
- Cache trong IndexedDB (đã có `dictionaryCache`)
- Populate `audioUrl` field trong vocab data
- `AudioButton` component đã có, chỉ cần wire data

### Phase B: Word Detail Enhancement (P1)
- Word detail page: fetch thêm synonyms từ Datamuse
- Hiện multiple definitions từ Free Dictionary
- Cache aggressive (7 days, đã có logic)

### Phase C: Custom Word Lists (P2)
- User tạo custom topic
- Search word → Free Dictionary API → add to list
- Persist trong IndexedDB

### Phase D: Smart Suggestions (P3 - Optional)
- Datamuse `ml=` (meaning-like) để suggest related words
- WordsAPI frequency để sort từ theo độ phổ biến
- Cần WordsAPI key ($0-$10/mo)

---

## 5. Technical Architecture

```
┌─────────────────────────────────────────────┐
│                  UI Layer                    │
├─────────────────────────────────────────────┤
│              Data Service Layer              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ VocabSvc │  │ GrammarSvc│  │ DictSvc   │ │
│  │ (local)  │  │ (local)   │  │ (API+cache)│ │
│  └──────────┘  └──────────┘  └───────────┘ │
├─────────────────────────────────────────────┤
│           Cache Layer (IndexedDB)            │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ vocabData│  │grammarData│  │ dictCache │ │
│  │ (static) │  │ (static)  │  │ (7d TTL)  │ │
│  └──────────┘  └──────────┘  └───────────┘ │
├─────────────────────────────────────────────┤
│              External APIs                   │
│  Free Dictionary │ Datamuse │ WordsAPI(opt) │
└─────────────────────────────────────────────┘
```

### New Service: `src/services/enrichmentService.ts`

```typescript
interface EnrichedWord extends VocabWord {
  audioUrl: string | null;        // Free Dictionary API
  definitions: string[];          // Free Dictionary API  
  synonyms: string[];             // Datamuse API
  relatedWords: string[];         // Datamuse API
  frequency?: number;             // WordsAPI (optional)
}

async function enrichWord(word: string): Promise<EnrichedWord> {
  // 1. Check IndexedDB cache
  // 2. Parallel fetch: Free Dictionary + Datamuse
  // 3. Merge results
  // 4. Cache in IndexedDB (7d TTL)
  // 5. Return enriched data
}
```

---

## 6. Cost Analysis

| API | Tier | Cost | Daily Limit | Đủ cho WordFlow? |
|-----|------|------|-------------|-------------------|
| Free Dictionary | Free | $0 | Unlimited | ✅ Dư |
| Datamuse | Free | $0 | 100K | ✅ Dư |
| WordsAPI | Free | $0 | 2,500 | ✅ Đủ (450 words + cache) |
| WordsAPI | Basic | $10/mo | 25K | ✅ Dư |

**Recommend:** Bắt đầu $0/mo, chỉ dùng Free Dictionary + Datamuse. Thêm WordsAPI khi cần frequency data.

---

## 7. Lưu Ý Cho Sam

1. **Không refactor data layer hiện tại** — giữ nguyên `ALL_TOPICS` và `ALL_GRAMMAR_LESSONS`, chỉ thêm enrichment layer phía trên
2. **Parallel fetch:** `Promise.all([freeDictionary, datamuse])` — không sequential
3. **Graceful fallback:** API fail → dùng local data, không break UI
4. **Rate limiting client-side:** Debounce API calls khi user browse nhanh
5. **Cache-first:** Luôn check IndexedDB trước khi fetch
6. **Audio preload:** Trong flashcard session, preload audio cho 2-3 cards tiếp theo
