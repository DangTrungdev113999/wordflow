import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Clock,
  Lock,
  BookOpen,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';
import { UNITS } from '../../../data/learning-path/units';
import { useLessonStore } from '../../../stores/lessonStore';

// ── Browse by Skill data ──
interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  path: string;
  gradient: string;
}

const features: FeatureCard[] = [
  {
    id: 'vocabulary',
    icon: '📖',
    title: 'Vocabulary',
    subtitle: 'Từ vựng',
    description: 'Flashcards theo chủ đề, luyện tập & ôn tập từ vựng',
    path: '/vocabulary',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'grammar',
    icon: '📝',
    title: 'Grammar',
    subtitle: 'Ngữ pháp',
    description: 'Bài học ngữ pháp chi tiết với quiz tương tác',
    path: '/grammar',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'word-usage',
    icon: '🔤',
    title: 'Word Usage',
    subtitle: 'Cách dùng từ',
    description: 'Từ đa nghĩa, cặp từ dễ nhầm, phrasal verbs',
    path: '/word-usage',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'listening',
    icon: '🎧',
    title: 'Listening',
    subtitle: 'Nghe',
    description: 'Nghe chép chính tả, điền từ, nghe hiểu hội thoại',
    path: '/listening',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'reading',
    icon: '📕',
    title: 'Reading',
    subtitle: 'Đọc hiểu',
    description: 'Đọc bài văn & trả lời câu hỏi theo trình độ',
    path: '/reading',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    id: 'sentence-building',
    icon: '🧩',
    title: 'Sentence Building',
    subtitle: 'Đặt câu',
    description: 'Sắp xếp từ thành câu hoàn chỉnh',
    path: '/sentence-building',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'pronunciation',
    icon: '🗣️',
    title: 'Pronunciation',
    subtitle: 'Phát âm',
    description: 'Luyện phát âm với nhận diện giọng nói AI',
    path: '/pronunciation',
    gradient: 'from-fuchsia-500 to-violet-600',
  },
];

type TabId = 'path' | 'browse';

export function LearnPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>('path');
  const [expandedUnit, setExpandedUnit] = useState<string | null>(
    UNITS[0]?.id ?? null,
  );
  const getLessonStatus = useLessonStore((s) => s.getLessonStatus);
  const getUnitProgress = useLessonStore((s) => s.getUnitProgress);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learn</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          {tab === 'path'
            ? 'Lộ trình học từng bước, từ cơ bản đến nâng cao'
            : 'Chọn kỹ năng bạn muốn luyện tập'}
        </p>
      </motion.div>

      {/* ── Tab Toggle ── */}
      <div className="flex p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl gap-1">
        {([
          { id: 'path' as const, label: 'Learning Path' },
          { id: 'browse' as const, label: 'Browse by Skill' },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              tab === t.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'path' ? (
          <motion.div
            key="path"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {UNITS.map((unit, ui) => {
              const { completed, total } = getUnitProgress(unit.id);
              const isExpanded = expandedUnit === unit.id;
              const unitDone = completed === total;

              return (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ui * 0.06 }}
                >
                  <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                    {/* Unit Header */}
                    <button
                      onClick={() => setExpandedUnit(isExpanded ? null : unit.id)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div
                        className={cn(
                          'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl shrink-0',
                          unit.gradient,
                        )}
                      >
                        {unitDone ? (
                          <CheckCircle2 size={22} className="text-white" />
                        ) : (
                          <span>{unit.icon}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            {unit.level}
                          </span>
                          <span className="text-[10px] text-gray-300 dark:text-gray-600">
                            {completed}/{total}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {unit.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {unit.titleVi}
                        </p>
                      </div>
                      {/* Progress ring */}
                      <div className="relative w-9 h-9 shrink-0">
                        <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            strokeWidth="3"
                            className="stroke-gray-100 dark:stroke-gray-800"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${(completed / total) * 94.2} 94.2`}
                            className={cn(
                              unitDone
                                ? 'stroke-emerald-500'
                                : 'stroke-indigo-500',
                            )}
                          />
                        </svg>
                      </div>
                      <ChevronDown
                        size={18}
                        className={cn(
                          'text-gray-400 transition-transform duration-200 shrink-0',
                          isExpanded && 'rotate-180',
                        )}
                      />
                    </button>

                    {/* Lessons List */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-3 space-y-2">
                            {unit.lessons.map((lesson, li) => {
                              const status = getLessonStatus(lesson.id);
                              const isLocked = status === 'locked';
                              const isDone = status === 'completed';
                              const isActive =
                                status === 'available' ||
                                status === 'in_progress';

                              return (
                                <motion.button
                                  key={lesson.id}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: li * 0.04 }}
                                  disabled={isLocked}
                                  onClick={() =>
                                    !isLocked &&
                                    navigate(`/learn/lesson/${lesson.id}`)
                                  }
                                  className={cn(
                                    'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all',
                                    isLocked
                                      ? 'opacity-40 cursor-not-allowed'
                                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 active:scale-[0.98] cursor-pointer',
                                    isDone && 'opacity-80',
                                  )}
                                >
                                  {/* Status Icon */}
                                  <div
                                    className={cn(
                                      'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                                      isLocked &&
                                        'bg-gray-100 dark:bg-gray-800',
                                      isActive &&
                                        'bg-indigo-50 dark:bg-indigo-950/50',
                                      isDone &&
                                        'bg-emerald-50 dark:bg-emerald-950/50',
                                    )}
                                  >
                                    {isLocked && (
                                      <Lock
                                        size={16}
                                        className="text-gray-400 dark:text-gray-600"
                                      />
                                    )}
                                    {isActive && (
                                      <Play
                                        size={16}
                                        className="text-indigo-500 fill-indigo-500"
                                      />
                                    )}
                                    {isDone && (
                                      <CheckCircle2
                                        size={16}
                                        className="text-emerald-500"
                                      />
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={cn(
                                        'text-sm font-medium truncate',
                                        isLocked
                                          ? 'text-gray-400 dark:text-gray-600'
                                          : 'text-gray-900 dark:text-white',
                                      )}
                                    >
                                      {lesson.title}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                      {lesson.titleVi}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 shrink-0">
                                    <Clock size={12} />
                                    <span>{lesson.estimatedMinutes}m</span>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="browse"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Card
                    interactive
                    onClick={() => navigate(feature.path)}
                    className="relative overflow-hidden cursor-pointer h-full"
                  >
                    <div
                      className={cn(
                        'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
                        feature.gradient,
                      )}
                    />
                    <div className="pt-2 flex flex-col gap-2">
                      <div
                        className={cn(
                          'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl',
                          feature.gradient,
                        )}
                      >
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {feature.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                          {feature.subtitle}
                        </p>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
