import { useState, useEffect } from 'react';
import { lookupWord } from '../../../services/dictionaryApi';
import type { DictionaryEntry } from '../../../lib/types';
import type { VocabWord } from '../../../lib/types';
import { AudioButton } from '../../../components/common/AudioButton';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Card } from '../../../components/ui/Card';

interface WordDetailProps {
  word: VocabWord;
}

export function WordDetail({ word }: WordDetailProps) {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    lookupWord(word.word).then((entries) => {
      setEntry(entries?.[0] ?? null);
      setLoading(false);
    });
  }, [word.word]);

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
          <AudioButton word={word.word} audioUrl={word.audioUrl} size="md" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-3">"{word.example}"</p>
      </Card>

      {/* Dictionary definitions */}
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-24" />
        </div>
      ) : entry ? (
        <Card>
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wide">Dictionary</h2>
          {entry.meanings.slice(0, 3).map((meaning, i) => (
            <div key={i} className="mb-3">
              <span className="text-xs text-indigo-500 font-semibold uppercase">{meaning.partOfSpeech}</span>
              {meaning.definitions.slice(0, 2).map((def, j) => (
                <div key={j} className="mt-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{def.definition}</p>
                  {def.example && (
                    <p className="text-xs text-gray-400 italic mt-0.5">"{def.example}"</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-gray-400 text-center py-4">No dictionary entry found</p>
        </Card>
      )}
    </div>
  );
}
