import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, HelpCircle, PenTool, Link2, FileText, Timer } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { LearningMode, VocabSessionConfig } from '../types';
import { cn } from '../../../lib/utils';

const TIMED_MODES: Set<LearningMode> = new Set(['quiz', 'spelling']);

interface SessionPickerProps {
  topicId: string;
  wordCount: number;
  isOpen: boolean;
  onClose: () => void;
  onStart: (config: VocabSessionConfig) => void;
}

const MODES: Array<{
  mode: LearningMode;
  label: string;
  description: string;
  icon: typeof Layers;
  gradient: string;
  minWords?: number;
}> = [
  {
    mode: 'flashcard',
    label: 'Flashcard',
    description: 'Flip cards to memorize',
    icon: Layers,
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    mode: 'quiz',
    label: 'Quiz',
    description: 'Pick the right answer',
    icon: HelpCircle,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    mode: 'spelling',
    label: 'Spelling',
    description: 'Type the word',
    icon: PenTool,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    mode: 'match',
    label: 'Match',
    description: 'Pair words & meanings',
    icon: Link2,
    gradient: 'from-rose-500 to-pink-500',
    minWords: 3,
  },
  {
    mode: 'context',
    label: 'Context',
    description: 'Fill in the blank',
    icon: FileText,
    gradient: 'from-violet-500 to-purple-500',
  },
];

const WORD_COUNTS = [5, 10, 15, 20] as const;

const FILTERS: Array<{ value: VocabSessionConfig['wordsFilter']; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'weak', label: 'Weak' },
  { value: 'due', label: 'Due' },
];

export function SessionPicker({ topicId, wordCount: totalWords, isOpen, onClose, onStart }: SessionPickerProps) {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<LearningMode>('quiz');
  const [selectedCount, setSelectedCount] = useState<number>(Math.min(10, totalWords));
  const [selectedFilter, setSelectedFilter] = useState<VocabSessionConfig['wordsFilter']>('all');
  const [timedEnabled, setTimedEnabled] = useState(false);

  const showTimedToggle = TIMED_MODES.has(selectedMode);

  const handleStart = () => {
    const config: VocabSessionConfig = {
      topicId,
      mode: selectedMode,
      wordCount: selectedCount,
      wordsFilter: selectedFilter,
    };

    if (selectedMode === 'flashcard') {
      navigate(`/vocabulary/${topicId}/learn`);
      return;
    }

    if (selectedMode === 'quiz') {
      const timedParam = timedEnabled ? '&timed=1' : '';
      navigate(`/vocabulary/${topicId}/quiz?count=${selectedCount}&filter=${selectedFilter}${timedParam}`);
      return;
    }

    // Future modes — call onStart for extensibility
    onStart(config);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white dark:bg-gray-900 shadow-2xl"
          >
            {/* Handle bar */}
            <div className="sticky top-0 z-10 flex justify-center pt-3 pb-1 bg-white dark:bg-gray-900 rounded-t-3xl">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>

            <div className="px-5 pb-8 pt-2">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Choose Learning Mode
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Mode cards */}
              <div className="grid grid-cols-1 gap-2.5 mb-6">
                {MODES.map((m, i) => {
                  const Icon = m.icon;
                  const disabled = m.minWords != null && totalWords < m.minWords;
                  const selected = selectedMode === m.mode && !disabled;

                  return (
                    <motion.button
                      key={m.mode}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.25 }}
                      disabled={disabled}
                      onClick={() => !disabled && setSelectedMode(m.mode)}
                      className={cn(
                        'flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition-all duration-200',
                        selected
                          ? 'bg-gradient-to-r text-white shadow-lg scale-[1.02]'
                          : 'bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800',
                        selected && m.gradient,
                        disabled && 'opacity-40 cursor-not-allowed',
                      )}
                    >
                      <div className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-xl shrink-0',
                        selected ? 'bg-white/20' : 'bg-white dark:bg-gray-700',
                      )}>
                        <Icon size={20} className={selected ? 'text-white' : 'text-gray-600 dark:text-gray-300'} />
                      </div>
                      <div className="min-w-0">
                        <p className={cn(
                          'font-semibold text-sm',
                          !selected && 'text-gray-900 dark:text-white',
                        )}>
                          {m.label}
                          {disabled && ' (need 3+ words)'}
                        </p>
                        <p className={cn(
                          'text-xs mt-0.5',
                          selected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400',
                        )}>
                          {m.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Word count */}
              <div className="mb-5">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                  Words
                </p>
                <div className="flex gap-2">
                  {WORD_COUNTS.map(count => {
                    const capped = Math.min(count, totalWords);
                    const active = selectedCount === capped;
                    return (
                      <button
                        key={count}
                        onClick={() => setSelectedCount(capped)}
                        className={cn(
                          'flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                          active
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
                        )}
                      >
                        {capped}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter */}
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                  Filter
                </p>
                <div className="flex gap-2">
                  {FILTERS.map(f => {
                    const active = selectedFilter === f.value;
                    return (
                      <button
                        key={f.value}
                        onClick={() => setSelectedFilter(f.value)}
                        className={cn(
                          'flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                          active
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
                        )}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timed challenge toggle */}
              <AnimatePresence>
                {showTimedToggle && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-6 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setTimedEnabled((v) => !v)}
                      className={cn(
                        'flex items-center gap-3 w-full p-3.5 rounded-2xl text-left transition-all duration-200 border',
                        timedEnabled
                          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
                          : 'bg-gray-50 dark:bg-gray-800/60 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-xl shrink-0',
                          timedEnabled ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-white dark:bg-gray-700',
                        )}
                      >
                        <Timer
                          size={20}
                          className={timedEnabled ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500'}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'font-semibold text-sm',
                            timedEnabled ? 'text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-white',
                          )}
                        >
                          Timed Challenge
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {selectedMode === 'quiz' ? '10s' : '15s'} per word — bonus XP for speed
                        </p>
                      </div>
                      <div
                        className={cn(
                          'w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0',
                          timedEnabled ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600',
                        )}
                      >
                        <motion.div
                          className="w-5 h-5 rounded-full bg-white shadow-sm"
                          animate={{ x: timedEnabled ? 20 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Start button */}
              <Button size="lg" className="w-full" onClick={handleStart}>
                Start Session
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
