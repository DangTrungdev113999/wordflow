import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { MULTI_MEANING_SEEDS } from '../../../data/multiMeaningSeeds';
import { CONFUSING_PAIRS } from '../../../data/confusingPairs';
import { PHRASAL_VERBS } from '../../../data/phrasalVerbs';
import { COLLOCATIONS } from '../../../data/collocations';
import { GRAMMAR_PATTERNS } from '../../../data/grammarPatterns';
import { cn } from '../../../lib/utils';

interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  count: number;
  countLabel: string;
  path: string;
  enabled: boolean;
  gradient: string;
}

const features: FeatureCard[] = [
  {
    id: 'multi-meaning',
    icon: '📚',
    title: 'Từ đa nghĩa',
    description: 'Khám phá nhiều nghĩa khác nhau của một từ theo ngữ cảnh',
    count: MULTI_MEANING_SEEDS.length,
    countLabel: 'từ',
    path: '/word-usage/multi-meaning',
    enabled: true,
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'confusing-pairs',
    icon: '🔄',
    title: 'Cặp từ dễ nhầm',
    description: 'So sánh chi tiết các cặp từ hay bị nhầm lẫn',
    count: CONFUSING_PAIRS.length,
    countLabel: 'cặp',
    path: '/word-usage/confusing-pairs',
    enabled: true,
    gradient: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'phrasal-verbs',
    icon: '🔗',
    title: 'Phrasal Verbs',
    description: 'Cụm động từ thông dụng nhóm theo động từ gốc',
    count: PHRASAL_VERBS.length,
    countLabel: 'cụm',
    path: '/word-usage/phrasal-verbs',
    enabled: true,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'collocations',
    icon: '🤝',
    title: 'Collocations',
    description: 'Các kết hợp từ tự nhiên trong tiếng Anh',
    count: COLLOCATIONS.length,
    countLabel: 'cụm',
    path: '/word-usage/collocations',
    enabled: true,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'grammar-patterns',
    icon: '📐',
    title: 'Grammar Patterns',
    description: 'Mẫu ngữ pháp phụ thuộc ngữ cảnh',
    count: GRAMMAR_PATTERNS.length,
    countLabel: 'mẫu',
    path: '/word-usage/grammar',
    enabled: true,
    gradient: 'from-rose-500 to-pink-600',
  },
];

export function WordUsageHubPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cách dùng từ</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Hiểu sâu từ vựng: nghĩa, cách dùng, và các lỗi thường gặp
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <Card
              interactive={feature.enabled}
              onClick={feature.enabled ? () => navigate(feature.path) : undefined}
              className={cn(
                'relative overflow-hidden cursor-pointer h-full',
                !feature.enabled && 'opacity-60 cursor-default'
              )}
            >
              {/* Gradient accent bar */}
              <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', feature.gradient)} />

              <div className="pt-2">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{feature.icon}</span>
                  {feature.enabled ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {feature.count} {feature.countLabel}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                      Sắp ra mắt
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
