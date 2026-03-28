import { useRef, useState } from 'react';
import { Download, Upload, FileText, FileJson, ChevronDown, AlertTriangle } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { useToastStore } from '../../../stores/toastStore';
import {
  exportCustomTopicCSV,
  exportCustomTopicJSON,
  importCustomTopicCSV,
  importCustomTopicJSON,
  performCustomImport,
  type ImportResult,
} from '../../../services/dataPortService';

const FILE_SIZE_LIMIT = 1024 * 1024; // 1MB

interface TopicExportImportProps {
  topicId: number;
  topicName: string;
  existingWords: Set<string>;
  onImportComplete: () => void;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function TopicExportImport({ topicId, topicName, existingWords, onImportComplete }: TopicExportImportProps) {
  const addToast = useToastStore((s) => s.addToast);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const dateStr = new Date().toISOString().slice(0, 10);
  const safeName = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');

  async function handleExportCSV() {
    setExportOpen(false);
    try {
      const csv = await exportCustomTopicCSV(topicId);
      downloadFile(csv, `wordflow-${safeName}-${dateStr}.csv`, 'text/csv;charset=utf-8');
      addToast({ type: 'info', title: 'Exported CSV', description: `${topicName} exported successfully` });
    } catch {
      addToast({ type: 'info', title: 'Export failed', description: 'Could not export CSV' });
    }
  }

  async function handleExportJSON() {
    setExportOpen(false);
    try {
      const data = await exportCustomTopicJSON(topicId);
      const json = JSON.stringify(data, null, 2);
      downloadFile(json, `wordflow-${safeName}-${dateStr}.json`, 'application/json');
      addToast({ type: 'info', title: 'Exported JSON', description: `${topicName} exported successfully` });
    } catch {
      addToast({ type: 'info', title: 'Export failed', description: 'Could not export JSON' });
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (file.size > FILE_SIZE_LIMIT) {
      setErrors(['File too large (max 1MB)']);
      return;
    }

    const text = await file.text();
    const ext = file.name.split('.').pop()?.toLowerCase();

    let result: ImportResult;
    if (ext === 'json') {
      result = importCustomTopicJSON(text, existingWords);
    } else if (ext === 'csv') {
      result = importCustomTopicCSV(text, existingWords);
    } else {
      setErrors(['Unsupported file format. Use .csv or .json']);
      return;
    }

    if (!result.success) {
      setErrors(result.errors);
      setImportResult(null);
      return;
    }

    if (result.words.length === 0) {
      setErrors([result.skipped > 0 ? 'All words already exist in this topic' : 'No valid words found in file']);
      setImportResult(null);
      return;
    }

    setErrors([]);
    setImportResult(result);
    setPreviewOpen(true);
  }

  async function handleConfirmImport() {
    if (!importResult) return;
    setImporting(true);
    try {
      await performCustomImport(topicId, importResult.words);
      setPreviewOpen(false);
      setImportResult(null);
      addToast({ type: 'info', title: 'Import successful', description: `${importResult.imported} words added` });
      onImportComplete();
    } catch {
      addToast({ type: 'info', title: 'Import failed', description: 'Could not add words' });
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Export dropdown */}
      <div className="relative">
        <button
          onClick={() => setExportOpen(!exportOpen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all"
        >
          <Download size={15} />
          Export
          <ChevronDown size={14} />
        </button>

        {exportOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
            <div className="absolute left-0 top-full mt-1 z-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg py-1 min-w-[150px]">
              <button
                onClick={handleExportCSV}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <FileText size={14} />
                Export CSV
              </button>
              <button
                onClick={handleExportJSON}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <FileJson size={14} />
                Export JSON
              </button>
            </div>
          </>
        )}
      </div>

      {/* Import button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all"
      >
        <Upload size={15} />
        Import
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 shadow-lg">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium mb-1">
              <AlertTriangle size={14} />
              Import Error
            </div>
            <ul className="text-xs text-red-500 dark:text-red-400 space-y-0.5">
              {errors.map((err, i) => (
                <li key={i}>- {err}</li>
              ))}
            </ul>
            <button
              onClick={() => setErrors([])}
              className="mt-2 text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Import preview modal */}
      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Import Preview">
        {importResult && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge label={`${importResult.imported} new`} variant="success" />
              {importResult.skipped > 0 && (
                <Badge label={`${importResult.skipped} skipped (duplicates)`} variant="warning" />
              )}
            </div>

            {importResult.words.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Preview
                </p>
                {importResult.words.slice(0, 3).map((w, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white">{w.word}</span>
                    {w.meaning && (
                      <span className="text-indigo-600 dark:text-indigo-400 ml-2">{w.meaning}</span>
                    )}
                  </div>
                ))}
                {importResult.words.length > 3 && (
                  <p className="text-xs text-gray-400">
                    ...and {importResult.words.length - 3} more
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setPreviewOpen(false)}
                className="flex-1 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={importing}
                className="flex-1 py-2 rounded-xl border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-all disabled:opacity-50"
              >
                {importing ? 'Importing...' : `Import ${importResult.imported} Words`}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
