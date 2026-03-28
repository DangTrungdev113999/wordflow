import { useState } from 'react';
import type { AnalyticsData } from '../hooks/useAnalytics';

interface Props {
  data: AnalyticsData['heatmapData'];
}

const INTENSITY_COLORS = [
  'bg-gray-100 dark:bg-gray-800',
  'bg-green-200 dark:bg-green-900',
  'bg-green-400 dark:bg-green-700',
  'bg-green-500 dark:bg-green-600',
  'bg-green-600 dark:bg-green-500',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function LearningHeatmap({ data }: Props) {
  const [tooltip, setTooltip] = useState<{ date: string; intensity: number; x: number; y: number } | null>(null);

  if (data.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">No activity data yet.</p>;
  }

  // Align data to start on Monday — pad front with empty cells
  const firstDate = new Date(data[0].date);
  const firstDow = (firstDate.getDay() + 6) % 7; // 0=Mon, 6=Sun
  const paddedData = [
    ...Array.from({ length: firstDow }, () => ({ date: '', intensity: -1 })),
    ...data,
  ];

  // Build weeks (columns)
  const weeks: Array<Array<{ date: string; intensity: number }>> = [];
  for (let i = 0; i < paddedData.length; i += 7) {
    weeks.push(paddedData.slice(i, i + 7));
  }
  // Pad last week to 7 if needed
  const lastWeek = weeks[weeks.length - 1];
  while (lastWeek.length < 7) {
    lastWeek.push({ date: '', intensity: -1 });
  }

  // Compute month labels
  const monthLabels: Array<{ label: string; col: number }> = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    const firstValid = weeks[w].find((d) => d.date);
    if (firstValid) {
      const month = new Date(firstValid.date).getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTHS[month], col: w });
        lastMonth = month;
      }
    }
  }

  return (
    <div className="relative">
      {/* Month labels */}
      <div className="flex ml-8 mb-1 gap-0" style={{ height: 16 }}>
        {monthLabels.map(({ label, col }, i) => {
          const nextCol = i < monthLabels.length - 1 ? monthLabels[i + 1].col : weeks.length;
          const span = nextCol - col;
          return (
            <div
              key={`${label}-${col}`}
              className="text-xs text-gray-400"
              style={{ width: span * 18, flexShrink: 0, marginLeft: i === 0 ? col * 18 : 0 }}
            >
              {label}
            </div>
          );
        })}
      </div>

      <div className="flex gap-0">
        {/* Day labels */}
        <div className="flex flex-col justify-between mr-1" style={{ height: 7 * 18 - 4 }}>
          {['Mon', '', 'Wed', '', 'Fri', '', 'Sun'].map((label, i) => (
            <span key={i} className="text-[10px] text-gray-400 leading-none" style={{ height: 14 }}>
              {label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div
          className="grid gap-[4px]"
          style={{
            gridTemplateRows: 'repeat(7, 14px)',
            gridTemplateColumns: `repeat(${weeks.length}, 14px)`,
            gridAutoFlow: 'column',
          }}
        >
          {weeks.flatMap((week, wIdx) =>
            week.map((day, dIdx) => (
              <div
                key={`${wIdx}-${dIdx}`}
                className={`w-[14px] h-[14px] rounded-sm ${
                  day.intensity >= 0 ? INTENSITY_COLORS[day.intensity] : ''
                }`}
                onMouseEnter={(e) => {
                  if (day.date) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({ date: day.date, intensity: day.intensity, x: rect.left, y: rect.top });
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 ml-8">
        <span className="text-xs text-gray-400 mr-1">Less</span>
        {INTENSITY_COLORS.map((cls, i) => (
          <div key={i} className={`w-[14px] h-[14px] rounded-sm ${cls}`} />
        ))}
        <span className="text-xs text-gray-400 ml-1">More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y - 30 }}
        >
          {tooltip.date} — Level {tooltip.intensity}
        </div>
      )}
    </div>
  );
}
