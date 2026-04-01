import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCustomFlashcard } from '../hooks/useCustomFlashcard';
import { useEnrichedAudio } from '../../../hooks/useEnrichedAudio';
import { useMnemonicForWord } from '../hooks/useMnemonicForWord';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { SessionSummary } from '../components/SessionSummary';
import { getWeakWords, getSessionWeakWords, type WeakWord } from '../../../services/weakWordsService';

export function CustomFlashcardPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const numericId = Number(topicId);

  const {
    topic,
    currentWord,
    isFlipped,
    flipCard,
    handleRate,
    sessionStats,
    sessionResults,
    isSessionComplete,
    flashcardQueue,
    currentCardIndex,
    sessionXP,
  } = useCustomFlashcard(numericId);

  const { getAudioUrl } = useEnrichedAudio(flashcardQueue, currentCardIndex);
  const [weakWords, setWeakWords] = useState<WeakWord[]>([]);
  const { mnemonic, mnemonicType } = useMnemonicForWord(currentWord ?? null);

  useEffect(() => {
    if (!isSessionComplete) return;
    getWeakWords().then((allWeak) => {
      setWeakWords(getSessionWeakWords(sessionResults, allWeak));
    });
  }, [isSessionComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!topic) {
    return <div className="p-6 text-center text-gray-700 dark:text-gray-300">Loading...</div>;
  }

  if (isSessionComplete) {
    const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
    return (
      <SessionSummary
        correct={sessionStats.correct}
        total={sessionStats.total}
        accuracy={accuracy}
        xpEarned={sessionXP}
        weakWords={weakWords}
        onBack={() => navigate(`/vocabulary/custom/${topicId}`)}
        onRetry={() => navigate(0)}
      />
    );
  }

  if (!currentWord) {
    return <div className="p-6 text-center text-gray-600 dark:text-gray-400">No cards due for review.</div>;
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/vocabulary/custom/${topicId}`} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <h1 className="font-semibold text-gray-900 dark:text-white">
          {topic.icon} {topic.name}
        </h1>
      </div>
      <FlashcardDeck
        word={{ ...currentWord, audioUrl: getAudioUrl(currentWord) }}
        isFlipped={isFlipped}
        onFlip={flipCard}
        onRate={handleRate}
        cardIndex={currentCardIndex}
        total={flashcardQueue.length}
        wordId={`custom-${topicId}:${currentWord.word}`}
        mnemonic={mnemonic}
        mnemonicType={mnemonicType}
      />
    </div>
  );
}
