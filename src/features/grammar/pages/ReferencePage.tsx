import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router';
import {
  BookOpen,
  ArrowLeft,
  Search,
  X,
  Construction,
} from 'lucide-react';
import { ReferenceCard } from '../components/ReferenceCard';
import { useReferenceSearch } from '../hooks/useReferenceSearch';
import { REFERENCE_CARDS, type ReferenceCardData } from '../../../data/reference/cards';

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
  const { tool } = useParams<{ tool?: string }>();

  const { query, setQuery, results, resultCount } = useReferenceSearch<ReferenceCardData>(
    REFERENCE_CARDS,
    ['title', 'description', 'keywords'],
  );

  const isSearching = query.trim().length > 0;

  // Coming-soon toast for sub-pages not yet implemented
  const showComingSoon = !!tool;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Coming Soon Toast */}
      {showComingSoon && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
        >
          <Construction size={18} className="text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <span className="font-medium">{tool}</span> — coming soon! Trang chi tiết sẽ có trong bản cập nhật tiếp theo.
          </p>
        </motion.div>
      )}

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
          <p className="text-sm text-gray-700 dark:text-gray-300">
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
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm reference..."
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:text-gray-400 dark:placeholder:text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 dark:focus:border-indigo-600 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
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
            {resultCount > 0 ? (
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {resultCount} result{resultCount !== 1 ? 's' : ''}
                </p>
                {results.map((item) => (
                  <ReferenceCard key={item.to} {...item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Không tìm thấy kết quả cho "{query}"
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
              const items = REFERENCE_CARDS.filter((i) => i.section === section.id);
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
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      {section.label}
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
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
