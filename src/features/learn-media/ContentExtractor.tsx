import { Loader2, FileText } from 'lucide-react';

interface Props {
  loading: boolean;
  title: string;
  text: string;
}

export function ContentExtractor({ loading, title, text }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
            <Loader2 size={28} className="text-indigo-500 animate-spin" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">Analyzing content...</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Extracting vocabulary with AI</p>
        </div>

        {/* Progress steps */}
        <div className="w-full max-w-xs space-y-2 mt-4">
          <Step label="Extracting text" done={text.length > 0} active={text.length === 0} />
          <Step label="AI vocabulary analysis" done={false} active={text.length > 0} />
        </div>
      </div>
    );
  }

  if (!title && !text) return null;

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText size={16} className="text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{title}</h3>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">{text.slice(0, 200)}...</p>
    </div>
  );
}

function Step({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
        done
          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
          : active
            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
      }`}>
        {done ? '✓' : active ? <Loader2 size={12} className="animate-spin" /> : '·'}
      </div>
      <span className={`text-xs ${done ? 'text-emerald-600' : active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}
