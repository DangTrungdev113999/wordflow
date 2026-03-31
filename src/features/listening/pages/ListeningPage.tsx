import { Headphones, ChevronRight, Mic, Puzzle, Dumbbell, BookOpen, BarChart3 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { TOPIC_ICONS, TOPIC_COLORS } from '../../../lib/constants';
import { Badge } from '../../../components/ui/Badge';
import { DictationModeSelector } from '../components/DictationModeSelector';
import { cn } from '../../../lib/utils';
import { useProgressStore } from '../../../stores/progressStore';
import type { ListeningMode } from '../../../lib/types';

const VALID_MODES: ListeningMode[] = [
  'word', 'phrase', 'sentence',
  'quiz', 'fill-blank', 'listen-choose',
  'speed', 'accent',
  'conversation', 'story', 'note-taking',
];

function getModeUrl(topicSlug: string, mode: ListeningMode): string {
  switch (mode) {
    case 'fill-blank':    return `/listening/${topicSlug}/fill-blank`;
    case 'speed':         return `/listening/${topicSlug}/speed`;
    case 'listen-choose': return `/listening/${topicSlug}/listen-choose`;
    case 'conversation':  return `/listening/${topicSlug}/conversation`;
    case 'story':         return `/listening/${topicSlug}/story`;
    case 'accent':        return `/listening/${topicSlug}/accent`;
    case 'note-taking':   return `/listening/${topicSlug}/note-taking`;
    default:              return `/listening/${topicSlug}/practice?mode=${mode}`;
  }
}

const MODE_DESCRIPTIONS: Record<ListeningMode, string> = {
  word:            'Listen to words and type them',
  phrase:          'Listen to phrases and type them',
  sentence:        'Listen to full sentences',
  quiz:            'Multiple choice listening quiz',
  'fill-blank':    'Listen and fill missing words',
  'speed':         'Type at increasing speeds',
  'listen-choose': 'Listen and pick the right answer',
  'conversation':  'Listen to AI conversations and answer questions',
  'story':         'Listen to AI stories and test comprehension',
  'accent':        'Hear words in US, UK, AU accents',
  'note-taking':   'Listen and take notes, AI evaluates',
};

interface ModeCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const MODE_CATEGORIES: ModeCategory[] = [
  { id: 'dictation', label: 'Dictation', icon: <Mic size={14} />, color: 'text-indigo-600 dark:text-indigo-400' },
  { id: 'interactive', label: 'Interactive', icon: <Puzzle size={14} />, color: 'text-amber-600 dark:text-amber-400' },
  { id: 'challenge', label: 'Challenge', icon: <Dumbbell size={14} />, color: 'text-orange-600 dark:text-orange-400' },
  { id: 'comprehension', label: 'Comprehension', icon: <BookOpen size={14} />, color: 'text-teal-600 dark:text-teal-400' },
];

function getCategoryForMode(mode: ListeningMode): string {
  switch (mode) {
    case 'word': case 'phrase': case 'sentence': return 'dictation';
    case 'quiz': case 'fill-blank': case 'listen-choose': return 'interactive';
    case 'speed': case 'accent': return 'challenge';
    case 'conversation': case 'story': case 'note-taking': return 'comprehension';
    default: return 'dictation';
  }
}

// TODO: Implement ListeningStats tracking service (models.ts:290) to track
// per-mode sessions, correct counts, best streak, and accent exposure.
// Currently showing global XP as a placeholder until listening-specific tracking is added.

export function ListeningPage() {
  const { xp, todayXP, currentStreak } = useProgressStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawMode = searchParams.get('mode');
  const mode = VALID_MODES.includes(rawMode as ListeningMode) ? (rawMode as ListeningMode) : 'word';
  const setMode = (m: ListeningMode) => {
    setSearchParams(prev => { prev.set('mode', m); return prev; }, { replace: true });
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Headphones className="text-indigo-500" size={24} />
          Listening Practice
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{MODE_DESCRIPTIONS[mode]}</p>
      </div>

      {/* Category labels */}
      <div className="flex flex-wrap gap-1.5">
        {MODE_CATEGORIES.map(cat => {
          const isActive = getCategoryForMode(mode) === cat.id;
          return (
            <span
              key={cat.id}
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                isActive
                  ? `${cat.color} bg-gray-100 dark:bg-gray-800`
                  : 'text-gray-400 dark:text-gray-600',
              )}
            >
              {cat.icon}
              {cat.label}
            </span>
          );
        })}
      </div>

      {/* Mode selector */}
      <DictationModeSelector mode={mode} onChange={setMode} />

      {/* Topic list */}
      <div className="grid gap-3">
        {ALL_TOPICS.map((topic, i) => (
          <motion.div
            key={topic.topic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              to={getModeUrl(topic.topic, mode)}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-md group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${TOPIC_COLORS[topic.topic] ?? 'from-indigo-400 to-indigo-600'} flex items-center justify-center text-2xl shadow-sm`}>
                {TOPIC_ICONS[topic.topic] ?? '📝'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white">{topic.topicLabel}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{topic.words.length} words</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge label={topic.cefrLevel} variant="cefr" />
                <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats summary */}
      <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-3">
          <BarChart3 size={14} />
          Your Stats
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{xp.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total XP</p>
          </div>
          <div>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{todayXP}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Today XP</p>
          </div>
          <div>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{currentStreak}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}
