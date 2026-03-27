import { useParams, Link } from 'react-router';
import { ArrowLeft, Play } from 'lucide-react';
import { useVocabularyStore } from '../../../stores/vocabularyStore';
import { WordCard } from '../components/WordCard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { TOPIC_ICONS } from '../../../lib/constants';

export function TopicPage() {
  const { topic } = useParams<{ topic: string }>();
  const { topics, wordProgressMap } = useVocabularyStore();
  const topicData = topics.find((t) => t.topic === topic);

  if (!topicData) {
    return (
      <div className="px-4 py-6 text-center text-gray-500">
        Topic not found.{' '}
        <Link to="/vocabulary" className="text-indigo-500">Go back</Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/vocabulary" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{TOPIC_ICONS[topicData.topic] ?? '📝'}</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{topicData.topicLabel}</h1>
            <Badge label={topicData.cefrLevel} variant="cefr" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{topicData.words.length} words</p>
        </div>
      </div>

      {/* Start button */}
      <Link to={`/vocabulary/${topic}/learn`} className="block">
        <Button size="lg" className="w-full gap-2">
          <Play size={18} />
          Start Flashcards
        </Button>
      </Link>

      {/* Word list */}
      <div className="space-y-2">
        {topicData.words.map((word) => {
          const wordId = `${topic}:${word.word}`;
          const progress = wordProgressMap[wordId];
          return (
            <WordCard
              key={word.word}
              word={word}
              status={progress?.status ?? 'new'}
            />
          );
        })}
      </div>
    </div>
  );
}
