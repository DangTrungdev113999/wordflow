import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useChartTheme } from '../../../hooks/useChartTheme';
import type { AnalyticsData } from '../hooks/useAnalytics';

interface Props {
  data: AnalyticsData['masteryBreakdown'];
}

export function WordMasteryBreakdown({ data }: Props) {
  const chart = useChartTheme();
  const total = data.reduce((s, d) => s + d.count, 0);

  if (total === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          label={false}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        {/* Center total label */}
        <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-900 dark:fill-white" fontSize={22} fontWeight="bold">
          {total}
        </text>
        <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400" fontSize={12}>
          words
        </text>
        <Tooltip
          contentStyle={{ background: chart.tooltipBg, border: 'none', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: chart.tooltipText }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => <span className="text-xs text-gray-700 dark:text-gray-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
