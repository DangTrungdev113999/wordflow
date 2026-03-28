import { useState, useMemo } from 'react';
import { ArrowLeft, Puzzle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../../lib/utils';
import { ALL_SENTENCE_TOPICS } from '../../data/sentences/_index';
import { SentenceBuildingExercise } from './SentenceBuildingExercise';
import { SentenceBuildingSummary } from './SentenceBuildingSummary';
import { useSentenceBuilding } from './useSentenceBuilding';
import { useProgressStore } from '../../stores/progressStore';
import type { CEFRLevel, SentenceBuildingExercise as Exercise } from '../../lib/types';

type Difficulty = 'all' | 'easy' | 'medium' | 'hard';
type ViewState = 'topics' | 'exercise' | 'summary';

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  all: { label: 'All Levels', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' },
  easy: { label: 'Easy', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
  medium: { label: 'Medium', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  hard: { label: 'Hard', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
};

const TOPIC_ICONS: Record<string, string> = {
  'daily-life': '🏠',
  travel: '✈️',
  'food-drink': '🍽️',
  work: '💼',
};

function TopicSelector({
  onSelect,
  difficulty,
  onDifficultyChange,
}: {
  onSelect: (exercises: Exercise[]) => void;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
}) {
  const filteredTopics = useMemo(() => {
    return ALL_SENTENCE_TOPICS.map((topic) => ({
      ...topic,
      sentences:
        difficulty === 'all'
          ? topic.sentences
          : topic.sentences.filter((s) => s.difficulty === difficulty),
    }));
  }, [difficulty]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
          <Puzzle size={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sentence Building</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Arrange words to build correct English sentences
        </p>
      </div>

      {/* Difficulty filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <Filter size={12} />
          <span>Difficulty</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(DIFFICULTY_CONFIG) as Array<Difficulty | 'all'>).map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d as Difficulty)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                difficulty === d
                  ? 'border-indigo-300 dark:border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-800 ' + DIFFICULTY_CONFIG[d].color
                  : 'border-transparent ' + DIFFICULTY_CONFIG[d].color + ' opacity-60 hover:opacity-100'
              )}
            >
              {DIFFICULTY_CONFIG[d].label}
            </button>
          ))}
        </div>
      </div>

      {/* Topic cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredTopics.map((topic) => {
          const count = topic.sentences.length;
          const icon = TOPIC_ICONS[topic.topic] ?? '📝';
          return (
            <button
              key={topic.topic}
              onClick={() => count > 0 && onSelect(topic.sentences)}
              disabled={count === 0}
              className={cn(
                'group text-left p-4 rounded-2xl border transition-all',
                count > 0
                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md cursor-pointer'
                  : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 cursor-not-allowed opacity-50'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {topic.topicLabel}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {count} sentence{count !== 1 ? 's' : ''} available
                  </p>
                </div>
                <div className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors">
                  →
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExerciseView({
  exercises,
  onComplete,
  onBack,
}: {
  exercises: Exercise[];
  onComplete: () => void;
  onBack: () => void;
}) {
  const hook = useSentenceBuilding(exercises);
  const addXP = useProgressStore((s) => s.addXP);

  if (hook.isComplete) {
    addXP(hook.totalXP);
    return (
      <SentenceBuildingSummary
        results={hook.results}
        exercises={hook.exercises}
        totalScore={hook.totalScore}
        totalXP={hook.totalXP}
        onBack={onBack}
      />
    );
  }

  if (!hook.currentExercise) return null;

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to topics
      </button>

      <SentenceBuildingExercise exercise={hook.currentExercise} state={hook} />
    </div>
  );
}

export function SentenceBuildingPage() {
  const [view, setView] = useState<ViewState>('topics');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [exerciseKey, setExerciseKey] = useState(0);

  const handleSelectTopic = (exercises: Exercise[]) => {
    setSelectedExercises(exercises);
    setExerciseKey((k) => k + 1);
    setView('exercise');
  };

  const handleBack = () => {
    setView('topics');
    setSelectedExercises([]);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {view === 'topics' && (
        <TopicSelector
          onSelect={handleSelectTopic}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
      )}
      {view === 'exercise' && (
        <ExerciseView
          key={exerciseKey}
          exercises={selectedExercises}
          onComplete={() => setView('topics')}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
