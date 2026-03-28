import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { shareAchievement } from '../../../services/shareService';
import { useToastStore } from '../../../stores/toastStore';
import { TierBadge, getTierBorderClass } from './TierBadge';
import type { AchievementDefinition } from '../../../lib/types';

interface Props {
  achievement: AchievementDefinition | null;
  onClose: () => void;
}

export function AchievementShareModal({ achievement, onClose }: Props) {
  if (!achievement) return null;

  const handleShare = async () => {
    await shareAchievement(achievement);
    onClose();
  };

  const handleCopy = async () => {
    const tierLabel = achievement.tier ? ` [${achievement.tier.toUpperCase()}]` : '';
    const text = `${achievement.badge} ${achievement.title}${tierLabel} — ${achievement.description}`;
    try {
      await navigator.clipboard.writeText(text);
      useToastStore.getState().addToast({
        type: 'info',
        title: 'Copied to clipboard!',
      });
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Share Achievement</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
            >
              <X size={18} />
            </button>
          </div>

          {/* Preview */}
          <div className="p-6">
            <div
              className={cn(
                'rounded-2xl border-2 p-6 text-center',
                achievement.tier
                  ? getTierBorderClass(achievement.tier)
                  : 'border-amber-200 dark:border-amber-800',
                'bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-900/10 dark:to-gray-900'
              )}
            >
              <div className="text-5xl mb-3">{achievement.badge}</div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {achievement.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {achievement.description}
              </p>
              {achievement.tier && <TierBadge tier={achievement.tier} size="md" />}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
            >
              <Copy size={16} />
              Copy
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors font-medium text-sm"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
