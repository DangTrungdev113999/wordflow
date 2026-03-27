import { Zap } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { useProgressStore } from '../../../stores/progressStore';
import { getLevelFromXP } from '../../../lib/utils';

export function XPBar() {
  const { xp, level, levelTitle } = useProgressStore();
  const { nextXP, progress } = getLevelFromXP(xp);

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-sm">Level {level} — {levelTitle}</span>
        </div>
        <span className="text-xs text-gray-400 tabular-nums">{xp} / {nextXP} XP</span>
      </div>
      <ProgressBar value={progress} color="indigo" size="md" />
    </Card>
  );
}
