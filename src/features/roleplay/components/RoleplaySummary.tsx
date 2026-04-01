import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { RoleplaySummary as Summary } from '../../../db/models';
import { cn } from '../../../lib/utils';

interface RoleplaySummaryProps {
  summary: Summary;
  scenarioTitle: string;
  onNewScenario: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

function FluencyCountUp({ end }: { end: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  const animate = useCallback(() => {
    if (!inView) return;
    const duration = 700;
    const start = performance.now();
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [end, inView]);

  useEffect(() => { animate(); }, [animate]);

  return <span ref={ref}>{val}</span>;
}

export function RoleplaySummary({ summary, scenarioTitle, onNewScenario }: RoleplaySummaryProps) {
  const [showGrammar, setShowGrammar] = useState(true);

  const xp = 50 + (summary.goalCompleted ? 20 : 0) + (summary.fluency >= 7 ? 10 : 0);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={sectionVariants} className="flex items-center gap-3 mb-5">
          <button
            onClick={onNewScenario}
            className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Tổng kết — {scenarioTitle}</h2>
        </motion.div>

        {/* Goal completion */}
        <motion.div
          variants={sectionVariants}
          className={cn(
            'rounded-2xl p-5 mb-4 border',
            summary.goalCompleted
              ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20'
              : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20',
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            {summary.goalCompleted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
              >
                <CheckCircle2 size={24} className="text-green-500" />
              </motion.div>
            ) : (
              <XCircle size={24} className="text-red-500" />
            )}
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {summary.goalCompleted ? 'Hoàn thành mục tiêu!' : 'Chưa hoàn thành mục tiêu'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 ml-9">{summary.goalFeedback}</p>
        </motion.div>

        {/* Fluency score */}
        <motion.div variants={sectionVariants} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Độ lưu loát</h3>
            <span className="text-lg font-bold text-gray-900 dark:text-white"><FluencyCountUp end={summary.fluency} />/10</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700',
                summary.fluency >= 7 ? 'bg-green-500' : summary.fluency >= 4 ? 'bg-amber-500' : 'bg-red-500',
              )}
              style={{ width: `${summary.fluency * 10}%` }}
            />
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300">{summary.fluencyFeedback}</p>
          <p className="text-xs text-indigo-500 font-semibold mt-2">+{xp} XP</p>
        </motion.div>

        {/* Grammar corrections */}
        {summary.grammarIssues.length > 0 && (
          <motion.div variants={sectionVariants} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-4">
            <button
              onClick={() => setShowGrammar(!showGrammar)}
              className="flex items-center justify-between w-full"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Lỗi ngữ pháp ({summary.grammarIssues.length})
              </h3>
              {showGrammar ? <ChevronUp size={16} className="text-gray-600 dark:text-gray-400" /> : <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />}
            </button>
            <AnimatePresence>
              {showGrammar && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-3">
                    {summary.grammarIssues.map((issue, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-red-500 line-through shrink-0">{issue.original}</span>
                          <span className="text-gray-600 dark:text-gray-400">→</span>
                          <span className="text-green-600 dark:text-green-400 font-medium">{issue.correction}</span>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1.5">{issue.explanation}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Useful phrases & Phrases to learn */}
        <motion.div variants={sectionVariants} className="grid gap-4 sm:grid-cols-2 mb-4">
          {summary.usefulPhrases.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Cụm từ bạn dùng tốt</h3>
              <div className="space-y-1.5">
                {summary.usefulPhrases.map((p, i) => (
                  <div key={i} className="px-2.5 py-1.5 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-xs rounded-lg border border-green-100 dark:border-green-900/30">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}
          {summary.phrasesToLearn.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Cụm từ cần luyện thêm</h3>
              <div className="space-y-1.5">
                {summary.phrasesToLearn.map((p, i) => (
                  <div key={i} className="px-2.5 py-1.5 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 text-xs rounded-lg border border-amber-100 dark:border-amber-900/30">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Overall feedback */}
        <motion.div variants={sectionVariants} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-5 mb-6 border border-amber-100 dark:border-amber-900/20">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">{summary.overallFeedback}</p>
          </div>
        </motion.div>

        {/* Action */}
        <motion.div variants={sectionVariants}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onNewScenario}
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
          >
            Chọn kịch bản mới
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
