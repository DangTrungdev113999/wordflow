import { NavLink } from 'react-router';
import { LayoutDashboard, BookOpen, Headphones, BookOpenText, PenTool, Sparkles, BarChart2, Trophy, Settings, Puzzle, Newspaper, RotateCcw, CalendarDays } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useProgressStore } from '../../stores/progressStore';
import { useMistakeStore } from '../../stores/mistakeStore';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vocabulary', label: 'Vocabulary', icon: BookOpen },
  { to: '/listening', label: 'Listening', icon: Headphones },
  { to: '/reading', label: 'Reading', icon: BookOpenText },
  { to: '/grammar', label: 'Grammar', icon: PenTool },
  { to: '/sentence-building', label: 'Sentences', icon: Puzzle },
  { to: '/learn-media', label: 'Learn from Media', icon: Newspaper },
  { to: '/mistake-journal', label: 'Mistake Journal', icon: RotateCcw },
  { to: '/study-planner', label: 'Study Planner', icon: CalendarDays },
  { to: '/ai', label: 'AI', icon: Sparkles },
  { to: '/stats', label: 'Statistics', icon: BarChart2 },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { level, levelTitle, xp } = useProgressStore();
  const dueCount = useMistakeStore(s => s.getDueForReview().length);

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 p-4">
      <div className="flex items-center gap-3 px-3 mb-8">
        <span className="text-2xl">📚</span>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">WordFlow</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
              )
            }
          >
            <Icon size={20} />
            {label}
            {to === '/mistake-journal' && dueCount > 0 && (
              <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                {dueCount > 99 ? '99+' : dueCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-3 py-3 rounded-xl bg-gray-50 dark:bg-gray-900">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Level {level} — {levelTitle}</p>
        <p className="text-xs text-gray-500">{xp.toLocaleString()} XP</p>
      </div>
    </aside>
  );
}
