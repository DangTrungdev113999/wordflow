import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title="Toggle theme"
    >
      {theme === 'dark' ? (
        <Moon size={18} className="text-indigo-400" />
      ) : (
        <Sun size={18} className="text-yellow-500" />
      )}
    </button>
  );
}
