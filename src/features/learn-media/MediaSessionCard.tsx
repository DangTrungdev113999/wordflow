import { Link2, FileText, Trophy } from 'lucide-react';
import type { MediaSession } from '../../db/models';
import { cn } from '../../lib/utils';

interface Props {
  session: MediaSession;
}

export function MediaSessionCard({ session }: Props) {
  const date = new Date(session.createdAt);
  const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-gray-200 dark:hover:border-gray-700 transition-all">
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
          session.sourceType === 'url'
            ? 'bg-blue-50 dark:bg-blue-900/20'
            : 'bg-amber-50 dark:bg-amber-900/20',
        )}>
          {session.sourceType === 'url' ? (
            <Link2 size={18} className="text-blue-500" />
          ) : (
            <FileText size={18} className="text-amber-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {session.title}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{dateStr}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {session.extractedVocab.length} words
            </span>
            {session.quizScore != null && (
              <span className={cn(
                'flex items-center gap-1 text-xs font-medium',
                session.quizScore >= 80 ? 'text-emerald-600' : session.quizScore >= 50 ? 'text-amber-600' : 'text-red-500',
              )}>
                <Trophy size={12} />
                {session.quizScore}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
