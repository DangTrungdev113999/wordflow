import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { AnalyticsData } from '../hooks/useAnalytics';

interface Props {
  data: AnalyticsData['masteryBreakdown'];
}

export function WordMasteryBreakdown({ data }: Props) {
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
        <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400" fontSize={11}>
          words
        </text>
        <Tooltip
          contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#e5e7eb' }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
