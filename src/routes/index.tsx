import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import App from '../App';
import { PageTransition } from '../components/common/PageTransition';

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
const CustomTopicsPage = lazy(() => import('../features/vocabulary/pages/CustomTopicsPage').then(m => ({ default: m.CustomTopicsPage })));
const CustomTopicDetailPage = lazy(() => import('../features/vocabulary/pages/CustomTopicDetailPage').then(m => ({ default: m.CustomTopicDetailPage })));
const CustomFlashcardPage = lazy(() => import('../features/vocabulary/pages/CustomFlashcardPage').then(m => ({ default: m.CustomFlashcardPage })));
const PronunciationPage = lazy(() => import('../features/pronunciation/pages/PronunciationPage').then(m => ({ default: m.PronunciationPage })));
const ReadingPage = lazy(() => import('../features/reading/pages/ReadingPage').then(m => ({ default: m.ReadingPage })));
const ReadingSessionPage = lazy(() => import('../features/reading/pages/ReadingSessionPage').then(m => ({ default: m.ReadingSessionPage })));
const AIHubPage = lazy(() => import('../features/ai-hub/pages/AIHubPage').then(m => ({ default: m.AIHubPage })));
const AIChatPage = lazy(() => import('../features/ai-chat/pages/AIChatPage').then(m => ({ default: m.AIChatPage })));
const WritingPage = lazy(() => import('../features/writing/pages/WritingPage').then(m => ({ default: m.WritingPage })));
const RoleplayPage = lazy(() => import('../features/roleplay/pages/RoleplayPage').then(m => ({ default: m.RoleplayPage })));
const SentenceBuildingPage = lazy(() => import('../features/sentence-building/SentenceBuildingPage').then(m => ({ default: m.SentenceBuildingPage })));
const LearnMediaPage = lazy(() => import('../features/learn-media/LearnMediaPage').then(m => ({ default: m.LearnMediaPage })));
const MistakeJournalPage = lazy(() => import('../features/mistake-journal/pages/MistakeJournalPage').then(m => ({ default: m.MistakeJournalPage })));

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
      <PageTransition>
        <Component />
      </PageTransition>
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
      { path: 'vocabulary/custom', element: withSuspense(CustomTopicsPage) },
      { path: 'vocabulary/custom/:topicId', element: withSuspense(CustomTopicDetailPage) },
      { path: 'vocabulary/custom/:topicId/learn', element: withSuspense(CustomFlashcardPage) },
      { path: 'vocabulary/word/:word', element: withSuspense(WordDetailPage) },
      { path: 'grammar', element: withSuspense(GrammarPage) },
      { path: 'grammar/:lessonId', element: withSuspense(LessonPage) },
      { path: 'grammar/:lessonId/quiz', element: withSuspense(QuizPage) },
      { path: 'achievements', element: withSuspense(AchievementsPage) },
      { path: 'stats', element: withSuspense(StatsPage) },
      { path: 'listening', element: withSuspense(ListeningPage) },
      { path: 'listening/:topic/practice', element: withSuspense(DictationSessionPage) },
      { path: 'pronunciation', element: withSuspense(PronunciationPage) },
      { path: 'reading', element: withSuspense(ReadingPage) },
      { path: 'reading/:passageId', element: withSuspense(ReadingSessionPage) },
      { path: 'daily-challenge', element: withSuspense(DailyChallengePage) },
      { path: 'ai', element: withSuspense(AIHubPage) },
      { path: 'ai-chat', element: withSuspense(AIChatPage) },
      { path: 'ai-chat/:conversationId', element: withSuspense(AIChatPage) },
      { path: 'writing', element: withSuspense(WritingPage) },
      { path: 'writing/:submissionId', element: withSuspense(WritingPage) },
      { path: 'roleplay', element: withSuspense(RoleplayPage) },
      { path: 'roleplay/:scenarioId', element: withSuspense(RoleplayPage) },
      { path: 'sentence-building', element: withSuspense(SentenceBuildingPage) },
      { path: 'learn-media', element: withSuspense(LearnMediaPage) },
      { path: 'learn-media/:sessionId', element: withSuspense(LearnMediaPage) },
      { path: 'mistake-journal', element: withSuspense(MistakeJournalPage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: 'onboarding', element: withSuspense(OnboardingPage) },
    ],
  },
]);
