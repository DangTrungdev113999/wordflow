import { useSyncExternalStore } from 'react';

function subscribe(cb: () => void) {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

function getIsDark() {
  return document.documentElement.classList.contains('dark');
}

export function useChartTheme() {
  const isDark = useSyncExternalStore(subscribe, getIsDark, () => false);

  return {
    grid: isDark ? '#374151' : '#e5e7eb',
    axis: isDark ? '#6b7280' : '#9ca3af',
    tooltipBg: '#1f2937',
    tooltipText: '#e5e7eb',
    polarGrid: isDark ? '#4b5563' : '#d1d5db',
    polarText: isDark ? '#9ca3af' : '#6b7280',
  };
}
