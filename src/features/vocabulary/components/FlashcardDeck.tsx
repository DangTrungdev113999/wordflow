import { FlipCard } from '../../../components/common/FlipCard';
import { AudioButton } from '../../../components/common/AudioButton';
import { PronunciationButton } from './PronunciationButton';
import { WordImage } from './WordImage';
import { Button } from '../../../components/ui/Button';
import type { VocabWord } from '../../../lib/types';
import { cn } from '../../../lib/utils';

interface FlashcardDeckProps {
  word: VocabWord;
  isFlipped: boolean;
  onFlip: () => void;
  onRate: (rating: 0 | 2 | 4 | 5) => void;
  cardIndex: number;
  total: number;
  wordId?: string;
  topicId?: string;
}

export function FlashcardDeck({ word, isFlipped, onFlip, onRate, cardIndex, total, wordId, topicId }: FlashcardDeckProps) {
  const progress = ((cardIndex + 1) / total) * 100;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Progress */}
      <div className="w-full flex items-center gap-3">
        <span className="text-sm text-gray-400">{cardIndex + 1}/{total}</span>
        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flip card */}
      <FlipCard
        isFlipped={isFlipped}
        onClick={onFlip}
        className="w-full h-[24rem]"
        front={
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 px-6 py-5">
            <WordImage
              word={word.word}
              meaning={word.meaning}
              topicId={topicId}
              size="lg"
              className="shadow-md shadow-black/10"
            />
            <span className="text-2xl font-bold text-white mt-1">{word.word}</span>
            <span className="text-indigo-200 text-sm font-mono -mt-0.5">{word.ipa}</span>
            <div className="flex items-center gap-2">
              <AudioButton word={word.word} audioUrl={word.audioUrl} className="bg-white/20 hover:bg-white/30 text-white hover:text-white" />
              <span className="text-indigo-200 text-xs">Tap to reveal</span>
            </div>
          </div>
        }
        back={
          <div className="w-full h-full bg-white dark:bg-gray-900 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center gap-3 shadow-lg p-6 text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{word.meaning}</p>
            <p className="text-sm text-gray-400 font-mono">{word.ipa}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">"{word.example}"</p>
            <div className="flex items-center gap-2 mt-2">
              <AudioButton word={word.word} audioUrl={word.audioUrl} size="sm" />
              {wordId && <PronunciationButton word={word.word} wordId={wordId} />}
            </div>
          </div>
        }
      />

      {/* Rating buttons — only visible when flipped */}
      <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-2 w-full transition-all duration-300', isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none')}>
        {([
          { rating: 0 as const, label: 'Again', color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' },
          { rating: 2 as const, label: 'Hard', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800' },
          { rating: 4 as const, label: 'Good', color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' },
          { rating: 5 as const, label: 'Easy', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' },
        ] as const).map(({ rating, label, color }) => (
          <button
            key={rating}
            onClick={() => onRate(rating)}
            className={cn('py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95', color)}
          >
            {label}
          </button>
        ))}
      </div>

      {!isFlipped && (
        <Button onClick={onFlip} size="lg" className="w-full">
          Reveal Answer
        </Button>
      )}
    </div>
  );
}
