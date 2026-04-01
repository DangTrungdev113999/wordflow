import type { Correction } from '../../../db/models';

interface CorrectionHighlightProps {
  corrections: Correction[];
}

export function CorrectionHighlight({ corrections }: CorrectionHighlightProps) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl px-3.5 py-2.5 space-y-2">
      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
        Sửa lỗi
      </p>
      {corrections.map((c, i) => (
        <div key={i} className="text-sm">
          <span className="text-red-500 line-through">{c.wrong}</span>
          <span className="mx-1.5 text-gray-600 dark:text-gray-400">→</span>
          <span className="text-green-600 dark:text-green-400 font-medium">{c.correct}</span>
          <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 pl-0.5">
            {c.explanation}
          </p>
        </div>
      ))}
    </div>
  );
}
