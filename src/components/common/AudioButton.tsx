import { Volume2, Loader2 } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import { cn } from '../../lib/utils';

interface AudioButtonProps {
  word: string;
  audioUrl?: string | null;
  size?: 'sm' | 'md';
  className?: string;
}

export function AudioButton({ word, audioUrl, size = 'md', className }: AudioButtonProps) {
  const { isPlaying, play } = useAudio();

  return (
    <button
      onClick={(e) => { e.stopPropagation(); play(word, audioUrl); }}
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-200 active:scale-95',
        isPlaying
          ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
          : 'text-gray-600 dark:text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30',
        { sm: 'w-7 h-7', md: 'w-9 h-9' }[size],
        className
      )}
      title={`Pronounce "${word}"`}
    >
      {isPlaying ? <Loader2 size={size === 'sm' ? 14 : 18} className="animate-spin" /> : <Volume2 size={size === 'sm' ? 14 : 18} />}
    </button>
  );
}
