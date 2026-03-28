import { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, Bot, User } from 'lucide-react';
import type { RoleplayMessage } from '../../../db/models';
import { cn } from '../../../lib/utils';

interface RoleplayChatProps {
  messages: RoleplayMessage[];
  isSending: boolean;
  error: string | null;
  disabled: boolean;
  onSend: (content: string) => void;
}

export function RoleplayChat({ messages, isSending, error, disabled, onSend }: RoleplayChatProps) {
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = () => {
    if (!text.trim() || isSending || disabled) return;
    onSend(text);
    setText('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-2.5 max-w-[88%]',
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : '',
            )}
          >
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                msg.role === 'assistant'
                  ? 'bg-orange-100 dark:bg-orange-900/30'
                  : 'bg-indigo-100 dark:bg-indigo-900/30',
              )}
            >
              {msg.role === 'assistant' ? (
                <Bot size={14} className="text-orange-600 dark:text-orange-400" />
              ) : (
                <User size={14} className="text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
            <div
              className={cn(
                'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-tr-md'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-md',
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex gap-2.5 max-w-[88%]">
            <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/10 rounded-xl text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 bg-white dark:bg-gray-950">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(120, e.target.scrollHeight) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Cuộc hội thoại đã kết thúc' : 'Nhập tin nhắn...'}
            disabled={isSending || disabled}
            rows={1}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50 placeholder:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || isSending || disabled}
            className="p-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
