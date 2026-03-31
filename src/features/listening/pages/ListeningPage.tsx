import { Headphones, ChevronRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { TOPIC_ICONS, TOPIC_COLORS } from '../../../lib/constants';
import { Badge } from '../../../components/ui/Badge';
import { DictationModeSelector } from '../components/DictationModeSelector';
import type { ListeningMode } from '../../../lib/types';

const VALID_MODES: ListeningMode[] = ['word', 'phrase', 'sentence', 'quiz', 'fill-blank', 'speed', 'listen-choose', 'conversation', 'story'];

function getModeUrl(topicSlug: string, mode: ListeningMode): string {
  switch (mode) {
    case 'fill-blank':    return `/listening/${topicSlug}/fill-blank`;
    case 'speed':         return `/listening/${topicSlug}/speed`;
    case 'listen-choose': return `/listening/${topicSlug}/listen-choose`;
    case 'conversation':  return `/listening/${topicSlug}/conversation`;
    case 'story':         return `/listening/${topicSlug}/story`;
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
};

export function ListeningPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawMode = searchParams.get('mode');
  const mode = VALID_MODES.includes(rawMode as ListeningMode) ? (rawMode as ListeningMode) : 'word';
  const setMode = (m: ListeningMode) => {
    setSearchParams(prev => { prev.set('mode', m); return prev; }, { replace: true });
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Headphones className="text-indigo-500" size={24} />
          Listening Practice
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{MODE_DESCRIPTIONS[mode]}</p>
      </div>

      <DictationModeSelector mode={mode} onChange={setMode} />

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
    </div>
  );
}
