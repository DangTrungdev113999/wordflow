import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, ArrowRight, ChevronDown, AlertTriangle } from 'lucide-react';
import { PREPOSITION_RULES, type PrepositionRule } from '../../../data/reference/prepositions';

const TABS = [
  { key: 'time', label: 'Time', icon: Clock },
  { key: 'place', label: 'Place', icon: MapPin },
  { key: 'movement', label: 'Movement', icon: ArrowRight },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export function PrepositionGuide() {
  const [activeTab, setActiveTab] = useState<TabKey>('time');
  const [expandedPreposition, setExpandedPreposition] = useState<string | null>(null);

  const toggleExpand = useCallback((key: string) => {
    setExpandedPreposition(prev => prev === key ? null : key);
  }, []);

  const filteredRules = useMemo(
    () => PREPOSITION_RULES.filter(r => r.category === activeTab),
    [activeTab],
  );

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PREPOSITION_RULES.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleTabChange = useCallback((key: TabKey) => {
    setActiveTab(key);
    setExpandedPreposition(null);
  }, []);

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-white dark:bg-gray-700 text-sky-700 dark:text-sky-400 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              <span className={`text-[11px] ml-0.5 ${isActive ? 'text-sky-500 dark:text-sky-400' : 'text-gray-600 dark:text-gray-400'}`}>
                ({tabCounts[tab.key] || 0})
              </span>
            </button>
          );
        })}
      </div>

      {/* Preposition cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-2"
        >
          {filteredRules.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-600 dark:text-gray-400">Không có dữ liệu</p>
            </div>
          ) : (
            filteredRules.map(rule => (
              <PrepositionCard
                key={`${rule.category}-${rule.preposition}`}
                rule={rule}
                expanded={expandedPreposition === `${rule.category}-${rule.preposition}`}
                onToggle={() => toggleExpand(`${rule.category}-${rule.preposition}`)}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PrepositionCard({ rule, expanded, onToggle }: {
  rule: PrepositionRule;
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
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-base font-bold bg-sky-50 dark:bg-sky-900/25 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
              {rule.preposition}
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {rule.rules.length} cách dùng · {rule.commonMistakes.length} lỗi hay gặp
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
                    <span className="flex-shrink-0 w-6 h-5 rounded text-[10px] font-bold text-white bg-sky-500 flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                      {r.usage}
                    </p>
                  </div>

                  {/* Examples */}
                  <div className="ml-8 space-y-1">
                    {r.examples.map((ex, exIdx) => (
                      <p key={exIdx} className="text-sm italic text-sky-700 dark:text-sky-400 leading-relaxed">
                        {ex}
                      </p>
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

              {/* Common Mistakes */}
              {rule.commonMistakes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Lỗi hay gặp
                  </p>
                  <div className="space-y-1.5">
                    {rule.commonMistakes.map((m, mIdx) => (
                      <div key={mIdx} className="flex flex-col gap-1 px-3 py-2 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="text-red-500 font-bold text-xs flex-shrink-0">✗</span>
                          <span className="text-sm text-red-600 dark:text-red-400 line-through">{m.wrong}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-500 font-bold text-xs flex-shrink-0">✓</span>
                          <span className="text-sm text-emerald-700 dark:text-emerald-400">{m.correct}</span>
                        </div>
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
