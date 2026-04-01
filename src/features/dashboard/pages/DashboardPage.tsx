import { useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Flame,
  RotateCcw,
  BookOpen,
  Target,
  Lightbulb,
  Headphones,
  BookText,
  GraduationCap,
  Sparkles,
  Zap,
  Play,
} from 'lucide-react';
import { useProgressStore } from '../../../stores/progressStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { useVocabularyStore } from '../../../stores/vocabularyStore';
import { useMistakeStore } from '../../../stores/mistakeStore';
import { useLessonStore } from '../../../stores/lessonStore';
import { useShallow } from 'zustand/react/shallow';
import { useDailyChallenge } from '../../daily-challenge/hooks/useDailyChallenge';
import { StatsChart } from '../components/StatsChart';
import { getLevelFromXP } from '../../../lib/utils';
import { UNITS } from '../../../data/learning-path/units';

// Fix 3: Animation variants as module-level constants (avoid re-creation each render)
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function DashboardPage() {
  const { xp, currentStreak, todayWordsLearned, todayWordsReviewed } = useProgressStore();
  const { dailyGoal } = useSettingsStore();
  const { topics, wordProgressMap } = useVocabularyStore();
  const dueCount = useMistakeStore((s) => s.getDueForReview().length);
  const { completed: dailyChallengeCompleted } = useDailyChallenge();
  const nextLesson = useLessonStore(useShallow((s) => s.getNextAvailableLesson()));

  const { level, title: levelTitle, progress: xpProgress } = getLevelFromXP(xp);
  const todayTotal = todayWordsLearned + todayWordsReviewed;
  const goalProgress = Math.min(100, (todayTotal / dailyGoal) * 100);

  // Fix 1: Memoize O(topics × words) computation
  const incompleteTopic = useMemo(
    () =>
      topics.find((t) => {
        const learnedCount = t.words.filter((w) => {
          const p = wordProgressMap[w.word];
          return p && p.status !== 'new';
        }).length;
        return learnedCount > 0 && learnedCount < t.words.length;
      }),
    [topics, wordProgressMap],
  );

  // Session items by priority: review → continue topic → daily challenge
  const sessionItems: Array<{
    icon: React.ReactNode;
    text: string;
    to: string;
    accent: string;
  }> = [];

  if (dueCount >= 3) {
    sessionItems.push({
      icon: <RotateCcw size={18} />,
      text: `${dueCount} từ cần ôn tập`,
      to: '/review',
      accent: 'from-amber-500 to-orange-500',
    });
  }

  if (incompleteTopic && sessionItems.length < 3) {
    sessionItems.push({
      icon: <BookOpen size={18} />,
      text: `Tiếp tục: ${incompleteTopic.topicLabel}`,
      to: `/vocabulary/${incompleteTopic.topic}/learn`,
      accent: 'from-emerald-500 to-teal-500',
    });
  }

  if (nextLesson && sessionItems.length < 3) {
    const lessonData = UNITS
      .find((u) => u.id === nextLesson.unitId)
      ?.lessons.find((l) => l.id === nextLesson.lessonId);
    if (lessonData) {
      sessionItems.push({
        icon: <Play size={18} />,
        text: `Bài tiếp: ${lessonData.title}`,
        to: `/learn/lesson/${nextLesson.lessonId}`,
        accent: 'from-indigo-500 to-blue-500',
      });
    }
  }

  // Fix 2: Only show Daily Challenge if not yet completed today
  if (!dailyChallengeCompleted && sessionItems.length < 3) {
    sessionItems.push({
      icon: <Target size={18} />,
      text: 'Daily Challenge',
      to: '/daily-challenge',
      accent: 'from-violet-500 to-purple-500',
    });
  }

  // Smart suggestions based on today's activity
  const suggestions: Array<{
    icon: React.ReactNode;
    title: string;
    desc: string;
    to: string;
  }> = [];

  if (todayWordsLearned > 0) {
    suggestions.push(
      {
        icon: <Headphones size={18} />,
        title: 'Luyện nghe',
        desc: 'Củng cố từ vừa học qua bài nghe',
        to: '/listening',
      },
      {
        icon: <BookText size={18} />,
        title: 'Luyện đọc',
        desc: 'Đọc hiểu với từ vựng đã học',
        to: '/reading',
      },
    );
  } else if (dueCount > 0) {
    suggestions.push({
      icon: <RotateCcw size={18} />,
      title: 'Ôn tập ngay',
      desc: `${dueCount} từ đang chờ bạn ôn`,
      to: '/review',
    });
  } else {
    suggestions.push({
      icon: <GraduationCap size={18} />,
      title: 'Bắt đầu học',
      desc: 'Khám phá từ vựng mới hôm nay',
      to: '/learn',
    });
  }

  return (
    <motion.div
      className="px-4 py-5 space-y-4 max-w-2xl mx-auto pb-24"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* ── Status Bar ── */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800"
      >
        <div className="flex items-center gap-1.5 text-sm font-semibold text-orange-500">
          <Flame size={16} className="fill-orange-500" />
          <span>{currentStreak}</span>
        </div>

        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />

        <div className="flex-1 flex items-center gap-2">
          <Zap size={14} className="text-indigo-500 shrink-0" />
          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, xpProgress)}%` }}
            />
          </div>
        </div>

        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />

        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-tight">
          Lv.{level}{' '}
          <span className="font-medium text-gray-500 dark:text-gray-400">{levelTitle}</span>
        </span>
      </motion.div>

      {/* ── Today's Session Card ── */}
      {sessionItems.length > 0 && (
        <motion.div variants={fadeUp}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 p-4 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/40">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/[0.06] rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/[0.06] rounded-full blur-xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-indigo-200" />
                <h2 className="text-sm font-semibold text-white/90 tracking-wide uppercase">
                  Phiên học hôm nay
                </h2>
              </div>
              <div className="space-y-2">
                {sessionItems.map((item, i) => (
                  <Link
                    key={i}
                    to={item.to}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/[0.18] active:scale-[0.98] transition-all group"
                  >
                    <span
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.accent} flex items-center justify-center text-white shadow-sm`}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1 text-sm font-medium text-white">{item.text}</span>
                    <ChevronRight
                      size={16}
                      className="text-white/40 group-hover:text-white/80 transition-colors"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Today's Progress ── */}
      <motion.div variants={fadeUp}>
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Tiến trình hôm nay
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {todayTotal}/{dailyGoal}
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                goalProgress >= 100
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                  : 'bg-gradient-to-r from-indigo-500 to-violet-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {todayWordsLearned}
              </span>{' '}
              từ đã học
            </span>
            <span className="text-xs text-gray-300 dark:text-gray-600">&middot;</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium text-violet-600 dark:text-violet-400">
                {todayWordsReviewed}
              </span>{' '}
              từ đã ôn
            </span>
            {goalProgress >= 100 && (
              <>
                <span className="text-xs text-gray-300 dark:text-gray-600">&middot;</span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Hoàn thành!
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Smart Suggestions ── */}
      <motion.div variants={fadeUp} className="space-y-2">
        <div className="flex items-center gap-1.5 px-1">
          <Lightbulb size={14} className="text-amber-500" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Gợi ý cho bạn
          </span>
        </div>
        {suggestions.map((s, i) => (
          <Link
            key={i}
            to={s.to}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm active:scale-[0.98] transition-all group"
          >
            <span className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              {s.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{s.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.desc}</p>
            </div>
            <ChevronRight
              size={16}
              className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors shrink-0"
            />
          </Link>
        ))}
      </motion.div>

      {/* ── Stats Overview ── */}
      <motion.div variants={fadeUp}>
        <StatsChart />
      </motion.div>
    </motion.div>
  );
}
