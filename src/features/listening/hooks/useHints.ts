import { useState, useCallback, useMemo } from 'react';
import type { VocabWord } from '../../../lib/types';
import type { HintType, HintConfig, HintState } from '../types';
import { HINT_CONFIGS } from '../types';

interface UseHintsOptions {
  availableHints: HintType[];
  currentWord: VocabWord | null;
  onSlowReplay?: () => void;
}

interface UseHintsReturn {
  hints: HintConfig[];
  usedHints: HintType[];
  revealedValues: Record<HintType, string | null>;
  useHint: (type: HintType) => void;
  hintState: HintState;
  resetHints: () => void;
}

export function useHints({ availableHints, currentWord, onSlowReplay }: UseHintsOptions): UseHintsReturn {
  const [usedHints, setUsedHints] = useState<HintType[]>([]);
  const [totalUsed, setTotalUsed] = useState(0);
  const [totalDeducted, setTotalDeducted] = useState(0);

  const hints = useMemo<HintConfig[]>(
    () => availableHints.map(type => ({ ...HINT_CONFIGS[type], available: true })),
    [availableHints],
  );

  const revealedValues = useMemo<Record<HintType, string | null>>(() => {
    const values: Record<HintType, string | null> = {
      'first-letter': null,
      'ipa': null,
      'meaning': null,
      'slow-replay': null,
    };
    if (!currentWord) return values;
    for (const type of usedHints) {
      switch (type) {
        case 'first-letter':
          values['first-letter'] = currentWord.word.charAt(0).toUpperCase();
          break;
        case 'ipa':
          values['ipa'] = currentWord.ipa;
          break;
        case 'meaning':
          values['meaning'] = currentWord.meaning;
          break;
        case 'slow-replay':
          values['slow-replay'] = 'Playing...';
          break;
      }
    }
    return values;
  }, [usedHints, currentWord]);

  const useHint = useCallback((type: HintType) => {
    if (usedHints.includes(type)) {
      if (type === 'slow-replay') onSlowReplay?.();
      return;
    }
    setUsedHints(prev => [...prev, type]);
    setTotalUsed(prev => prev + 1);
    setTotalDeducted(prev => prev + HINT_CONFIGS[type].xpPenalty);
    if (type === 'slow-replay') onSlowReplay?.();
  }, [usedHints, onSlowReplay]);

  const resetHints = useCallback(() => {
    setUsedHints([]);
  }, []);

  const hintState: HintState = {
    usedHints,
    totalHintsUsed: totalUsed,
    xpDeducted: totalDeducted,
  };

  return { hints, usedHints, revealedValues, useHint, hintState, resetHints };
}
