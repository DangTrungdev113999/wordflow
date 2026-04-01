import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Volume2, ChevronDown, Filter, ArrowUpDown } from 'lucide-react';
import { useReferenceSearch } from '../hooks/useReferenceSearch';
import { IRREGULAR_VERBS, type IrregularVerb } from '../../../data/reference/irregular-verbs';
import { playWordAudio } from '../../../services/audioService';

const PATTERN_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  AAA: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/25',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    label: 'AAA — same form',
  },
  ABB: {
    bg: 'bg-blue-50 dark:bg-blue-900/25',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    label: 'ABB — V2 = V3',
  },
  ABC: {
    bg: 'bg-violet-50 dark:bg-violet-900/25',
    text: 'text-violet-700 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800',
    label: 'ABC — all different',
  },
  ABA: {
    bg: 'bg-amber-50 dark:bg-amber-900/25',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    label: 'ABA — V1 = V3',
  },
};

const FREQUENCY_LABELS: Record<number, string> = { 1: 'Phổ biến', 2: 'Trung bình', 3: 'Ít gặp' };

const FREQUENCY_DOTS: Record<number, string> = {
  1: 'text-emerald-500',
  2: 'text-amber-500',
  3: 'text-gray-600 dark:text-gray-400',
};

const SEARCH_FIELDS: (keyof IrregularVerb)[] = ['base', 'past', 'pastParticiple', 'meaning'];

const filterFn = (item: IrregularVerb, filters: Record<string, string>) => {
  if (filters.pattern && filters.pattern !== 'all' && item.pattern !== filters.pattern) return false;
  if (filters.frequency && filters.frequency !== 'all' && item.frequency !== Number(filters.frequency)) return false;
  return true;
};

const sortFn = (a: IrregularVerb, b: IrregularVerb, sortBy: string) => {
  if (sortBy === 'pattern') return a.pattern.localeCompare(b.pattern) || a.base.localeCompare(b.base);
  if (sortBy === 'frequency') return a.frequency - b.frequency || a.base.localeCompare(b.base);
  return a.base.localeCompare(b.base);
};

export function IrregularVerbsTable() {
  const [expandedVerb, setExpandedVerb] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
    query, setQuery, filters, setFilter, sortBy, setSortBy, results, resultCount,
  } = useReferenceSearch<IrregularVerb>(IRREGULAR_VERBS, SEARCH_FIELDS, {
    filterFn,
    sortFn,
  });

  const handlePlay = useCallback((word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playWordAudio(word);
  }, []);

  const toggleExpand = useCallback((base: string) => {
    setExpandedVerb(prev => prev === base ? null : base);
  }, []);

  const activePattern = filters.pattern || 'all';
  const activeFrequency = filters.frequency || 'all';

  const patternCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    IRREGULAR_VERBS.forEach(v => { counts[v.pattern] = (counts[v.pattern] || 0) + 1; });
    return counts;
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
          placeholder="Tìm verb: go, went, gone, đi..."
          aria-label="Tìm kiếm irregular verb"
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:text-gray-400 dark:placeholder:text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 dark:focus:border-violet-600 transition-all"
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
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${showFilters ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-700' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
        >
          <Filter size={13} />
          Lọc
        </button>
        <button
          onClick={() => setSortBy(sortBy === 'alpha' ? 'pattern' : sortBy === 'pattern' ? 'frequency' : 'alpha')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-colors"
        >
          <ArrowUpDown size={13} />
          {sortBy === 'pattern' ? 'Pattern' : sortBy === 'frequency' ? 'Tần suất' : 'A → Z'}
        </button>
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-auto">
          {resultCount} / {IRREGULAR_VERBS.length} verbs
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
              {/* Pattern chips */}
              <div>
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Pattern</p>
                <div className="flex flex-wrap gap-1.5">
                  <PatternChip value="all" active={activePattern === 'all'} onClick={() => setFilter('pattern', 'all')} label={`Tất cả (${IRREGULAR_VERBS.length})`} />
                  {Object.entries(PATTERN_STYLES).map(([key, style]) => (
                    <PatternChip key={key} value={key} active={activePattern === key} onClick={() => setFilter('pattern', key)} label={`${key} (${patternCounts[key] || 0})`} colorBg={style.bg} colorText={style.text} />
                  ))}
                </div>
              </div>
              {/* Frequency chips */}
              <div>
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Tần suất</p>
                <div className="flex flex-wrap gap-1.5">
                  <PatternChip value="all" active={activeFrequency === 'all'} onClick={() => setFilter('frequency', 'all')} label="Tất cả" />
                  {[1, 2, 3].map(f => (
                    <PatternChip key={f} value={String(f)} active={activeFrequency === String(f)} onClick={() => setFilter('frequency', String(f))} label={FREQUENCY_LABELS[f]} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_auto] gap-2 px-4 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
        <span>V1 (Base)</span>
        <span>V2 (Past)</span>
        <span>V3 (Past Participle)</span>
        <span className="w-16 text-right">Nghĩa</span>
      </div>

      {/* Verb rows */}
      <div className="space-y-1">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-600 dark:text-gray-400">Không tìm thấy verb nào</p>
          </div>
        ) : (
          results.map(verb => (
            <VerbRow
              key={verb.base}
              verb={verb}
              expanded={expandedVerb === verb.base}
              onToggle={() => toggleExpand(verb.base)}
              onPlay={handlePlay}
            />
          ))
        )}
      </div>
    </div>
  );
}

