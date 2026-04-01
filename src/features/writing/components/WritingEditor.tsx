import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WritingPrompt } from '../hooks/useWritingPractice';
import { cn } from '../../../lib/utils';

interface WritingEditorProps {
  prompt: WritingPrompt;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (text: string) => void;
  onBack: () => void;
}

export function WritingEditor({ prompt, isSubmitting, error, onSubmit, onBack }: WritingEditorProps) {
  const [text, setText] = useState('');
  const [showHints, setShowHints] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const isUnderMin = wordCount < prompt.minWords;
  const isOverMax = wordCount > prompt.maxWords;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.max(200, el.scrollHeight) + 'px';
  }, [text]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {prompt.titleVi}
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">{prompt.level} · {prompt.minWords}–{prompt.maxWords} từ</p>
        </div>
      </div>

      {/* Prompt instructions */}
      <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-4 mb-4 border border-indigo-100 dark:border-indigo-900/30">
        <p className="text-sm text-gray-700 dark:text-gray-300">{prompt.prompt}</p>
        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 italic">{prompt.promptVi}</p>
      </div>

      {/* Hints toggle */}
      <motion.button
        onClick={() => setShowHints(!showHints)}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-3 transition-colors"
      >
        <Lightbulb size={14} />
        {showHints ? 'Ẩn gợi ý' : 'Xem gợi ý'}
      </motion.button>
      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 mb-4">
              {prompt.hints.map((hint) => (
                <span key={hint} className="px-2 py-1 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 text-xs rounded-md border border-amber-200 dark:border-amber-800/30">
                  {hint}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Bắt đầu viết tại đây..."
        className="w-full min-h-[200px] px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors placeholder:text-gray-600 dark:text-gray-400"
        disabled={isSubmitting}
      />

      {/* Word count + submit */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-xs font-medium',
              isOverMax ? 'text-red-500' : isUnderMin ? 'text-amber-500' : 'text-green-500',
            )}
          >
            {wordCount} từ
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            ({prompt.minWords} min – {prompt.maxWords} max)
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onSubmit(text)}
          disabled={isUnderMin || isSubmitting || !text.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
        >
          <Send size={16} />
          Nộp bài
        </motion.button>
      </div>

      {isUnderMin && wordCount > 0 && (
        <p className="text-xs text-amber-500 mt-2">
          Cần ít nhất {prompt.minWords} từ (còn thiếu {prompt.minWords - wordCount} từ)
        </p>
      )}

      {error && (
        <div className="mt-3 px-4 py-3 bg-red-50 dark:bg-red-900/10 rounded-xl text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
