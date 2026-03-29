import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWordImage, TOPIC_EMOJI_MAP } from '../../../services/wordImageService';
import type { WordImageData } from '../../../db/models';
import { cn } from '../../../lib/utils';

interface WordImageProps {
  word: string;
  meaning: string;
  topicId?: string;
  size: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CONFIG = {
  sm: { px: 48, emoji: 'text-2xl', rounded: 'rounded-xl' },
  md: { px: 80, emoji: 'text-4xl', rounded: 'rounded-2xl' },
  lg: { px: 200, emoji: 'text-7xl', rounded: 'rounded-3xl' },
} as const;

export function WordImage({ word, meaning, topicId, size, className }: WordImageProps) {
  const [imageData, setImageData] = useState<WordImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy — only fetch when element enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;
    setLoading(true);
    setImgLoaded(false);

    getWordImage(word, meaning, topicId).then((data) => {
      if (!cancelled) {
        setImageData(data);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [word, meaning, topicId, isVisible]);

  const handleImgLoad = useCallback(() => setImgLoaded(true), []);

  const { px, emoji: emojiSize, rounded } = SIZE_CONFIG[size];
  const imgUrl =
    imageData?.source === 'unsplash'
      ? size === 'sm'
        ? imageData.thumbUrl || imageData.url
        : imageData.url
      : null;

  const topicEmoji = TOPIC_EMOJI_MAP[topicId ?? ''] || '📝';

  return (
    <div
      ref={containerRef}
      className={cn('relative shrink-0 overflow-hidden', rounded, className)}
      style={{ width: px, height: px }}
    >
      {/* Skeleton */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn('absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-800', rounded)}
          />
        )}
      </AnimatePresence>

      {/* Unsplash photo */}
      {!loading && imgUrl && (
        <>
          {!imgLoaded && (
            <div className={cn(
              'absolute inset-0 animate-pulse',
              'bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30',
              rounded,
            )} />
          )}
          <motion.img
            src={imgUrl}
            alt={imageData!.alt}
            loading="lazy"
            onLoad={handleImgLoad}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: imgLoaded ? 1 : 0, scale: imgLoaded ? 1 : 1.04 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={cn('absolute inset-0 w-full h-full object-cover', rounded)}
          />
        </>
      )}

      {/* Emoji fallback */}
      {!loading && imageData?.source === 'emoji' && (
        <div
          className={cn(
            'w-full h-full flex items-center justify-center',
            'bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40',
            'border border-indigo-100/80 dark:border-indigo-800/40',
            rounded,
          )}
        >
          <span className={cn(emojiSize, 'select-none leading-none')} role="img" aria-label={word}>
            {topicEmoji}
          </span>
        </div>
      )}
    </div>
  );
}
