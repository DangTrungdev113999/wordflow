import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { Collocation } from '../models';
import { cn } from '../../../lib/utils';

const CAT_COLOR: Record<string, string> = {
  'verb-noun': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  'adj-noun': 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
  'noun-noun': 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
  'adv-adj': 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  'verb-prep': 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  'business': 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
};

const CAT_LABEL: Record<string, string> = {
  'verb-noun': 'V + N',
  'adj-noun': 'Adj + N',
  'noun-noun': 'N + N',
  'adv-adj': 'Adv + Adj',
  'verb-prep': 'V + Prep',
  'business': 'Business',
};

interface CollocationItemProps {
  item: Collocation;
}

export function CollocationItem({ item }: CollocationItemProps) {
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
              {item.collocation}
            </span>
            <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0', CAT_COLOR[item.category])}>
              {CAT_LABEL[item.category]}
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
              {/* Correct vs Incorrect */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 px-2.5 py-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-emerald-500 text-xs">&#10003;</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Correct</span>
                  </div>
                  <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">{item.correct}</p>
                </div>
                <div className="rounded-lg bg-red-50/60 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 px-2.5 py-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-red-500 text-xs">&#10007;</span>
                    <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold uppercase">Incorrect</span>
                  </div>
                  <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">{item.incorrect}</p>
                </div>
              </div>

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
