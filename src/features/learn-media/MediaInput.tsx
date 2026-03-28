import { useState } from 'react';
import { Link2, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  onSubmit: (input: string, mode: 'url' | 'text') => void;
  loading: boolean;
  error: string | null;
}

export function MediaInput({ onSubmit, loading, error }: Props) {
  const [mode, setMode] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const canSubmit = mode === 'url' ? url.trim().length > 0 : text.trim().length >= 50;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;
    onSubmit(mode === 'url' ? url.trim() : text.trim(), mode);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Tab Switch */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
            mode === 'url'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
          )}
        >
          <Link2 size={16} />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('text')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
            mode === 'text'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
          )}
        >
          <FileText size={16} />
          Text
        </button>
      </div>

      {/* Input */}
      {mode === 'url' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paste article URL
          </label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/article..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            disabled={loading}
          />
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            Supports most news articles and blog posts
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paste text content
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste article text, YouTube transcript, podcast notes, or any English text here..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            disabled={loading}
          />
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            {text.length < 50
              ? `Minimum 50 characters (${text.length}/50)`
              : `${text.length.toLocaleString()} / 5,000 characters`}
          </p>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit || loading}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all',
          canSubmit && !loading
            ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed',
        )}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Analyze Content
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
