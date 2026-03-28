import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { AnalyticsData } from '../hooks/useAnalytics';

interface Props {
  data: AnalyticsData['skillRadar'];
}

export function SkillRadar({ data }: Props) {
  if (data.every((d) => d.score === 0)) {
    return <p className="text-sm text-gray-400 text-center py-6">Start learning to see your skill breakdown.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#d1d5db" />
        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#6b7280' }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#9ca3af" />
        <Tooltip
          contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#e5e7eb' }}
          formatter={(value: number) => [`${value}%`]}
        />
        <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
