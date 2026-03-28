import { useState } from 'react';
import { FileText, Mail, PenLine, Filter } from 'lucide-react';
import type { WritingPrompt } from '../hooks/useWritingPractice';
import { cn } from '../../../lib/utils';

const TYPE_CONFIG = {
  essay: { label: 'Luận văn', icon: FileText, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  email: { label: 'Email', icon: Mail, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
  description: { label: 'Mô tả', icon: PenLine, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20' },
  story: { label: 'Truyện', icon: FileText, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' },
} as const;

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

interface PromptPickerProps {
  prompts: WritingPrompt[];
  onSelect: (prompt: WritingPrompt) => void;
}

export function PromptPicker({ prompts, onSelect }: PromptPickerProps) {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<string | null>(null);

  const filtered = prompts.filter((p) => {
    if (filterType && p.type !== filterType) return false;
    if (filterLevel && p.level !== filterLevel) return false;
    return true;
  });

  const types = [...new Set(prompts.map((p) => p.type))];
  const levels = [...new Set(prompts.map((p) => p.level))];

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter size={16} className="text-gray-400 shrink-0" />
        <button
          onClick={() => { setFilterType(null); setFilterLevel(null); }}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-colors',
            !filterType && !filterLevel
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
          )}
        >
          Tất cả
        </button>
        {types.map((t) => {
          const cfg = TYPE_CONFIG[t];
          return (
            <button
              key={t}
              onClick={() => setFilterType(filterType === t ? null : t)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                filterType === t
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
              )}
            >
              {cfg.label}
            </button>
          );
        })}
        <span className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setFilterLevel(filterLevel === l ? null : l)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              filterLevel === l
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((prompt) => {
          const cfg = TYPE_CONFIG[prompt.type];
          const Icon = cfg.icon;
          return (
            <button
              key={prompt.id}
              onClick={() => onSelect(prompt)}
              className="text-left bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', cfg.color)}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {prompt.titleVi}
                    </h3>
                    <span className={cn('px-1.5 py-0.5 text-[10px] font-bold rounded', LEVEL_COLORS[prompt.level] || '')}>
                      {prompt.level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {prompt.promptVi}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
                    {prompt.minWords}–{prompt.maxWords} từ
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
          Không có đề bài phù hợp với bộ lọc
        </p>
      )}
    </div>
  );
}
