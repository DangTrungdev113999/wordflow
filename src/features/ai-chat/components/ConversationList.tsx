import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import type { ChatConversation } from '../../../db/models';
import { cn } from '../../../lib/utils';

interface ConversationListProps {
  conversations: ChatConversation[];
  onNew: () => void;
  onDelete: (id: string) => void;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return d.toLocaleDateString('vi-VN');
}

export function ConversationList({ conversations, onNew, onDelete }: ConversationListProps) {
  const { conversationId } = useParams();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <button
        onClick={onNew}
        className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
      >
        <Plus size={18} />
        Cuộc hội thoại mới
      </button>

      {conversations.length === 0 ? (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-6">
          Chưa có hội thoại nào
        </p>
      ) : (
        <div className="space-y-1">
          {conversations.map((c) => (
            <div
              key={c.id}
              className={cn(
                'group flex items-center rounded-xl transition-colors',
                conversationId === c.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-900',
              )}
            >
              <Link
                to={`/ai-chat/${c.id}`}
                className="flex-1 flex items-center gap-3 px-3 py-2.5 min-w-0"
              >
                <MessageSquare
                  size={16}
                  className={cn(
                    'shrink-0',
                    conversationId === c.id
                      ? 'text-indigo-500'
                      : 'text-gray-400 dark:text-gray-600',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'text-sm truncate',
                      conversationId === c.id
                        ? 'font-semibold text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300',
                    )}
                  >
                    {c.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDate(c.updatedAt)}
                  </p>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteTarget(c.id);
                }}
                className="p-2 mr-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={deleteTarget != null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) onDelete(deleteTarget);
          setDeleteTarget(null);
        }}
        title="Delete conversation?"
        description="This conversation and all its messages will be permanently deleted."
        confirmLabel="Delete"
      />
    </div>
  );
}
