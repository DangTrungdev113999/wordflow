import { useEffect, useState, useRef, useCallback } from 'react';
import { BarChart2, TrendingUp, Target, Crosshair, Activity, CalendarDays, PieChart as PieChartIcon } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '../../../db/database';
import { useProgressStore } from '../../../stores/progressStore';
import { useChartTheme } from '../../../hooks/useChartTheme';
import { useAnalytics } from '../hooks/useAnalytics';
import { SkillRadar } from '../components/SkillRadar';
import { WordMasteryBreakdown } from '../components/WordMasteryBreakdown';
import { AccuracyTrend } from '../components/AccuracyTrend';
import { WeakAreasChart } from '../components/WeakAreasChart';
import { LearningHeatmap } from '../components/LearningHeatmap';
import { PageTransition } from '../../../components/common/PageTransition';
import type { DailyLog } from '../../../db/models';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  const animate = useCallback(() => {
    if (!inView) return;
    const duration = 600;
    const start = performance.now();
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [end, inView]);

  useEffect(() => { animate(); }, [animate]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

export function StatsPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const { xp, totalWordsLearned, currentStreak, longestStreak, badges } = useProgressStore();
  const analytics = useAnalytics();
  const chart = useChartTheme();

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
    <PageTransition>
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
            <BarChart2 size={22} className="text-emerald-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Statistics</h1>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <p className="text-2xl font-bold text-indigo-600"><CountUp end={xp} /></p>
              <p className="text-sm text-gray-500">Total XP</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <p className="text-2xl font-bold text-green-600"><CountUp end={totalWordsLearned} /></p>
              <p className="text-sm text-gray-500">Words Learned</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <p className="text-2xl font-bold text-orange-500"><CountUp end={currentStreak} suffix="🔥" /></p>
              <p className="text-sm text-gray-500">Current Streak</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <p className="text-2xl font-bold text-amber-500">{badges.length}/10</p>
              <p className="text-sm text-gray-500">Badges</p>
            </motion.div>
          </div>

          {/* Longest streak */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-orange-500" />
              <span className="text-sm text-gray-500">Longest Streak</span>
              <span className="ml-auto font-bold text-orange-500"><CountUp end={longestStreak} suffix=" days" /></span>
            </div>
          </motion.div>

          {chartData.length > 0 ? (
            <>
              {/* Words per day chart */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Words Per Day</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke={chart.axis} />
                    <YAxis tick={{ fontSize: 12 }} stroke={chart.axis} />
                    <Tooltip contentStyle={{ background: chart.tooltipBg, border: 'none', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: chart.tooltipText }} />
                    <Bar dataKey="words" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* XP over time */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">XP History</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke={chart.axis} />
                    <YAxis tick={{ fontSize: 12 }} stroke={chart.axis} />
                    <Tooltip contentStyle={{ background: chart.tooltipBg, border: 'none', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: chart.tooltipText }} />
                    <Line type="monotone" dataKey="xp" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </>
          ) : (
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-gray-400">Start learning to see your stats!</p>
              <p className="text-sm text-gray-400 mt-1">Charts will appear after your first study session.</p>
            </motion.div>
          )}

          {/* Enhanced Analytics */}
          {!analytics.loading && (
            <div className="mt-6 space-y-4">
              {/* Skill Radar + Word Mastery — side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} className="text-indigo-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Skill Radar</h3>
                  </div>
                  <SkillRadar data={analytics.skillRadar} />
                </motion.div>

                {analytics.masteryBreakdown.some((d) => d.count > 0) && (
                  <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-3">
                      <PieChartIcon size={16} className="text-green-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">Word Mastery</h3>
                    </div>
                    <WordMasteryBreakdown data={analytics.masteryBreakdown} />
                  </motion.div>
                )}
              </div>

              {/* Accuracy Trend — full width */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={16} className="text-indigo-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Accuracy Trend (30 days)</h3>
                </div>
                <AccuracyTrend data={analytics.accuracyTrend} />
              </motion.div>

              {/* Weak Areas — full width */}
              {analytics.weakAreas.length >= 2 && (
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Crosshair size={16} className="text-red-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Weak Areas</h3>
                  </div>
                  <WeakAreasChart data={analytics.weakAreas} />
                </motion.div>
              )}

              {/* Learning Heatmap — full width */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays size={16} className="text-green-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Learning Activity</h3>
                </div>
                <LearningHeatmap data={analytics.heatmapData} />
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
