import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import App from '../App';
import { PageTransition } from '../components/common/PageTransition';

// Auto-reload on chunk load failure (after deploy with new hashes)
function lazyRetry(factory: () => Promise<any>) {
  return lazy(() =>
    factory().catch((err: Error) => {
      if (err.message.includes('Failed to fetch dynamically imported module') ||
          err.message.includes('Importing a module script failed')) {
        const hasReloaded = sessionStorage.getItem('chunk-reload');
        if (!hasReloaded) {
          sessionStorage.setItem('chunk-reload', '1');
          window.location.reload();
          return new Promise(() => {}); // never resolves, page reloads
        }
        sessionStorage.removeItem('chunk-reload');
      }
      throw err;
    })
  );
}



const DashboardPage = lazyRetry(() => import('../features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const VocabularyPage = lazyRetry(() => import('../features/vocabulary/pages/VocabularyPage').then(m => ({ default: m.VocabularyPage })));
const TopicPage = lazyRetry(() => import('../features/vocabulary/pages/TopicPage').then(m => ({ default: m.TopicPage })));
const FlashcardPage = lazyRetry(() => import('../features/vocabulary/pages/FlashcardPage').then(m => ({ default: m.FlashcardPage })));
const WordDetailPage = lazyRetry(() => import('../features/vocabulary/pages/WordDetailPage').then(m => ({ default: m.WordDetailPage })));
const GrammarPage = lazyRetry(() => import('../features/grammar/pages/GrammarPage').then(m => ({ default: m.GrammarPage })));
const LessonPage = lazyRetry(() => import('../features/grammar/pages/LessonPage').then(m => ({ default: m.LessonPage })));
const QuizPage = lazyRetry(() => import('../features/grammar/pages/QuizPage').then(m => ({ default: m.QuizPage })));
const BookmarkedSheetsPage = lazyRetry(() => import('../features/grammar/pages/BookmarkedSheetsPage').then(m => ({ default: m.BookmarkedSheetsPage })));
const VocabQuizPage = lazyRetry(() => import('../features/vocabulary/pages/QuizPage').then(m => ({ default: m.QuizPage })));
const AchievementsPage = lazyRetry(() => import('../features/achievements/pages/AchievementsPage').then(m => ({ default: m.AchievementsPage })));
const StatsPage = lazyRetry(() => import('../features/dashboard/pages/StatsPage').then(m => ({ default: m.StatsPage })));
const SettingsPage = lazyRetry(() => import('../features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const DailyChallengePage = lazyRetry(() => import('../features/daily-challenge/pages/DailyChallengePage').then(m => ({ default: m.DailyChallengePage })));
const ListeningPage = lazyRetry(() => import('../features/listening/pages/ListeningPage').then(m => ({ default: m.ListeningPage })));
const DictationSessionPage = lazyRetry(() => import('../features/listening/pages/DictationSessionPage').then(m => ({ default: m.DictationSessionPage })));
const OnboardingPage = lazyRetry(() => import('../features/onboarding/pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const CustomTopicsPage = lazyRetry(() => import('../features/vocabulary/pages/CustomTopicsPage').then(m => ({ default: m.CustomTopicsPage })));
const CustomTopicDetailPage = lazyRetry(() => import('../features/vocabulary/pages/CustomTopicDetailPage').then(m => ({ default: m.CustomTopicDetailPage })));
const CustomFlashcardPage = lazyRetry(() => import('../features/vocabulary/pages/CustomFlashcardPage').then(m => ({ default: m.CustomFlashcardPage })));
const PronunciationPage = lazyRetry(() => import('../features/pronunciation/pages/PronunciationPage').then(m => ({ default: m.PronunciationPage })));
const ReadingPage = lazyRetry(() => import('../features/reading/pages/ReadingPage').then(m => ({ default: m.ReadingPage })));
const ReadingSessionPage = lazyRetry(() => import('../features/reading/pages/ReadingSessionPage').then(m => ({ default: m.ReadingSessionPage })));
const AIHubPage = lazyRetry(() => import('../features/ai-hub/pages/AIHubPage').then(m => ({ default: m.AIHubPage })));
const AIChatPage = lazyRetry(() => import('../features/ai-chat/pages/AIChatPage').then(m => ({ default: m.AIChatPage })));
const WritingPage = lazyRetry(() => import('../features/writing/pages/WritingPage').then(m => ({ default: m.WritingPage })));
const RoleplayPage = lazyRetry(() => import('../features/roleplay/pages/RoleplayPage').then(m => ({ default: m.RoleplayPage })));
const SentenceBuildingPage = lazyRetry(() => import('../features/sentence-building/SentenceBuildingPage').then(m => ({ default: m.SentenceBuildingPage })));
const LearnMediaPage = lazyRetry(() => import('../features/learn-media/LearnMediaPage').then(m => ({ default: m.LearnMediaPage })));
const MistakeJournalPage = lazyRetry(() => import('../features/mistake-journal/pages/MistakeJournalPage').then(m => ({ default: m.MistakeJournalPage })));
const StudyPlannerPage = lazyRetry(() => import('../features/study-planner/pages/StudyPlannerPage').then(m => ({ default: m.StudyPlannerPage })));
const LearnPage = lazyRetry(() => import('../features/learn/pages/LearnPage').then(m => ({ default: m.LearnPage })));
const LessonFlowPage = lazyRetry(() => import('../features/learn/pages/LessonFlowPage').then(m => ({ default: m.LessonFlowPage })));
const ReviewPage = lazyRetry(() => import('../features/review/pages/ReviewPage').then(m => ({ default: m.ReviewPage })));
const MePage = lazyRetry(() => import('../features/me/pages/MePage').then(m => ({ default: m.MePage })));
const MixedReviewPage = lazyRetry(() => import('../features/vocabulary/pages/MixedReviewPage').then(m => ({ default: m.MixedReviewPage })));
const ReferencePage = lazyRetry(() => import('../features/grammar/pages/ReferencePage').then(m => ({ default: m.ReferencePage })));
const IrregularVerbsPage = lazyRetry(() => import('../features/grammar/pages/IrregularVerbsPage').then(m => ({ default: m.IrregularVerbsPage })));
const TenseComparePage = lazyRetry(() => import('../features/grammar/pages/TenseComparePage').then(m => ({ default: m.TenseComparePage })));
const TenseOverviewPage = lazyRetry(() => import('../features/grammar/pages/TenseOverviewPage').then(m => ({ default: m.TenseOverviewPage })));
const CollocationsPage = lazyRetry(() => import('../features/grammar/pages/CollocationsPage').then(m => ({ default: m.CollocationsPage })));
const PhrasalVerbsPage = lazyRetry(() => import('../features/grammar/pages/PhrasalVerbsPage').then(m => ({ default: m.PhrasalVerbsPage })));
const PrepositionGuidePage = lazyRetry(() => import('../features/grammar/pages/PrepositionGuidePage').then(m => ({ default: m.PrepositionGuidePage })));
const ArticlesPage = lazyRetry(() => import('../features/grammar/pages/ArticlesPage').then(m => ({ default: m.ArticlesPage })));
const CommonMistakesPage = lazyRetry(() => import('../features/grammar/pages/CommonMistakesPage').then(m => ({ default: m.CommonMistakesPage })));
const FalseFriendsPage = lazyRetry(() => import('../features/grammar/pages/FalseFriendsPage').then(m => ({ default: m.FalseFriendsPage })));
const GrammarPatternsPage = lazyRetry(() => import('../features/grammar/pages/GrammarPatternsPage').then(m => ({ default: m.GrammarPatternsPage })));
const WordUsageHubPage = lazyRetry(() => import('../features/word-usage/pages/WordUsageHubPage').then(m => ({ default: m.WordUsageHubPage })));
const MultiMeaningListPage = lazyRetry(() => import('../features/word-usage/pages/MultiMeaningListPage').then(m => ({ default: m.MultiMeaningListPage })));
const MultiMeaningDetailPage = lazyRetry(() => import('../features/word-usage/pages/MultiMeaningDetailPage').then(m => ({ default: m.MultiMeaningDetailPage })));
const ConfusingPairsPage = lazyRetry(() => import('../features/word-usage/pages/ConfusingPairsPage').then(m => ({ default: m.ConfusingPairsPage })));
const ConfusingPairDetailPage = lazyRetry(() => import('../features/word-usage/pages/ConfusingPairDetailPage').then(m => ({ default: m.ConfusingPairDetailPage })));
const WordUsagePhrasalVerbsPage = lazyRetry(() => import('../features/word-usage/pages/PhrasalVerbsPage').then(m => ({ default: m.PhrasalVerbsPage })));
const WordUsageCollocationsPage = lazyRetry(() => import('../features/word-usage/pages/CollocationsPage').then(m => ({ default: m.CollocationsPage })));
const WordUsageGrammarPatternsPage = lazyRetry(() => import('../features/word-usage/pages/GrammarPatternsPage').then(m => ({ default: m.GrammarPatternsPage })));
const FillBlankPage = lazyRetry(() => import('../features/listening/pages/FillBlankPage').then(m => ({ default: m.FillBlankPage })));
const SpeedListeningPage = lazyRetry(() => import('../features/listening/pages/SpeedListeningPage').then(m => ({ default: m.SpeedListeningPage })));
const ListenChoosePage = lazyRetry(() => import('../features/listening/pages/ListenChoosePage').then(m => ({ default: m.ListenChoosePage })));
const ConversationPage = lazyRetry(() => import('../features/listening/pages/ConversationPage').then(m => ({ default: m.ConversationPage })));
const StoryPage = lazyRetry(() => import('../features/listening/pages/StoryPage').then(m => ({ default: m.StoryPage })));
const AccentPage = lazyRetry(() => import('../features/listening/pages/AccentPage').then(m => ({ default: m.AccentPage })));
const NoteTakingPage = lazyRetry(() => import('../features/listening/pages/NoteTakingPage').then(m => ({ default: m.NoteTakingPage })));

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
      { path: 'learn', element: withSuspense(LearnPage) },
      { path: 'learn/lesson/:lessonId', element: withSuspense(LessonFlowPage) },
      { path: 'review', element: withSuspense(ReviewPage) },
      { path: 'me', element: withSuspense(MePage) },
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
      { path: 'listening/:topic/conversation', element: withSuspense(ConversationPage) },
      { path: 'listening/:topic/story', element: withSuspense(StoryPage) },
      { path: 'listening/:topic/accent', element: withSuspense(AccentPage) },
      { path: 'listening/:topic/note-taking', element: withSuspense(NoteTakingPage) },
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
      { path: 'word-usage/grammar', element: withSuspense(WordUsageGrammarPatternsPage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: 'onboarding', element: withSuspense(OnboardingPage) },
    ],
  },
], { basename });
