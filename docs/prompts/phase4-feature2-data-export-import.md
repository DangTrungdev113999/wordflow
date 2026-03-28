# Task: Implement Data Export/Import for WordFlow app

## Context
WordFlow is a React + TypeScript English learning app using Vite, Dexie (IndexedDB), Zustand, React Router, Framer Motion, Tailwind CSS.

Database is in `src/db/database.ts` using Dexie with tables: words, wordProgress, grammarLessons, dailyLogs, userProfile, dictionaryCache.
Models are in `src/db/models.ts`.
Settings page is at `src/features/settings/pages/SettingsPage.tsx`.

## What to do

### 1. Create `src/services/dataPortService.ts`

```typescript
export interface ExportData {
  version: 1;
  exportedAt: string;               // ISO timestamp
  app: 'WordFlow';
  data: {
    userProfile: UserProfile;
    wordProgress: WordProgress[];
    grammarLessons: GrammarLesson[];
    dailyLogs: DailyLog[];
    dictionaryCache: DictionaryCache[];
  };
}

export async function exportAllData(): Promise<ExportData> {
  // 1. Query all Dexie tables (userProfile, wordProgress, grammarLessons, dailyLogs, dictionaryCache)
  // 2. Build ExportData object with version: 1, app: 'WordFlow', exportedAt: new Date().toISOString()
  // 3. Return the object (component will JSON.stringify + download)
  // NOTE: Do NOT export the `words` table - it's static built-in data, not user data
}

export async function importData(json: string): Promise<{
  success: boolean;
  stats: { words: number; lessons: number; logs: number };
  errors: string[];
}> {
  // 1. JSON.parse the input
  // 2. Validate schema:
  //    - version must be 1
  //    - app must be "WordFlow"
  //    - data must contain userProfile, wordProgress, grammarLessons, dailyLogs
  //    - dictionaryCache is optional (skip if missing)
  // 3. Validate data types:
  //    - wordProgress[].wordId must match format "topic:word" (contains a colon)
  //    - wordProgress[].easeFactor must be >= 1.3
  //    - dailyLogs[].date must match format YYYY-MM-DD
  //    - userProfile must have required fields: id, xp, level, currentStreak, dailyGoal, theme, badges
  // 4. Return validation result with stats and errors
  //    NOTE: This function does NOT perform the actual import - it validates only
  //    The component will call performImport() after user confirmation
}

export async function performImport(data: ExportData['data']): Promise<void> {
  // Use Dexie transaction to:
  // 1. Clear wordProgress, grammarLessons, dailyLogs, userProfile, dictionaryCache tables
  // 2. Bulk insert all data from the validated export
  // 3. If any step fails, transaction rolls back automatically
}
```

### 2. Create `src/features/settings/components/DataExportImport.tsx`

A React component for the Settings page with:

**Export section:**
- "Export Data" button with download icon
- On click: call `exportAllData()`, JSON.stringify with 2-space indent, create Blob, trigger download
- Filename format: `wordflow-backup-YYYY-MM-DD.json`
- Show success toast after export

**Import section:**
- "Import Data" button with upload icon
- Hidden `<input type="file" accept=".json">` triggered by button click
- On file select: read file, call `importData(json)` for validation
- If validation fails: show error list
- If validation passes: show confirm dialog with stats ("Replace X word progress records, Y lesson records, Z daily logs?")
- On confirm: call `performImport(data)`, reload stores, show success toast
- Warning text: "⚠️ Import will replace all current data."

**Styling:**
- Match existing Settings page style (white/dark cards with rounded-2xl, border, padding)
- Use lucide-react icons (Download, Upload, AlertTriangle)
- Use the existing toast system from `src/stores/toastStore.ts`
- Use the existing Modal component from `src/components/ui/Modal.tsx` for confirm dialog

### 3. Update `src/features/settings/pages/SettingsPage.tsx`
- Import and add `<DataExportImport />` component at the bottom of the settings page
- Place it after the existing sections (Theme, Daily Goal)

## Important constraints
- Do NOT change any existing UI/visual behavior
- Do NOT break existing functionality  
- Follow the existing code patterns and styling conventions in the project
- Use Dexie's transaction API for safe import (rollback on failure)
- The `words` table contains static built-in data - do NOT include it in export/import
- After import, Zustand stores need to be refreshed. Use `window.location.reload()` as simplest approach after successful import
- Commit message: `feat: add data export/import to settings`

## After implementing
Run `pnpm build` to verify no TypeScript errors.
