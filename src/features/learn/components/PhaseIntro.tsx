import { motion } from 'framer-motion';
import { BookOpen, Star, PenLine, Trophy } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { LessonPhase } from '../../../data/learning-path/types';

const PHASE_CONFIG: Record<
  LessonPhase,
  { icon: typeof BookOpen; label: string; description: string; gradient: string; iconBg: string }
> = {
  vocab: {
    icon: BookOpen,
    label: 'Từ vựng',
    description: 'Học từ vựng mới qua thẻ flashcard',
    gradient: 'from-indigo-500 to-violet-500',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
  },
  grammar: {
    icon: Star,
    label: 'Ngữ pháp',
    description: 'Tìm hiểu ngữ pháp và công thức',
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
  },
  practice: {
    icon: PenLine,
    label: 'Thực hành',
    description: 'Luyện tập với bài tập tương tác',
    gradient: 'from-orange-500 to-amber-500',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
  },
  quiz: {
    icon: Trophy,
    label: 'Kiểm tra',
    description: 'Kiểm tra kiến thức vừa học',
    gradient: 'from-violet-500 to-purple-500',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400',
  },
};

export function PhaseIntro({
  phase,
  onStart,
}: {
  phase: LessonPhase;
  onStart: () => void;
}) {
  const config = PHASE_CONFIG[phase];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex-1 flex flex-col items-center justify-center px-4 py-8"
    >
      <div className="text-center max-w-xs">
        <div className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center ${config.iconBg}`}>
          <Icon size={28} />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {config.label}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {config.description}
        </p>

        <Button onClick={onStart} size="lg" className="w-full max-w-[200px]">
          Sẵn sàng?
        </Button>
      </div>
    </motion.div>
  );
}
