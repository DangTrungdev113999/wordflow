import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../../../components/ui/Card';
import { db } from '../../../db/database';
import type { DailyLog } from '../../../db/models';

export function StatsChart() {
  const [logs, setLogs] = useState<DailyLog[]>([]);

  useEffect(() => {
    db.dailyLogs.orderBy('date').reverse().limit(7).toArray().then((data) => {
      setLogs(data.reverse());
    });
  }, []);

  if (logs.length === 0) {
    return (
      <Card>
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm">Last 7 Days</h3>
        <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
          No activity yet
        </div>
      </Card>
    );
  }

  const data = logs.map((log) => ({
    date: log.date.slice(5), // MM-DD
    words: log.wordsLearned + log.wordsReviewed,
    xp: log.xpEarned,
  }));

  return (
    <Card>
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm">Last 7 Days</h3>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} barSize={24}>
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#e5e7eb' }}
            itemStyle={{ color: '#818cf8' }}
          />
          <Bar dataKey="words" fill="#6366f1" radius={[4, 4, 0, 0]} name="Words" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
