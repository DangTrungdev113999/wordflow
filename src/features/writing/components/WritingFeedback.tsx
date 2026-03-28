import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Eye, EyeOff, Sparkles } from 'lucide-react';
import type { WritingSubmission } from '../../../db/models';
import { cn } from '../../../lib/utils';

interface WritingFeedbackProps {
  submission: WritingSubmission;
  onBack: () => void;
  onNewWriting: () => void;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  grammar: { label: 'Ngữ pháp', color: 'bg-blue-500' },
  vocabulary: { label: 'Từ vựng', color: 'bg-emerald-500' },
  coherence: { label: 'Mạch lạc', color: 'bg-violet-500' },
  taskCompletion: { label: 'Hoàn thành', color: 'bg-amber-500' },
};

function CircularScore({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color = score >= 8 ? '#22c55e' : score >= 5 ? '#eab308' : '#ef4444';

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-800" />
        <circle
          cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{score}</span>
        <span className="text-xs text-gray-400">/10</span>
      </div>
    </div>
  );
}

export function WritingFeedback({ submission, onBack, onNewWriting }: WritingFeedbackProps) {
  const [showImproved, setShowImproved] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState(true);
  const { feedback } = submission;

  if (!feedback) {
    return (
      <div className="text-center py-12 text-gray-400">
        Không có dữ liệu phản hồi
      </div>
    );
  }

  const xp = Math.min(feedback.overallScore * 10, 100) + (feedback.overallScore >= 8 ? 20 : 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Kết quả chấm bài</h2>
      </div>

      {/* Overall score */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-4">
        <CircularScore score={feedback.overallScore} />
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
          Điểm tổng · <span className="text-indigo-500 font-semibold">+{xp} XP</span>
        </p>
      </div>

      {/* Category breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Chi tiết điểm</h3>
        <div className="space-y-3">
          {Object.entries(CATEGORY_LABELS).map(([key, cfg]) => {
            const cat = feedback.categories[key as keyof typeof feedback.categories];
            const score = cat.score;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{cfg.label}</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{score}/10</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-700', cfg.color)}
                    style={{ width: `${score * 10}%` }}
                  />
                </div>
                {'feedback' in cat && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cat.feedback}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grammar issues */}
      {feedback.categories.grammar.issues.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-4">
          <button
            onClick={() => setExpandedIssues(!expandedIssues)}
            className="flex items-center justify-between w-full"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Lỗi ngữ pháp ({feedback.categories.grammar.issues.length})
            </h3>
            {expandedIssues ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {expandedIssues && (
            <div className="mt-3 space-y-3">
              {feedback.categories.grammar.issues.map((issue, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-red-500 line-through shrink-0">{issue.original}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">{issue.correction}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{issue.rule}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Improved version */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-4">
        <button
          onClick={() => setShowImproved(!showImproved)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white"
        >
          {showImproved ? <EyeOff size={16} /> : <Eye size={16} />}
          {showImproved ? 'Ẩn bản sửa' : 'Xem bản sửa'}
        </button>
        {showImproved && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {feedback.improvedVersion}
            </p>
          </div>
        )}
      </div>

      {/* Vocab suggestions */}
      {feedback.vocabSuggestions.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Từ vựng gợi ý</h3>
          <div className="flex flex-wrap gap-2">
            {feedback.vocabSuggestions.map((v, i) => (
              <span key={i} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 text-xs rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-5 mb-6 border border-amber-100 dark:border-amber-900/20">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300">{feedback.encouragement}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onNewWriting}
          className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
        >
          Viết bài mới
        </button>
      </div>
    </div>
  );
}
