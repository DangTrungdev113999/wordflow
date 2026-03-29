import { useEffect, useState } from 'react';
import { getCachedEnrichment } from '../../../services/wordEnrichmentService';
import type { VocabWord } from '../../../lib/types';

export function useMnemonicForWord(currentWord: VocabWord | null) {
  const [mnemonic, setMnemonic] = useState<string | undefined>();
  const [mnemonicType, setMnemonicType] = useState<'sound' | 'visual' | 'breakdown' | 'rhyme' | undefined>();

  useEffect(() => {
    if (!currentWord) { setMnemonic(undefined); setMnemonicType(undefined); return; }
    setMnemonic(undefined);
    setMnemonicType(undefined);
    getCachedEnrichment(currentWord.word).then((data) => {
      setMnemonic(data?.mnemonic || undefined);
      setMnemonicType(data?.mnemonicType);
    });
  }, [currentWord]);

  return { mnemonic, mnemonicType };
}
