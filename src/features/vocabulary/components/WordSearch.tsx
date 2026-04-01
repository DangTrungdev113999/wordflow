import { useState, useCallback, useRef } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { searchWord, type DictionarySearchResult } from '../../../services/customTopicService';
import { AddWordCard } from './AddWordCard';

interface WordSearchProps {
  existingWords: Set<string>;
  onAdd: (result: DictionarySearchResult) => void;
}

export function WordSearch({ existingWords, onAdd }: WordSearchProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<DictionarySearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const doSearch = useCallback(async (word: string) => {
    const trimmed = word.trim();
    if (!trimmed) {
      setResult(null);
      setNotFound(false);
      return;
    }

    setSearching(true);
    setNotFound(false);
    setResult(null);

    const found = await searchWord(trimmed);
    setSearching(false);

    if (found) {
      setResult(found);
    } else {
      setNotFound(true);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    setNotFound(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 500);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      doSearch(query);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for a word to add..."
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-sm"
        />
        {searching && (
          <Loader2 size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-indigo-500 animate-spin" />
        )}
      </div>

      {result && (
        <AddWordCard
          key={result.word}
          result={result}
          alreadyAdded={existingWords.has(result.word.toLowerCase())}
          onAdd={onAdd}
        />
      )}

      {notFound && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm">
          <AlertCircle size={16} />
          <span>Word not found. Try a different spelling.</span>
        </div>
      )}
    </div>
  );
}
