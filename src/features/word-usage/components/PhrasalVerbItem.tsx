import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { PhrasalVerb } from '../models';
import { cn } from '../../../lib/utils';

const LEVEL_COLOR: Record<string, string> = {
  A2: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  B1: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  B2: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
};

interface PhrasalVerbItemProps {
  item: PhrasalVerb;
}

export function PhrasalVerbItem({ item }: PhrasalVerbItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {item.verb}
            </span>
            <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-semibold', LEVEL_COLOR[item.level])}>
              {item.level}
            </span>
          </div>
          <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-0.5 truncate">
            {item.meaning}
          </p>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-gray-600 dark:text-gray-400"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2.5 border-t border-gray-100 dark:border-gray-800 pt-2.5">
              {/* English meaning */}
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {item.meaningEn}
              </p>

              {/* Examples */}
              <div className="space-y-1.5">
                {item.examples.map((ex, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 dark:bg-gray-800/50 px-2.5 py-2">
                    <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                      {ex.sentence}
                    </p>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                      → {ex.translation}
                    </p>
                  </div>
                ))}
              </div>

              {/* Synonyms */}
              {item.synonyms && item.synonyms.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-600 dark:text-gray-400 uppercase font-medium">Synonyms:</span>
                  {item.synonyms.map(s => (
                    <span key={s} className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/20 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Note */}
              {item.note && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                  💡 {item.note}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
