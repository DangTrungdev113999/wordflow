# Sub-Phase D: Enhanced Analytics — Implementation Guide

**Author:** Marcus (Tech Lead)
**Date:** 2026-03-28
**Ref:** `docs/design-phase5-features.md` Section "Sub-Phase D"

---

## Tổng quan

Mở rộng `StatsPage` hiện có: thêm 5 sections mới bên dưới existing charts.

---

## 1. Hook: `useAnalytics.ts`

```
src/features/dashboard/hooks/useAnalytics.ts
```

Single hook aggregate TẤT CẢ data từ IndexedDB, memoize kết quả.

```typescript
interface AnalyticsData {
  // Weak Areas — top 5 weakest topics by avg easeFactor
  weakAreas: Array<{ topic: string; topicLabel: string; avgEase: number; wordCount: number }>;

  // Accuracy Trend — last 30 days quiz accuracy (smoothed 3-day moving avg)
  accuracyTrend: Array<{ date: string; accuracy: number; smoothed: number }>;

  // Skill Radar — 4 axes scored 0-100
  skillRadar: Array<{ skill: string; score: number }>;

  // Learning Heatmap — last 90 days activity
  heatmapData: Array<{ date: string; intensity: number }>; // intensity 0-4

  // Word Mastery Breakdown — count per status
  masteryBreakdown: Array<{ status: string; count: number; color: string }>;
}
```

### Data Sources (tất cả có sẵn)

| Metric | Query |
|--------|-------|
| Weak areas | `db.wordProgress.toArray()` → group by topic (split `wordId` on `:`) → avg `easeFactor` → sort ascending → top 5 |
| Accuracy trend | `db.dailyLogs.where('date').above(30daysAgo)` → `quizAccuracy` field |
| Skill radar | Aggregate from last 14 days `dailyLogs`: vocab = wordsLearned, grammar = grammarCompleted, listening = dictationCorrect/dictationAttempts, pronunciation = pronunciationCorrect |
| Heatmap | `db.dailyLogs.where('date').above(90daysAgo)` → `xpEarned` → bucket into 0-4 intensity |
| Mastery | `db.wordProgress.toArray()` → count by `status` (new/learning/review/mastered) |

### Scoring cho Skill Radar

```typescript
function computeSkillScore(logs: DailyLog[], field: string, maxPerDay: number): number {
  // Sum field over last 14 days / (14 * maxPerDay) * 100, capped at 100
}
```

- **Vocabulary:** `wordsLearned + wordsReviewed` / (14 * 20) * 100
- **Grammar:** `grammarCompleted` / (14 * 3) * 100
- **Listening:** `dictationCorrect / max(dictationAttempts, 1)` avg accuracy * 100
- **Pronunciation:** `pronunciationCorrect` / (14 * 10) * 100

### Heatmap Intensity Buckets

```
0 XP → intensity 0 (empty/gray)
1-20 XP → intensity 1
21-50 XP → intensity 2
51-100 XP → intensity 3
101+ XP → intensity 4
```

### Moving Average (3-day)

```typescript
function movingAverage(data: number[], window: number): number[] {
  return data.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}
```

---

## 2. Components

Tất cả trong `src/features/dashboard/components/`:

### 2.1 `WeakAreasChart.tsx` — Horizontal bar chart

```typescript
interface Props { data: AnalyticsData['weakAreas'] }
```

- Dùng recharts `BarChart` layout="vertical"
- Top 5 weakest topics (lowest avgEase)
- Bar color: gradient red→orange (weaker = more red)
- Show topic label + ease score

### 2.2 `AccuracyTrend.tsx` — Line chart

```typescript
interface Props { data: AnalyticsData['accuracyTrend'] }
```

- Dùng recharts `LineChart`
- 2 lines: raw accuracy (dotted, light) + smoothed (solid, bold)
- Y axis: 0-100%
- Last 30 days

### 2.3 `SkillRadar.tsx` — Radar chart

```typescript
interface Props { data: AnalyticsData['skillRadar'] }
```

- Dùng recharts `RadarChart` + `PolarGrid` + `PolarAngleAxis` + `Radar`
- 4 axes: Vocabulary, Grammar, Listening, Pronunciation
- Fill: indigo with 30% opacity

### 2.4 `LearningHeatmap.tsx` — Calendar grid (CUSTOM, no library)

```typescript
interface Props { data: AnalyticsData['heatmapData'] }
```

- CSS grid: 7 rows (Mon-Sun) × 13 columns (weeks)
- Each cell: 14×14px rounded square
- Colors: gray-100 (0), green-200 (1), green-400 (2), green-500 (3), green-600 (4)
- Dark mode: adjust opacity/colors
- Show month labels on top
- Tooltip on hover: date + XP

**Implementation:**
```typescript
// Generate 90 days grid starting from today going back
const today = new Date();
const days = Array.from({ length: 91 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (90 - i));
  return d.toISOString().slice(0, 10);
});

// Align to weeks (start from Monday)
// Fill gaps with intensity 0
```

**KHÔNG dùng library** — pure CSS grid + divs.

### 2.5 `WordMasteryBreakdown.tsx` — Donut/pie chart

```typescript
interface Props { data: AnalyticsData['masteryBreakdown'] }
```

- Dùng recharts `PieChart` + `Pie` + `Cell`
- 4 segments: new (gray), learning (amber), review (blue), mastered (green)
- Center label: total words count
- Legend below

---

## 3. StatsPage Layout Update

Giữ nguyên existing content. Thêm sections bên dưới:

```
[Existing Summary Cards]
[Existing Words Per Day Chart]
[Existing XP History Chart]

--- New sections below ---

[Skill Radar]          [Word Mastery Breakdown]
     (side by side on desktop, stacked on mobile)

[Accuracy Trend — full width]

[Weak Areas — full width]

[Learning Heatmap — full width]
```

Responsive: dùng `grid grid-cols-1 md:grid-cols-2` cho Radar + Mastery row.

---

## 4. Empty States

Mỗi chart cần handle empty data:
- Nếu chưa có logs → show placeholder text
- Nếu `wordProgress` empty → mastery breakdown hidden
- Nếu weak areas < 2 topics → hide section

---

## 5. Reuse Checklist

- ✅ `recharts` — đã có: BarChart, LineChart, PieChart, RadarChart, ResponsiveContainer, Tooltip
- ✅ `db.wordProgress`, `db.dailyLogs` — existing IndexedDB tables
- ✅ `ALL_TOPICS` — topic labels mapping
- ✅ Card styling — copy pattern từ existing StatsPage sections
- ❌ KHÔNG thêm library mới

---

## 6. Tests

- `useAnalytics` hook: mock IndexedDB data → verify computed output
  - Weak areas sorting
  - Moving average calculation
  - Skill score computation
  - Heatmap intensity buckets
  - Mastery count by status

Estimate: 8-10 test cases.

---

## Summary cho Sam

1. Tạo `useAnalytics.ts` hook — single source, aggregate all data
2. Tạo 5 components mới trong `dashboard/components/`
3. **LearningHeatmap = custom CSS grid** — không dùng library
4. Còn lại dùng recharts (đã có)
5. Mount tất cả vào `StatsPage.tsx` bên dưới existing charts
6. Handle empty states cho mỗi chart
7. Unit tests cho `useAnalytics` hook
