import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useMistakeStore } from '../../../stores/mistakeStore';
import type { MistakeType } from '../../../models/Mistake';

const TYPE_COLORS: Record<MistakeType, string> = {
  vocabulary: '#3b82f6',
  grammar: '#8b5cf6',
  spelling: '#f59e0b',
  sentence_order: '#14b8a6',
  listening: '#06b6d4',
  reading: '#10b981',
  writing: '#f43f5e',
};

const TYPE_LABELS: Record<MistakeType, string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  spelling: 'Spelling',
  sentence_order: 'Sentence Order',
  listening: 'Listening',
  reading: 'Reading',
  writing: 'Writing',
};

export function MistakeStatsView() {
  const { mistakes } = useMistakeStore();

  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of mistakes) {
      counts[m.type] = (counts[m.type] || 0) + 1;
    }
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([type, count]) => ({
        name: TYPE_LABELS[type as MistakeType] ?? type,
        value: count,
        color: TYPE_COLORS[type as MistakeType] ?? '#6b7280',
      }))
      .sort((a, b) => b.value - a.value);
  }, [mistakes]);

  const trendData = useMemo(() => {
    // Group mistakes by creation date
    const byDate = new Map<string, number>();
    for (const m of mistakes) {
      byDate.set(m.createdAt, (byDate.get(m.createdAt) || 0) + 1);
    }

    // Cumulative count
    const entries = Array.from(byDate.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    let cumulative = 0;
    return entries.map(([date, count]) => {
      cumulative += count;
      return {
        date: date.slice(5), // MM-DD
        newMistakes: count,
        total: cumulative,
      };
    });
  }, [mistakes]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const due = mistakes.filter(m => m.nextReview <= today).length;
    const mastered = mistakes.filter(m => m.interval > 30).length;
    const reviewed = mistakes.filter(m => m.reviewCount > 0).length;
    const avgEase = mistakes.length > 0
      ? (mistakes.reduce((sum, m) => sum + m.easeFactor, 0) / mistakes.length).toFixed(2)
      : '—';

    return { total: mistakes.length, due, mastered, reviewed, avgEase };
  }, [mistakes]);

  if (mistakes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📊</p>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">No data yet</h3>
        <p className="text-sm text-gray-500">Start practicing to see your mistake statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-800 dark:text-gray-200' },
          { label: 'Due', value: stats.due, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Reviewed', value: stats.reviewed, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Mastered', value: stats.mastered, color: 'text-emerald-600 dark:text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pie chart: by type */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Mistakes by Type</h3>
        {pieData.length > 0 ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center sm:flex-col sm:gap-y-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{d.name}</span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Line chart: trend over time */}
      {trendData.length > 1 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Mistake Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={{ r: 2 }} name="Total" />
              <Line type="monotone" dataKey="newMistakes" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="New" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Avg ease factor */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Average Ease Factor</span>
          <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{stats.avgEase}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Higher is easier (1.3 - 3.5+). A value around 2.5 is normal.</p>
      </div>
    </div>
  );
}
