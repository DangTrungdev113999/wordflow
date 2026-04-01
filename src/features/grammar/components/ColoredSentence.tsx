import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SentencePart } from '../../../lib/types';
import { ROLE_COLORS, ROLE_LABELS } from '../constants/colors';

interface ColoredSentenceProps {
  parts: SentencePart[];
  vi?: string;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-sm px-2 py-0.5',
  md: 'text-base px-2.5 py-1',
  lg: 'text-lg px-3 py-1.5',
};

export function ColoredSentence({ parts, vi, interactive = true, size = 'md' }: ColoredSentenceProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleTap = (index: number) => {
    if (!interactive) return;
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredParts = parts.filter(p => p.role && ROLE_COLORS[p.role]);
  const activePart = activeIndex !== null ? filteredParts[activeIndex] : null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {parts.filter(p => p.role && ROLE_COLORS[p.role]).map((part, i) => {
          const colors = ROLE_COLORS[part.role];
          const isActive = activeIndex === i;
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => handleTap(i)}
              className={`
                ${sizeClasses[size]} rounded-lg font-medium border transition-shadow
                ${colors.bg} ${colors.text} ${colors.border}
                ${interactive ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}
                ${isActive ? 'ring-2 ring-offset-1 ring-indigo-400 dark:ring-indigo-500 shadow-md' : ''}
              `}
              whileTap={interactive ? { scale: 0.95 } : undefined}
              layout
            >
              {part.text}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activePart?.tooltip && (
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
              <span className="opacity-90">{activePart.tooltip}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {vi && (
        <p className="text-sm text-gray-700 dark:text-gray-300 italic pl-1">{vi}</p>
      )}
    </div>
  );
}
