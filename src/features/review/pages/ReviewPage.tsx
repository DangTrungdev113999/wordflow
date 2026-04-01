import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';
import { useMistakeStore } from '../../../stores/mistakeStore';

export function ReviewPage() {
  const navigate = useNavigate();
  const dueCount = useMistakeStore(s => s.getDueForReview().length);

  const features = [
    {
      id: 'mistake-journal',
      icon: '📋',
      title: 'Mistake Journal',
      subtitle: 'Sổ lỗi sai',
      description: 'Xem lại các từ & câu đã sai, luyện tập để không lặp lại',
      path: '/mistake-journal',
      gradient: 'from-rose-500 to-red-600',
      badge: null as string | null,
    },
    {
      id: 'mixed-review',
      icon: '🔀',
      title: 'Mixed Review',
      subtitle: 'Ôn tổng hợp',
      description: 'Ôn tập từ vựng xáo trộn từ tất cả chủ đề',
      path: '/vocabulary/mixed-review',
      gradient: 'from-indigo-500 to-blue-600',
      badge: null,
    },
    {
      id: 'due-reviews',
      icon: '⏰',
      title: 'Due Reviews',
      subtitle: 'Cần ôn tập',
      description: 'Từ vựng đến hạn ôn tập theo thuật toán spaced repetition',
      path: '/vocabulary/mixed-review?source=due',
      gradient: 'from-amber-500 to-orange-600',
      badge: dueCount > 0 ? `${dueCount > 99 ? '99+' : dueCount} từ` : null,
    },
  ];

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          Ôn tập để ghi nhớ lâu dài
        </p>
      </motion.div>

      {dueCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          onClick={() => navigate('/vocabulary/mixed-review?source=due')}
          className="cursor-pointer rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white shadow-lg shadow-amber-500/20"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏰</span>
            <div>
              <p className="font-bold text-lg">{dueCount} từ cần ôn tập</p>
              <p className="text-amber-100 text-sm">Ôn ngay để không quên!</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                <div className="flex items-start justify-between">
                  <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl', feature.gradient)}>
                    {feature.icon}
                  </div>
                  {feature.badge && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                      {feature.badge}
                    </span>
                  )}
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
