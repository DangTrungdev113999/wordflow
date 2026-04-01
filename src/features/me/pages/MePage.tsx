import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';
import { useProgressStore } from '../../../stores/progressStore';

const features = [
  {
    id: 'stats',
    icon: '📊',
    title: 'Statistics',
    subtitle: 'Thống kê',
    description: 'Xem tiến trình học tập chi tiết theo thời gian',
    path: '/stats',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'achievements',
    icon: '🏆',
    title: 'Achievements',
    subtitle: 'Thành tựu',
    description: 'Huy hiệu & cấp bậc đạt được trong quá trình học',
    path: '/achievements',
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'study-planner',
    icon: '📅',
    title: 'Study Planner',
    subtitle: 'Kế hoạch học',
    description: 'Lên kế hoạch, đặt mục tiêu & hẹn giờ học tập',
    path: '/study-planner',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'settings',
    icon: '⚙️',
    title: 'Settings',
    subtitle: 'Cài đặt',
    description: 'Giao diện, mục tiêu hàng ngày & tùy chỉnh cá nhân',
    path: '/settings',
    gradient: 'from-gray-500 to-slate-600',
  },
];

export function MePage() {
  const navigate = useNavigate();
  const { level, levelTitle, xp, currentStreak } = useProgressStore();

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Me</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          Hồ sơ & cài đặt cá nhân
        </p>
      </motion.div>

      {/* Profile summary card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
      >
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
              👤
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">Level {level} — {levelTitle}</p>
              <p className="text-indigo-100 text-sm">{xp.toLocaleString()} XP</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/15 backdrop-blur-sm px-3 py-2">
              <p className="text-xs text-indigo-100">Streak</p>
              <p className="font-bold text-lg">{currentStreak} ngày 🔥</p>
            </div>
            <div className="rounded-xl bg-white/15 backdrop-blur-sm px-3 py-2">
              <p className="text-xs text-indigo-100">Level</p>
              <p className="font-bold text-lg">{level} ⭐</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
          >
            <Card
              interactive
              onClick={() => navigate(feature.path)}
              className="relative overflow-hidden cursor-pointer h-full"
            >
              <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', feature.gradient)} />

              <div className="pt-2 flex flex-col gap-2">
                <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl', feature.gradient)}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{feature.title}</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{feature.subtitle}</p>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
