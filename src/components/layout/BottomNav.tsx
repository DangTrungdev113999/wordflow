import { NavLink, useLocation } from 'react-router';
import { Home, BookOpen, RefreshCw, Sparkles, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useMistakeStore } from '../../stores/mistakeStore';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/review', label: 'Review', icon: RefreshCw },
  { to: '/ai', label: 'AI', icon: Sparkles },
  { to: '/me', label: 'Me', icon: User },
];

export function BottomNav() {
  const dueCount = useMistakeStore(s => s.getDueForReview().length);
  const location = useLocation();

  // Highlight parent tab when on a sub-page
  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    if (to === '/learn') {
      return ['/learn', '/vocabulary', '/grammar', '/word-usage', '/listening', '/reading', '/sentence-building', '/pronunciation'].some(
        p => location.pathname === p || location.pathname.startsWith(p + '/')
      );
    }
    if (to === '/review') {
      return ['/review', '/mistake-journal'].some(
        p => location.pathname === p || location.pathname.startsWith(p + '/')
      ) || (location.pathname.startsWith('/vocabulary/mixed-review'));
    }
    if (to === '/ai') {
      return ['/ai', '/ai-chat', '/writing', '/roleplay', '/learn-media'].some(
        p => location.pathname === p || location.pathname.startsWith(p + '/')
      );
    }
    if (to === '/me') {
      return ['/me', '/stats', '/achievements', '/study-planner', '/settings'].some(
        p => location.pathname === p || location.pathname.startsWith(p + '/')
      );
    }
    return location.pathname === to;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 safe-area-inset-bottom">
      <div className="max-w-3xl mx-auto flex">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={cn(
                'relative flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 transition-colors',
                active
                  ? 'text-indigo-500 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {to === '/review' && dueCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-red-500 rounded-full">
                    {dueCount > 99 ? '99+' : dueCount}
                  </span>
                )}
              </div>
              <span className={cn('text-[11px] font-medium', active && 'font-semibold')}>{label}</span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
