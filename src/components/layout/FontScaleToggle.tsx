import { Type } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import type { FontScale } from '../../lib/types';
import { cn } from '../../lib/utils';

const scaleOrder: FontScale[] = ['small', 'normal', 'large'];
const scaleLabels: Record<FontScale, string> = {
  small: 'S',
  normal: 'M',
  large: 'L',
};

export function FontScaleToggle() {
  const { fontScale, setFontScale } = useSettingsStore();

  const cycle = () => {
    const idx = scaleOrder.indexOf(fontScale);
    const next = scaleOrder[(idx + 1) % scaleOrder.length];
    setFontScale(next);
  };

  return (
    <button
      onClick={cycle}
      className="h-9 flex items-center gap-1 px-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={`Font size: ${fontScale}`}
    >
      <Type size={15} className="text-violet-500" />
      <span className={cn(
        'text-xs font-bold min-w-[16px] text-center',
        'text-violet-600 dark:text-violet-400'
      )}>
        {scaleLabels[fontScale]}
      </span>
    </button>
  );
}
