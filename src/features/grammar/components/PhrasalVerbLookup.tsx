import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Filter, ArrowUpDown } from 'lucide-react';
import { useReferenceSearch } from '../hooks/useReferenceSearch';
import { PHRASAL_VERBS, type PhrasalVerb } from '../../../data/reference/phrasal-verbs';

const LEVEL_STYLES: Record<string, { bg: string; text: string }> = {
  A1: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  A2: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  B1: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  B2: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400' },
};

const BASE_VERBS = ['get', 'look', 'turn', 'take', 'put', 'come', 'go', 'give', 'break', 'make', 'bring', 'carry', 'pick', 'run', 'set', 'work', 'hold'] as const;
const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;
const SEPARABLE_OPTIONS = ['all', 'separable', 'inseparable'] as const;

const SORT_LABELS: Record<string, string> = {
  alpha: 'A → Z',
  baseVerb: 'Base verb',
  level: 'Level',
  frequency: 'Tần suất',
};

const SORT_CYCLE: string[] = ['alpha', 'baseVerb', 'level', 'frequency'];

const SEARCH_FIELDS: (keyof PhrasalVerb)[] = ['verb', 'meaning', 'baseVerb'];

const FREQUENCY_DOTS: Record<number, string> = {
  1: 'bg-emerald-500',
  2: 'bg-amber-500',
  3: 'bg-gray-400 dark:bg-gray-500',
};

const filterFn = (item: PhrasalVerb, filters: Record<string, string>) => {
  if (filters.baseVerb && filters.baseVerb !== 'all' && item.baseVerb !== filters.baseVerb) return false;
  if (filters.level && filters.level !== 'all' && item.level !== filters.level) return false;
  if (filters.separable && filters.separable !== 'all') {
    if (filters.separable === 'separable' && !item.separable) return false;
    if (filters.separable === 'inseparable' && item.separable) return false;
  }
  return true;
};

const sortFn = (a: PhrasalVerb, b: PhrasalVerb, sortBy: string) => {
  if (sortBy === 'baseVerb') return a.baseVerb.localeCompare(b.baseVerb) || a.verb.localeCompare(b.verb);
  if (sortBy === 'level') {
    const order = { A1: 0, A2: 1, B1: 2, B2: 3 };
    return (order[a.level] ?? 0) - (order[b.level] ?? 0) || a.verb.localeCompare(b.verb);
  }
  if (sortBy === 'frequency') return a.frequency - b.frequency || a.verb.localeCompare(b.verb);
  return a.verb.localeCompare(b.verb);
};

