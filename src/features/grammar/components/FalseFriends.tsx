import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Filter, ArrowUpDown, Lightbulb } from 'lucide-react';
import { useReferenceSearch } from '../hooks/useReferenceSearch';
import { FALSE_FRIENDS, type FalseFriend } from '../../../data/reference/false-friends';

const LEVEL_STYLES: Record<string, { bg: string; text: string }> = {
  A1: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  A2: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  B1: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  B2: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400' },
};

const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;

const SEARCH_FIELDS: (keyof FalseFriend)[] = ['word', 'commonMistake', 'correctMeaning', 'tip'];

const LEVEL_ORDER: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4 };

const filterFn = (item: FalseFriend, filters: Record<string, string>) => {
  if (filters.level && filters.level !== 'all' && item.level !== filters.level) return false;
  return true;
};

const sortFn = (a: FalseFriend, b: FalseFriend, sortBy: string) => {
  if (sortBy === 'level') return (LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]) || a.word.localeCompare(b.word);
  return a.word.localeCompare(b.word);
};

export function FalseFriends() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
    query, setQuery, filters, setFilter, sortBy, setSortBy, results, resultCount,
  } = useReferenceSearch<FalseFriend>(FALSE_FRIENDS, SEARCH_FIELDS, {
    filterFn,
    sortFn,
  });

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const activeLevel = filters.level || 'all';

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Tìm từ: actually, eventually, sensible..."
          aria-label="Tìm kiếm từ dễ nhầm"
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:text-gray-400 dark:placeholder:text-gray-500 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-300 dark:focus:border-orange-600 transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter toggles */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setShowFilters(prev => !prev)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${showFilters ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-700' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
        >
          <Filter size={13} />
          Lọc
        </button>
        <button
          onClick={() => setSortBy(sortBy === 'alpha' ? 'level' : 'alpha')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-colors"
        >
          <ArrowUpDown size={13} />
          {sortBy === 'level' ? 'Trình độ' : 'A → Z'}
        </button>
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-auto">
          {resultCount} / {FALSE_FRIENDS.length} từ
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
              {/* Level chips */}
              <div>
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Trình độ</p>
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

      {/* Word cards */}
      <div className="space-y-1">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-600 dark:text-gray-400">Không tìm thấy từ nào</p>
          </div>
        ) : (
          results.map(friend => (
            <WordCard
              key={friend.id}
              friend={friend}
              expanded={expandedId === friend.id}
              onToggle={() => toggleExpand(friend.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function WordCard({ friend, expanded, onToggle }: {
  friend: FalseFriend;
  expanded: boolean;
  onToggle: () => void;
}) {
  const lvlStyle = LEVEL_STYLES[friend.level];

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
          <span className="font-bold text-gray-900 dark:text-white text-lg flex-shrink-0">{friend.word}</span>
          {lvlStyle && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0 ${lvlStyle.bg} ${lvlStyle.text}`}>
              {friend.level}
            </span>
          )}
          <motion.div className="ml-auto flex-shrink-0" animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
          </motion.div>
        </div>
        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
          <span className="text-gray-600 dark:text-gray-400">Hay nhầm: </span>
          <span className="text-rose-600 dark:text-rose-400">{friend.commonMistake}</span>
        </p>
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
              {/* Correct meaning */}
              <div>
                <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">Nghĩa đúng</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium leading-relaxed">{friend.correctMeaning}</p>
              </div>

              {/* Wrong usage */}
              <div>
                <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">Cách dùng sai</p>
                <p className="text-sm text-rose-600 dark:text-rose-400 italic leading-relaxed">{friend.wrongUsage}</p>
              </div>

              {/* Examples */}
              {friend.examples.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Ví dụ</p>
                  <div className="space-y-2">
                    {friend.examples.map((ex, i) => (
                      <div key={i} className="space-y-0.5">
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{ex.en}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">{ex.vi}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tip */}
              <div className="flex items-start gap-2.5 px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <Lightbulb size={16} className="flex-shrink-0 text-amber-500 mt-0.5" />
                <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">{friend.tip}</p>
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
          : 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-700'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}
