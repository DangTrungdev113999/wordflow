import { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, Target, Crosshair, Activity, CalendarDays, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '../../../db/database';
import { useProgressStore } from '../../../stores/progressStore';
import { useAnalytics } from '../hooks/useAnalytics';
import { SkillRadar } from '../components/SkillRadar';
import { WordMasteryBreakdown } from '../components/WordMasteryBreakdown';
import { AccuracyTrend } from '../components/AccuracyTrend';
import { WeakAreasChart } from '../components/WeakAreasChart';
import { LearningHeatmap } from '../components/LearningHeatmap';
import type { DailyLog } from '../../../db/models';

export function StatsPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const { xp, totalWordsLearned, currentStreak, longestStreak, badges } = useProgressStore();
  const analytics = useAnalytics();

  useEffect(() => {
    db.dailyLogs.orderBy('date').reverse().limit(30).toArray().then((data) => {
      setLogs(data.reverse());
    });
  }, []);

  const chartData = logs.map((log) => ({
    date: log.date.slice(5), // MM-DD
    words: log.wordsLearned + log.wordsReviewed,
    xp: log.xpEarned,
    accuracy: log.quizAccuracy,
  }));

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
          <BarChart2 size={22} className="text-emerald-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Statistics</h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <p className="text-2xl font-bold text-indigo-600">{xp.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total XP</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <p className="text-2xl font-bold text-green-600">{totalWordsLearned}</p>
          <p className="text-sm text-gray-500">Words Learned</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <p className="text-2xl font-bold text-orange-500">{currentStreak}🔥</p>
          <p className="text-sm text-gray-500">Current Streak</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <p className="text-2xl font-bold text-amber-500">{badges.length}/10</p>
          <p className="text-sm text-gray-500">Badges</p>
        </div>
      </div>

      {/* Longest streak */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-orange-500" />
          <span className="text-sm text-gray-500">Longest Streak</span>
          <span className="ml-auto font-bold text-orange-500">{longestStreak} days</span>
        </div>
      </div>

      {chartData.length > 0 ? (
        <>
          {/* Words per day chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Words Per Day</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="words" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* XP over time */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">XP History</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="xp" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 text-center">
          <p className="text-gray-400">📊 Start learning to see your stats!</p>
          <p className="text-sm text-gray-400 mt-1">Charts will appear after your first study session.</p>
        </div>
      )}

      {/* Enhanced Analytics */}
      {!analytics.loading && (
        <div className="mt-6 space-y-4">
          {/* Skill Radar + Word Mastery — side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Target size={16} className="text-indigo-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Skill Radar</h3>
              </div>
              <SkillRadar data={analytics.skillRadar} />
            </div>

            {analytics.masteryBreakdown.some((d) => d.count > 0) && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <PieChartIcon size={16} className="text-green-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Word Mastery</h3>
                </div>
                <WordMasteryBreakdown data={analytics.masteryBreakdown} />
              </div>
            )}
          </div>

          {/* Accuracy Trend — full width */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} className="text-indigo-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Accuracy Trend (30 days)</h3>
            </div>
            <AccuracyTrend data={analytics.accuracyTrend} />
          </div>

          {/* Weak Areas — full width */}
          {analytics.weakAreas.length >= 2 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Crosshair size={16} className="text-red-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Weak Areas</h3>
              </div>
              <WeakAreasChart data={analytics.weakAreas} />
            </div>
          )}

          {/* Learning Heatmap — full width */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={16} className="text-green-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Learning Activity</h3>
            </div>
            <LearningHeatmap data={analytics.heatmapData} />
          </div>
        </div>
      )}
    </div>
  );
}
