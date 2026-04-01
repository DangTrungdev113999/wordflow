import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Play } from 'lucide-react';
import { useVocabularyStore } from '../../../stores/vocabularyStore';
import { useTopicProgress } from '../hooks/useTopicProgress';
import { prefetchTopicImages } from '../../../services/wordImageService';
import { TopicHeader } from '../components/TopicHeader';
import { WordFilterBar, type WordFilter, type WordSort } from '../components/WordFilterBar';
import { WordCard } from '../components/WordCard';
import { Button } from '../../../components/ui/Button';
import { SessionPicker } from '../components/SessionPicker';

export function TopicPage() {
  const { topic } = useParams<{ topic: string }>();
  const { topics, wordProgressMap } = useVocabularyStore();
  const topicData = topics.find((t) => t.topic === topic);

  const [filter, setFilter] = useState<WordFilter>('all');
  const [sort, setSort] = useState<WordSort>('alpha');
  const [showPicker, setShowPicker] = useState(false);

  // Build stable word keys for progress query
  const wordKeys = useMemo(
    () => topicData?.words.map((w) => `${topic}:${w.word}`) ?? [],
    [topicData, topic],
  );

  const progress = useTopicProgress(topic ?? '', wordKeys);

  // Prefetch images for this topic's words in background
  // prefetchTopicImages auto-cancels previous prefetch when called again
  useEffect(() => {
    if (!topicData || !topic) return;
    const words = topicData.words.map((w) => ({ word: w.word, meaning: w.meaning }));
    prefetchTopicImages(words, topic);
  }, [topicData, topic]);

  // Filter counts
  const counts = useMemo(() => {
    if (!topicData) return { all: 0, new: 0, learning: 0, review: 0, mastered: 0 };
    const c = { all: topicData.words.length, new: 0, learning: 0, review: 0, mastered: 0 };
    for (const w of topicData.words) {
      const status = wordProgressMap[`${topic}:${w.word}`]?.status ?? 'new';
      c[status]++;
    }
    return c;
  }, [topicData, topic, wordProgressMap]);

  // Filtered + sorted words
  const displayWords = useMemo(() => {
    if (!topicData) return [];
    let words = topicData.words.map((w) => ({
      ...w,
      status: (wordProgressMap[`${topic}:${w.word}`]?.status ?? 'new') as WordFilter,
      lastReview: wordProgressMap[`${topic}:${w.word}`]?.lastReview ?? 0,
    }));

    // Apply filter
    if (filter !== 'all') {
      words = words.filter((w) => w.status === filter);
    }

    // Apply sort
    switch (sort) {
      case 'alpha':
        words.sort((a, b) => a.word.localeCompare(b.word));
        break;
      case 'mastery': {
        const ORDER = { new: 0, learning: 1, review: 2, mastered: 3 };
        words.sort((a, b) => ORDER[a.status as keyof typeof ORDER] - ORDER[b.status as keyof typeof ORDER]);
        break;
      }
      case 'frequency':
        words.sort((a, b) => (b.lastReview || 0) - (a.lastReview || 0));
        break;
    }

    return words;
  }, [topicData, topic, wordProgressMap, filter, sort]);

  if (!topicData) {
    return (
      <div className="px-4 py-6 text-center text-gray-700 dark:text-gray-300">
        Topic not found.{' '}
        <Link to="/vocabulary" className="text-indigo-500">Go back</Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4 max-w-2xl mx-auto">
      <TopicHeader
        topic={topicData.topic}
        topicLabel={topicData.topicLabel}
        cefrLevel={topicData.cefrLevel}
        wordCount={topicData.words.length}
        progress={progress}
      />

      {/* Start button */}
      <Button size="lg" className="w-full gap-2" onClick={() => setShowPicker(true)}>
        <Play size={18} />
        Start Learning
      </Button>

      <SessionPicker
        topicId={topic!}
        wordCount={topicData.words.length}
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onStart={() => setShowPicker(false)}
      />

      {/* Filter + sort */}
      <WordFilterBar
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
        counts={counts}
      />

      {/* Word list */}
      <div className="space-y-2">
        {displayWords.length === 0 && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 py-8">
            No words match this filter.
          </p>
        )}
        {displayWords.map((word) => (
          <WordCard
            key={word.word}
            word={word}
            status={word.status === 'all' ? 'new' : word.status}
            topicId={topic}
          />
        ))}
      </div>
    </div>
  );
}
