import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface FlipCardProps {
  isFlipped: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function FlipCard({ isFlipped, front, back, onClick, className }: FlipCardProps) {
  return (
    <div
      className={cn('relative cursor-pointer select-none', className)}
      onClick={onClick}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full"
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        {/* Back */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
