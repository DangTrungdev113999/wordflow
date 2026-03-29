import { useState } from 'react';
import { Timer, Play, Pause, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStudyTimer, formatTime } from '../../../hooks/useStudyTimer';

export function StudyTimerWidget() {
  const { isRunning, elapsedMs, isManual, startManual, pauseManual, resumeManual, stopAndReset } =
    useStudyTimer();
  const [collapsed, setCollapsed] = useState(false);

  const hasTime = elapsedMs > 0;
  const showWidget = isRunning || hasTime;

  if (!showWidget) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={startManual}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
      >
        <Timer size={16} />
        <span className="hidden sm:inline">Start Timer</span>
      </motion.button>
    );
  }

  if (collapsed) {
    return (
      <motion.button
        layout
        onClick={() => setCollapsed(false)}
        className={`fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-20 flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border text-sm font-mono font-bold transition-all ${
          isRunning
            ? 'bg-gradient-to-r from-indigo-500 to-violet-500 border-indigo-400 text-white'
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
        }`}
      >
        <span>{formatTime(elapsedMs)}</span>
        <ChevronUp size={14} className={isRunning ? 'text-white/70' : 'text-gray-400'} />
      </motion.button>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-20 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      style={{ minWidth: 180 }}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-2 ${
          isRunning
            ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <Timer size={14} />
          <span className="text-xs font-semibold uppercase tracking-wider">Study Timer</span>
        </div>
        <button onClick={() => setCollapsed(true)} className="p-0.5 rounded hover:bg-white/20 transition-colors">
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Time display */}
      <div className="px-4 py-3 text-center">
        <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white tabular-nums">
          {formatTime(elapsedMs)}
        </span>
        {!isManual && isRunning && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Auto-tracking</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 px-4 pb-3">
        {isRunning ? (
          <button
            onClick={pauseManual}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <Pause size={12} />
            Pause
          </button>
        ) : (
          <button
            onClick={isManual ? resumeManual : startManual}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <Play size={12} />
            Resume
          </button>
        )}
        {hasTime && (
          <button
            onClick={stopAndReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Square size={12} />
            Stop
          </button>
        )}
      </div>
    </motion.div>
  );
}
