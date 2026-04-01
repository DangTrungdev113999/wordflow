import { motion } from 'framer-motion';

interface TenseColumn {
  name: string;
  formula: string;
  usage: string;
  example: string;
  signalWords?: string[];
}

export interface ComparisonTableProps {
  left: TenseColumn;
  right: TenseColumn;
}

const colVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.35, ease: 'easeOut' as const } }),
};

function Column({ data, accent }: { data: TenseColumn; accent: 'indigo' | 'violet' }) {
  const colors = accent === 'indigo'
    ? { header: 'bg-indigo-500 dark:bg-indigo-600', badge: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300', line: 'border-indigo-200 dark:border-indigo-800' }
    : { header: 'bg-violet-500 dark:bg-violet-600', badge: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300', line: 'border-violet-200 dark:border-violet-800' };

  return (
    <div className="flex-1 min-w-0">
      <div className={`${colors.header} text-white text-sm font-bold px-4 py-2.5 rounded-t-xl text-center`}>
        {data.name}
      </div>
      <div className="bg-white dark:bg-gray-900 border border-t-0 border-gray-100 dark:border-gray-800 rounded-b-xl p-4 space-y-3">
        {/* Formula */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold mb-1">Công thức</div>
          <div className={`text-sm font-mono font-semibold px-2.5 py-1.5 rounded-lg ${colors.badge}`}>
            {data.formula}
          </div>
        </div>

        {/* Usage */}
        <div className={`border-t ${colors.line} pt-3`}>
          <div className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold mb-1">Cách dùng</div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{data.usage}</p>
        </div>

        {/* Example */}
        <div className={`border-t ${colors.line} pt-3`}>
          <div className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold mb-1">Ví dụ</div>
          <p className="text-sm text-gray-900 dark:text-white italic">&ldquo;{data.example}&rdquo;</p>
        </div>

        {/* Signal words */}
        {data.signalWords && data.signalWords.length > 0 && (
          <div className={`border-t ${colors.line} pt-3`}>
            <div className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold mb-1.5">Dấu hiệu</div>
            <div className="flex flex-wrap gap-1.5">
              {data.signalWords.map((w) => (
                <span key={w} className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>{w}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ComparisonTable({ left, right }: ComparisonTableProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
        So sánh
      </div>

      {/* Desktop: side-by-side, Mobile: stack */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.div className="flex-1" custom={0} variants={colVariant} initial="hidden" animate="visible">
          <Column data={left} accent="indigo" />
        </motion.div>

        {/* VS badge */}
        <div className="hidden sm:flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm">
            VS
          </div>
        </div>
        <div className="sm:hidden flex items-center justify-center py-1">
          <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300">
            VS
          </div>
        </div>

        <motion.div className="flex-1" custom={1} variants={colVariant} initial="hidden" animate="visible">
          <Column data={right} accent="violet" />
        </motion.div>
      </div>
    </div>
  );
}
