import { NavLink } from 'react-router';
import { LayoutDashboard, BookOpen, Headphones, PenTool, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/vocabulary', label: 'Vocab', icon: BookOpen },
  { to: '/listening', label: 'Listen', icon: Headphones },
  { to: '/grammar', label: 'Grammar', icon: PenTool },
  { to: '/ai', label: 'AI', icon: Sparkles },
];

export function BottomNav() {
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
                'flex-1 flex flex-col items-center gap-0.5 py-2 px-1 transition-colors',
                isActive
                  ? 'text-indigo-500 dark:text-indigo-400'
                  : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
              )
            }
          >
            <Icon size={22} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
