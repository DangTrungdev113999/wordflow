export const ROLE_COLORS = {
  subject:    { bg: 'bg-blue-100 dark:bg-blue-900/40',    text: 'text-blue-700 dark:text-blue-300',    border: 'border-blue-300 dark:border-blue-700' },
  verb:       { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' },
  object:     { bg: 'bg-green-100 dark:bg-green-900/40',   text: 'text-green-700 dark:text-green-300',   border: 'border-green-300 dark:border-green-700' },
  time:       { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700' },
  auxiliary:  { bg: 'bg-pink-100 dark:bg-pink-900/40',     text: 'text-pink-700 dark:text-pink-300',     border: 'border-pink-300 dark:border-pink-700' },
  complement: { bg: 'bg-teal-100 dark:bg-teal-900/40',     text: 'text-teal-700 dark:text-teal-300',     border: 'border-teal-300 dark:border-teal-700' },
  connector:   { bg: 'bg-gray-100 dark:bg-gray-800',        text: 'text-gray-600 dark:text-gray-400',     border: 'border-gray-300 dark:border-gray-700' },
  determiner:  { bg: 'bg-amber-100 dark:bg-amber-900/40',    text: 'text-amber-700 dark:text-amber-300',   border: 'border-amber-300 dark:border-amber-700' },
} as const;

export type SentenceRole = keyof typeof ROLE_COLORS;

export const ALL_ROLES: SentenceRole[] = ['subject', 'verb', 'object', 'time', 'auxiliary', 'complement', 'connector', 'determiner'];

export const ROLE_LABELS: Record<SentenceRole, string> = {
  subject: 'Chủ ngữ',
  verb: 'Động từ',
  object: 'Tân ngữ',
  time: 'Thời gian',
  auxiliary: 'Trợ động từ',
  complement: 'Bổ ngữ',
  connector: 'Liên từ',
  determiner: 'Mạo từ/Hạn định từ',
};
