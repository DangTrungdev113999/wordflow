import { useParams } from 'react-router';
import { PenLine, History } from 'lucide-react';
import { useWritingPractice } from '../hooks/useWritingPractice';
import { PromptPicker } from '../components/PromptPicker';
import { WritingEditor } from '../components/WritingEditor';
import { WritingFeedback } from '../components/WritingFeedback';
import { WritingHistory } from '../components/WritingHistory';
import { AIKeyRequired } from '../../../components/common/AIKeyRequired';
import { aiService } from '../../../services/ai/aiService';
import writingPromptsData from '../../../data/writing-prompts.json';
import type { WritingPrompt } from '../hooks/useWritingPractice';

const prompts = writingPromptsData as WritingPrompt[];

export function WritingPage() {
  const { submissionId } = useParams();
  const {
    phase,
    selectedPrompt,
    currentSubmission,
    submissions,
    isSubmitting,
    error,
    selectPrompt,
    submitWriting,
    goToHistory,
    goToPick,
    reviewSubmission,
  } = useWritingPractice(submissionId);

  if (!aiService.hasAnyProvider()) {
    return <AIKeyRequired />;
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header — only show on pick phase */}
      {phase === 'pick' && (
        <>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                <PenLine size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Luyện viết</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chọn đề bài và bắt đầu viết</p>
              </div>
            </div>
            {submissions.length > 0 && (
              <button
                onClick={goToHistory}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <History size={14} />
                Lịch sử
              </button>
            )}
          </div>
          <PromptPicker prompts={prompts} onSelect={selectPrompt} />
        </>
      )}

      {phase === 'write' && selectedPrompt && (
        <WritingEditor
          prompt={selectedPrompt}
          isSubmitting={isSubmitting}
          error={error}
          onSubmit={submitWriting}
          onBack={goToPick}
        />
      )}

      {phase === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">AI đang chấm bài...</p>
        </div>
      )}

      {phase === 'feedback' && currentSubmission && (
        <WritingFeedback
          submission={currentSubmission}
          onBack={goToPick}
          onNewWriting={goToPick}
        />
      )}

      {phase === 'history' && (
        <WritingHistory
          submissions={submissions}
          onSelect={reviewSubmission}
          onBack={goToPick}
        />
      )}
    </div>
  );
}
