# WordFlow — English Learning App

## Overview
Web app học tiếng Anh cho beginner, tập trung từ vựng + ngữ pháp.
Owner: Trung (cá nhân)

## Core Features

### 📚 Vocabulary
- Flashcard với Spaced Repetition (SM-2 algorithm)
- Học theo chủ đề (Daily Life, Food, Travel, Business, Tech...) + CEFR level (A1-A2)
- Mỗi từ: nghĩa tiếng Việt, phiên âm IPA, audio phát âm, ví dụ câu
- 10-20 từ/ngày (configurable)

### 📝 Grammar
- Bài học lý thuyết theo level
- Quiz trắc nghiệm
- Điền vào chỗ trống (fill in the blank)
- Sửa câu sai (error correction)
- Sắp xếp câu (sentence ordering)

### 📊 Tracking & Gamification
- Daily streak 🔥
- Điểm (XP) cho mỗi hoạt động
- Thống kê: từ đã học, accuracy, thời gian học/ngày
- Achievements/Badges: "7-day streak 🔥", "Master 100 words 🏆", "Grammar Pro 📝"
- Level system (Beginner → Intermediate → Advanced)

## APIs & Data Sources
- **Dictionary:** Free Dictionary API (https://api.dictionaryapi.dev/api/v2/entries/en/{word})
  - Nghĩa, IPA phonetics, audio pronunciation (UK/AU), examples, synonyms
  - Free, no API key needed
- **Vocabulary data:** Curated JSON datasets by topic + CEFR level (built-in)
  - Bao gồm nghĩa tiếng Việt
- **Grammar data:** Curated lessons + exercises (built-in JSON)
- **Text-to-Speech:** Web Speech API (browser built-in) — fallback cho audio

## Milestones

### Phase 1 — Foundation (MVP)
- Project setup (monorepo, build tools)
- Database schema (SQLite/JSON): words, progress, stats
- Vocabulary module: flashcard UI, word detail (IPA, audio, meaning), browse by topic
- Spaced repetition engine (SM-2)
- Basic dashboard: words learned today, streak

### Phase 2 — Grammar & Quiz
- Grammar lessons (lý thuyết từng topic)
- Quiz engine: multiple choice, fill-in-blank, error correction, sentence ordering
- Grammar progress tracking
- XP system + scoring

### Phase 3 — Gamification & Polish
- Achievement/badge system
- Level progression
- Detailed statistics (charts: words/day, accuracy trends)
- Daily goals + reminders
- UI polish: animations, responsive design, dark/light theme
- Data seeding: comprehensive word lists (500+ words), grammar lessons (20+ topics)

## Tech Stack
Marcus sẽ quyết định — không cần Trung confirm.

## Path
~/TrustAI/projects/wordflow

## Discord
Cần tạo channel mới: #wordflow
