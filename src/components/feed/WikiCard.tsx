import { WikiArticle } from '@/types';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { memo, useState, useEffect, useRef } from 'react';
import { prefetchWikiPageHtml } from '@/lib/services/wikipedia';
import Image from 'next/image';
import { getOptimizedImageUrl, getThumbnailUrl, preloadImage } from '@/lib/utils/images';

interface WikiCardProps {
  article: WikiArticle;
  priority?: boolean;
  onInView?: (imageUrl: string | null) => void;
  onRead?: (article: WikiArticle) => void;
}

export const WikiCard = memo(function WikiCard({ article, priority = false, onInView, onRead }: WikiCardProps) {
  const bgImage = article.originalimage?.source ? getOptimizedImageUrl(article.originalimage.source, 800) : null;
  const thumbnailUrl = article.originalimage?.source ? getThumbnailUrl(article.originalimage.source, 50) : null;
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Prefetch Article HTML and preload image
  useEffect(() => {
    if (priority) {
      prefetchWikiPageHtml(article.title, article.lang);
    }
    // Preload image for priority cards
    if (priority && bgImage) {
      preloadImage(bgImage);
    }
  }, [priority, article.title, article.lang, bgImage]);

  // Aggressive preloading when card comes into view
  useEffect(() => {
    if (!cardRef.current || !bgImage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Preload this card's image immediately
          preloadImage(bgImage);

          // Preload next 3 cards aggressively
          const allCards = Array.from(document.querySelectorAll('[data-card-image]'));
          const currentIndex = allCards.findIndex(el => el === cardRef.current);

          // Preload more cards for smoother scrolling
          [1, 2, 3, 4].forEach(offset => {
            const nextCard = allCards[currentIndex + offset] as HTMLElement;
            if (nextCard?.dataset.cardImage) {
              preloadImage(nextCard.dataset.cardImage);
            }
          });
        }
      },
      { rootMargin: '200%', threshold: 0.1 } // Increased root margin for earlier loading
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [bgImage, priority]);

  return (
    <motion.div
      ref={cardRef}
      data-card-image={bgImage}
      onViewportEnter={() => onInView?.(bgImage || null)}
      className="relative h-[100dvh] w-full snap-start overflow-hidden bg-black text-white"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[#1a1a1a]">
        {bgImage && (
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: imageLoaded ? 0.6 : 0.3
            }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 h-full w-full"
          >
            {/* Blur placeholder while loading */}
            {!imageLoaded && (
              <div
                className="absolute inset-0 bg-cover bg-center blur-xl scale-110"
                style={{ backgroundImage: `url(${thumbnailUrl || bgImage})` }}
              />
            )}
                <Image
                    src={bgImage}
                    alt={article.title}
                    fill
                    className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    priority={priority}
                    quality={75}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={true}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      // On error, hide the image and show fallback
                      e.currentTarget.style.display = 'none';
                      setImageLoaded(true);
                    }}
                />
          </motion.div>
        )}

        {/* TikTok-style bottom shading gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.9)] via-[rgba(0,0,0,0.3)] to-[rgba(0,0,0,0.1)] z-10" />
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex w-full flex-row items-end justify-between p-4 pb-20 md:pb-8 max-w-2xl mx-auto pointer-events-none">
        {/* Left Side: Text Content */}
        <div className="flex-1 flex flex-col gap-4 pointer-events-auto pr-12">
          {/* Header / Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-2xl md:text-4xl font-black leading-tight text-white drop-shadow-lg text-balance tracking-tighter line-clamp-3">
              {article.title}
            </h1>
          </motion.div>

          {/* Wikipedia Attribution */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-col gap-1.5 mt-2"
          >
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <span className="font-medium">Source:</span>
              <a
                href={`https://${article.lang || 'en'}.wikipedia.org/wiki/${encodeURIComponent(article.title.replace(/ /g, '_'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors underline decoration-1 underline-offset-2 font-medium"
              >
                Wikipedia
              </a>
            </div>
            <div className="text-white/50 text-xs leading-tight">
              Licensed under{' '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white/70 transition-colors underline decoration-1 underline-offset-1"
              >
                CC BY-SA 3.0
              </a>
            </div>
          </motion.div>

          {/* Extract / Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="prose prose-invert prose-sm md:prose-base leading-snug text-white/90 drop-shadow-md font-medium"
          >
            <div
              className="relative cursor-pointer group"
              onClick={() => onRead?.(article)}
            >
              <div className="max-h-[35dvh] overflow-hidden">
                <span className="line-clamp-[8] md:line-clamp-[12] block text-white/90 group-hover:text-white transition-colors">
                  {article.extract.length > 800
                    ? `${article.extract.slice(0, 800)}...`
                    : article.extract}
                </span>
              </div>
              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRead?.(article);
                  }}
                  className="inline-flex items-center gap-2 !text-white !font-black hover:opacity-80 transition-opacity uppercase text-xs tracking-widest drop-shadow-lg"
                >
                  Read Article
                  <ExternalLink size={16} className="stroke-[3px]" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});
