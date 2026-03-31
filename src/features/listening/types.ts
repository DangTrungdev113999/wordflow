import type { ListeningMode } from '../../lib/types';

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
  'first-letter': { type: 'first-letter', label: 'Chữ cái đầu', icon: '🔤', xpPenalty: 2 },
  'ipa':          { type: 'ipa',          label: 'Phiên âm IPA', icon: '🗣️', xpPenalty: 3 },
  'meaning':      { type: 'meaning',      label: 'Nghĩa tiếng Việt', icon: '🇻🇳', xpPenalty: 4 },
  'slow-replay':  { type: 'slow-replay',  label: 'Nghe chậm 0.75x', icon: '🐢', xpPenalty: 1 },
};

/** Which hints are available per listening mode */
export const MODE_HINT_AVAILABILITY: Record<ListeningMode, HintType[]> = {
  word:            ['first-letter', 'ipa', 'meaning', 'slow-replay'],
  phrase:          ['meaning', 'slow-replay'],
  sentence:        ['meaning', 'slow-replay'],
  quiz:            ['ipa', 'slow-replay'],
  'fill-blank':    ['first-letter', 'ipa', 'meaning', 'slow-replay'],
  'speed':         ['meaning'],
  'listen-choose': ['ipa', 'slow-replay'],
  'conversation':  ['meaning', 'slow-replay'],
  'story':         ['meaning', 'slow-replay'],
};