function VerbRow({ verb, expanded, onToggle, onPlay }: {
  verb: IrregularVerb;
  expanded: boolean;
  onToggle: () => void;
  onPlay: (word: string, e: React.MouseEvent) => void;
}) {
  const style = PATTERN_STYLES[verb.pattern];

  return (
    <div className="group">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${expanded ? 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-sm' : 'bg-white dark:bg-gray-900 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-800'}`}
      >
        <div className="flex items-center gap-2 sm:grid sm:grid-cols-[1fr_1fr_1fr_auto]">
          {/* V1 + audio */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-semibold text-gray-900 dark:text-white text-[15px]">{verb.base}</span>
            <button
              onClick={e => onPlay(verb.base, e)}
              className="w-6 h-6 rounded-full bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors flex-shrink-0"
              aria-label={`Play ${verb.base}`}
            >
              <Volume2 size={12} className="text-violet-600 dark:text-violet-400" />
            </button>
          </div>
          {/* V2 */}
          <span className="text-gray-700 dark:text-gray-300 text-sm hidden sm:block">{verb.past}</span>
          {/* V3 */}
          <span className="text-gray-700 dark:text-gray-300 text-sm hidden sm:block">{verb.pastParticiple}</span>
          {/* Meaning + expand icon */}
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block truncate max-w-[80px]">{verb.meaning}</span>
            {/* Frequency dots */}
            <div className="flex gap-0.5">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= (4 - verb.frequency) ? FREQUENCY_DOTS[verb.frequency] : 'bg-gray-200 dark:bg-gray-700'}`} />
              ))}
            </div>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
            </motion.div>
          </div>
        </div>

        {/* Mobile: show V2/V3/meaning inline */}
        <div className="flex items-center gap-3 mt-1.5 sm:hidden">
          <span className="text-xs text-gray-700 dark:text-gray-300">{verb.past}</span>
          <span className="text-xs text-gray-600 dark:text-gray-400">→</span>
          <span className="text-xs text-gray-700 dark:text-gray-300">{verb.pastParticiple}</span>
          <span className="text-xs text-gray-600 dark:text-gray-400 ml-auto">{verb.meaning}</span>
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
              {/* Pattern badge */}
              <div className="flex items-center gap-2 flex-wrap">
                {style && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
                    {style.label}
                  </span>
                )}
                <span className={`text-xs font-medium ${FREQUENCY_DOTS[verb.frequency]}`}>
                  {FREQUENCY_LABELS[verb.frequency]}
                </span>
              </div>

              {/* Examples */}
              <div className="space-y-2">
                <ExampleRow label="V1" sentence={verb.examples.base} color="text-emerald-600 dark:text-emerald-400" bgColor="bg-emerald-500" />
                <ExampleRow label="V2" sentence={verb.examples.past} color="text-blue-600 dark:text-blue-400" bgColor="bg-blue-500" />
                <ExampleRow label="V3" sentence={verb.examples.pastParticiple} color="text-violet-600 dark:text-violet-400" bgColor="bg-violet-500" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExampleRow({ label, sentence, color, bgColor }: { label: string; sentence: string; color: string; bgColor: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={`flex-shrink-0 w-7 h-5 rounded text-[10px] font-bold text-white ${bgColor} flex items-center justify-center mt-0.5`}>
        {label}
      </span>
      <p className={`text-sm leading-relaxed ${color}`}>{sentence}</p>
    </div>
  );
}

function PatternChip({ value, active, onClick, label, colorBg, colorText }: {
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
          : 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-700'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}
