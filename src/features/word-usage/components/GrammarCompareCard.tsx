import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { GrammarPattern } from '../models';
import { cn } from '../../../lib/utils';
import { useProgressStore } from '../../../stores/progressStore';

interface GrammarCompareCardProps {
  pattern: GrammarPattern;
  defaultOpen?: boolean;
}

const CAT_STYLE: Record<string, { label: string; color: string; formColors: [string, string] }> = {
  'verb-pattern': {
    label: 'Verb Pattern',
    color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    formColors: [
      'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30',
      'bg-sky-50/60 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/30',
    ],
  },
  'used-to': {
    label: 'Used to',
    color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    formColors: [
      'bg-violet-50/60 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/30',
      'bg-fuchsia-50/60 dark:bg-fuchsia-950/20 border-fuchsia-100 dark:border-fuchsia-900/30',
    ],
  },
  conditional: {
    label: 'Conditional',
    color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
    formColors: [
      'bg-teal-50/60 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900/30',
      'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30',
    ],
  },
  'reported-speech': {
    label: 'Reported Speech',
    color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    formColors: [
      'bg-amber-50/60 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30',
      'bg-orange-50/60 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30',
    ],
  },
  passive: {
    label: 'Passive',
    color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    formColors: [
      'bg-rose-50/60 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30',
      'bg-pink-50/60 dark:bg-pink-950/20 border-pink-100 dark:border-pink-900/30',
    ],
  },
};

export function GrammarCompareCard({ pattern, defaultOpen = false }: GrammarCompareCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const cat = CAT_STYLE[pattern.category] ?? CAT_STYLE['verb-pattern'];

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Collapsed header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {pattern.pattern}
            </span>
            <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0', cat.color)}>
              {cat.label}
            </span>
          </div>
          {!open && (
            <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-0.5 truncate">
              {pattern.forms.map(f => f.meaning).join(' · ')}
            </p>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-gray-600 dark:text-gray-400"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-3">
              {/* Side-by-side forms */}
              <div className="grid grid-cols-2 gap-2.5">
                {pattern.forms.map((form, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={cn(
                      'rounded-xl p-3 border space-y-1.5',
                      cat.formColors[i % 2]
                    )}
                  >
                    <p className="font-bold text-xs text-gray-900 dark:text-white leading-snug">
                      {form.structure}
                    </p>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {form.meaning}
                    </p>
                    <div className="rounded-lg bg-white/60 dark:bg-gray-900/40 px-2 py-1.5">
                      <p className="text-[11px] text-gray-700 dark:text-gray-300 italic leading-relaxed">
                        &quot;{form.example.sentence}&quot;
                      </p>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">
                        → {form.example.translation}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-700 dark:text-gray-300 leading-relaxed">
                      {form.usage}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Common mistake + memory tip */}
              <div className="space-y-2">
                <div className="flex gap-2 items-start">
                  <span className="shrink-0 text-sm mt-0.5">⚠️</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{pattern.commonMistake}</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="shrink-0 text-sm mt-0.5">💡</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{pattern.memoryTip}</p>
                </div>
              </div>

              {/* Quiz button */}
              {pattern.quiz && pattern.quiz.items.length > 0 && (
                <div className="pt-1">
                  <QuizSection quiz={pattern.quiz} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ── Inline quiz for a single grammar pattern ──

function QuizSection({ quiz }: { quiz: NonNullable<GrammarPattern['quiz']> }) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const addXP = useProgressStore(s => s.addXP);

  const isComplete = results.length === quiz.items.length;

  const reset = () => {
    setStarted(false);
    setCurrentIndex(0);
    setSelected(null);
    setResults([]);
  };

  if (!started) {
    return (
      <button
        onClick={() => setStarted(true)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
      >
        <span>🧩</span> Thử quiz ({quiz.items.length} câu)
      </button>
    );
  }

  if (isComplete) {
    const score = results.filter(Boolean).length;
    return (
      <div className="text-center py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {score}/{results.length}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {score === results.length ? 'Xuất sắc! Bạn nắm vững mẫu ngữ pháp này!' : 'Hãy đọc lại phần so sánh phía trên nhé.'}
        </p>
        {score > 0 && (
          <p className="text-xs text-amber-500 mt-1">+{score * 10} XP</p>
        )}
        <button
          onClick={reset}
          className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const item = quiz.items[currentIndex];
  if (!item) return null;

  const isAnswered = selected !== null;
  const isCorrect = selected === item.correct;

  const handleSelect = (optIndex: number) => {
    if (isAnswered) return;
    setSelected(optIndex);
  };

  const handleNext = () => {
    if (isCorrect) addXP(10);
    setResults(prev => [...prev, isCorrect]);
    setSelected(null);
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="space-y-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
      {/* Progress dots */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Câu {currentIndex + 1}/{quiz.items.length}
        </span>
        <div className="flex gap-1">
          {quiz.items.map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                i < results.length
                  ? results[i] ? 'bg-emerald-500' : 'bg-red-400'
                  : i === currentIndex ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
              )}
            />
          ))}
        </div>
      </div>

      {/* Sentence */}
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.sentence}</p>

      {/* Options */}
      <div className="flex flex-wrap gap-2">
        {item.options.map((opt, oi) => {
          const isThis = selected === oi;
          const isCorrectOpt = oi === item.correct;

          let style = 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700';
          if (isAnswered) {
            if (isCorrectOpt) {
              style = 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700';
            } else if (isThis) {
              style = 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700';
            } else {
              style = 'opacity-40 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
            }
          }

          return (
            <button
              key={oi}
              onClick={() => handleSelect(oi)}
              disabled={isAnswered}
              className={cn(
                'flex-1 min-w-[80px] py-2 px-3 rounded-xl text-sm font-medium border transition-all',
                style
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className={cn(
              'text-xs font-medium',
              isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            )}>
              {isCorrect ? 'Chính xác!' : `Sai rồi! Đáp án: ${item.options[item.correct]}`}
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">{item.explanation}</p>
            <button
              onClick={handleNext}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              {currentIndex < quiz.items.length - 1 ? 'Câu tiếp →' : 'Xem kết quả'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
