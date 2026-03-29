import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { enrichWord, type EnrichedWordData } from '../../../services/enrichmentService';
import {
  enrichWordData,
  needsReEnrichment,
  forceReEnrich,
  regenerateMnemonic,
} from '../../../services/wordEnrichmentService';
import type { EnrichedWordData as AIEnrichedData } from '../../../db/models';
import type { VocabWord } from '../../../lib/types';
import { AudioButton } from '../../../components/common/AudioButton';
import { WordImage } from './WordImage';
import { ActiveRecallBanner } from './ActiveRecallBanner';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/database';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Card } from '../../../components/ui/Card';
import { useContextProgress } from '../hooks/useContextProgress';
import { cn } from '../../../lib/utils';
import { CONTEXT_ICONS, CONTEXT_LABELS } from '../constants/context';

const MNEMONIC_TYPE_LABELS: Record<string, string> = {
  sound: 'Li\u00EAn t\u01B0\u1EDFng \u00E2m',
  visual: 'H\u00ECnh \u1EA3nh',
  breakdown: 'T\u00E1ch t\u1EEB',
  rhyme: 'V\u1EA7n \u0111i\u1EC7u',
};

interface WordDetailProps {
  word: VocabWord;
  topicId?: string;
}

export function WordDetail({ word, topicId }: WordDetailProps) {
  const [enriched, setEnriched] = useState<EnrichedWordData | null>(null);
  const [aiData, setAiData] = useState<AIEnrichedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const wordId = `${topicId ?? 'unknown'}:${word.word}`;
  const { mastery } = useContextProgress(wordId);
  const wordProgress = useLiveQuery(() => db.wordProgress.get(wordId), [wordId]);
  const hasBeenStudied = (wordProgress?.repetitions ?? 0) >= 1;

  // Reset revealed state when word changes; auto-reveal for new words (no active recall needed)
  useEffect(() => {
    setRevealed(!hasBeenStudied);
  }, [word.word, hasBeenStudied]);

  // Fetch dictionary enrichment + AI enrichment in parallel
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setAiLoading(true);

    enrichWord(word.word).then((data) => {
      if (cancelled) return;
      setEnriched(data);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });

    enrichWordData(word.word, word.meaning).then((data) => {
      if (cancelled) return;
      // Lazy migration: if cached data missing P10-2 fields, re-enrich
      if (data && needsReEnrichment(data)) {
        forceReEnrich(word.word, word.meaning).then((fresh) => {
          if (cancelled) return;
          setAiData(needsReEnrichment(fresh) ? data : fresh);
          setAiLoading(false);
        }).catch(() => {
          if (cancelled) return;
          setAiData(data); // keep old data on failure
          setAiLoading(false);
        });
      } else {
        setAiData(data);
        setAiLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setAiLoading(false);
    });

    return () => { cancelled = true; };
  }, [word.word, word.meaning]);

  const handleRegenerateMnemonic = useCallback(async () => {
    setRegenerating(true);
    const result = await regenerateMnemonic(word.word, word.meaning);
    if (result) {
      setAiData((prev) => prev ? { ...prev, mnemonic: result.mnemonic, mnemonicType: result.mnemonicType } : prev);
    }
    setRegenerating(false);
  }, [word.word, word.meaning]);

  const audioUrl = enriched?.audioUrl ?? word.audioUrl;

  // Determine which examples to show
  const richExamples = aiData?.richExamples;
  const fallbackExamples = aiData?.examples;

  return (
    <div className="space-y-4">
      {/* Header — always visible: word + IPA + audio (NO meaning when unrevealed) */}
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{word.word}</h1>
            <p className="text-sm text-gray-400 font-mono mt-0.5">{word.ipa}</p>
            <AnimatePresence>
              {revealed && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1"
                >
                  {word.meaning}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <AudioButton word={word.word} audioUrl={audioUrl} size="md" />
        </div>
        <AnimatePresence>
          {revealed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-sm text-gray-500 dark:text-gray-400 italic mt-3"
            >
              &quot;{word.example}&quot;
            </motion.p>
          )}
        </AnimatePresence>
      </Card>

      {/* Active Recall Banner — only for previously studied words */}
      {hasBeenStudied && (
        <ActiveRecallBanner
          key={wordId}
          wordId={wordId}
          word={word.word}
          onReveal={() => setRevealed(true)}
        />
      )}

      {/* Everything below only shows after user reveals */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-4"
          >
            {/* Word Image */}
            <div className="flex justify-center">
              <WordImage word={word.word} meaning={word.meaning} topicId={topicId} size="lg" className="rounded-2xl shadow-sm" />
            </div>

            {/* Memory Hook */}
            {aiLoading ? (
              <Skeleton className="h-20" />
            ) : aiData?.mnemonic ? (
              <Card>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                        {'\u{1F4A1}'} M\u1EB9o ghi nh\u1EDB
                      </h2>
                      {aiData.mnemonicType && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          {MNEMONIC_TYPE_LABELS[aiData.mnemonicType] ?? aiData.mnemonicType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {aiData.mnemonic}
                    </p>
                  </div>
                  <button
                    onClick={handleRegenerateMnemonic}
                    disabled={regenerating}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-50"
                  >
                    <svg
                      className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {regenerating ? '\u0110ang t\u1EA1o...' : 'T\u1EA1o m\u1EDBi'}
                  </button>
                </div>
              </Card>
            ) : null}

            {/* Rich Examples with Context Mastery indicators */}
            {aiLoading ? (
              <Skeleton className="h-40" />
            ) : richExamples && richExamples.length > 0 ? (
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">Examples</h2>
                  {/* Context mastery progress */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">Context</span>
                    <div className="flex gap-0.5">
                      {(['daily', 'work', 'social', 'formal', 'dialogue'] as const).map((ctx) => (
                        <div
                          key={ctx}
                          title={`${CONTEXT_LABELS[ctx]}: ${mastery.contextsCorrect.includes(ctx) ? 'Mastered' : 'Not yet'}`}
                          className={cn(
                            'w-2 h-2 rounded-full transition-colors',
                            mastery.contextsCorrect.includes(ctx)
                              ? 'bg-emerald-500 dark:bg-emerald-400'
                              : 'bg-gray-200 dark:bg-gray-700'
                          )}
                        />
                      ))}
                    </div>
                    {mastery.contextMastered && (
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{'\u2713'}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {richExamples.map((ex, i) => {
                    const isContextMastered = mastery.contextsCorrect.includes(ex.context);
                    return (
                      <div
                        key={i}
                        className={cn(
                          'flex gap-2.5 w-full text-left rounded-lg px-2 py-1.5 -mx-2 transition-colors',
                          isContextMastered
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                            : ''
                        )}
                      >
                        <span
                          className={cn(
                            'shrink-0 text-base mt-0.5 transition-opacity',
                            isContextMastered ? 'opacity-100' : 'opacity-60'
                          )}
                          title={`${CONTEXT_LABELS[ex.context]}${isContextMastered ? ' \u2714' : ''}`}
                        >
                          {CONTEXT_ICONS[ex.context]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{ex.sentence}</p>
                          {ex.translation && (
                            <p className="text-xs text-gray-400 mt-0.5">{ex.translation}</p>
                          )}
                        </div>
                        {isContextMastered && (
                          <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ) : fallbackExamples && fallbackExamples.length > 0 ? (
              <Card>
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wide">Examples</h2>
                <ul className="space-y-2">
                  {fallbackExamples.map((ex, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-4 relative before:content-['\2022'] before:absolute before:left-0 before:text-gray-400">
                      {ex}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {/* Dictionary definitions */}
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-32" />
                <Skeleton className="h-24" />
              </div>
            ) : enriched && enriched.definitions.length > 0 ? (
              <Card>
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wide">Dictionary</h2>
                {enriched.definitions.map((def, i) => (
                  <div key={i} className="mb-3">
                    <span className="text-xs text-indigo-500 font-semibold uppercase">{def.partOfSpeech}</span>
                    <div className="mt-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{def.definition}</p>
                      {def.example && (
                        <p className="text-xs text-gray-400 italic mt-0.5">&quot;{def.example}&quot;</p>
                      )}
                    </div>
                  </div>
                ))}
              </Card>
            ) : (
              <Card>
                <p className="text-sm text-gray-400 text-center py-4">No dictionary entry found</p>
              </Card>
            )}

            {/* Synonyms */}
            {!loading && enriched && enriched.synonyms.length > 0 && (
              <Card>
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wide">Synonyms</h2>
                <div className="flex flex-wrap gap-2">
                  {enriched.synonyms.map((syn) => (
                    <span
                      key={syn}
                      className="px-3 py-1 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
