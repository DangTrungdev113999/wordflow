import { useMemo, useState } from 'react';

/**
 * Simple string-includes search for small datasets (~350 items).
 * Returns filtered items + search state.
 */
export function useUsageSearch<T>(
  items: T[],
  getSearchableText: (item: T) => string,
) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item => getSearchableText(item).toLowerCase().includes(q));
  }, [items, search, getSearchableText]);

  return { search, setSearch, filtered } as const;
}
