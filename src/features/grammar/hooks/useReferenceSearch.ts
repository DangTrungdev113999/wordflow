import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

interface UseReferenceSearchOptions<T> {
  debounceMs?: number;
  filterFn?: (item: T, filters: Record<string, string>) => boolean;
  sortFn?: (a: T, b: T, sortBy: string) => number;
}

interface UseReferenceSearchReturn<T> {
  query: string;
  setQuery: (q: string) => void;
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  results: T[];
  resultCount: number;
}

export function useReferenceSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  options?: UseReferenceSearchOptions<T>
): UseReferenceSearchReturn<T> {
  const { debounceMs = 300, filterFn, sortFn } = options ?? {};

  const [query, setQueryRaw] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const setQuery = useCallback(
    (q: string) => {
      setQueryRaw(q);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setDebouncedQuery(q), debounceMs);
    },
    [debounceMs]
  );

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => {
      if (!value || value === 'all') {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setQueryRaw('');
    setDebouncedQuery('');
  }, []);

  const results = useMemo(() => {
    let filtered = items;

    // Text search
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        searchFields.some((field) => {
          const val = item[field];
          if (typeof val === 'string') return val.toLowerCase().includes(q);
          if (Array.isArray(val)) return val.some((v) => String(v).toLowerCase().includes(q));
          return false;
        })
      );
    }

    // Custom filter
    if (filterFn && Object.keys(filters).length > 0) {
      filtered = filtered.filter((item) => filterFn(item, filters));
    }

    // Custom sort
    if (sortFn && sortBy) {
      filtered = [...filtered].sort((a, b) => sortFn(a, b, sortBy));
    }

    return filtered;
  }, [items, debouncedQuery, searchFields, filters, filterFn, sortBy, sortFn]);

  return {
    query,
    setQuery,
    filters,
    setFilter,
    clearFilters,
    sortBy,
    setSortBy,
    results,
    resultCount: results.length,
  };
}
