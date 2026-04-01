import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useChartTheme } from '../../../hooks/useChartTheme';
import type { AnalyticsData } from '../hooks/useAnalytics';

interface Props {
  data: AnalyticsData['skillRadar'];
}

export function SkillRadar({ data }: Props) {
  const chart = useChartTheme();

  if (data.every((d) => d.score === 0)) {
    return <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-6">Start learning to see your skill breakdown.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke={chart.polarGrid} />
        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: chart.polarText }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke={chart.axis} />
        <Tooltip
          contentStyle={{ background: chart.tooltipBg, border: 'none', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: chart.tooltipText }}
          formatter={(value: number) => [`${value}%`]}
        />
        <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
