import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Check, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DropZone } from './DropZone';
import { BankWordChip, DragOverlayChip } from './WordChip';
import { HintButton } from './HintButton';
import type { SentenceBuildingExercise as Exercise } from '../../lib/types';
import type { useSentenceBuilding } from './useSentenceBuilding';

type HookReturn = ReturnType<typeof useSentenceBuilding>;

interface SentenceBuildingExerciseProps {
  exercise: Exercise;
  state: Pick<
    HookReturn,
    | 'bankWords'
    | 'placedWords'
    | 'hintsUsed'
    | 'wrongWordIds'
    | 'checkResult'
    | 'currentIndex'
    | 'exercises'
    | 'moveToZone'
    | 'moveToBank'
    | 'reorderPlaced'
    | 'checkAnswer'
    | 'useHint'
    | 'nextExercise'
  >;
}

export function SentenceBuildingExercise({ exercise, state }: SentenceBuildingExerciseProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const activeWord =
    state.bankWords.find((w) => w.id === activeId) ??
    state.placedWords.find((w) => w.id === activeId) ??
    null;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over) return;

      const activeIdStr = active.id as string;
      const overIdStr = over.id as string;

      const isFromBank = state.bankWords.some((w) => w.id === activeIdStr);
      const isInZone = state.placedWords.some((w) => w.id === activeIdStr);

      if (isFromBank) {
        // Dragged from bank → drop zone
        if (overIdStr === 'drop-zone' || state.placedWords.some((w) => w.id === overIdStr)) {
          state.moveToZone(activeIdStr);
        }
      } else if (isInZone) {
        // Reorder within zone
        const oldIndex = state.placedWords.findIndex((w) => w.id === activeIdStr);
        const newIndex = state.placedWords.findIndex((w) => w.id === overIdStr);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          state.reorderPlaced(oldIndex, newIndex);
        }
      }
    },
    [state]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const correctWordCount = exercise.sentence.replace(/[.!?]+$/, '').split(/\s+/).length;
  const maxHints = Math.min(3, Math.ceil(correctWordCount / 3));
  const progress = ((state.currentIndex + 1) / state.exercises.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Question {state.currentIndex + 1} / {state.exercises.length}</span>
          <span className="capitalize text-gray-600 dark:text-gray-300 font-medium">{exercise.difficulty}</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Translation hint */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-violet-100 dark:border-violet-800/50">
        <p className="text-xs font-medium text-violet-500 dark:text-violet-400 uppercase tracking-wider mb-1">
          Translate to English
        </p>
        <p className="text-gray-800 dark:text-gray-200 font-medium">{exercise.translation}</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Drop Zone */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Your sentence
          </label>
          <DropZone
            placedWords={state.placedWords}
            wrongWordIds={state.wrongWordIds}
            onRemoveWord={state.moveToBank}
          />
        </div>

        {/* Word Bank */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Word Bank
          </label>
          <div
            className={cn(
              'min-h-[80px] rounded-2xl p-4 border border-gray-200 dark:border-gray-700',
              'bg-white dark:bg-gray-900',
              state.bankWords.length === 0 && 'flex items-center justify-center'
            )}
          >
            {state.bankWords.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">All words placed!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {state.bankWords.map((word) => (
                  <BankWordChip
                    key={word.id}
                    id={word.id}
                    word={word.word}
                    onClick={() => state.moveToZone(word.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeWord ? <DragOverlayChip word={activeWord.word} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Result feedback */}
      {state.checkResult === 'correct' && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-center">
          <p className="text-emerald-700 dark:text-emerald-300 font-semibold text-lg">Correct!</p>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-1">
            {exercise.sentence}
          </p>
        </div>
      )}

      {state.checkResult === 'wrong' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-center">
          <p className="text-red-700 dark:text-red-300 font-semibold">Not quite right</p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
            Check the highlighted words and try again
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <HintButton
          hintsUsed={state.hintsUsed}
          maxHints={maxHints}
          onHint={state.useHint}
          disabled={state.checkResult === 'correct'}
        />

        <div className="flex items-center gap-2">
          {state.checkResult === 'correct' ? (
            <button
              onClick={state.nextExercise}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              {state.currentIndex + 1 < state.exercises.length ? (
                <>
                  Next <ArrowRight size={16} />
                </>
              ) : (
                'See Results'
              )}
            </button>
          ) : (
            <button
              onClick={state.checkAnswer}
              disabled={state.placedWords.length === 0}
              className={cn(
                'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm',
                state.placedWords.length > 0
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              )}
            >
              <Check size={16} /> Check
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
