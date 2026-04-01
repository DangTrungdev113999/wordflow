import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '../../lib/utils';
import { ZoneWordChip } from './WordChip';
import type { WordItem } from '../../lib/types';

interface DropZoneProps {
  placedWords: WordItem[];
  wrongWordIds: Set<string>;
  onRemoveWord: (id: string) => void;
}

export function DropZone({ placedWords, wrongWordIds, onRemoveWord }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id: 'drop-zone' });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[120px] rounded-2xl border-2 border-dashed p-4 transition-all duration-200',
        placedWords.length === 0 && 'flex items-center justify-center',
        isOver
          ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
          : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50',
      )}
    >
      {placedWords.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Drag words here to build the sentence
        </p>
      ) : (
        <SortableContext items={placedWords.map((w) => w.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex flex-wrap gap-2">
            {placedWords.map((word) => (
              <ZoneWordChip
                key={word.id}
                id={word.id}
                word={word.word}
                isHinted={word.isHinted}
                isWrong={wrongWordIds.has(word.id)}
                onClick={() => onRemoveWord(word.id)}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
