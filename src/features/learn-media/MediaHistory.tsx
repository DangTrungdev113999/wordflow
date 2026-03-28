import { useState, useEffect } from 'react';
import { History, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '../../db/database';
import type { MediaSession } from '../../db/models';
import { MediaSessionCard } from './MediaSessionCard';

export function MediaHistory({ refreshKey = 0 }: { refreshKey?: number }) {
  const [sessions, setSessions] = useState<MediaSession[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    db.mediaSessions.orderBy('createdAt').reverse().limit(20).toArray().then(setSessions);
  }, [refreshKey]);

  if (sessions.length === 0) return null;

  const visibleSessions = expanded ? sessions : sessions.slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <History size={16} className="text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Sessions</h3>
        <span className="text-xs text-gray-400 ml-auto">{sessions.length} total</span>
      </div>

      <div className="space-y-2">
        {visibleSessions.map(session => (
          <MediaSessionCard key={session.id} session={session} />
        ))}
      </div>

      {sessions.length > 3 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          {expanded ? (
            <>Show less <ChevronUp size={14} /></>
          ) : (
            <>Show all ({sessions.length}) <ChevronDown size={14} /></>
          )}
        </button>
      )}
    </div>
  );
}
