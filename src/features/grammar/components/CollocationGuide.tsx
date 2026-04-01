import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Lightbulb, RotateCcw, Check, XCircle } from 'lucide-react';
import { useReferenceSearch } from '../hooks/useReferenceSearch';
import { COLLOCATION_GROUPS, type CollocationGroup } from '../../../data/reference/collocations';

interface FlatCollocation {
  groupId: string;
  groupTitle: string;
  word: string;
  phrase: string;
  meaning: string;
  example: string;
}

const SEARCH_FIELDS: (keyof FlatCollocation)[] = ['phrase', 'meaning', 'groupTitle'];

const flattenCollocations = (groups: CollocationGroup[]): FlatCollocation[] =>
  groups.flatMap(group =>
    group.entries.flatMap(entry =>
      entry.collocations.map(col => ({
        groupId: group.id,
        groupTitle: group.title,
        word: entry.word,
        phrase: col.phrase,
        meaning: col.meaning,
        example: col.example,
      }))
    )
  );

const COLUMN_STYLES = [
  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' },
  { bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-200 dark:border-sky-800', badge: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400' },
  { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800', badge: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400' },
];

export function CollocationGuide() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const flatItems = useMemo(() => flattenCollocations(COLLOCATION_GROUPS), []);

  const { query, setQuery, results, resultCount } = useReferenceSearch<FlatCollocation>(
    flatItems,
    SEARCH_FIELDS,
  );

  const matchingGroupIds = useMemo(() => {
    if (!query.trim()) return null;
    return new Set(results.map(r => r.groupId));
  }, [query, results]);

  const displayedGroups = useMemo(() => {
    if (!matchingGroupIds) return COLLOCATION_GROUPS;
    return COLLOCATION_GROUPS.filter(g => matchingGroupIds.has(g.id));
  }, [matchingGroupIds]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedGroup(prev => prev === id ? null : id);
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
          placeholder="Tìm collocation: make a decision, nói dối..."
          aria-label="Tìm kiếm collocation"
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:text-gray-400 dark:placeholder:text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Counter */}
      <div className="flex items-center">
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-auto">
          {displayedGroups.length} / {COLLOCATION_GROUPS.length} groups
        </span>
      </div>

      {/* Groups */}
      <div className="space-y-2">
        {displayedGroups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-600 dark:text-gray-400">Không tìm thấy collocation nào</p>
          </div>
        ) : (
          displayedGroups.map(group => (
            <GroupAccordion
              key={group.id}
              group={group}
              expanded={expandedGroup === group.id}
              onToggle={() => toggleExpand(group.id)}
              highlightedPhrases={matchingGroupIds ? new Set(results.filter(r => r.groupId === group.id).map(r => r.phrase)) : null}
            />
          ))
        )}
      </div>
    </div>
  );
}

function GroupAccordion({ group, expanded, onToggle, highlightedPhrases }: {
  group: CollocationGroup;
  expanded: boolean;
  onToggle: () => void;
  highlightedPhrases: Set<string> | null;
}) {
  return (
    <div className="group">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${expanded ? 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-sm' : 'bg-white dark:bg-gray-900 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-800'}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-[15px]">{group.title}</h3>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 line-clamp-1">{group.description}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {group.entries.reduce((sum, e) => sum + e.collocations.length, 0)} phrases
            </span>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mx-2 mb-1 px-3 py-4 bg-gray-50 dark:bg-gray-800/30 rounded-b-xl border-x border-b border-gray-100 dark:border-gray-800 space-y-4">
              {/* Word columns */}
              <div className={`grid gap-3 ${group.entries.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                {group.entries.map((entry, idx) => {
                  const style = COLUMN_STYLES[idx % COLUMN_STYLES.length];
                  return (
                    <div key={entry.word} className={`rounded-lg border p-3 ${style.bg} ${style.border}`}>
                      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold uppercase mb-2 ${style.badge}`}>
                        {entry.word}
                      </span>
                      <div className="space-y-2">
                        {entry.collocations.map(col => {
                          const isHighlighted = highlightedPhrases === null || highlightedPhrases.has(col.phrase);
                          return (
                            <div
                              key={col.phrase}
                              className={`transition-opacity ${isHighlighted ? 'opacity-100' : 'opacity-40'}`}
                            >
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{col.phrase}</p>
                              <p className="text-xs text-gray-700 dark:text-gray-300">{col.meaning}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 italic mt-0.5">{col.example}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tip box */}
              <div className="flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <Lightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{group.tip}</p>
              </div>

              {/* Mini Quiz */}
              <MiniQuiz groupId={group.id} questions={group.quiz} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniQuiz({ groupId, questions }: {
  groupId: string;
  questions: CollocationGroup['quiz'];
}) {
  const [quizActive, setQuizActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);

  const isFinished = currentQ >= questions.length && quizActive;
  const current = questions[currentQ];

  const handleAnswer = useCallback((idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === current.correct) {
      setScore(prev => prev + 1);
    }
    setTimeout(() => {
      setAnswered(null);
      setCurrentQ(prev => prev + 1);
    }, 1200);
  }, [answered, current]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setScore(0);
    setAnswered(null);
  }, []);

  if (!quizActive) {
    return (
      <button
        onClick={() => { handleRestart(); setQuizActive(true); }}
        className="w-full py-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
      >
        Mini Quiz ({questions.length} questions)
      </button>
    );
  }

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 bg-white dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 text-center space-y-3"
      >
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {score} / {questions.length}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {score === questions.length ? 'Xuất sắc! Bạn trả lời đúng tất cả!' : score >= questions.length * 0.6 ? 'Khá tốt! Hãy ôn lại những câu sai nhé.' : 'Cố gắng hơn nhé! Xem lại collocations phía trên.'}
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
          >
            <RotateCcw size={12} />
            Thử lại
          </button>
          <button
            onClick={() => setQuizActive(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-colors"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`${groupId}-q-${currentQ}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 bg-white dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Question {currentQ + 1} / {questions.length}
        </span>
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          Score: {score}
        </span>
      </div>

      <p className="text-sm text-gray-900 dark:text-white font-medium leading-relaxed">
        {current.sentence}
      </p>

      <div className="flex flex-wrap gap-2">
        {current.options.map((option, idx) => {
          let chipClass = 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';

          if (answered !== null) {
            if (idx === current.correct) {
              chipClass = 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700';
            } else if (idx === answered) {
              chipClass = 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-700';
            } else {
              chipClass = 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 opacity-50';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={answered !== null}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${chipClass}`}
            >
              {option}
              {answered !== null && idx === current.correct && <Check size={14} />}
              {answered !== null && idx === answered && idx !== current.correct && <XCircle size={14} />}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