export function PhrasalVerbLookup() {
  const [expandedVerb, setExpandedVerb] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
    query, setQuery, filters, setFilter, sortBy, setSortBy, results, resultCount,
  } = useReferenceSearch<PhrasalVerb>(PHRASAL_VERBS, SEARCH_FIELDS, {
    filterFn,
    sortFn,
  });

  const toggleExpand = useCallback((verb: string) => {
    setExpandedVerb(prev => prev === verb ? null : verb);
  }, []);

  const activeBaseVerb = filters.baseVerb || 'all';
  const activeLevel = filters.level || 'all';
  const activeSeparable = filters.separable || 'all';

  const baseVerbCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PHRASAL_VERBS.forEach(v => { counts[v.baseVerb] = (counts[v.baseVerb] || 0) + 1; });
    return counts;
  }, []);

  const cycleSortBy = useCallback(() => {
    const currentIdx = SORT_CYCLE.indexOf(sortBy || 'alpha');
    const nextIdx = (currentIdx + 1) % SORT_CYCLE.length;
    setSortBy(SORT_CYCLE[nextIdx]);
  }, [sortBy, setSortBy]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Tìm phrasal verb: get up, tìm kiếm, look..."
          aria-label="Tìm kiếm phrasal verb"
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:text-gray-400 dark:placeholder:text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 dark:focus:border-amber-600 transition-all"
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
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${showFilters ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
        >
          <Filter size={13} />
          Lọc
        </button>
        <button
          onClick={cycleSortBy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-colors"
        >
          <ArrowUpDown size={13} />
          {SORT_LABELS[sortBy || 'alpha']}
        </button>
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-auto">
          {resultCount} / {PHRASAL_VERBS.length} phrasal verbs
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
              {/* Base verb chips */}
              <div>
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Base verb</p>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip value="all" active={activeBaseVerb === 'all'} onClick={() => setFilter('baseVerb', 'all')} label={`Tất cả (${PHRASAL_VERBS.length})`} />
                  {BASE_VERBS.map(bv => (
                    <FilterChip key={bv} value={bv} active={activeBaseVerb === bv} onClick={() => setFilter('baseVerb', bv)} label={`${bv} (${baseVerbCounts[bv] || 0})`} />
                  ))}
                </div>
              </div>
              {/* Level chips */}
              <div>
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Level</p>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip value="all" active={activeLevel === 'all'} onClick={() => setFilter('level', 'all')} label="Tất cả" />
                  {LEVELS.map(lvl => (
                    <FilterChip
                      key={lvl}
                      value={lvl}
                      active={activeLevel === lvl}
                      onClick={() => setFilter('level', lvl)}
                      label={lvl}
                      colorBg={LEVEL_STYLES[lvl].bg}
                      colorText={LEVEL_STYLES[lvl].text}
                    />
                  ))}
                </div>
              </div>
              {/* Separable chips */}
              <div>
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Separable</p>
                <div className="flex flex-wrap gap-1.5">
                  {SEPARABLE_OPTIONS.map(opt => (
                    <FilterChip
                      key={opt}
                      value={opt}
                      active={activeSeparable === opt}
                      onClick={() => setFilter('separable', opt)}
                      label={opt === 'all' ? 'Tất cả' : opt === 'separable' ? '✂️ Separable' : '🔗 Inseparable'}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verb rows */}
      <div className="space-y-1">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-600 dark:text-gray-400">Không tìm thấy phrasal verb nào</p>
          </div>
        ) : (
          results.map(verb => (
            <VerbRow
              key={verb.verb}
              verb={verb}
              expanded={expandedVerb === verb.verb}
              onToggle={() => toggleExpand(verb.verb)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function VerbRow({ verb, expanded, onToggle }: {
  verb: PhrasalVerb;
  expanded: boolean;
  onToggle: () => void;
}) {
  const levelStyle = LEVEL_STYLES[verb.level];

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
          {/* Verb name */}
          <span className="font-semibold text-gray-900 dark:text-white text-[15px]">{verb.verb}</span>
          {/* Level badge */}
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${levelStyle.bg} ${levelStyle.text}`}>
            {verb.level}
          </span>
          {/* Separable icon */}
          <span className="text-sm" title={verb.separable ? 'Separable' : 'Inseparable'}>
            {verb.separable ? '✂️' : '🔗'}
          </span>
          {/* Frequency dots */}
          <div className="flex gap-0.5 ml-auto mr-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= (4 - verb.frequency) ? FREQUENCY_DOTS[verb.frequency] : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
          </motion.div>
        </div>
        {/* Meaning */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{verb.meaning}</p>
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
              {/* Separable explanation */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${verb.separable ? 'bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'}`}>
                  {verb.separable ? '✂️ Separable' : '🔗 Inseparable'}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {verb.separable
                    ? `Có thể tách: ${verb.baseVerb} + object + ${verb.particle}`
                    : `Không tách được: luôn dùng ${verb.verb} liền nhau`}
                </span>
              </div>

              {/* Base verb + particle */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/25 text-amber-700 dark:text-amber-400 font-medium">{verb.baseVerb}</span>
                <span className="text-gray-600 dark:text-gray-400">+</span>
                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">{verb.particle}</span>
              </div>

              {/* Examples */}
              <div className="space-y-2">
                {verb.examples.map((ex, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">{ex.en}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">{ex.vi}</p>
                  </div>
                ))}
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
          : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}
