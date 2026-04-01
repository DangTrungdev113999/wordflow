import { Suspense, lazy, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Bookmark, TrendingUp, ArrowRight } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useGrammarStore } from '../../../stores/grammarStore';
import { db } from '../../../db/database';
import { useNavigate } from 'react-router';

const LazyChart = lazy(() => import('./DashboardChart'));

interface DashboardStat {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
}

export function GrammarDashboard() {
  const { lessons, lessonProgress } = useGrammarStore();
  const navigate = useNavigate();

  const bookmarkCount = useLiveQuery(() => db.grammarBookmarks.count(), []) ?? 0;

  const stats = useMemo(() => {
    const completedIds = Object.keys(lessonProgress).filter(id => lessonProgress[id]?.completed);
    const totalLessons = lessons.length;
    const completionPct = totalLessons > 0 ? Math.round((completedIds.length / totalLessons) * 100) : 0;

    // Average score
    const scores = completedIds.map(id => lessonProgress[id]?.bestScore ?? 0);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    // Weak areas — lessons with score < 70
    const weakAreas = completedIds
      .filter(id => (lessonProgress[id]?.bestScore ?? 0) < 70)
      .map(id => lessons.find(l => l.id === id)?.title ?? id);

    // Find first incomplete lesson for "Continue" button
    const firstIncomplete = lessons.find(l => !lessonProgress[l.id]?.completed);

    return { completedIds, totalLessons, completionPct, avgScore, weakAreas, firstIncomplete };
  }, [lessons, lessonProgress]);

  // Level breakdown for chart
  const levelData = useMemo(() => {
    const levels = ['A1', 'A2'] as const;
    return levels.map(level => {
      const levelLessons = lessons.filter(l => l.level === level);
      const completed = levelLessons.filter(l => lessonProgress[l.id]?.completed).length;
      return { level, completed, total: levelLessons.length, pct: levelLessons.length > 0 ? Math.round((completed / levelLessons.length) * 100) : 0 };
    });
  }, [lessons, lessonProgress]);

  const statCards: DashboardStat[] = [
    {
      icon: <BookOpen size={18} />,
      label: 'Hoàn thành',
      value: `${stats.completionPct}%`,
      sub: `${stats.completedIds.length}/${stats.totalLessons} bài`,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30',
    },
    {
      icon: <TrendingUp size={18} />,
      label: 'Điểm TB',
      value: stats.avgScore > 0 ? `${stats.avgScore}%` : '—',
      sub: stats.completedIds.length > 0 ? `${stats.completedIds.length} bài đã làm` : 'Chưa có',
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30',
    },
    {
      icon: <Bookmark size={18} />,
      label: 'Đã lưu',
      value: String(bookmarkCount),
      sub: 'cheat sheets',
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3, ease: 'easeOut' }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-center"
          >
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${s.color} mb-1.5`}>
              {s.icon}
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{s.value}</div>
            <div className="text-[10px] text-gray-700 dark:text-gray-300 font-medium uppercase tracking-wide">{s.label}</div>
            {s.sub && <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">{s.sub}</div>}
          </motion.div>
        ))}
      </div>

      {/* Chart — completion by level */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4"
      >
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
          Tiến độ theo cấp độ
        </div>
        <Suspense fallback={<div className="h-24 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">Loading chart...</div>}>
          <LazyChart data={levelData} />
        </Suspense>
      </motion.div>

      {/* Weak areas */}
      {stats.weakAreas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-red-50/60 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/40 p-4"
        >
          <div className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">
            Cần ôn lại ({stats.weakAreas.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stats.weakAreas.slice(0, 5).map(name => (
              <span key={name} className="text-xs px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Continue button */}
      {stats.firstIncomplete && (
        <motion.button
          type="button"
          onClick={() => navigate(`/grammar/${stats.firstIncomplete!.id}`)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex items-center justify-between px-4 py-3 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl transition-colors font-medium text-sm"
        >
          <span>Tiếp tục: {stats.firstIncomplete.title}</span>
          <ArrowRight size={18} />
        </motion.button>
      )}
    </div>
  );
}
