import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import App from '../App';

const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const VocabularyPage = lazy(() => import('../features/vocabulary/pages/VocabularyPage').then(m => ({ default: m.VocabularyPage })));
const TopicPage = lazy(() => import('../features/vocabulary/pages/TopicPage').then(m => ({ default: m.TopicPage })));
const FlashcardPage = lazy(() => import('../features/vocabulary/pages/FlashcardPage').then(m => ({ default: m.FlashcardPage })));
const WordDetailPage = lazy(() => import('../features/vocabulary/pages/WordDetailPage').then(m => ({ default: m.WordDetailPage })));
const GrammarPage = lazy(() => import('../features/grammar/pages/GrammarPage').then(m => ({ default: m.GrammarPage })));
const LessonPage = lazy(() => import('../features/grammar/pages/LessonPage').then(m => ({ default: m.LessonPage })));
const QuizPage = lazy(() => import('../features/grammar/pages/QuizPage').then(m => ({ default: m.QuizPage })));
const AchievementsPage = lazy(() => import('../features/achievements/pages/AchievementsPage').then(m => ({ default: m.AchievementsPage })));
const StatsPage = lazy(() => import('../features/dashboard/pages/StatsPage').then(m => ({ default: m.StatsPage })));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const DailyChallengePage = lazy(() => import('../features/daily-challenge/pages/DailyChallengePage').then(m => ({ default: m.DailyChallengePage })));
const ListeningPage = lazy(() => import('../features/listening/pages/ListeningPage').then(m => ({ default: m.ListeningPage })));
const DictationSessionPage = lazy(() => import('../features/listening/pages/DictationSessionPage').then(m => ({ default: m.DictationSessionPage })));
const OnboardingPage = lazy(() => import('../features/onboarding/pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: withSuspense(DashboardPage) },
      { path: 'vocabulary', element: withSuspense(VocabularyPage) },
      { path: 'vocabulary/:topic', element: withSuspense(TopicPage) },
      { path: 'vocabulary/:topic/learn', element: withSuspense(FlashcardPage) },
      { path: 'vocabulary/word/:word', element: withSuspense(WordDetailPage) },
      { path: 'grammar', element: withSuspense(GrammarPage) },
      { path: 'grammar/:lessonId', element: withSuspense(LessonPage) },
      { path: 'grammar/:lessonId/quiz', element: withSuspense(QuizPage) },
      { path: 'achievements', element: withSuspense(AchievementsPage) },
      { path: 'stats', element: withSuspense(StatsPage) },
      { path: 'listening', element: withSuspense(ListeningPage) },
      { path: 'listening/:topic/practice', element: withSuspense(DictationSessionPage) },
      { path: 'daily-challenge', element: withSuspense(DailyChallengePage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: 'onboarding', element: withSuspense(OnboardingPage) },
    ],
  },
]);
