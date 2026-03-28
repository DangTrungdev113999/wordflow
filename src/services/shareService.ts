import type { AchievementDefinition } from '../lib/types';
import { useToastStore } from '../stores/toastStore';

interface ShareData {
  title: string;
  text: string;
}

function buildShareData(achievement: AchievementDefinition): ShareData {
  const tierLabel = achievement.tier ? ` [${achievement.tier.toUpperCase()}]` : '';
  return {
    title: `I earned ${achievement.title} on WordFlow!`,
    text: `${achievement.badge} ${achievement.title}${tierLabel} — ${achievement.description}`,
  };
}

export async function shareAchievement(achievement: AchievementDefinition): Promise<void> {
  const data = buildShareData(achievement);

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(data);
      return;
    } catch (err) {
      // User cancelled or share failed — fall through to clipboard
      if ((err as DOMException)?.name === 'AbortError') return;
    }
  }

  // Clipboard fallback
  try {
    await navigator.clipboard.writeText(data.text);
    useToastStore.getState().addToast({
      type: 'success',
      title: 'Copied to clipboard!',
      description: 'Share your achievement with friends',
    });
  } catch {
    // Clipboard API not available
    useToastStore.getState().addToast({
      type: 'info',
      title: 'Share failed',
      description: 'Unable to copy to clipboard',
    });
  }
}
