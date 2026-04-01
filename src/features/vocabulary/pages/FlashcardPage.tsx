import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFlashcard } from '../hooks/useFlashcard';
import { useEnrichedAudio } from '../../../hooks/useEnrichedAudio';
import { useMnemonicForWord } from '../hooks/useMnemonicForWord';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { SessionSummary } from '../components/SessionSummary';
import { StreakIndicator } from '../components/StreakIndicator';
import { getWeakWords, getSessionWeakWords, type WeakWord } from '../../../services/weakWordsService';

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
    sessionResults,
    isSessionComplete,
    flashcardQueue,
    currentCardIndex,
    sessionXP,
    xpBreakdown,
    streak,
    multiplier,
    bestStreak,
  } = useFlashcard(topic ?? '');

  const { getAudioUrl } = useEnrichedAudio(flashcardQueue, currentCardIndex);
  const [weakWords, setWeakWords] = useState<WeakWord[]>([]);
  const { mnemonic, mnemonicType } = useMnemonicForWord(currentWord ?? null);

  useEffect(() => {
    if (!isSessionComplete) return;
    getWeakWords().then((allWeak) => {
      setWeakWords(getSessionWeakWords(sessionResults, allWeak));
    });
    // Mistake emission is handled by useFlashcard hook
  }, [isSessionComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentTopic) {
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
        bestStreak={bestStreak}
        xpBreakdown={xpBreakdown}
        onPracticeWeakWords={
          weakWords.length > 0
            ? () => navigate(`/vocabulary/${topic}/learn?weak=true`)
            : undefined
        }
        onBack={() => navigate(`/vocabulary/${topic}`)}
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
        <Link to={`/vocabulary/${topic}`} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <h1 className="flex-1 font-semibold text-gray-900 dark:text-white">{currentTopic.topicLabel}</h1>
        <StreakIndicator streak={streak} multiplier={multiplier} />
      </div>
      <FlashcardDeck
        word={{ ...currentWord, audioUrl: getAudioUrl(currentWord) }}
        isFlipped={isFlipped}
        onFlip={flipCard}
        onRate={handleRate}
        cardIndex={currentCardIndex}
        total={flashcardQueue.length}
        wordId={`${topic}:${currentWord.word}`}
        topicId={topic}
        mnemonic={mnemonic}
        mnemonicType={mnemonicType}
      />
    </div>
  );
}
