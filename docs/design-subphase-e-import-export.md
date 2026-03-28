# Sub-Phase E: Enhanced Import/Export — Implementation Guide

**Author:** Marcus (Tech Lead)
**Date:** 2026-03-28
**Ref:** `docs/design-phase5-features.md` Section "Sub-Phase E"

---

## Tổng quan

Thêm CSV/JSON export+import cho **custom word lists**. Tách biệt với existing full-backup export/import (giữ nguyên `DataExportImport` component).

---

## 1. Service Layer — Mở rộng `dataPortService.ts`

Thêm 4 functions mới vào `src/services/dataPortService.ts`:

### 1.1 CSV Format

```csv
word,meaning,ipa,example
breakfast,bữa sáng,/ˈbrek.fəst/,"I have breakfast at 7 AM every day."
morning,buổi sáng,/ˈmɔːr.nɪŋ/,"Good morning! How are you today?"
```

**Rules:**
- Header row bắt buộc: `word,meaning,ipa,example`
- Columns: `word` (required), `meaning` (required), `ipa` (optional), `example` (optional)
- Quoted values cho fields chứa dấu phẩy
- UTF-8 encoding

### 1.2 CSV Parser — Viết tay

```typescript
// Add to dataPortService.ts or a new src/lib/csvParser.ts

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCSV(csv: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = csv.split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) throw new Error('Empty CSV');
  
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
  const rows = lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
    return row;
  });
  
  return { headers, rows };
}
```

### 1.3 Export Functions

```typescript
export async function exportCustomTopicCSV(topicId: number): Promise<string> {
  const words = await db.customWords.where('topicId').equals(topicId).toArray();
  
  const escapeCSV = (val: string) => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };
  
  const header = 'word,meaning,ipa,example';
  const rows = words.map(w =>
    [w.word, w.meaning, w.ipa, w.example]
      .map(v => escapeCSV(v ?? ''))
      .join(',')
  );
  
  return [header, ...rows].join('\n');
}

export async function exportCustomTopicJSON(topicId: number): Promise<object> {
  const topic = await db.customTopics.get(topicId);
  const words = await db.customWords.where('topicId').equals(topicId).toArray();
  
  return {
    version: 1,
    app: 'WordFlow',
    type: 'custom_topic',
    exportedAt: new Date().toISOString(),
    topic: { name: topic?.name, icon: topic?.icon },
    words: words.map(w => ({
      word: w.word,
      meaning: w.meaning,
      ipa: w.ipa,
      example: w.example,
      audioUrl: w.audioUrl,
    })),
  };
}
```

### 1.4 Import Functions

```typescript
interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;    // duplicates
  errors: string[];
  preview: { word: string; meaning: string }[];  // first 3 words
}

export async function importCustomTopicCSV(
  csv: string,
  topicId: number,
  existingWords: Set<string>,
): Promise<ImportResult> {
  // Parse CSV
  // Validate required columns: word, meaning
  // Filter duplicates (existingWords check, case-insensitive)
  // Return preview (first 3) + stats
  // Caller confirms → then call performCustomImport()
}

export async function importCustomTopicJSON(
  json: string,
  topicId: number,
  existingWords: Set<string>,
): Promise<ImportResult> {
  // Parse JSON, validate structure
  // Same duplicate check + preview pattern
}

export async function performCustomImport(
  topicId: number,
  words: Array<{ word: string; meaning: string; ipa: string; example: string; audioUrl: string | null }>,
): Promise<void> {
  // Bulk add to db.customWords
  await db.customWords.bulkAdd(
    words.map(w => ({
      topicId,
      word: w.word,
      meaning: w.meaning,
      ipa: w.ipa,
      example: w.example,
      audioUrl: w.audioUrl,
      createdAt: Date.now(),
    }))
  );
}
```

---

## 2. UI Changes

### 2.1 `CustomTopicDetailPage.tsx` — Thêm Export/Import buttons

**Vị trí:** Dưới header, trước "Start Flashcards" button.

```
[← Topic Name]              [⬇ Export ▼] [⬆ Import]
   X words

[Start Flashcards]
```

- **Export dropdown:** 2 options — "Export CSV" / "Export JSON"
  - Dùng simple dropdown (custom, không cần library)
  - Download file: `wordflow-{topicName}-{date}.csv` hoặc `.json`
- **Import button:** Accept `.csv` và `.json`
  - Detect format by extension
  - Show preview modal: word count + first 3 words + skipped count
  - Confirm → add words → reload

### 2.2 Component mới: `TopicExportImport.tsx`

```
src/features/vocabulary/components/TopicExportImport.tsx
```

Props:
```typescript
interface TopicExportImportProps {
  topicId: number;
  topicName: string;
  existingWords: Set<string>;  // from parent (đã có useMemo)
  onImportComplete: () => void; // trigger reload
}
```

**Tách component riêng** — không nhét vào CustomTopicDetailPage. Parent chỉ render `<TopicExportImport ... />`.

### 2.3 `SettingsPage` — Export All Custom Lists

Thêm section mới trong `DataExportImport.tsx` (hoặc section riêng):

- **"Export Custom Lists"** button → export TẤT CẢ custom topics as single JSON
- **"Import Custom Lists"** button → import JSON with multiple topics
- Format: `{ version: 1, app: 'WordFlow', type: 'custom_topics_all', topics: [...] }`

**Lưu ý:** Đây là P4 priority — nếu thời gian hạn chế, focus vào per-topic export/import trước. Bulk all-topics export/import có thể skip cho MVP.

---

## 3. Validation Rules

| Check | Action |
|-------|--------|
| CSV missing `word` column | Error: "CSV must have 'word' column" |
| CSV missing `meaning` column | Error: "CSV must have 'meaning' column" |
| Empty word field | Skip row |
| Duplicate (exists in topic) | Skip, increment `skipped` counter |
| JSON wrong `type` | Error: "Invalid format" |
| File > 1MB | Error: "File too large" |

---

## 4. Reuse checklist

- ✅ `db.customWords` — existing Dexie table
- ✅ `getWords()` from `customTopicService.ts` — load existing words
- ✅ `Modal` component — for import preview confirm
- ✅ `useToastStore` — success/error notifications
- ✅ `existingWords` Set — already computed in `CustomTopicDetailPage`

---

## 5. File download helper

```typescript
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

Reuse pattern từ existing `DataExportImport.handleExport()`.

---

## 6. Tests cần viết

- `parseCSVLine` — basic, quoted values, escaped quotes, empty fields
- `exportCustomTopicCSV` — correct format output
- `importCustomTopicCSV` — validate, duplicate skip, preview
- `importCustomTopicJSON` — validate structure

Estimate: 6-8 test cases.

---

## Summary cho Sam

1. Thêm CSV parser (`parseCSVLine` + `parseCSV`) vào `dataPortService.ts` hoặc file riêng
2. Thêm 4 export/import functions vào `dataPortService.ts`
3. Tạo `TopicExportImport.tsx` component
4. Mount vào `CustomTopicDetailPage.tsx`
5. Unit tests cho CSV parser + import/export logic
6. **KHÔNG thêm library** — CSV parser viết tay
7. **Skip** bulk all-topics export trong Settings cho MVP (nice-to-have)
