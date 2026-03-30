import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { ConfusingPairCard } from '../components/ConfusingPairCard';
import { CONFUSING_PAIRS } from '../../../data/confusingPairs';

export function ConfusingPairDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const pair = CONFUSING_PAIRS.find(p => p.id === id);

  if (!pair) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-400">Không tìm thấy cặp từ này</p>
        <button
          onClick={() => navigate('/word-usage/confusing-pairs')}
          className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
        >
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  // Find related pairs (same category)
  const related = CONFUSING_PAIRS
    .filter(p => p.category === pair.category && p.id !== pair.id)
    .slice(0, 6);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/word-usage/confusing-pairs')}
          className="p-2 -ml-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {pair.word1} vs {pair.word2}
        </h1>
      </div>

      {/* Full card with quiz */}
      <ConfusingPairCard pair={pair} showQuiz />

      {/* Related pairs */}
      {related.length > 0 && (
        <div className="pt-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Cặp từ liên quan</p>
          <div className="flex flex-wrap gap-2">
            {related.map(p => (
              <button
                key={p.id}
                onClick={() => navigate(`/word-usage/confusing-pairs/${p.id}`)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {p.word1} / {p.word2}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
