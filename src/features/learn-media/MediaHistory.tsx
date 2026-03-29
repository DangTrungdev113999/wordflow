import { useState, useEffect } from 'react';
import { History, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
  };

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-2">
        <History size={16} className="text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Sessions</h3>
        <span className="text-xs text-gray-400 ml-auto">{sessions.length} total</span>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div className="space-y-2" variants={listVariants} initial="hidden" animate="visible" key={expanded ? 'expanded' : 'collapsed'}>
          {visibleSessions.map(session => (
            <motion.div key={session.id} variants={itemVariants} layout>
              <MediaSessionCard session={session} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {sessions.length > 3 && (
        <motion.button
          type="button"
          onClick={() => setExpanded(!expanded)}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-1 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          {expanded ? (
            <>Show less <ChevronUp size={14} /></>
          ) : (
            <>Show all ({sessions.length}) <ChevronDown size={14} /></>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
