import { useState, useEffect, useCallback } from 'react';
import { enrichWord, type EnrichedWordData } from '../../../services/enrichmentService';
import {
  enrichWordData,
  needsReEnrichment,
  forceReEnrich,
  regenerateMnemonic,
} from '../../../services/wordEnrichmentService';
import type { EnrichedWordData as AIEnrichedData, EnrichedExample } from '../../../db/models';
import type { VocabWord } from '../../../lib/types';
import { AudioButton } from '../../../components/common/AudioButton';
import { WordImage } from './WordImage';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Card } from '../../../components/ui/Card';

const CONTEXT_ICONS: Record<EnrichedExample['context'], string> = {
  daily: '\u{1F3E0}',
  work: '\u{1F4BC}',
  social: '\u{1F4AC}',
  formal: '\u{1F4F0}',
  dialogue: '\u{1F5E3}\uFE0F',
};

const CONTEXT_LABELS: Record<EnrichedExample['context'], string> = {
  daily: 'Daily',
  work: 'Work',
  social: 'Social',
  formal: 'Formal',
  dialogue: 'Dialogue',
};

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

  // Fetch dictionary enrichment + AI enrichment in parallel
  useEffect(() => {
    setLoading(true);
    setAiLoading(true);

    enrichWord(word.word).then((data) => {
      setEnriched(data);
      setLoading(false);
    });

    enrichWordData(word.word, word.meaning).then((data) => {
      // Lazy migration: if cached data missing P10-2 fields, re-enrich
      if (data && needsReEnrichment(data)) {
        forceReEnrich(word.word, word.meaning).then((fresh) => {
          setAiData(fresh);
          setAiLoading(false);
        });
      } else {
        setAiData(data);
        setAiLoading(false);
      }
    });
  }, [word.word, word.meaning]);

  const handleRegenerateMnemonic = useCallback(async () => {
    setRegenerating(true);
    const result = await regenerateMnemonic(word.word, word.meaning);
    if (result && aiData) {
      setAiData({ ...aiData, mnemonic: result.mnemonic, mnemonicType: result.mnemonicType });
    }
    setRegenerating(false);
  }, [word.word, word.meaning, aiData]);

  const audioUrl = enriched?.audioUrl ?? word.audioUrl;

  // Determine which examples to show
  const richExamples = aiData?.richExamples;
  const fallbackExamples = aiData?.examples;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{word.word}</h1>
            <p className="text-sm text-gray-400 font-mono mt-0.5">{word.ipa}</p>
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">{word.meaning}</p>
          </div>
          <AudioButton word={word.word} audioUrl={audioUrl} size="md" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-3">&quot;{word.example}&quot;</p>
      </Card>

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
                  M\u1EB9o ghi nh\u1EDB
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
              className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-50"
              title="T\u1EA1o m\u1EB9o m\u1EDBi"
            >
              <svg
                className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </Card>
      ) : null}

      {/* Rich Examples (P10-2) or fallback examples */}
      {aiLoading ? (
        <Skeleton className="h-40" />
      ) : richExamples && richExamples.length > 0 ? (
        <Card>
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wide">Examples</h2>
          <div className="space-y-3">
            {richExamples.map((ex, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="shrink-0 text-base mt-0.5" title={CONTEXT_LABELS[ex.context]}>
                  {CONTEXT_ICONS[ex.context]}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{ex.sentence}</p>
                  {ex.translation && (
                    <p className="text-xs text-gray-400 mt-0.5">{ex.translation}</p>
                  )}
                </div>
              </div>
            ))}
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
    </div>
  );
}
