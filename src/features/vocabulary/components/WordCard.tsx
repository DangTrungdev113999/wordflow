import { motion } from 'framer-motion';
import type { VocabWord } from '../../../lib/types';
import type { WordStatus } from '../../../lib/types';
import { AudioButton } from '../../../components/common/AudioButton';
import { WordImage } from './WordImage';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

const STATUS_COLORS: Record<WordStatus, string> = {
  new: 'default',
  learning: 'warning',
  review: 'info',
  mastered: 'success',
} as const;

interface WordCardProps {
  word: VocabWord;
  status?: WordStatus;
  topicId?: string;
  onClick?: () => void;
}

export function WordCard({ word, status = 'new', topicId, onClick }: WordCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all',
        onClick && 'cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm'
      )}
    >
      <WordImage word={word.word} meaning={word.meaning} topicId={topicId} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900 dark:text-white">{word.word}</span>
          <span className="text-xs text-gray-400 font-mono">{word.ipa}</span>
          <AudioButton word={word.word} audioUrl={word.audioUrl} size="sm" />
        </div>
        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{word.meaning}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic truncate">{word.example}</p>
      </div>
      <Badge label={status} variant={STATUS_COLORS[status] as 'default' | 'success' | 'warning' | 'info'} />
    </motion.div>
  );
}
