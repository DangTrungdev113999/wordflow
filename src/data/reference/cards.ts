import type { LucideIcon } from 'lucide-react';
import {
  Table2,
  GitCompareArrows,
  MessageCircle,
  Zap,
  MapPin,
  FileText,
  AlertTriangle,
  Ghost,
  Braces,
} from 'lucide-react';

export interface ReferenceCardData {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  count: string;
  accentBg: string;
  accentText: string;
  accentColor: string;
  section: 'tools' | 'lookup' | 'special';
  keywords: string[];
}

export const REFERENCE_CARDS: ReferenceCardData[] = [
  // Reference Tools
  {
    to: '/grammar/reference/irregular-verbs',
    icon: Table2,
    title: 'Irregular Verbs',
    description: 'Bảng động từ bất quy tắc V1-V2-V3 với pattern và ví dụ',
    count: '~120 verbs',
    accentBg: 'bg-violet-50 dark:bg-violet-900/30',
    accentText: 'text-violet-500',
    accentColor: 'violet',
    section: 'tools',
    keywords: ['irregular', 'verb', 'v1', 'v2', 'v3', 'bất quy tắc', 'động từ'],
  },
  {
    to: '/grammar/reference/tense-compare',
    icon: GitCompareArrows,
    title: 'Tense Comparison',
    description: 'So sánh các thì song song: cấu trúc, cách dùng, lỗi hay gặp',
    count: '7 pairs',
    accentBg: 'bg-indigo-50 dark:bg-indigo-900/30',
    accentText: 'text-indigo-500',
    accentColor: 'indigo',
    section: 'tools',
    keywords: ['tense', 'comparison', 'thì', 'so sánh', 'present', 'past', 'future'],
  },
  // Quick Lookup
  {
    to: '/grammar/reference/collocations',
    icon: MessageCircle,
    title: 'Collocations',
    description: 'Make vs Do, Say vs Tell — từ nào đi với từ nào?',
    count: '8 groups',
    accentBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    accentText: 'text-emerald-500',
    accentColor: 'emerald',
    section: 'lookup',
    keywords: ['collocation', 'make', 'do', 'say', 'tell', 'kết hợp'],
  },
  {
    to: '/grammar/reference/phrasal-verbs',
    icon: Zap,
    title: 'Phrasal Verbs',
    description: 'Cụm động từ phổ biến: get up, look for, turn on...',
    count: '~100 verbs',
    accentBg: 'bg-amber-50 dark:bg-amber-900/30',
    accentText: 'text-amber-500',
    accentColor: 'amber',
    section: 'lookup',
    keywords: ['phrasal', 'verb', 'cụm', 'get', 'look', 'turn', 'take', 'put'],
  },
  {
    to: '/grammar/reference/prepositions',
    icon: MapPin,
    title: 'Prepositions',
    description: 'Hướng dẫn giới từ: in/on/at theo thời gian, nơi chốn, chuyển động',
    count: '3 categories',
    accentBg: 'bg-sky-50 dark:bg-sky-900/30',
    accentText: 'text-sky-500',
    accentColor: 'sky',
    section: 'lookup',
    keywords: ['preposition', 'giới từ', 'in', 'on', 'at', 'time', 'place'],
  },
  {
    to: '/grammar/reference/articles',
    icon: FileText,
    title: 'Articles',
    description: 'Cheat sheet mạo từ a/an/the và zero article',
    count: '4 types',
    accentBg: 'bg-teal-50 dark:bg-teal-900/30',
    accentText: 'text-teal-500',
    accentColor: 'teal',
    section: 'lookup',
    keywords: ['article', 'mạo từ', 'a', 'an', 'the', 'zero'],
  },
  // Special Cases
  {
    to: '/grammar/reference/common-mistakes',
    icon: AlertTriangle,
    title: 'Common Mistakes',
    description: 'Lỗi người Việt hay mắc khi học tiếng Anh',
    count: '~40 items',
    accentBg: 'bg-rose-50 dark:bg-rose-900/30',
    accentText: 'text-rose-500',
    accentColor: 'rose',
    section: 'special',
    keywords: ['mistake', 'lỗi', 'sai', 'common', 'thường gặp', 'vietnamese'],
  },
  {
    to: '/grammar/reference/false-friends',
    icon: Ghost,
    title: 'False Friends',
    description: 'Từ dễ nhầm nghĩa: actually, eventually, sympathetic...',
    count: '~30 items',
    accentBg: 'bg-orange-50 dark:bg-orange-900/30',
    accentText: 'text-orange-500',
    accentColor: 'orange',
    section: 'special',
    keywords: ['false friend', 'nhầm', 'confuse', 'actually', 'eventually'],
  },
  {
    to: '/grammar/reference/grammar-patterns',
    icon: Braces,
    title: 'Grammar Patterns',
    description: 'Mẫu câu: suggest + V-ing, used to + V, too...to...',
    count: '~40 patterns',
    accentBg: 'bg-fuchsia-50 dark:bg-fuchsia-900/30',
    accentText: 'text-fuchsia-500',
    accentColor: 'fuchsia',
    section: 'special',
    keywords: ['pattern', 'mẫu', 'structure', 'cấu trúc', 'suggest', 'used to'],
  },
];
