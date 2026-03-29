import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface LevelDatum {
  level: string;
  completed: number;
  total: number;
  pct: number;
}

interface DashboardChartProps {
  data: LevelDatum[];
}

const LEVEL_COLORS: Record<string, string> = {
  A1: '#6366f1',
  A2: '#8b5cf6',
  B1: '#a78bfa',
  B2: '#c4b5fd',
};

export default function DashboardChart({ data }: DashboardChartProps) {
  return (
    <div className="space-y-3">
      {/* Progress bars (simpler, mobile-friendly) */}
      {data.map(d => (
        <div key={d.level} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{d.level}</span>
            <span className="text-gray-500 dark:text-gray-400">{d.completed}/{d.total} ({d.pct}%)</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${d.pct}%`, backgroundColor: LEVEL_COLORS[d.level] || '#6366f1' }}
            />
          </div>
        </div>
      ))}

      {/* Bar chart for wider screens */}
      <div className="hidden sm:block h-32 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <XAxis dataKey="level" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
            <Bar dataKey="pct" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map(d => (
                <Cell key={d.level} fill={LEVEL_COLORS[d.level] || '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
