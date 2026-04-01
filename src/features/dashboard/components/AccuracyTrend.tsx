import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChartTheme } from '../../../hooks/useChartTheme';
import type { AnalyticsData } from '../hooks/useAnalytics';

interface Props {
  data: AnalyticsData['accuracyTrend'];
}

export function AccuracyTrend({ data }: Props) {
  const chart = useChartTheme();

  if (data.length === 0) {
    return <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-6">No quiz data yet. Complete quizzes to see your accuracy trend.</p>;
  }

  const chartData = data.map((d) => ({
    ...d,
    date: d.date.slice(5),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke={chart.axis} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke={chart.axis} unit="%" />
        <Tooltip
          contentStyle={{ background: chart.tooltipBg, border: 'none', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: chart.tooltipText }}
          formatter={(value: number) => [`${Math.round(value)}%`]}
        />
        <Line
          type="monotone"
          dataKey="accuracy"
          stroke="#a5b4fc"
          strokeWidth={1}
          strokeDasharray="5 5"
          dot={false}
          name="Raw"
        />
        <Line
          type="monotone"
          dataKey="smoothed"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 2 }}
          name="Smoothed"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
