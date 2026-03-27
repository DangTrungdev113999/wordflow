import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useVocabularyStore } from '../../../stores/vocabularyStore';
import { WordDetail } from '../components/WordDetail';

export function WordDetailPage() {
  const { word: wordParam } = useParams<{ word: string }>();
  const { topics } = useVocabularyStore();

  const wordData = topics
    .flatMap((t) => t.words.map((w) => ({ ...w, topic: t.topic })))
    .find((w) => w.word.toLowerCase() === wordParam?.toLowerCase());

  if (!wordData) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-gray-500">Word not found.</p>
        <Link to="/vocabulary" className="text-indigo-500 mt-2 block">Back to Vocabulary</Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Link to={`/vocabulary/${wordData.topic}`} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <h1 className="font-semibold text-gray-900 dark:text-white">Word Detail</h1>
      </div>
      <WordDetail word={wordData} />
    </div>
  );
}
