import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useFlashcard } from '../hooks/useFlashcard';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { Button } from '../../../components/ui/Button';
import { motion } from 'framer-motion';

export function FlashcardPage() {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const {
    currentTopic,
    currentWord,
    isFlipped,
    flipCard,
    handleRate,
    sessionStats,
    isSessionComplete,
    flashcardQueue,
    currentCardIndex,
  } = useFlashcard(topic ?? '');

  if (!currentTopic) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (isSessionComplete) {
    const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-4 py-10 flex flex-col items-center gap-6 text-center max-w-md mx-auto"
      >
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Session Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{sessionStats.total} cards reviewed</p>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
            <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
            <p className="text-sm text-green-700 dark:text-green-400">Accuracy</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4">
            <p className="text-2xl font-bold text-indigo-600">{sessionStats.correct * 10}xp</p>
            <p className="text-sm text-indigo-700 dark:text-indigo-400">XP Earned</p>
          </div>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" className="flex-1" onClick={() => navigate(`/vocabulary/${topic}`)}>
            Word List
          </Button>
          <Button className="flex-1" onClick={() => navigate(0)}>
            Study Again
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!currentWord) {
    return <div className="p-6 text-center text-gray-400">No cards due for review.</div>;
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/vocabulary/${topic}`} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <h1 className="font-semibold text-gray-900 dark:text-white">{currentTopic.topicLabel}</h1>
      </div>
      <FlashcardDeck
        word={currentWord}
        isFlipped={isFlipped}
        onFlip={flipCard}
        onRate={handleRate}
        cardIndex={currentCardIndex}
        total={flashcardQueue.length}
      />
    </div>
  );
}
