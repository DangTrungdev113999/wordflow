import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { MultiMeaningCard } from '../components/MultiMeaningCard';
import { AudioButton } from '../../../components/common/AudioButton';
import { MULTI_MEANING_SEEDS } from '../../../data/multiMeaningSeeds';

export function MultiMeaningDetailPage() {
  const { word } = useParams<{ word: string }>();
  const navigate = useNavigate();

  if (!word) return null;

  const decodedWord = decodeURIComponent(word);
  const seedData = MULTI_MEANING_SEEDS.find(s => s.word.toLowerCase() === decodedWord.toLowerCase());

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/word-usage/multi-meaning')}
          className="p-2 -ml-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{decodedWord}</h1>
          <AudioButton word={decodedWord} size="md" />
        </div>
      </div>

      {/* Full MultiMeaningCard (not compact) */}
      <MultiMeaningCard word={decodedWord} compact={false} />

      {/* Navigation to related words */}
      {seedData && (
        <div className="pt-2">
          <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium mb-2">Xem thêm</p>
          <div className="flex flex-wrap gap-2">
            {MULTI_MEANING_SEEDS
              .filter(s => s.word !== decodedWord)
              .slice(0, 8)
              .map(s => (
                <button
                  key={s.word}
                  onClick={() => navigate(`/word-usage/multi-meaning/${encodeURIComponent(s.word)}`)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {s.word}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
