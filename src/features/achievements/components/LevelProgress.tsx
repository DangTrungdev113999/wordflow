import { useProgressStore } from '../../../stores/progressStore';
import { getLevelFromXP } from '../../../lib/utils';
import { LEVELS } from '../../../lib/constants';
import { ProgressBar } from '../../../components/ui/ProgressBar';

export function LevelProgress() {
  const { xp, level, levelTitle } = useProgressStore();
  const { nextXP, progress } = getLevelFromXP(xp);
  const currentLevelData = LEVELS.find((l) => l.level === level);
  const nextLevelData = LEVELS.find((l) => l.level === level + 1);

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm opacity-80">Level {level}</p>
          <h3 className="text-xl font-bold">{levelTitle}</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{xp.toLocaleString()}</p>
          <p className="text-sm opacity-80">Total XP</p>
        </div>
      </div>
      {nextLevelData && (
        <div>
          <div className="flex justify-between text-xs opacity-80 mb-1">
            <span>{currentLevelData?.xpRequired.toLocaleString()} XP</span>
            <span>{nextXP.toLocaleString()} XP</span>
          </div>
          <ProgressBar value={progress} className="bg-white/20" barClassName="bg-white" />
          <p className="text-xs opacity-80 mt-1 text-center">
            {(nextXP - xp).toLocaleString()} XP to {nextLevelData.title}
          </p>
        </div>
      )}
      {!nextLevelData && (
        <p className="text-sm opacity-80 text-center">🏆 Max level reached!</p>
      )}
    </div>
  );
}
