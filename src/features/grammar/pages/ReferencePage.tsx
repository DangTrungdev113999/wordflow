import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import {
  BookOpen,
  ArrowLeft,
  Search,
  X,
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
import { ReferenceCard } from '../components/ReferenceCard';

interface ReferenceItem {
  to: string;
  icon: typeof BookOpen;
  title: string;
  description: string;
  count: string;
  accentBg: string;
  accentText: string;
  accentColor: string;
  section: 'tools' | 'lookup' | 'special';
  keywords: string[];
}

const REFERENCE_ITEMS: ReferenceItem[] = [
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

const SECTIONS = [
  { id: 'tools' as const, label: 'Reference Tools', description: 'Bảng tra cứu & so sánh' },
  { id: 'lookup' as const, label: 'Quick Lookup', description: 'Từ vựng & ngữ pháp nhanh' },
  { id: 'special' as const, label: 'Special Cases', description: 'Lỗi sai & mẫu câu đặc biệt' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export function ReferencePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return REFERENCE_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
    );
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-center gap-3 mb-5"
      >
        <Link
          to="/grammar"
          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reference</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tra cứu nhanh ngữ pháp tiếng Anh
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="relative mb-6"
      >
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm reference..."
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 dark:focus:border-indigo-600 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </motion.div>

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="search-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredItems && filteredItems.length > 0 ? (
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
                </p>
                {filteredItems.map((item) => (
                  <ReferenceCard key={item.to} {...item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Không tìm thấy kết quả cho "{searchQuery}"
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="sections"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-7"
          >
            {SECTIONS.map((section, sectionIdx) => {
              const items = REFERENCE_ITEMS.filter((i) => i.section === section.id);
              return (
                <motion.div
                  key={section.id}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06, delayChildren: sectionIdx * 0.1 } },
                  }}
                >
                  <div className="mb-3">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {section.label}
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {section.description}
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    {items.map((item) => (
                      <motion.div key={item.to} variants={cardVariants}>
                        <ReferenceCard {...item} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
