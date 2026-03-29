import type { EnrichedExample } from '../../../db/models';

export const CONTEXT_ICONS: Record<EnrichedExample['context'], string> = {
  daily: '\u{1F3E0}',
  work: '\u{1F4BC}',
  social: '\u{1F4AC}',
  formal: '\u{1F4F0}',
  dialogue: '\u{1F5E3}\uFE0F',
};

export const CONTEXT_LABELS: Record<EnrichedExample['context'], string> = {
  daily: 'Daily life',
  work: 'Work',
  social: 'Social',
  formal: 'Formal',
  dialogue: 'Dialogue',
};
