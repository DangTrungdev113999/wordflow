import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

const EMOJI_OPTIONS = [
  '📚', '🎯', '🌟', '🔥', '💡', '🎨', '🎵', '🌍',
  '🏆', '💼', '🍕', '🎬', '🔬', '✈️', '🏠', '⚡',
  '🎮', '📖', '🌺', '🦋', '🚀', '🎭', '🎪', '🧩',
];

interface CreateTopicModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, icon: string) => void;
}

export function CreateTopicModal({ open, onClose, onCreate }: CreateTopicModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📚');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed, icon);
    setName('');
    setIcon('📚');
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Create New Topic">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Topic Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kitchen Tools, Medical Terms..."
            maxLength={40}
            autoFocus
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Icon
          </label>
          <div className="grid grid-cols-8 gap-1.5">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setIcon(emoji)}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                  icon === emoji
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 ring-2 ring-indigo-500 scale-110'
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim()} className="flex-1">
            Create Topic
          </Button>
        </div>
      </form>
    </Modal>
  );
}
