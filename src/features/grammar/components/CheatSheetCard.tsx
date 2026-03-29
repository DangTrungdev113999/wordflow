import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import type { CheatSheet } from '../../../lib/types';

interface CheatSheetCardProps {
  sheet: CheatSheet;
  bookmarked?: boolean;
  onBookmark?: () => void;
}

export function CheatSheetCard({ sheet, bookmarked = false, onBookmark }: CheatSheetCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = [
      `📝 ${sheet.title}`,
      `📐 ${sheet.formula}`,
      '',
      sheet.keyPoints.map(p => `• ${p}`).join('\n'),
      '',
      `🔑 ${sheet.signalWords.join(', ')}`,
      '',
      sheet.commonMistakes.map(m => `⚠️ ${m}`).join('\n'),
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: sheet.title, text });
        return;
      } catch {
        // Fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-gray-900 dark:to-purple-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📝</span>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">Cheat Sheet</h3>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{sheet.title}</span>
      </div>

      {/* Formula */}
      <div className="bg-white dark:bg-gray-800/80 rounded-xl px-4 py-3 border border-indigo-100 dark:border-indigo-800/40">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>📐</span>
          <span className="uppercase tracking-wide font-medium">Công thức</span>
        </div>
        <p className="text-base font-mono font-bold text-indigo-700 dark:text-indigo-300">
          {sheet.formula}
        </p>
      </div>

      {/* Key points */}
      {sheet.keyPoints.length > 0 && (
        <div className="space-y-1.5">
          {sheet.keyPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
              <span className="text-gray-700 dark:text-gray-300">{point}</span>
            </div>
          ))}
        </div>
      )}

      {/* Signal words */}
      {sheet.signalWords.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs">🔑</span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Dấu hiệu</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sheet.signalWords.map((word, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium border border-green-200 dark:border-green-800/40"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Common mistakes */}
      {sheet.commonMistakes.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">⚠️</span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Lỗi thường gặp</span>
          </div>
          {sheet.commonMistakes.map((mistake, i) => (
            <div key={i} className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-1.5 border border-red-100 dark:border-red-900/30">
              {mistake}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onBookmark}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors
            ${bookmarked
              ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
        >
          {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          {bookmarked ? 'Đã lưu' : 'Lưu'}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Share2 size={16} />
          {copied ? 'Đã copy!' : 'Chia sẻ'}
        </button>
      </div>
    </motion.div>
  );
}
