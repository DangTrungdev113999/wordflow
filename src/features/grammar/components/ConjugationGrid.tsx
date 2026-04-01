import { motion } from 'framer-motion';
import type { ConjugationTable } from '../../../lib/types';

interface ConjugationGridProps {
  table: ConjugationTable;
  highlightMode?: 'changes' | 'all';
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const rowVariant = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
};

function highlightChanges(text: string, isThirdPerson: boolean): React.ReactNode {
  if (!isThirdPerson) return text;
  // Bold the differing suffix for third-person forms
  const patterns = [
    { match: /(does)(n't|n't)/i, wrap: true },
    { match: /(Does)(\s)/i, wrap: true },
    { match: /(\w+)(s|es|ies)$/i, wrap: true },
  ];
  for (const p of patterns) {
    const m = text.match(p.match);
    if (m) {
      const idx = text.indexOf(m[0]);
      const before = text.slice(0, idx);
      return (
        <>
          {before}
          {m[1]}
          <span className="font-bold text-orange-600 dark:text-orange-400">{m[2]}</span>
          {text.slice(idx + m[0].length)}
        </>
      );
    }
  }
  return text;
}

export function ConjugationGrid({ table, highlightMode = 'changes' }: ConjugationGridProps) {
  const shouldHighlight = highlightMode === 'changes';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
          {table.verb}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium">
          {table.tense}
        </span>
      </div>

      {/* Desktop table (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <th className="text-left px-3 py-2 font-semibold text-gray-600 dark:text-gray-400 w-28">Pronoun</th>
              <th className="text-left px-3 py-2 font-semibold text-green-700 dark:text-green-400">✅ Khẳng định</th>
              <th className="text-left px-3 py-2 font-semibold text-red-700 dark:text-red-400">❌ Phủ định</th>
              <th className="text-left px-3 py-2 font-semibold text-blue-700 dark:text-blue-400">❓ Nghi vấn</th>
            </tr>
          </thead>
          <motion.tbody variants={stagger} initial="hidden" animate="visible">
            {table.rows.map((row, i) => {
              const isThird = row.highlight === 'third-person';
              const isIrregular = row.highlight === 'irregular';
              return (
                <motion.tr
                  key={i}
                  variants={rowVariant}
                  className={`
                    border-t border-gray-100 dark:border-gray-800
                    ${isThird ? 'bg-orange-50/60 dark:bg-orange-900/15' : ''}
                    ${isIrregular ? 'bg-amber-50/60 dark:bg-amber-900/15' : ''}
                  `}
                >
                  <td className="px-3 py-2.5 font-medium text-gray-900 dark:text-white">{row.pronoun}</td>
                  <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                    {shouldHighlight ? highlightChanges(row.affirmative, isThird || isIrregular) : row.affirmative}
                  </td>
                  <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                    {shouldHighlight ? highlightChanges(row.negative, isThird || isIrregular) : row.negative}
                  </td>
                  <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                    {shouldHighlight ? highlightChanges(row.question, isThird || isIrregular) : row.question}
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>

      {/* Mobile stacked cards (< 640px) */}
      <motion.div
        className="sm:hidden space-y-2.5"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {table.rows.map((row, i) => {
          const isThird = row.highlight === 'third-person';
          const isIrregular = row.highlight === 'irregular';
          return (
            <motion.div
              key={i}
              variants={rowVariant}
              className={`
                rounded-xl border p-3 space-y-1.5
                ${isThird
                  ? 'border-orange-200 dark:border-orange-800 bg-orange-50/60 dark:bg-orange-900/15'
                  : isIrregular
                    ? 'border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-900/15'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                }
              `}
            >
              <div className="font-semibold text-sm text-gray-900 dark:text-white">{row.pronoun}</div>
              <div className="grid grid-cols-1 gap-1 text-sm">
                <div className="flex items-start gap-1.5">
                  <span className="text-green-600 dark:text-green-400 shrink-0">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {shouldHighlight ? highlightChanges(row.affirmative, isThird || isIrregular) : row.affirmative}
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-red-500 dark:text-red-400 shrink-0">❌</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {shouldHighlight ? highlightChanges(row.negative, isThird || isIrregular) : row.negative}
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-blue-600 dark:text-blue-400 shrink-0">❓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {shouldHighlight ? highlightChanges(row.question, isThird || isIrregular) : row.question}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {table.notes && (
        <div className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2 italic">
          💡 {table.notes}
        </div>
      )}
    </div>
  );
}
