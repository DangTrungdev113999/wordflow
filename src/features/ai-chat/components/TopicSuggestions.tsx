import { MessageCircle } from 'lucide-react';

interface TopicSuggestionsProps {
  onSelect: (topic: string) => void;
}

const TOPICS = [
  { text: 'Tell me about your day', emoji: '☀️' },
  { text: 'Describe your favorite food', emoji: '🍜' },
  { text: "What's your hobby?", emoji: '🎨' },
  { text: 'Talk about your family', emoji: '👨‍👩‍👧' },
  { text: 'Describe your hometown', emoji: '🏘️' },
  { text: 'What do you do for work?', emoji: '💼' },
];

export function TopicSuggestions({ onSelect }: TopicSuggestionsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
        <MessageCircle size={32} className="text-emerald-500" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        Bắt đầu hội thoại
      </h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 text-center">
        Chọn chủ đề hoặc gõ bất kỳ điều gì bạn muốn nói
      </p>
      <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
        {TOPICS.map((topic) => (
          <button
            key={topic.text}
            onClick={() => onSelect(topic.text)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-left text-sm text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
          >
            <span>{topic.emoji}</span>
            <span className="line-clamp-1">{topic.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
