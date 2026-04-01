import { motion } from 'framer-motion';
import { SkipBack, Play, Pause, SkipForward } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disablePrev?: boolean;
  disableNext?: boolean;
}

const SPEEDS = [0.75, 1, 1.25, 1.5];

export function PlaybackControls({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  speed,
  onSpeedChange,
  disablePrev,
  disableNext,
}: PlaybackControlsProps) {
  return (
    <div className="space-y-3">
      {/* Transport buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onPrev}
          disabled={disablePrev}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
            disablePrev
              ? 'text-gray-600 dark:text-gray-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
          )}
        >
          <SkipBack size={20} />
        </button>

        <motion.button
          onClick={onPlayPause}
          whileTap={{ scale: 0.9 }}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors',
            isPlaying
              ? 'bg-teal-500 text-white'
              : 'bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 border-2 border-teal-200 dark:border-teal-800 hover:border-teal-400 dark:hover:border-teal-600',
          )}
        >
          {isPlaying ? (
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Pause size={24} />
            </motion.div>
          ) : (
            <Play size={24} className="ml-0.5" />
          )}
        </motion.button>

        <button
          onClick={onNext}
          disabled={disableNext}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
            disableNext
              ? 'text-gray-600 dark:text-gray-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
          )}
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Speed selector */}
      <div className="flex items-center justify-center gap-1.5">
        {SPEEDS.map(s => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
              s === speed
                ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 ring-1 ring-teal-300 dark:ring-teal-700'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
            )}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
