import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import App from '../App';

const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const VocabularyPage = lazy(() => import('../features/vocabulary/pages/VocabularyPage').then(m => ({ default: m.VocabularyPage })));
const TopicPage = lazy(() => import('../features/vocabulary/pages/TopicPage').then(m => ({ default: m.TopicPage })));
const FlashcardPage = lazy(() => import('../features/vocabulary/pages/FlashcardPage').then(m => ({ default: m.FlashcardPage })));
const WordDetailPage = lazy(() => import('../features/vocabulary/pages/WordDetailPage').then(m => ({ default: m.WordDetailPage })));

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
      {
        path: 'stats',
        element: (
          <Suspense fallback={<PageLoader />}>
            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Statistics</h1>
              <p>Coming in Phase 3</p>
            </div>
          </Suspense>
        ),
      },
    ],
  },
]);
