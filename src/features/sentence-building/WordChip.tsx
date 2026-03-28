import { useSortable } from '@dnd-kit/sortable';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../lib/utils';

interface WordChipProps {
  id: string;
  word: string;
  isHinted?: boolean;
  isWrong?: boolean;
  isDragging?: boolean;
  variant: 'bank' | 'zone';
  onClick?: () => void;
}

export function BankWordChip({ id, word, onClick }: { id: string; word: string; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        'select-none cursor-grab active:cursor-grabbing',
        'px-4 py-2.5 rounded-xl text-sm font-medium',
        'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
        'text-gray-800 dark:text-gray-200',
        'shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600',
        'transition-all duration-150',
        'touch-manipulation',
        isDragging && 'opacity-30 scale-95'
      )}
    >
      {word}
    </div>
  );
}

export function ZoneWordChip({ id, word, isHinted, isWrong, onClick }: Omit<WordChipProps, 'variant' | 'isDragging'>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: isHinted,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={isHinted ? undefined : onClick}
      className={cn(
        'select-none px-4 py-2.5 rounded-xl text-sm font-medium',
        'transition-all duration-150 touch-manipulation',
        isHinted && 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-400 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 cursor-default',
        isWrong && !isHinted && 'bg-red-50 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 cursor-grab active:cursor-grabbing animate-shake',
        !isHinted && !isWrong && 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 cursor-grab active:cursor-grabbing hover:bg-indigo-100 dark:hover:bg-indigo-900/50',
        isDragging && 'opacity-30 scale-95',
      )}
    >
      <span className="flex items-center gap-1.5">
        {isHinted && <span className="text-emerald-500">✓</span>}
        {word}
      </span>
    </div>
  );
}

export function DragOverlayChip({ word }: { word: string }) {
  return (
    <div className="px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-100 dark:bg-indigo-800 border-2 border-indigo-400 dark:border-indigo-500 text-indigo-800 dark:text-indigo-100 shadow-lg scale-105 cursor-grabbing">
      {word}
    </div>
  );
}
