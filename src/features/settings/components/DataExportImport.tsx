import { useRef, useState } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { useToastStore } from '../../../stores/toastStore';
import { exportAllData, importData, performImport, type ExportData } from '../../../services/dataPortService';

export function DataExportImport() {
  const addToast = useToastStore((s) => s.addToast);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [importStats, setImportStats] = useState({ words: 0, lessons: 0, logs: 0 });
  const [pendingData, setPendingData] = useState<ExportData['data'] | null>(null);
  const [importing, setImporting] = useState(false);

  async function handleExport() {
    try {
      const data = await exportAllData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wordflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast({ type: 'info', title: 'Export successful', description: 'Backup file downloaded' });
    } catch {
      addToast({ type: 'info', title: 'Export failed', description: 'Could not export data' });
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so the same file can be re-selected
    e.target.value = '';

    const json = await file.text();
    const result = await importData(json);

    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setErrors([]);
    setImportStats(result.stats);
    setPendingData(JSON.parse(json).data);
    setConfirmOpen(true);
  }

  async function handleConfirmImport() {
    if (!pendingData) return;
    setImporting(true);
    try {
      await performImport(pendingData);
      setConfirmOpen(false);
      addToast({ type: 'info', title: 'Import successful', description: 'Data restored. Reloading...' });
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      addToast({ type: 'info', title: 'Import failed', description: 'Transaction rolled back' });
      setImporting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Data</h3>

      <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all"
        >
          <Download size={16} />
          Export Data
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all"
        >
          <Upload size={16} />
          Import Data
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {errors.length > 0 && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium mb-1">
            <AlertTriangle size={14} />
            Validation errors
          </div>
          <ul className="text-xs text-red-500 dark:text-red-400 space-y-0.5">
            {errors.map((err, i) => (
              <li key={i}>- {err}</li>
            ))}
          </ul>
        </div>
      )}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Import">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
            <AlertTriangle size={16} />
            Import will replace all current data.
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>Replace with:</p>
            <ul className="ml-4 list-disc">
              <li>{importStats.words} word progress records</li>
              <li>{importStats.lessons} lesson records</li>
              <li>{importStats.logs} daily logs</li>
            </ul>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="flex-1 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={importing}
              className="flex-1 py-2 rounded-xl border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-all disabled:opacity-50"
            >
              {importing ? 'Importing...' : 'Confirm Import'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
