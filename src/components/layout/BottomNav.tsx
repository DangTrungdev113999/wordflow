import { NavLink } from 'react-router';
import { LayoutDashboard, BookOpen, Headphones, PenTool, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useMistakeStore } from '../../stores/mistakeStore';

const navItems = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/vocabulary', label: 'Vocab', icon: BookOpen },
  { to: '/listening', label: 'Listen', icon: Headphones },
  { to: '/grammar', label: 'Grammar', icon: PenTool },
  { to: '/mistake-journal', label: 'Journal', icon: RotateCcw },
];

export function BottomNav() {
  const dueCount = useMistakeStore(s => s.getDueForReview().length);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 safe-area-inset-bottom lg:hidden">
      <div className="max-w-2xl mx-auto flex">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'relative flex-1 flex flex-col items-center gap-0.5 py-2 px-1 transition-colors',
                isActive
                  ? 'text-indigo-500 dark:text-indigo-400'
                  : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
              )
            }
          >
            <div className="relative">
              <Icon size={22} />
              {to === '/mistake-journal' && dueCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-red-500 rounded-full">
                  {dueCount > 99 ? '99+' : dueCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
