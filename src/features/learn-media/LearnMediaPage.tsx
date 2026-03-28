import { Newspaper, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaLearning } from './useMediaLearning';
import { MediaInput } from './MediaInput';
import { ContentExtractor } from './ContentExtractor';
import { MediaVocabList } from './MediaVocabList';
import { MediaQuiz, MediaQuizSummary } from './MediaQuiz';
import { MediaHistory } from './MediaHistory';
import { AIKeyRequired } from '../../components/common/AIKeyRequired';
import { aiService } from '../../services/ai/aiService';

export function LearnMediaPage() {
  const media = useMediaLearning();
  const hasAI = aiService.hasAnyProvider();

  if (!hasAI) {
    return <AIKeyRequired />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {media.step !== 'input' && (
          <button
            type="button"
            onClick={media.reset}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Newspaper size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Learn from Media</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {media.step === 'input' && 'Paste a URL or text to learn vocabulary'}
              {media.step === 'extracting' && 'Analyzing content...'}
              {media.step === 'vocab' && `${media.vocab.length} words found`}
              {media.step === 'quiz' && `Quiz — Question ${media.quizIndex + 1}/${media.quizExercises.length}`}
              {media.step === 'complete' && 'Session complete!'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {media.step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
              <MediaInput
                onSubmit={media.processContent}
                loading={media.loading}
                error={media.error}
              />
            </div>
            <MediaHistory />
          </motion.div>
        )}

        {media.step === 'extracting' && (
          <motion.div
            key="extracting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
          >
            <ContentExtractor
              loading={media.loading}
              title={media.title}
              text={media.originalText}
            />
          </motion.div>
        )}

        {media.step === 'vocab' && (
          <motion.div
            key="vocab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {media.title && (
              <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 px-4 py-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{media.title}</p>
              </div>
            )}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
              <MediaVocabList
                vocab={media.vocab}
                onStartQuiz={media.generateQuiz}
                onSaveToMyWords={media.saveToMyWords}
                loading={media.loading}
              />
              {media.error && (
                <div className="mt-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-sm text-red-600 dark:text-red-400">
                  {media.error}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {media.step === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
          >
            <MediaQuiz
              exercises={media.quizExercises}
              currentIndex={media.quizIndex}
              onAnswer={media.answerQuiz}
            />
          </motion.div>
        )}

        {media.step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
          >
            <MediaQuizSummary
              score={media.quizScore}
              results={media.quizResults}
              exercises={media.quizExercises}
              onReset={media.reset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
