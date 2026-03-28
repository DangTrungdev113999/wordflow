import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Target, Mic2 } from 'lucide-react';
import { useProgressStore } from '../../../stores/progressStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { useVocabularyStore } from '../../../stores/vocabularyStore';
import { StreakWidget } from '../components/StreakWidget';
import { XPBar } from '../components/XPBar';
import { StatsChart } from '../components/StatsChart';
import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { TOPIC_ICONS, TOPIC_COLORS } from '../../../lib/constants';
import { DailyChallengeCard } from '../../daily-challenge/components/DailyChallengeCard';

export function DashboardPage() {
  const { todayWordsLearned, todayWordsReviewed } = useProgressStore();
  const { dailyGoal } = useSettingsStore();
  const { topics } = useVocabularyStore();

  const todayTotal = todayWordsLearned + todayWordsReviewed;
  const goalProgress = Math.min(100, (todayTotal / dailyGoal) * 100);

  return (
    <div className="px-4 py-6 space-y-4 max-w-2xl mx-auto">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Good day! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Keep up your learning streak!</p>
      </motion.div>

      {/* Daily goal */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-indigo-500" />
              <span className="font-semibold text-gray-900 dark:text-white text-sm">Daily Goal</span>
            </div>
            <span className="text-xs text-gray-400">{todayTotal}/{dailyGoal} words</span>
          </div>
          <ProgressBar value={goalProgress} color={goalProgress >= 100 ? 'green' : 'indigo'} />
          {goalProgress >= 100 && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">🎉 Daily goal completed!</p>
          )}
        </Card>
      </motion.div>

      {/* Daily Challenge */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <DailyChallengeCard />
      </motion.div>

      {/* Streak + XP */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 gap-3">
        <StreakWidget />
        <XPBar />
      </motion.div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        <Link
          to="/pronunciation"
          className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
        >
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
            <Mic2 size={20} className="text-white" />
          </span>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white text-sm">Pronunciation Practice</p>
            <p className="text-xs text-gray-400">Improve your speaking skills</p>
          </div>
          <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400" />
        </Link>
      </motion.div>

      {/* Quick start */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2 flex items-center gap-1.5">
          <BookOpen size={14} />
          Quick Start
        </h2>
        <div className="grid gap-2">
          {topics.slice(0, 3).map((topic) => (
            <Link
              key={topic.topic}
              to={`/vocabulary/${topic.topic}/learn`}
              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
            >
              <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${TOPIC_COLORS[topic.topic] ?? 'from-indigo-400 to-indigo-600'} flex items-center justify-center text-xl`}>
                {TOPIC_ICONS[topic.topic] ?? '📝'}
              </span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{topic.topicLabel}</p>
                <p className="text-xs text-gray-400">{topic.words.length} words</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Stats chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <StatsChart />
      </motion.div>
    </div>
  );
}
