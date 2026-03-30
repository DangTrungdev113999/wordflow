import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import type { GrammarPattern } from '../models';
import { cn } from '../../../lib/utils';

interface GrammarCompareCardProps {
  pattern: GrammarPattern;
  onStartQuiz?: () => void;
}

const CATEGORY_STYLE: Record<string, { label: string; color: string }> = {
  'verb-pattern': { label: 'Verb Pattern', color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' },
  'used-to': { label: 'Used to', color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' },
  'conditional': { label: 'Conditional', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
  'reported-speech': { label: 'Reported Speech', color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' },
  'passive': { label: 'Passive', color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' },
};

const FORM_COLORS = [
  'bg-sky-50/60 dark:bg-sky-950/20 border-sky-200/60 dark:border-sky-800/40',
  'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/40',
];

export function GrammarCompareCard({ pattern, onStartQuiz }: GrammarCompareCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORY_STYLE[pattern.category] ?? CATEGORY_STYLE['verb-pattern'];
  const showToggle = pattern.forms.length > 2;
  const visibleForms = expanded ? pattern.forms : pattern.forms.slice(0, 2);

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
          {pattern.pattern}
        </h3>
        <span className={cn('shrink-0 ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold', cat.color)}>
          {cat.label}
        </span>
      </div>

      {/* Side-by-side forms */}
      <div className={cn(
        'grid gap-2.5 mb-3',
        visibleForms.length === 2 ? 'grid-cols-2' : 'grid-cols-1',
      )}>
        {visibleForms.map((form, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              'rounded-xl p-3 border',
              FORM_COLORS[i % FORM_COLORS.length],
            )}
          >
            {/* Structure label */}
            <p className="font-mono text-xs font-bold text-gray-800 dark:text-gray-100 leading-snug">
              {form.structure}
            </p>

            {/* Vietnamese meaning */}
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1.5">
              {form.meaning}
            </p>

            {/* Example */}
            <div className="mt-2 rounded-lg bg-white/60 dark:bg-gray-900/40 px-2.5 py-2">
              <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed italic">
                &quot;{form.example.sentence}&quot;
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                → {form.example.translation}
              </p>
            </div>

            {/* Usage note */}
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              {form.usage}
            </p>
          </motion.div>
        ))}
      </div>

      {showToggle && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 mb-3"
        >
          {expanded ? 'Thu gọn' : `Xem thêm ${pattern.forms.length - 2} dạng`}
        </button>
      )}

      {/* Common mistake + memory tip */}
      <div className="space-y-2 mb-3">
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
      {pattern.quiz && onStartQuiz && (
        <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
          <button
            onClick={onStartQuiz}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
          >
            <span>🧩</span> Thử quiz
          </button>
        </div>
      )}
    </Card>
  );
}
