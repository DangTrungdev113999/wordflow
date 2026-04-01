import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Filter, ArrowUpDown } from 'lucide-react';
import { useReferenceSearch } from '../hooks/useReferenceSearch';
import { GRAMMAR_PATTERNS, type GrammarPattern } from '../../../data/reference/grammar-patterns';

const LEVEL_STYLES: Record<string, { bg: string; text: string }> = {
  A2: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  B1: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  B2: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400' },
};

const SEARCH_FIELDS: (keyof GrammarPattern)[] = ['pattern', 'meaning', 'structure'];

const filterFn = (item: GrammarPattern, filters: Record<string, string>) => {
  if (filters.level && filters.level !== 'all' && item.level !== filters.level) return false;
  return true;
};

const LEVEL_ORDER: Record<string, number> = { A2: 1, B1: 2, B2: 3 };

const sortFn = (a: GrammarPattern, b: GrammarPattern, sortBy: string) => {
  if (sortBy === 'level') return (LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]) || a.pattern.localeCompare(b.pattern);
  return a.pattern.localeCompare(b.pattern);
};

export function GrammarPatterns() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
    query, setQuery, filters, setFilter, sortBy, setSortBy, results, resultCount,
  } = useReferenceSearch<GrammarPattern>(GRAMMAR_PATTERNS, SEARCH_FIELDS, {
    filterFn,
    sortFn,
  });

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const activeLevel = filters.level || 'all';

  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    GRAMMAR_PATTERNS.forEach(p => { counts[p.level] = (counts[p.level] || 0) + 1; });
    return counts;
  }, []);

  const patternMap = useMemo(() => {
    const map: Record<string, GrammarPattern> = {};
    GRAMMAR_PATTERNS.forEach(p => { map[p.id] = p; });
    return map;
  }, []);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Tìm pattern: suggest + V-ing, used to..."
          aria-label="Tìm kiếm grammar pattern"
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:text-gray-400 dark:placeholder:text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 focus:border-fuchsia-300 dark:focus:border-fuchsia-600 transition-all"
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
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${showFilters ? 'bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-700' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
        >
          <Filter size={13} />
          Lọc
        </button>
        <button
          onClick={() => setSortBy(sortBy === 'alpha' ? 'level' : 'alpha')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-colors"
        >
          <ArrowUpDown size={13} />
          {sortBy === 'level' ? 'Level' : 'A → Z'}
        </button>
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-auto">
          {resultCount} / {GRAMMAR_PATTERNS.length} patterns
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
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Level</p>
                <div className="flex flex-wrap gap-1.5">
                  <LevelChip value="all" active={activeLevel === 'all'} onClick={() => setFilter('level', 'all')} label={`Tất cả (${GRAMMAR_PATTERNS.length})`} />
                  {Object.entries(LEVEL_STYLES).map(([key, style]) => (
                    <LevelChip key={key} value={key} active={activeLevel === key} onClick={() => setFilter('level', key)} label={`${key} (${levelCounts[key] || 0})`} colorBg={style.bg} colorText={style.text} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pattern cards */}
      <div className="space-y-1">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-600 dark:text-gray-400">Không tìm thấy pattern nào</p>
          </div>
        ) : (
          results.map(pattern => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              expanded={expandedId === pattern.id}
              onToggle={() => toggleExpand(pattern.id)}
              patternMap={patternMap}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PatternCard({ pattern, expanded, onToggle, patternMap }: {
  pattern: GrammarPattern;
  expanded: boolean;
  onToggle: () => void;
  patternMap: Record<string, GrammarPattern>;
}) {
  const levelStyle = LEVEL_STYLES[pattern.level];

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
          <span className="font-semibold text-fuchsia-700 dark:text-fuchsia-400 text-[15px] flex-1 min-w-0 truncate">{pattern.pattern}</span>
          <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold ${levelStyle.bg} ${levelStyle.text}`}>
            {pattern.level}
          </span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
            <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
          </motion.div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 truncate">{pattern.meaning}</p>
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
              {/* Structure */}
              <div className="border-l-2 border-fuchsia-400 dark:border-fuchsia-600 pl-3 py-2 bg-gray-50 dark:bg-gray-800/40 rounded-r-lg">
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300 leading-relaxed">{pattern.structure}</p>
              </div>

              {/* Examples */}
              <div className="space-y-2">
                {pattern.examples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded text-[10px] font-bold text-white bg-fuchsia-500 flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{ex.en}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">{ex.vi}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Common mistake */}
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="text-red-500 font-bold text-sm flex-shrink-0">✗</span>
                  <p className="text-sm text-red-700 dark:text-red-400">{pattern.commonMistake.wrong}</p>
                </div>
                <div className="flex items-start gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <span className="text-emerald-500 font-bold text-sm flex-shrink-0">✓</span>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">{pattern.commonMistake.correct}</p>
                </div>
              </div>

              {/* Related patterns */}
              {pattern.relatedPatterns && pattern.relatedPatterns.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Related:</span>
                  {pattern.relatedPatterns.map(relId => {
                    const related = patternMap[relId];
                    if (!related) return null;
                    return (
                      <span key={relId} className="px-2 py-0.5 rounded-md text-xs font-medium bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400">
                        {related.pattern}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LevelChip({ value, active, onClick, label, colorBg, colorText }: {
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
          : 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-700'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}
