import { useEffect, useState } from 'react';
import { getCachedEnrichment } from '../../../services/wordEnrichmentService';
import type { VocabWord } from '../../../lib/types';

export function useMnemonicForWord(currentWord: VocabWord | null) {
  const [mnemonic, setMnemonic] = useState<string | undefined>();
  const [mnemonicType, setMnemonicType] = useState<'sound' | 'visual' | 'breakdown' | 'rhyme' | undefined>();

  useEffect(() => {
    let cancelled = false;
    if (!currentWord) { setMnemonic(undefined); setMnemonicType(undefined); return; }
    setMnemonic(undefined);
    setMnemonicType(undefined);
    getCachedEnrichment(currentWord.word)
      .then((data) => {
        if (!cancelled) {
          setMnemonic(data?.mnemonic || undefined);
          setMnemonicType(data?.mnemonicType);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMnemonic(undefined);
          setMnemonicType(undefined);
        }
      });
    return () => { cancelled = true; };
  }, [currentWord?.word]); // eslint-disable-line react-hooks/exhaustive-deps

  return { mnemonic, mnemonicType };
}
