import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { AnalyticsData } from '../hooks/useAnalytics';

interface Props {
  data: AnalyticsData['weakAreas'];
}

const COLORS = ['#ef4444', '#f97316', '#fb923c', '#fdba74', '#fed7aa'];

export function WeakAreasChart({ data }: Props) {
  if (data.length < 2) return null;

  return (
    <ResponsiveContainer width="100%" height={data.length * 48 + 20}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
        <XAxis type="number" domain={[0, 'auto']} tick={{ fontSize: 11 }} stroke="#9ca3af" />
        <YAxis type="category" dataKey="topicLabel" width={120} tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <Tooltip
          contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#e5e7eb' }}
          formatter={(value: number) => [value.toFixed(2), 'Ease Factor']}
        />
        <Bar dataKey="avgEase" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i] ?? COLORS[COLORS.length - 1]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
