import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';

interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  path: string;
  gradient: string;
}

const features: FeatureCard[] = [
  {
    id: 'vocabulary',
    icon: '📖',
    title: 'Vocabulary',
    subtitle: 'Từ vựng',
    description: 'Flashcards theo chủ đề, luyện tập & ôn tập từ vựng',
    path: '/vocabulary',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'grammar',
    icon: '📝',
    title: 'Grammar',
    subtitle: 'Ngữ pháp',
    description: 'Bài học ngữ pháp chi tiết với quiz tương tác',
    path: '/grammar',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'word-usage',
    icon: '🔤',
    title: 'Word Usage',
    subtitle: 'Cách dùng từ',
    description: 'Từ đa nghĩa, cặp từ dễ nhầm, phrasal verbs',
    path: '/word-usage',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'listening',
    icon: '🎧',
    title: 'Listening',
    subtitle: 'Nghe',
    description: 'Nghe chép chính tả, điền từ, nghe hiểu hội thoại',
    path: '/listening',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'reading',
    icon: '📕',
    title: 'Reading',
    subtitle: 'Đọc hiểu',
    description: 'Đọc bài văn & trả lời câu hỏi theo trình độ',
    path: '/reading',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    id: 'sentence-building',
    icon: '🧩',
    title: 'Sentence Building',
    subtitle: 'Đặt câu',
    description: 'Sắp xếp từ thành câu hoàn chỉnh',
    path: '/sentence-building',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'pronunciation',
    icon: '🗣️',
    title: 'Pronunciation',
    subtitle: 'Phát âm',
    description: 'Luyện phát âm với nhận diện giọng nói AI',
    path: '/pronunciation',
    gradient: 'from-fuchsia-500 to-violet-600',
  },
];

export function LearnPage() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learn</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          Chọn kỹ năng bạn muốn luyện tập
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Card
              interactive
              onClick={() => navigate(feature.path)}
              className="relative overflow-hidden cursor-pointer h-full"
            >
              <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', feature.gradient)} />

              <div className="pt-2 flex flex-col gap-2">
                <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl', feature.gradient)}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{feature.title}</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{feature.subtitle}</p>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
