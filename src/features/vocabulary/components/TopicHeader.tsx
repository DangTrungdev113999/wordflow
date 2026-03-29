import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import type { TopicProgress } from '../hooks/useTopicProgress';
import { Badge } from '../../../components/ui/Badge';
import { TOPIC_ICONS } from '../../../lib/constants';
import type { CEFRLevel } from '../../../lib/types';

interface TopicHeaderProps {
  topic: string;
  topicLabel: string;
  cefrLevel: CEFRLevel;
  wordCount: number;
  progress: TopicProgress;
}

const RING_SIZE = 72;
const STROKE_WIDTH = 6;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STATUS_ITEMS = [
  { key: 'mastered' as const, label: 'Mastered', dot: 'bg-emerald-500' },
  { key: 'review' as const, label: 'Review', dot: 'bg-blue-500' },
  { key: 'learning' as const, label: 'Learning', dot: 'bg-amber-500' },
  { key: 'new' as const, label: 'New', dot: 'bg-gray-300 dark:bg-gray-600' },
] as const;

export function TopicHeader({
  topic,
  topicLabel,
  cefrLevel,
  wordCount,
  progress,
}: TopicHeaderProps) {
  const percent = progress.percentMastered;
  const dashOffset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <div className="space-y-4">
      {/* Back nav + title */}
      <div className="flex items-center gap-3">
        <Link
          to="/vocabulary"
          className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{TOPIC_ICONS[topic] ?? '📝'}</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {topicLabel}
            </h1>
            <Badge label={cefrLevel} variant="cefr" />
          </div>
        </div>
      </div>

      {/* Progress ring + stats */}
      <div className="flex items-center gap-5 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        {/* SVG ring */}
        <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            className="-rotate-90"
          >
            {/* Track */}
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE_WIDTH}
              className="text-gray-100 dark:text-gray-800"
            />
            {/* Progress arc */}
            <motion.circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {percent}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {progress.mastered}/{wordCount}{' '}
            <span className="text-gray-400 dark:text-gray-500 font-normal">mastered</span>
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {STATUS_ITEMS.map(({ key, label, dot }) => {
              const count = progress[key];
              if (count === 0) return null;
              return (
                <span key={key} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  {count} {label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
