import { Link } from 'react-router';
import { Sparkles, ArrowRight } from 'lucide-react';

const AI_FEATURES = [
  {
    title: 'AI Chat',
    titleVi: 'Trò chuyện AI',
    description: 'Luyện tiếng Anh qua hội thoại với AI tutor',
    icon: '💬',
    to: '/ai-chat',
    gradient: 'from-emerald-400 to-teal-500',
    available: true,
  },
  {
    title: 'Writing Practice',
    titleVi: 'Luyện viết',
    description: 'Viết đoạn văn, AI chấm điểm chi tiết',
    icon: '✍️',
    to: '/writing',
    gradient: 'from-violet-400 to-purple-500',
    available: true,
  },
  {
    title: 'Roleplay',
    titleVi: 'Đóng vai hội thoại',
    description: 'Luyện giao tiếp qua các tình huống thực tế',
    icon: '🎭',
    to: '/roleplay',
    gradient: 'from-orange-400 to-rose-500',
    available: true,
  },
];

export function AIHubPage() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <Sparkles size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Features</h1>
          <p className="text-sm text-gray-700 dark:text-gray-300">Luyện tiếng Anh với trí tuệ nhân tạo</p>
        </div>
      </div>

      <div className="grid gap-4">
        {AI_FEATURES.map((feature) => {
          const content = (
            <div
              key={feature.title}
              className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 overflow-hidden group hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient}`} />

              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl shrink-0`}>
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{feature.titleVi}</h3>
                    {!feature.available && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        Sắp có
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                    {feature.description}
                  </p>
                </div>
                {feature.available && (
                  <ArrowRight
                    size={18}
                    className="text-gray-600 dark:text-gray-400 group-hover:text-indigo-500 transition-colors shrink-0 mt-1"
                  />
                )}
              </div>
            </div>
          );

          return feature.available ? (
            <Link key={feature.title} to={feature.to}>
              {content}
            </Link>
          ) : (
            <div key={feature.title} className="opacity-60 cursor-not-allowed">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
