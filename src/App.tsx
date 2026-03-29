import { useLocation, useNavigate, useOutlet } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from './hooks/useTheme';
import { useDaily } from './hooks/useDaily';
import { useAchievements } from './hooks/useAchievements';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { StudyTimerWidget } from './features/study-planner/components/StudyTimerWidget';
import { useEffect } from 'react';
import { db, initializeUserProfile } from './db/database';
import { initEventSubscribers } from './services/eventSubscribers';

export default function App() {
  useTheme();
  useAchievements();
  const { recordActivity } = useDaily();
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();

  useEffect(() => {
    async function init() {
      await initializeUserProfile();
      initEventSubscribers();
    }
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Routing guard: redirect to onboarding if placement not done
  useEffect(() => {
    async function checkOnboarding() {
      const profile = await db.userProfile.get('default');
      if (profile && !profile.placementDone && location.pathname !== '/onboarding') {
        navigate('/onboarding', { replace: true });
      }
    }
    checkOnboarding();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    recordActivity();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFullscreen = location.pathname.includes('/learn') || location.pathname.includes('/quiz') || location.pathname === '/onboarding';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <ToastContainer />
      {!isFullscreen && <StudyTimerWidget />}
      {!isFullscreen && <Sidebar />}
      <div className={!isFullscreen ? 'lg:ml-64' : ''}>
        {!isFullscreen && <Header />}
        <main className={!isFullscreen ? 'pb-20 lg:pb-6' : 'pb-0'}>
          <AnimatePresence mode="wait">
            <div key={location.pathname}>
              {outlet}
            </div>
          </AnimatePresence>
        </main>
        {!isFullscreen && <BottomNav />}
      </div>
    </div>
  );
}
