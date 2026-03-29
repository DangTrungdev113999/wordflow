import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useChartTheme } from '../../../hooks/useChartTheme';
import { useStudyPlanStore } from '../../../stores/studyPlanStore';

interface WeeklyChartProps {
  data: { day: string; date: string; words: number; xp: number; minutes: number }[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const chart = useChartTheme();
  const goals = useStudyPlanStore((s) => s.goals);
  const dailyXpGoal = goals.find((g) => g.type === 'daily' && g.metric === 'xp')?.target;

  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
        No data yet
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">This Week</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barGap={2} barSize={20}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: chart.axis }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          {dailyXpGoal && (
            <ReferenceLine
              y={dailyXpGoal}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
          )}
          <Tooltip
            contentStyle={{
              background: chart.tooltipBg,
              border: 'none',
              borderRadius: 10,
              fontSize: 12,
              padding: '8px 12px',
            }}
            labelStyle={{ color: chart.tooltipText, marginBottom: 4 }}
            itemStyle={{ padding: 0 }}
            cursor={{ fill: 'rgba(99,102,241,0.08)' }}
          />
          <Bar
            dataKey="xp"
            fill="#6366f1"
            radius={[5, 5, 0, 0]}
            name="XP"
            animationDuration={800}
          />
          <Bar
            dataKey="minutes"
            fill="#06b6d4"
            radius={[5, 5, 0, 0]}
            name="Minutes"
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">XP</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Minutes</span>
        </div>
        {dailyXpGoal && (
          <div className="flex items-center gap-1.5">
            <span className="w-4 border-t-2 border-dashed border-emerald-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">XP Goal</span>
          </div>
        )}
      </div>
    </div>
  );
}
