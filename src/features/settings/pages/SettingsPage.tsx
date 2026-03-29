import { useState, useEffect } from 'react';
import { Settings, Sun, Moon, Monitor, Target, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useSettingsStore } from '../../../stores/settingsStore';
import type { Theme, CEFRLevel } from '../../../lib/types';
import { cn } from '../../../lib/utils';
import { DataExportImport } from '../components/DataExportImport';
import { AISettings } from '../components/AISettings';
import { PageTransition } from '../../../components/common/PageTransition';
import { db } from '../../../db/database';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export function SettingsPage() {
  const { theme, setTheme, dailyGoal, setDailyGoal } = useSettingsStore();
  const navigate = useNavigate();
  const [placementLevel, setPlacementLevel] = useState<CEFRLevel | undefined>();

  useEffect(() => {
    db.userProfile.get('default').then((p) => setPlacementLevel(p?.placementLevel));
  }, []);

  const themes: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const goalOptions = [5, 10, 15, 20, 30];

  return (
    <PageTransition>
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Settings size={22} className="text-gray-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Theme */}
          <motion.div variants={sectionVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Theme</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {themes.map(({ value, label, icon: Icon }) => (
                <motion.button
                  key={value}
                  onClick={() => setTheme(value)}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                    theme === value
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon size={20} className={theme === value ? 'text-indigo-500' : 'text-gray-400'} />
                  <span className={cn('text-sm font-medium', theme === value ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400')}>
                    {label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Daily Goal */}
          <motion.div variants={sectionVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} className="text-green-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Daily Goal</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Words to learn per day</p>
            <div className="flex gap-2">
              {goalOptions.map((g) => (
                <motion.button
                  key={g}
                  onClick={() => setDailyGoal(g)}
                  whileTap={{ scale: 0.93 }}
                  className={cn(
                    'flex-1 py-2 rounded-xl border-2 font-semibold text-sm transition-all',
                    dailyGoal === g
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
                  )}
                >
                  {g}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Placement Test */}
          <motion.div variants={sectionVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap size={18} className="text-indigo-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Placement Test</h3>
            </div>
            {placementLevel && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Current level: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{placementLevel}</span>
              </p>
            )}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/onboarding')}
              className={cn(
                'w-full py-2.5 rounded-xl border-2 font-semibold text-sm transition-all',
                'border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
              )}
            >
              Redo Placement Test
            </motion.button>
          </motion.div>

          {/* AI Settings */}
          <motion.div variants={sectionVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 mb-4">
            <AISettings />
          </motion.div>

          {/* Data Export/Import */}
          <motion.div variants={sectionVariants} className="mb-4">
            <DataExportImport />
          </motion.div>

          {/* App info */}
          <motion.div variants={sectionVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About</h3>
            <p className="text-sm text-gray-500">WordFlow v0.1.0</p>
            <p className="text-sm text-gray-400">English learning app with spaced repetition</p>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
