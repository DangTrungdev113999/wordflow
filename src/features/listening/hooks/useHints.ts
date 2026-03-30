import { useState, useCallback, useMemo } from 'react';
import type { VocabWord } from '../../../lib/types';
import type { HintType, HintConfig, HintState } from '../types';
import { HINT_CONFIGS } from '../types';

interface UseHintsOptions {
  availableHints: HintType[];
  currentWord: VocabWord | null;
  onSlowReplay?: () => void;
}

export function useHints({ availableHints, currentWord, onSlowReplay }: UseHintsOptions) {
  const [usedHintsForCurrent, setUsedHintsForCurrent] = useState<HintType[]>([]);
  const [revealedValues, setRevealedValues] = useState<Partial<Record<HintType, string>>>({});
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);
  const [xpDeducted, setXpDeducted] = useState(0);

  const hints = useMemo<HintConfig[]>(() => {
    return (Object.keys(HINT_CONFIGS) as HintType[]).map(type => ({
      ...HINT_CONFIGS[type],
      available: availableHints.includes(type),
    }));
  }, [availableHints]);

  const useHint = useCallback((type: HintType): string | undefined => {
    if (type === 'slow-replay' && usedHintsForCurrent.includes(type)) {
      onSlowReplay?.();
      return undefined; // no additional XP penalty
    }
    if (usedHintsForCurrent.includes(type)) return revealedValues[type];
    if (!currentWord) return undefined;

    const config = HINT_CONFIGS[type];
    let value: string | undefined;

    switch (type) {
      case 'first-letter': {
        const word = currentWord.word;
        value = word[0].toUpperCase() + '_'.repeat(Math.max(0, word.length - 1));
        break;
      }
      case 'ipa':
        value = currentWord.ipa || undefined;
        break;
      case 'meaning':
        value = currentWord.meaning || undefined;
        break;
      case 'slow-replay':
        onSlowReplay?.();
        value = undefined;
        break;
    }

    // Track usage & XP
    setUsedHintsForCurrent(prev => [...prev, type]);
    setRevealedValues(prev => ({ ...prev, [type]: value }));
    setTotalHintsUsed(prev => prev + 1);
    setXpDeducted(prev => prev + config.xpPenalty);

    return value;
  }, [usedHintsForCurrent, currentWord, onSlowReplay, revealedValues]);

  const resetHints = useCallback(() => {
    setUsedHintsForCurrent([]);
    setRevealedValues({});
  }, []);

  const hintState: HintState = {
    usedHints: usedHintsForCurrent,
    totalHintsUsed,
    xpDeducted,
  };

  return {
    hints,
    usedHints: usedHintsForCurrent,
    revealedValues,
    useHint,
    hintState,
    resetHints,
  };
}
