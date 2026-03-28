import type { ChatMessage } from '../../../db/models';
import { CorrectionHighlight } from './CorrectionHighlight';
import { Bot, User } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ChatBubbleProps {
  message: ChatMessage;
}

function formatContent(content: string): string {
  // Remove correction block from displayed text (it's shown separately)
  // Only strip lines matching the correction format: ❌ ... → ✅ ... — ...
  return content.replace(/\n*(?:❌\s*.+?\s*→\s*✅\s*.+?\s*—\s*.+?\n*)+$/, '').trim();
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const displayContent = isUser ? message.content : formatContent(message.content);

  return (
    <div className={cn('flex gap-2.5 max-w-[88%]', isUser ? 'ml-auto flex-row-reverse' : '')}>
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1',
          isUser
            ? 'bg-indigo-100 dark:bg-indigo-900/30'
            : 'bg-emerald-100 dark:bg-emerald-900/30',
        )}
      >
        {isUser ? (
          <User size={16} className="text-indigo-600 dark:text-indigo-400" />
        ) : (
          <Bot size={16} className="text-emerald-600 dark:text-emerald-400" />
        )}
      </div>

      <div className="space-y-2 min-w-0">
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words',
            isUser
              ? 'bg-indigo-500 text-white rounded-tr-md'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-md',
          )}
        >
          {displayContent}
        </div>

        {!isUser && message.corrections && message.corrections.length > 0 && (
          <CorrectionHighlight corrections={message.corrections} />
        )}
      </div>
    </div>
  );
}
