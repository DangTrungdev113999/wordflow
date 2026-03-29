import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TheoryStep } from '../../../lib/types';
import { ColoredSentence } from './ColoredSentence';
import { ConjugationGrid } from './ConjugationGrid';
import { BeforeAfterCard } from './BeforeAfterCard';

interface StepByStepProps {
  steps: TheoryStep[];
  lessonId: string;
}

function renderBold(text: string): React.ReactNode[] {
  return text.split(/(\*\*.*?\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="text-indigo-600 dark:text-indigo-400">{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const STORAGE_KEY = 'grammar-step-';

export function StepByStep({ steps, lessonId }: StepByStepProps) {
  const [current, setCurrent] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY + lessonId);
    const val = saved ? parseInt(saved, 10) : 0;
    return val >= 0 && val < steps.length ? val : 0;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + lessonId, String(current));
  }, [current, lessonId]);

  const goNext = useCallback(() => setCurrent(c => Math.min(c + 1, steps.length - 1)), [steps.length]);
  const goPrev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  const step = steps[current];
  if (!step) return null;

  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">Bước {current + 1}/{steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-1.5">
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`
              h-2 rounded-full transition-all duration-200
              ${i === current
                ? 'w-5 bg-indigo-500 dark:bg-indigo-400'
                : i < current
                  ? 'w-2 bg-indigo-300 dark:bg-indigo-600'
                  : 'w-2 bg-gray-200 dark:bg-gray-700'
              }
            `}
          />
        ))}
      </div>

      {/* Step content card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4"
        >
          <h3 className="font-bold text-gray-900 dark:text-white">{step.title}</h3>

          {step.content && (
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {renderBold(step.content)}
            </div>
          )}

          {/* Plain examples */}
          {step.examples && step.examples.length > 0 && (
            <div className="space-y-2">
              {step.examples.map((ex, j) => (
                <div key={j} className="pl-3 border-l-2 border-indigo-200 dark:border-indigo-800">
                  <p className="text-sm text-gray-900 dark:text-white">{renderBold(ex.en)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">{ex.vi}</p>
                </div>
              ))}
            </div>
          )}

          {/* Colored examples */}
          {step.coloredExamples && step.coloredExamples.length > 0 && (
            <div className="space-y-3">
              {step.coloredExamples.map((ce, j) => (
                <ColoredSentence key={j} parts={ce.parts} vi={ce.vi} size="sm" />
              ))}
            </div>
          )}

          {/* Conjugation table */}
          {step.conjugation && (
            <ConjugationGrid table={step.conjugation} />
          )}

          {/* Before/After */}
          {step.beforeAfter && step.beforeAfter.length > 0 && (
            <BeforeAfterCard items={step.beforeAfter} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={current === 0}
          className={`
            flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors
            ${current === 0
              ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          <ChevronLeft size={16} />
          Trước
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={current === steps.length - 1}
          className={`
            flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors
            ${current === steps.length - 1
              ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
              : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
            }
          `}
        >
          Tiếp
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
