import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Bot, PanelLeftOpen, PanelLeftClose, AlertCircle } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';
import { ChatBubble } from '../components/ChatBubble';
import { ChatInput } from '../components/ChatInput';
import { TopicSuggestions } from '../components/TopicSuggestions';
import { ConversationList } from '../components/ConversationList';
import { AIKeyRequired } from '../../../components/common/AIKeyRequired';
import { aiService } from '../../../services/ai/aiService';
import { cn } from '../../../lib/utils';

export function AIChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const {
    conversations,
    messages,
    isLoading,
    error,
    sendMessage,
    createConversation,
    deleteConversation,
  } = useAIChat(conversationId);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProvider = aiService.hasAnyProvider();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!hasProvider) {
    return <AIKeyRequired />;
  }

  const handleNewChat = async () => {
    const id = await createConversation();
    setSidebarOpen(false);
    navigate(`/ai-chat/${id}`);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)] relative">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conversation sidebar */}
      <div
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 p-3 overflow-y-auto transition-transform lg:transition-none lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between mb-3 lg:hidden">
          <h3 className="font-semibold text-gray-900 dark:text-white">Hội thoại</h3>
          <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-600 dark:text-gray-400">
            <PanelLeftClose size={20} />
          </button>
        </div>
        <ConversationList
          conversations={conversations}
          onNew={handleNewChat}
          onDelete={deleteConversation}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <PanelLeftOpen size={20} />
          </button>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <Bot size={18} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">AI Tutor</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">Luyện tiếng Anh qua hội thoại</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && !conversationId ? (
            <TopicSuggestions onSelect={sendMessage} />
          ) : messages.length === 0 ? (
            <TopicSuggestions onSelect={sendMessage} />
          ) : (
            <>
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex gap-2.5 max-w-[88%]">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:0.3s]" />
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
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
