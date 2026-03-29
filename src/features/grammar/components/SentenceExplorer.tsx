import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ColoredExample, SentencePart } from '../../../lib/types';
import { ROLE_COLORS, ROLE_LABELS, ALL_ROLES } from '../constants/colors';

interface SentenceExplorerProps {
  examples: ColoredExample[];
}

type Mode = 'explore' | 'quiz';

interface QuizPartState {
  revealed: boolean;
  wrong: boolean;
}

function ExploreView({ parts, vi }: { parts: SentencePart[]; vi?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePart = activeIndex !== null ? parts[activeIndex] : null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {parts.map((part, i) => {
          const colors = ROLE_COLORS[part.role];
          const isActive = activeIndex === i;
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => setActiveIndex(isActive ? null : i)}
              className={`
                text-sm px-2.5 py-1 rounded-lg font-medium border transition-shadow
                ${colors.bg} ${colors.text} ${colors.border}
                cursor-pointer hover:shadow-md
                ${isActive ? 'ring-2 ring-offset-1 ring-indigo-400 dark:ring-indigo-500 shadow-md' : ''}
              `}
              whileTap={{ scale: 0.95 }}
              layout
            >
              {part.text}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activePart && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm
              ${ROLE_COLORS[activePart.role].bg} ${ROLE_COLORS[activePart.role].text}
              border ${ROLE_COLORS[activePart.role].border}
            `}>
              <span className="font-semibold">{ROLE_LABELS[activePart.role]}:</span>
              <span className="opacity-90">{activePart.tooltip ?? activePart.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {vi && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic pl-1">{vi}</p>
      )}
    </div>
  );
}

function QuizView({ parts, vi }: { parts: SentencePart[]; vi?: string }) {
  const [states, setStates] = useState<QuizPartState[]>(
    () => parts.map(() => ({ revealed: false, wrong: false }))
  );
  const [activePicker, setActivePicker] = useState<number | null>(null);
  const allRevealed = states.every((s) => s.revealed);

  const handlePick = useCallback((partIndex: number, role: SentenceRole) => {
    if (role === parts[partIndex].role) {
      setStates((prev) => prev.map((s, i) => i === partIndex ? { revealed: true, wrong: false } : s));
      setActivePicker(null);
    } else {
      setStates((prev) => prev.map((s, i) => i === partIndex ? { ...s, wrong: true } : s));
      setTimeout(() => {
        setStates((prev) => prev.map((s, i) => i === partIndex ? { ...s, wrong: false } : s));
      }, 600);
    }
  }, [parts]);

  const handleReset = () => {
    setStates(parts.map(() => ({ revealed: false, wrong: false })));
    setActivePicker(null);
  };

  return (
    <div className="space-y-2">
      {/* Click-outside backdrop */}
      {activePicker !== null && (
        <div className="fixed inset-0 z-10" onClick={() => setActivePicker(null)} />
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        {parts.map((part, i) => {
          const isRevealed = states[i].revealed;
          const isWrong = states[i].wrong;
          const isPicking = activePicker === i;
          const colors = ROLE_COLORS[part.role];

          return (
            <div key={i} className="relative">
              <motion.button
                type="button"
                onClick={() => {
                  if (isRevealed) return;
                  setActivePicker(isPicking ? null : i);
                }}
                className={`
                  text-sm px-2.5 py-1 rounded-lg font-medium border transition-all
                  ${isRevealed
                    ? `${colors.bg} ${colors.text} ${colors.border}`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                  }
                  ${!isRevealed ? 'cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500' : 'cursor-default'}
                  ${isPicking ? 'ring-2 ring-indigo-400 dark:ring-indigo-500' : ''}
                `}
                animate={isWrong ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                transition={isWrong ? { duration: 0.4 } : undefined}
              >
                {part.text}
                {isRevealed && (
                  <span className="ml-1 text-xs opacity-70">
                    {ROLE_LABELS[part.role]}
                  </span>
                )}
              </motion.button>

              {/* Role picker dropdown */}
              <AnimatePresence>
                {isPicking && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-20 top-full mt-1 left-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-1.5 min-w-[160px]"
                  >
                    {ALL_ROLES.map((role) => {
                      const rc = ROLE_COLORS[role];
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handlePick(i, role)}
                          className={`
                            w-full text-left text-xs px-2.5 py-1.5 rounded-lg
                            ${rc.bg} ${rc.text} mb-0.5 last:mb-0
                            hover:opacity-80 transition-opacity font-medium
                          `}
                        >
                          {ROLE_LABELS[role]}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {allRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">All revealed!</span>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
          >
            Try again
          </button>
        </motion.div>
      )}

      {vi && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic pl-1">{vi}</p>
      )}
    </div>
  );
}

export function SentenceExplorer({ examples }: SentenceExplorerProps) {
  const [mode, setMode] = useState<Mode>('explore');

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        {(['explore', 'quiz'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`
              px-3 py-1 text-xs font-semibold rounded-md transition-all
              ${mode === m
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
          >
            {m === 'explore' ? 'Explore' : 'Quiz'}
          </button>
        ))}
      </div>

      {/* Sentences */}
      <div className="space-y-4">
        {examples.map((ex, i) => (
          <div key={`${mode}-${i}`}>
            {mode === 'explore' ? (
              <ExploreView parts={ex.parts} vi={ex.vi} />
            ) : (
              <QuizView parts={ex.parts} vi={ex.vi} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
