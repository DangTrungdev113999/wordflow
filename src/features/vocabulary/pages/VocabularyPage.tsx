import { BookOpen } from 'lucide-react';
import { useVocabularyStore } from '../../../stores/vocabularyStore';
import { TopicList } from '../components/TopicList';

export function VocabularyPage() {
  const { topics } = useVocabularyStore();

  return (
    <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="text-indigo-500" size={24} />
          Vocabulary
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Choose a topic to start learning</p>
      </div>
      <TopicList topics={topics} />
    </div>
  );
}
