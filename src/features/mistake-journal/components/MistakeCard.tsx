import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { Mistake } from '../../../models/Mistake';
import { Badge } from '../../../components/ui/Badge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

const TYPE_COLORS: Record<string, string> = {
  vocabulary: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  grammar: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  spelling: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  sentence_order: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  listening: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  reading: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  writing: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

const SOURCE_LABELS: Record<string, string> = {
  quiz: 'Vocab Quiz',
  'grammar-quiz': 'Grammar Quiz',
  dictation: 'Dictation',
  'listening-quiz': 'Listening Quiz',
  'sentence-building': 'Sentence Building',
  writing: 'Writing',
  'media-quiz': 'Media Quiz',
  reading: 'Reading',
};

interface Props {
  mistake: Mistake;
  onDelete?: (id: string) => void;
}

export function MistakeCard({ mistake, onDelete }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isDue = mistake.nextReview <= new Date().toISOString().split('T')[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${TYPE_COLORS[mistake.type] ?? 'bg-gray-100 text-gray-700'}`}>
            {mistake.type.replace('_', ' ')}
          </span>
          <span className="text-xs text-gray-400">{SOURCE_LABELS[mistake.source] ?? mistake.source}</span>
          {isDue && (
            <Badge variant="warning" className="text-xs">Due</Badge>
          )}
        </div>
        {onDelete && (
          <button
            onClick={() => setShowConfirm(true)}
            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 leading-relaxed">{mistake.question}</p>

      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-[10px] text-red-600 dark:text-red-400">✕</span>
          <p className="text-sm text-red-600 dark:text-red-400 line-through decoration-red-300/50">{mistake.userAnswer}</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[10px] text-green-600 dark:text-green-400">✓</span>
          <p className="text-sm font-medium text-green-600 dark:text-green-400">{mistake.correctAnswer}</p>
        </div>
      </div>

      {mistake.explanation && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed">{mistake.explanation}</p>
      )}

      <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
        <span>Reviews: {mistake.reviewCount}</span>
        <span>Interval: {mistake.interval}d</span>
        <span>Next: {mistake.nextReview}</span>
      </div>
      {onDelete && (
        <ConfirmDialog
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => onDelete(mistake.id)}
          title="Delete mistake?"
          description="This mistake will be permanently removed from your journal."
          confirmLabel="Delete"
        />
      )}
    </motion.div>
  );
}
