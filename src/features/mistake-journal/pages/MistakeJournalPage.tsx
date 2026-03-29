import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, List, BarChart3, Brain, Trash2 } from 'lucide-react';
import { useMistakeStore } from '../../../stores/mistakeStore';
import { MistakeReviewSession } from '../components/MistakeReviewSession';
import { MistakeList } from '../components/MistakeList';
import { MistakeStatsView } from '../components/MistakeStats';
import { PatternAnalysis } from '../components/PatternAnalysis';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

type Tab = 'review' | 'browse' | 'stats';

const TABS: { id: Tab; label: string; icon: typeof RotateCcw }[] = [
  { id: 'review', label: 'Review', icon: RotateCcw },
  { id: 'browse', label: 'Browse', icon: List },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
];

export function MistakeJournalPage() {
  const [activeTab, setActiveTab] = useState<Tab>('review');
  const [showPatterns, setShowPatterns] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { getDueForReview, clearResolved, mistakes } = useMistakeStore();
  const dueCount = getDueForReview().length;

  const handleReviewComplete = useCallback(() => {
    // Stay on review tab, component will show "all caught up"
  }, []);

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mistake Journal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Learn from your mistakes with spaced repetition
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl mb-6">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowPatterns(false); }}
              className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-gray-900 rounded-lg shadow-sm"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <Icon size={16} />
                {tab.label}
                {tab.id === 'review' && dueCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {dueCount > 99 ? '99+' : dueCount}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab + (showPatterns ? '-patterns' : '')}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'review' && (
          <MistakeReviewSession onComplete={handleReviewComplete} />
        )}

        {activeTab === 'browse' && <MistakeList />}

        {activeTab === 'stats' && !showPatterns && (
          <>
            <MistakeStatsView />
            {mistakes.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="gap-1.5 text-xs"
                  onClick={() => setShowPatterns(true)}
                >
                  <Brain size={14} />
                  Pattern Analysis
                </Button>
                <Button
                  variant="secondary"
                  className="gap-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => setShowClearConfirm(true)}
                >
                  <Trash2 size={14} />
                  Clear Mastered
                </Button>
              </div>
            )}
          </>
        )}

        {activeTab === 'stats' && showPatterns && (
          <>
            <button
              onClick={() => setShowPatterns(false)}
              className="text-sm text-indigo-500 hover:underline mb-4 inline-block"
            >
              ← Back to Stats
            </button>
            <PatternAnalysis />
          </>
        )}
      </motion.div>

      <ConfirmDialog
        open={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearResolved}
        title="Clear mastered mistakes?"
        description="All fully mastered mistakes will be permanently removed. Mistakes still in progress will be kept."
        confirmLabel="Clear All"
      />
    </div>
  );
}
