import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertTriangle, Lightbulb } from 'lucide-react';
import { ARTICLE_RULES, type ArticleRule } from '../../../data/reference/articles';

const ARTICLE_LABELS: Record<string, { label: string; bg: string; text: string; border: string }> = {
  a: {
    label: 'A',
    bg: 'bg-indigo-50 dark:bg-indigo-900/25',
    text: 'text-indigo-700 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  an: {
    label: 'AN',
    bg: 'bg-violet-50 dark:bg-violet-900/25',
    text: 'text-violet-700 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800',
  },
  the: {
    label: 'THE',
    bg: 'bg-emerald-50 dark:bg-emerald-900/25',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  zero: {
    label: 'Ø (Zero)',
    bg: 'bg-amber-50 dark:bg-amber-900/25',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
};

export function ArticlesCheatSheet() {
  const [expandedArticle, setExpandedArticle] = useState<string | null>('a');

  const toggleExpand = useCallback((key: string) => {
    setExpandedArticle(prev => prev === key ? null : key);
  }, []);

  return (
    <div className="space-y-2">
      {ARTICLE_RULES.map(rule => (
        <ArticleCard
          key={rule.article}
          rule={rule}
          style={ARTICLE_LABELS[rule.article]}
          expanded={expandedArticle === rule.article}
          onToggle={() => toggleExpand(rule.article)}
        />
      ))}
    </div>
  );
}

function ArticleCard({ rule, style, expanded, onToggle }: {
  rule: ArticleRule;
  style: (typeof ARTICLE_LABELS)[string];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="group">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${
          expanded
            ? 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-sm'
            : 'bg-white dark:bg-gray-900 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-base font-bold border ${style.bg} ${style.text} ${style.border}`}>
              {style.label}
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {rule.rules.length} quy tắc · {rule.commonMistakes.length} lỗi hay gặp
            </span>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
          </motion.div>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mx-2 mb-1 px-4 py-4 bg-gray-50 dark:bg-gray-800/30 rounded-b-xl border-x border-b border-gray-100 dark:border-gray-800 space-y-5">
              {/* Rules */}
              {rule.rules.map((r, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className={`flex-shrink-0 w-6 h-5 rounded text-[10px] font-bold text-white flex items-center justify-center mt-0.5 ${
                      rule.article === 'a' ? 'bg-indigo-500'
                        : rule.article === 'an' ? 'bg-violet-500'
                        : rule.article === 'the' ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                      {r.when}
                    </p>
                  </div>

                  {/* Examples (en/vi pairs) */}
                  <div className="ml-8 space-y-1.5">
                    {r.examples.map((ex, exIdx) => (
                      <div key={exIdx} className="space-y-0.5">
                        <p className={`text-sm italic leading-relaxed ${style.text}`}>
                          {ex.en}
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                          {ex.vi}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Tip */}
                  {r.tip && (
                    <div className="ml-8 flex items-start gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50">
                      <AlertTriangle size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{r.tip}</p>
                    </div>
                  )}

                  {idx < rule.rules.length - 1 && (
                    <div className="ml-8 border-t border-gray-100 dark:border-gray-800" />
                  )}
                </div>
              ))}

              {/* Special Cases */}
              {rule.specialCases.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb size={13} className="text-teal-500" />
                    <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Trường hợp đặc biệt
                    </p>
                  </div>
                  <ul className="space-y-1 ml-1">
                    {rule.specialCases.map((sc, scIdx) => (
                      <li key={scIdx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                        {sc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Mistakes */}
              {rule.commonMistakes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Lỗi hay gặp
                  </p>
                  <div className="space-y-1.5">
                    {rule.commonMistakes.map((m, mIdx) => (
                      <div key={mIdx} className="px-3 py-2 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-red-500 font-bold text-xs flex-shrink-0">✗</span>
                          <span className="text-sm text-red-600 dark:text-red-400 line-through">{m.wrong}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-500 font-bold text-xs flex-shrink-0">✓</span>
                          <span className="text-sm text-emerald-700 dark:text-emerald-400">{m.correct}</span>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed ml-5">
                          {m.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
