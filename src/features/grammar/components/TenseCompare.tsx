import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { TENSE_COMPARISONS, type TenseComparison } from '../../../data/reference/tense-comparisons';

export function TenseCompare() {
  const [activeIdx, setActiveIdx] = useState(0);
  const comparison = TENSE_COMPARISONS[activeIdx];

  const prev = () => setActiveIdx(i => (i === 0 ? TENSE_COMPARISONS.length - 1 : i - 1));
  const next = () => setActiveIdx(i => (i === TENSE_COMPARISONS.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-5">
      {/* Tab navigation */}
      <div className="flex items-center gap-2">
        <button onClick={prev} aria-label="So sánh trước" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0">
          <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
        </button>

        <div className="flex-1 overflow-x-auto scrollbar-none">
          <div className="flex gap-1.5 min-w-max px-0.5">
            {TENSE_COMPARISONS.map((comp, i) => (
              <button
                key={comp.id}
                onClick={() => setActiveIdx(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${i === activeIdx
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                {comp.title.replace(' vs ', ' / ')}
              </button>
            ))}
          </div>
        </div>

        <button onClick={next} aria-label="So sánh tiếp" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0">
          <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Comparison content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={comparison.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <ComparisonCard comparison={comparison} />
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div className="flex justify-center gap-1.5">
        {TENSE_COMPARISONS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            aria-label={`Chuyển đến so sánh ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === activeIdx ? 'w-6 bg-indigo-500' : 'w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
}

function ComparisonCard({ comparison }: { comparison: TenseComparison }) {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="space-y-4">
      {/* Side-by-side tenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TensePanel tense={comparison.tenseA} variant="indigo" />
        <TensePanel tense={comparison.tenseB} variant="emerald" />
      </div>

      {/* Key difference */}
      <div className="flex items-start gap-3 p-3.5 bg-amber-50 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-800/40 rounded-xl">
        <Lightbulb size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-0.5">Khác biệt chính</p>
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{comparison.keyDifference}</p>
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-rose-500" />
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lỗi thường gặp</p>
        </div>
        <div className="space-y-2">
          {comparison.commonMistakes.map((mistake, i) => (
            <div key={i} className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1.5">
              <div className="flex items-start gap-2">
                <XCircle size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rose-600 dark:text-rose-400 line-through decoration-rose-300 dark:decoration-rose-600">{mistake.wrong}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{mistake.correct}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 pl-[22px] leading-relaxed">{mistake.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz trigger */}
      {!showQuiz ? (
        <button
          onClick={() => setShowQuiz(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium text-sm rounded-xl border border-indigo-200/60 dark:border-indigo-800/40 transition-colors"
        >
          <Sparkles size={16} />
          Làm quiz ({comparison.quiz.length} câu)
        </button>
      ) : (
        <MiniQuiz questions={comparison.quiz} onClose={() => setShowQuiz(false)} />
      )}
    </div>
  );
}

function TensePanel({ tense, variant }: {
  tense: TenseComparison['tenseA'];
  variant: 'indigo' | 'emerald';
}) {
  const styles = variant === 'indigo'
    ? {
        card: 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-200/50 dark:border-indigo-800/30',
        title: 'text-indigo-700 dark:text-indigo-400',
        structure: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        dot: 'bg-indigo-400 dark:bg-indigo-500',
        signal: 'bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/40',
        example: 'text-indigo-800 dark:text-indigo-300',
        exampleVi: 'text-indigo-500/70 dark:text-indigo-400/60',
      }
    : {
        card: 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30',
        title: 'text-emerald-700 dark:text-emerald-400',
        structure: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-400 dark:bg-emerald-500',
        signal: 'bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40',
        example: 'text-emerald-800 dark:text-emerald-300',
        exampleVi: 'text-emerald-500/70 dark:text-emerald-400/60',
      };

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${styles.card}`}>
      {/* Tense name */}
      <h3 className={`font-bold text-base ${styles.title}`}>{tense.name}</h3>

      {/* Structure */}
      <div className={`inline-block px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border ${styles.structure}`}>
        {tense.structure}
      </div>

      {/* Usage */}
      <ul className="space-y-1.5">
        {tense.usage.map((u, i) => (
          <li key={i} className="flex items-start gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${styles.dot} mt-1.5 flex-shrink-0`} />
            <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{u}</span>
          </li>
        ))}
      </ul>

      {/* Signal words */}
      <div>
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Signal Words</p>
        <div className="flex flex-wrap gap-1">
          {tense.signalWords.map(word => (
            <span key={word} className={`px-2 py-0.5 rounded-md text-xs font-medium border ${styles.signal}`}>
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-2 pt-1">
        {tense.examples.slice(0, 3).map((ex, i) => (
          <div key={i}>
            <p className={`text-sm font-medium leading-snug ${styles.example}`}>{ex.en}</p>
            <p className={`text-xs italic mt-0.5 ${styles.exampleVi}`}>{ex.vi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniQuiz({ questions, onClose }: {
  questions: TenseComparison['quiz'];
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = questions[current];

  const handleSelect = useCallback((idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore(s => s + 1);
  }, [answered, q.correct]);

  const handleNext = useCallback(() => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  }, [current, questions.length]);

  const handleReset = useCallback(() => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  }, []);

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 text-center space-y-3"
      >
        <div className={`text-4xl font-bold ${pct >= 80 ? 'text-emerald-500' : pct >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
          {score}/{questions.length}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {pct >= 80 ? 'Xuất sắc!' : pct >= 60 ? 'Khá tốt, cần luyện thêm!' : 'Cần ôn lại lý thuyết nhé!'}
        </p>
        <div className="flex gap-2 justify-center">
          <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
            <RotateCcw size={14} />
            Làm lại
          </button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Đóng
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3"
    >
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{current + 1}/{questions.length}</span>
      </div>

      {/* Question */}
      <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{q.sentence}</p>

      {/* Options */}
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let optStyle = 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300';
          if (answered) {
            if (i === q.correct) {
              optStyle = 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400';
            } else if (i === selected && i !== q.correct) {
              optStyle = 'bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400';
            } else {
              optStyle = 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${optStyle}`}
            >
              {opt}
              {answered && i === q.correct && <CheckCircle2 size={14} className="inline ml-2 text-emerald-500" />}
              {answered && i === selected && i !== q.correct && <XCircle size={14} className="inline ml-2 text-rose-400" />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/40">
              <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">{q.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="mt-2 w-full py-2 text-sm font-medium rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
            >
              {current < questions.length - 1 ? 'Câu tiếp' : 'Xem kết quả'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
