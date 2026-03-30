import type { DictationMode } from '../../lib/types';

export type HintType = 'first-letter' | 'ipa' | 'meaning' | 'slow-replay';

export interface HintConfig {
  type: HintType;
  label: string;
  icon: string;
  xpPenalty: number;
  available: boolean;
}

export interface HintState {
  usedHints: HintType[];
  totalHintsUsed: number;
  xpDeducted: number;
}

export const HINT_CONFIGS: Record<HintType, Omit<HintConfig, 'available'>> = {
  'first-letter': { type: 'first-letter', label: 'Chữ cái đầu', icon: '\u{1F524}', xpPenalty: 2 },
  'ipa':          { type: 'ipa',          label: 'Phiên âm IPA', icon: '\u{1F5E3}\uFE0F', xpPenalty: 3 },
  'meaning':      { type: 'meaning',      label: 'Nghĩa ti\u1EBFng Vi\u1EC7t', icon: '\u{1F1FB}\u{1F1F3}', xpPenalty: 4 },
  'slow-replay':  { type: 'slow-replay',  label: 'Nghe ch\u1EADm 0.75x', icon: '\u{1F422}', xpPenalty: 1 },
};

/** Which hints are available per dictation mode */
export const MODE_HINT_AVAILABILITY: Record<DictationMode, HintType[]> = {
  word:     ['first-letter', 'ipa', 'meaning', 'slow-replay'],
  phrase:   ['meaning', 'slow-replay'],
  sentence: ['meaning', 'slow-replay'],
  quiz:     ['ipa', 'slow-replay'],
};
