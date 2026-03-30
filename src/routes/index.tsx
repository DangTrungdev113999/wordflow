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
const BookmarkedSheetsPage = lazy(() => import('../features/grammar/pages/BookmarkedSheetsPage').then(m => ({ default: m.BookmarkedSheetsPage })));
const VocabQuizPage = lazy(() => import('../features/vocabulary/pages/QuizPage').then(m => ({ default: m.QuizPage })));
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
const StudyPlannerPage = lazy(() => import('../features/study-planner/pages/StudyPlannerPage').then(m => ({ default: m.StudyPlannerPage })));
const MixedReviewPage = lazy(() => import('../features/vocabulary/pages/MixedReviewPage').then(m => ({ default: m.MixedReviewPage })));
const ReferencePage = lazy(() => import('../features/grammar/pages/ReferencePage').then(m => ({ default: m.ReferencePage })));
const IrregularVerbsPage = lazy(() => import('../features/grammar/pages/IrregularVerbsPage').then(m => ({ default: m.IrregularVerbsPage })));
const TenseComparePage = lazy(() => import('../features/grammar/pages/TenseComparePage').then(m => ({ default: m.TenseComparePage })));
const TenseOverviewPage = lazy(() => import('../features/grammar/pages/TenseOverviewPage').then(m => ({ default: m.TenseOverviewPage })));
const CollocationsPage = lazy(() => import('../features/grammar/pages/CollocationsPage').then(m => ({ default: m.CollocationsPage })));
const PhrasalVerbsPage = lazy(() => import('../features/grammar/pages/PhrasalVerbsPage').then(m => ({ default: m.PhrasalVerbsPage })));
const PrepositionGuidePage = lazy(() => import('../features/grammar/pages/PrepositionGuidePage').then(m => ({ default: m.PrepositionGuidePage })));
const ArticlesPage = lazy(() => import('../features/grammar/pages/ArticlesPage').then(m => ({ default: m.ArticlesPage })));
const CommonMistakesPage = lazy(() => import('../features/grammar/pages/CommonMistakesPage').then(m => ({ default: m.CommonMistakesPage })));
const FalseFriendsPage = lazy(() => import('../features/grammar/pages/FalseFriendsPage').then(m => ({ default: m.FalseFriendsPage })));
const GrammarPatternsPage = lazy(() => import('../features/grammar/pages/GrammarPatternsPage').then(m => ({ default: m.GrammarPatternsPage })));
const WordUsageHubPage = lazy(() => import('../features/word-usage/pages/WordUsageHubPage').then(m => ({ default: m.WordUsageHubPage })));
const MultiMeaningListPage = lazy(() => import('../features/word-usage/pages/MultiMeaningListPage').then(m => ({ default: m.MultiMeaningListPage })));
const MultiMeaningDetailPage = lazy(() => import('../features/word-usage/pages/MultiMeaningDetailPage').then(m => ({ default: m.MultiMeaningDetailPage })));
const ConfusingPairsPage = lazy(() => import('../features/word-usage/pages/ConfusingPairsPage').then(m => ({ default: m.ConfusingPairsPage })));
const ConfusingPairDetailPage = lazy(() => import('../features/word-usage/pages/ConfusingPairDetailPage').then(m => ({ default: m.ConfusingPairDetailPage })));
const WordUsagePhrasalVerbsPage = lazy(() => import('../features/word-usage/pages/PhrasalVerbsPage').then(m => ({ default: m.PhrasalVerbsPage })));
const WordUsageCollocationsPage = lazy(() => import('../features/word-usage/pages/CollocationsPage').then(m => ({ default: m.CollocationsPage })));
const WordUsageGrammarPage = lazy(() => import('../features/word-usage/pages/GrammarPatternsPage').then(m => ({ default: m.GrammarPatternsPage })));
const FillBlankPage = lazy(() => import('../features/listening/pages/FillBlankPage').then(m => ({ default: m.FillBlankPage })));
const SpeedListeningPage = lazy(() => import('../features/listening/pages/SpeedListeningPage').then(m => ({ default: m.SpeedListeningPage })));
const ListenChoosePage = lazy(() => import('../features/listening/pages/ListenChoosePage').then(m => ({ default: m.ListenChoosePage })));

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

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: withSuspense(DashboardPage) },
      { path: 'vocabulary', element: withSuspense(VocabularyPage) },
      { path: 'vocabulary/mixed-review', element: withSuspense(MixedReviewPage) },
      { path: 'vocabulary/:topic', element: withSuspense(TopicPage) },
      { path: 'vocabulary/:topic/learn', element: withSuspense(FlashcardPage) },
      { path: 'vocabulary/:topic/quiz', element: withSuspense(VocabQuizPage) },
      { path: 'vocabulary/custom', element: withSuspense(CustomTopicsPage) },
      { path: 'vocabulary/custom/:topicId', element: withSuspense(CustomTopicDetailPage) },
      { path: 'vocabulary/custom/:topicId/learn', element: withSuspense(CustomFlashcardPage) },
      { path: 'vocabulary/word/:word', element: withSuspense(WordDetailPage) },
      { path: 'grammar', element: withSuspense(GrammarPage) },
      { path: 'grammar/reference', element: withSuspense(ReferencePage) },
      { path: 'grammar/reference/irregular-verbs', element: withSuspense(IrregularVerbsPage) },
      { path: 'grammar/reference/tense-compare', element: withSuspense(TenseComparePage) },
      { path: 'grammar/reference/tense-overview', element: withSuspense(TenseOverviewPage) },
      { path: 'grammar/reference/collocations', element: withSuspense(CollocationsPage) },
      { path: 'grammar/reference/phrasal-verbs', element: withSuspense(PhrasalVerbsPage) },
      { path: 'grammar/reference/prepositions', element: withSuspense(PrepositionGuidePage) },
      { path: 'grammar/reference/articles', element: withSuspense(ArticlesPage) },
      { path: 'grammar/reference/common-mistakes', element: withSuspense(CommonMistakesPage) },
      { path: 'grammar/reference/false-friends', element: withSuspense(FalseFriendsPage) },
      { path: 'grammar/reference/grammar-patterns', element: withSuspense(GrammarPatternsPage) },
      { path: 'grammar/reference/:tool', element: withSuspense(ReferencePage) },
      { path: 'grammar/bookmarks', element: withSuspense(BookmarkedSheetsPage) },
      { path: 'grammar/:lessonId', element: withSuspense(LessonPage) },
      { path: 'grammar/:lessonId/quiz', element: withSuspense(QuizPage) },
      { path: 'achievements', element: withSuspense(AchievementsPage) },
      { path: 'stats', element: withSuspense(StatsPage) },
      { path: 'listening', element: withSuspense(ListeningPage) },
      { path: 'listening/:topic/practice', element: withSuspense(DictationSessionPage) },
      { path: 'listening/:topic/fill-blank', element: withSuspense(FillBlankPage) },
      { path: 'listening/:topic/speed', element: withSuspense(SpeedListeningPage) },
      { path: 'listening/:topic/listen-choose', element: withSuspense(ListenChoosePage) },
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
      { path: 'study-planner', element: withSuspense(StudyPlannerPage) },
      { path: 'word-usage', element: withSuspense(WordUsageHubPage) },
      { path: 'word-usage/multi-meaning', element: withSuspense(MultiMeaningListPage) },
      { path: 'word-usage/multi-meaning/:word', element: withSuspense(MultiMeaningDetailPage) },
      { path: 'word-usage/confusing-pairs', element: withSuspense(ConfusingPairsPage) },
      { path: 'word-usage/confusing-pairs/:id', element: withSuspense(ConfusingPairDetailPage) },
      { path: 'word-usage/phrasal-verbs', element: withSuspense(WordUsagePhrasalVerbsPage) },
      { path: 'word-usage/collocations', element: withSuspense(WordUsageCollocationsPage) },
      { path: 'word-usage/grammar', element: withSuspense(WordUsageGrammarPage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: 'onboarding', element: withSuspense(OnboardingPage) },
    ],
  },
], { basename });
