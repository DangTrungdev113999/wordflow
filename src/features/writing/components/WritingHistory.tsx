import { ArrowLeft, FileText, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { WritingSubmission } from '../../../db/models';
import { cn } from '../../../lib/utils';
import writingPromptsData from '../../../data/writing-prompts.json';

interface WritingHistoryProps {
  submissions: WritingSubmission[];
  onSelect: (sub: WritingSubmission) => void;
  onBack: () => void;
}

const promptMap = new Map(writingPromptsData.map((p) => [p.id, p]));

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function scoreColor(score: number): string {
  if (score >= 8) return 'text-green-500';
  if (score >= 5) return 'text-amber-500';
  return 'text-red-500';
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const listItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export function WritingHistory({ submissions, onSelect, onBack }: WritingHistoryProps) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-center gap-3 mb-5"
      >
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Lịch sử bài viết</h2>
      </motion.div>

      {submissions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-12"
        >
          <FileText size={32} className="text-gray-600 dark:text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Chưa có bài viết nào</p>
        </motion.div>
      ) : (
        <motion.div className="space-y-2" variants={listVariants} initial="hidden" animate="visible">
          {submissions.map((sub) => {
            const prompt = promptMap.get(sub.promptId);
            return (
              <motion.button
                key={sub.id}
                variants={listItem}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(sub)}
                className="w-full text-left bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {prompt?.titleVi || sub.promptId}
                  </h3>
                  <span className={cn('text-lg font-bold', scoreColor(sub.overallScore))}>
                    {sub.overallScore}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(sub.submittedAt)}
                  </span>
                  <span>{sub.wordCount} từ</span>
                  {prompt && (
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium">
                      {prompt.level}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
