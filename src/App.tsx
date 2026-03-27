import { Outlet, useLocation } from 'react-router';
import { useTheme } from './hooks/useTheme';
import { useDaily } from './hooks/useDaily';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { useEffect } from 'react';
import { initializeUserProfile } from './db/database';

export default function App() {
  useTheme();
  const { recordActivity } = useDaily();
  const location = useLocation();

  useEffect(() => {
    initializeUserProfile();
  }, []);

  useEffect(() => {
    recordActivity();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFullscreen = location.pathname.includes('/learn') || location.pathname.includes('/quiz');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {!isFullscreen && <Header />}
      <main className={!isFullscreen ? 'pb-20' : 'pb-0'}>
        <Outlet />
      </main>
      {!isFullscreen && <BottomNav />}
    </div>
  );
}
