# Review: Bugfix — Tab State Reset on Navigate Back

**Reviewer:** Marcus (Tech Lead)
**Date:** 2026-03-30
**Commit:** c9f3f1c

---

## Status: NEEDS CHANGES (1 Medium + 1 Hygiene)

### ✅ Những phần tốt

- **useState → useSearchParams** đúng ở cả 3 pages
- **`replace: true`** — tab change không tạo history entry ✅
- **Default values** — fallback đúng tab đầu tiên
- **Approach đúng** — persist vào URL là cách tốt nhất cho case này

### 🔴 Issues cần fix

#### 1. [MEDIUM] Không validate tab value từ URL
**Files:** GrammarPage.tsx, ListeningPage.tsx, MistakeJournalPage.tsx

Dùng `as Tab` chỉ là type assertion, không validate runtime. URL bị sửa thành `?tab=garbage` → UI trống, không tab nào active.

**Fix:**
```ts
const VALID_TABS: Tab[] = ['lessons', 'reference'];
const raw = searchParams.get('tab');
const activeTab = VALID_TABS.includes(raw as Tab) ? (raw as Tab) : 'lessons';
```

Áp dụng tương tự cho ListeningPage (`VALID_MODES`) và MistakeJournalPage (`VALID_TABS`).

#### 2. [HYGIENE] Commit chứa files không liên quan
Commit này lẫn:
- `docs/phase13-word-usage-design.md` (665 dòng design doc)
- 5 file `.png` screenshots ở root
- 1 file `.log` console log

**Fix:**
- Xóa `.log` file khỏi repo
- Move screenshots vào `docs/` hoặc xóa nếu chỉ dùng để verify
- Tách `phase13-word-usage-design.md` thành commit riêng
- Thêm `.playwright-mcp/*.log` và `*.png` ở root vào `.gitignore`

### Summary

Logic fix đúng hướng, chỉ thiếu validation cho URL params và cần clean commit. Fix xong là merge được.
