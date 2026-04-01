import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ColoredExample } from '../../../lib/types';
import { ColoredSentence } from './ColoredSentence';

interface TimelineMarker {
  position: 'past' | 'present' | 'future';
  label: string;
  type: 'point' | 'range' | 'repeated';
}

export interface TenseTimelineProps {
  tense: string;
  markers: TimelineMarker[];
  example?: ColoredExample;
}

const POSITION_X: Record<string, number> = { past: 80, present: 250, future: 420 };

function markerColor(type: string) {
  if (type === 'point') return { fill: '#6366f1', stroke: '#4f46e5' };
  if (type === 'range') return { fill: '#8b5cf6', stroke: '#7c3aed' };
  return { fill: '#a78bfa', stroke: '#7c3aed' };
}

export function TenseTimeline({ tense, markers, example }: TenseTimelineProps) {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
        Timeline — {tense}
      </div>

      <div className="relative bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-gray-900 dark:to-indigo-950/30 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 overflow-hidden">
        <svg viewBox="0 0 500 120" className="w-full h-auto" aria-label={`Timeline for ${tense}`}>
          {/* Main timeline line */}
          <motion.line
            x1="30" y1="60" x2="470" y2="60"
            stroke="currentColor"
            className="text-gray-600 dark:text-gray-400"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Arrow tip */}
          <motion.polygon
            points="470,54 482,60 470,66"
            fill="currentColor"
            className="text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          />

          {/* Epoch labels */}
          {(['past', 'present', 'future'] as const).map((epoch, i) => (
            <motion.g key={epoch} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
              <line
                x1={POSITION_X[epoch]} y1="52" x2={POSITION_X[epoch]} y2="68"
                stroke="currentColor"
                className="text-gray-600 dark:text-gray-400"
                strokeWidth="1.5"
              />
              <text
                x={POSITION_X[epoch]}
                y="90"
                textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400"
                fontSize="11"
                fontWeight="500"
              >
                {epoch === 'past' ? 'Past' : epoch === 'present' ? 'Now' : 'Future'}
              </text>
            </motion.g>
          ))}

          {/* Markers */}
          {markers.map((m, i) => {
            const cx = POSITION_X[m.position];
            const colors = markerColor(m.type);

            if (m.type === 'range') {
              // Range: a bar spanning before and after the point
              const x1 = cx - 40;
              const x2 = cx + 40;
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.6 + i * 0.12, duration: 0.4 }}
                  style={{ transformOrigin: `${cx}px 60px` }}
                  className="cursor-pointer"
                  onClick={() => setActiveMarker(activeMarker === i ? null : i)}
                >
                  <rect x={x1} y="50" width={x2 - x1} height="20" rx="10" fill={colors.fill} opacity="0.3" />
                  <rect x={x1 + 5} y="54" width={x2 - x1 - 10} height="12" rx="6" fill={colors.fill} opacity="0.6" />
                  <text x={cx} y="42" textAnchor="middle" fontSize="10" fontWeight="600" fill={colors.fill}>
                    {m.label}
                  </text>
                </motion.g>
              );
            }

            if (m.type === 'repeated') {
              // Repeated: multiple small dots
              const dots = [-24, -12, 0, 12, 24];
              return (
                <motion.g
                  key={i}
                  className="cursor-pointer"
                  onClick={() => setActiveMarker(activeMarker === i ? null : i)}
                >
                  {dots.map((dx, di) => (
                    <motion.circle
                      key={di}
                      cx={cx + dx}
                      cy="44"
                      r="4"
                      fill={colors.fill}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.8, scale: 1 }}
                      transition={{ delay: 0.7 + di * 0.08 }}
                    />
                  ))}
                  <text x={cx} y="32" textAnchor="middle" fontSize="10" fontWeight="600" fill={colors.fill}>
                    {m.label}
                  </text>
                </motion.g>
              );
            }

            // Point: single dot
            return (
              <motion.g
                key={i}
                className="cursor-pointer"
                onClick={() => setActiveMarker(activeMarker === i ? null : i)}
              >
                <motion.circle
                  cx={cx}
                  cy="44"
                  r="7"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.12, type: 'spring', stiffness: 300 }}
                />
                <text x={cx} y="28" textAnchor="middle" fontSize="10" fontWeight="600" fill={colors.fill}>
                  {m.label}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Tooltip for active marker */}
        <AnimatePresence>
          {activeMarker !== null && markers[activeMarker] && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-xs text-gray-700 dark:text-gray-300"
            >
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{markers[activeMarker].label}</span>
              {' · '}
              {markers[activeMarker].type === 'point' && 'Hành động xảy ra tại một thời điểm'}
              {markers[activeMarker].type === 'range' && 'Hành động kéo dài trong một khoảng'}
              {markers[activeMarker].type === 'repeated' && 'Hành động lặp đi lặp lại'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Example sentence */}
      {example && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ColoredSentence parts={example.parts} vi={example.vi} size="sm" />
        </motion.div>
      )}
    </div>
  );
}
