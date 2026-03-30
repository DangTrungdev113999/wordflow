import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Filter, ArrowUpDown, Lightbulb } from 'lucide-react';
import { useReferenceSearch } from '../hooks/useReferenceSearch';
import { COMMON_MISTAKES, type CommonMistake } from '../../../data/reference/common-mistakes';

const CATEGORY_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  tense: { label: 'Thì (Tense)', bg: 'bg-blue-50 dark:bg-blue-900/25', text: 'text-blue-700 dark:text-blue-400' },
  preposition: { label: 'Giới từ', bg: 'bg-sky-50 dark:bg-sky-900/25', text: 'text-sky-700 dark:text-sky-400' },
  article: { label: 'Mạo từ', bg: 'bg-teal-50 dark:bg-teal-900/25', text: 'text-teal-700 dark:text-teal-400' },
  'word-order': { label: 'Trật tự từ', bg: 'bg-violet-50 dark:bg-violet-900/25', text: 'text-violet-700 dark:text-violet-400' },
  pronunciation: { label: 'Phát âm', bg: 'bg-amber-50 dark:bg-amber-900/25', text: 'text-amber-700 dark:text-amber-400' },
  vocabulary: { label: 'Từ vựng', bg: 'bg-emerald-50 dark:bg-emerald-900/25', text: 'text-emerald-700 dark:text-emerald-400' },
};

const LEVEL_STYLES: Record<string, { bg: string; text: string }> = {
  A1: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  A2: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  B1: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  B2: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400' },
};

const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;

const SEARCH_FIELDS: (keyof CommonMistake)[] = ['title', 'wrong', 'correct', 'explanation'];

const filterFn = (item: CommonMistake, filters: Record<string, string>) => {
  if (filters.category && filters.category !== 'all' && item.category !== filters.category) return false;
  if (filters.level && filters.level !== 'all' && item.level !== filters.level) return false;
  return true;
};

const LEVEL_ORDER: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4 };

const sortFn = (a: CommonMistake, b: CommonMistake, sortBy: string) => {
  if (sortBy === 'category') return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
  if (sortBy === 'level') return (LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]) || a.title.localeCompare(b.title);
  return a.title.localeCompare(b.title);
};

export function CommonMistakes() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
    query, setQuery, filters, setFilter, sortBy, setSortBy, results, resultCount,
  } = useReferenceSearch<CommonMistake>(COMMON_MISTAKES, SEARCH_FIELDS, {
    filterFn,
    sortFn,
  });

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const activeCategory = filters.category || 'all';
  const activeLevel = filters.level || 'all';

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    COMMON_MISTAKES.forEach(m => { counts[m.category] = (counts[m.category] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Tìm lỗi: tense, preposition, article..."
          aria-label="Tìm kiếm lỗi thường gặp"
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-300 dark:focus:border-rose-600 transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter toggles */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setShowFilters(prev => !prev)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${showFilters ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-700' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
        >
          <Filter size={13} />
          Lọc
        </button>
        <button
          onClick={() => setSortBy(sortBy === 'alpha' ? 'category' : sortBy === 'category' ? 'level' : 'alpha')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-colors"
        >
          <ArrowUpDown size={13} />
          {sortBy === 'category' ? 'Loại lỗi' : sortBy === 'level' ? 'Trình độ' : 'A → Z'}
        </button>
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
          {resultCount} / {COMMON_MISTAKES.length} lỗi
        </span>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
              {/* Category chips */}
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Loại lỗi</p>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip value="all" active={activeCategory === 'all'} onClick={() => setFilter('category', 'all')} label={`Tất cả (${COMMON_MISTAKES.length})`} />
                  {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
                    <FilterChip key={key} value={key} active={activeCategory === key} onClick={() => setFilter('category', key)} label={`${style.label} (${categoryCounts[key] || 0})`} colorBg={style.bg} colorText={style.text} />
                  ))}
                </div>
              </div>
              {/* Level chips */}
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Trình độ</p>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip value="all" active={activeLevel === 'all'} onClick={() => setFilter('level', 'all')} label="Tất cả" />
                  {LEVELS.map(level => (
                    <FilterChip key={level} value={level} active={activeLevel === level} onClick={() => setFilter('level', level)} label={level} colorBg={LEVEL_STYLES[level].bg} colorText={LEVEL_STYLES[level].text} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mistake cards */}
      <div className="space-y-1">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400 dark:text-gray-500">Không tìm thấy lỗi nào</p>
          </div>
        ) : (
          results.map(mistake => (
            <MistakeCard
              key={mistake.id}
              mistake={mistake}
              expanded={expandedId === mistake.id}
              onToggle={() => toggleExpand(mistake.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function MistakeCard({ mistake, expanded, onToggle }: {
  mistake: CommonMistake;
  expanded: boolean;
  onToggle: () => void;
}) {
  const catStyle = CATEGORY_STYLES[mistake.category];
  const lvlStyle = LEVEL_STYLES[mistake.level];

  return (
    <div className="group">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${expanded ? 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-sm' : 'bg-white dark:bg-gray-900 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-800'}`}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-white text-[15px] flex-1 min-w-0 truncate">{mistake.title}</span>
          {catStyle && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0 ${catStyle.bg} ${catStyle.text}`}>
              {catStyle.label}
            </span>
          )}
          {lvlStyle && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0 ${lvlStyle.bg} ${lvlStyle.text}`}>
              {mistake.level}
            </span>
          )}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
          </motion.div>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mx-2 mb-1 px-4 py-3 bg-gray-50 dark:bg-gray-800/30 rounded-b-xl border-x border-b border-gray-100 dark:border-gray-800 space-y-3">
              {/* Wrong */}
              <div className="flex items-start gap-2.5 px-3 py-2.5 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-100 dark:border-rose-900/30">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">✗</span>
                <p className="text-sm text-rose-700 dark:text-rose-400 leading-relaxed">{mistake.wrong}</p>
              </div>

              {/* Correct */}
              <div className="flex items-start gap-2.5 px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">✓</span>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">{mistake.correct}</p>
              </div>

              {/* Explanation */}
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{mistake.explanation}</p>

              {/* Tip */}
              <div className="flex items-start gap-2.5 px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <Lightbulb size={16} className="flex-shrink-0 text-amber-500 mt-0.5" />
                <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">{mistake.tip}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({ value, active, onClick, label, colorBg, colorText }: {
  value: string;
  active: boolean;
  onClick: () => void;
  label: string;
  colorBg?: string;
  colorText?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${active
        ? colorBg
          ? `${colorBg} ${colorText} border-current/20`
          : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-700'
        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}
