import { WikiArticle } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Volume2, VolumeX, Sparkles, Bookmark, Share2, ExternalLink } from 'lucide-react';
import { memo, useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { prefetchWikiPageHtml } from '@/lib/services/wikipedia';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getWikimediaImageUrl, getThumbnailUrl, preloadImage } from '@/lib/utils/images';

const CommentSheet = dynamic(() => import('./CommentSheet').then(mod => mod.CommentSheet), {
    ssr: false
});

interface WikiCardProps {
  article: WikiArticle;
  priority?: boolean;
  onInView?: (imageUrl: string | null) => void;
  onRead?: (article: WikiArticle) => void;
}

export const WikiCard = memo(function WikiCard({ article, priority = false, onInView, onRead }: WikiCardProps) {
  const { user, session } = useAuth();
  const bgImage = article.originalimage?.source ? getWikimediaImageUrl(article.originalimage.source, 800) : null;
  const thumbnailUrl = article.originalimage?.source ? getThumbnailUrl(article.originalimage.source, 50) : null;

  // Interaction States
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Counts
  const [counts, setCounts] = useState({
      likes: 0,
      comments: 0,
      bookmarks: 0,
      shares: 0
  });

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
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

  // Preload upcoming images when card comes into view
  useEffect(() => {
    if (!cardRef.current || !bgImage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Preload this card's image immediately
          preloadImage(bgImage);
          
          // Aggressively find and preload the next 2 cards
          const allCards = Array.from(document.querySelectorAll('[data-card-image]'));
          const currentIndex = allCards.findIndex(el => el === cardRef.current);
          
          [1, 2].forEach(offset => {
            const nextCard = allCards[currentIndex + offset] as HTMLElement;
            if (nextCard?.dataset.cardImage) {
              preloadImage(nextCard.dataset.cardImage);
            }
          });
        }
      },
      { rootMargin: '100%', threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [bgImage, priority]);

  // Fetch Public Stats & User Status
  useEffect(() => {
    const fetchStatus = async () => {
        const headers: any = {};
        if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        try {
            const res = await fetch(`/api/interactions?type=stats&url=${encodeURIComponent(article.content_urls.mobile.page)}`, { headers });
            const data = await res.json();

            if (data.counts) {
                setCounts(data.counts);
            }
            if (data.userStatus) {
                setIsLiked(data.userStatus.liked);
                setIsBookmarked(data.userStatus.bookmarked);
            }
        } catch (e) {
            console.error("Failed to fetch interaction stats");
        }
    };

    fetchStatus();
  }, [user, session, article.content_urls.mobile.page, isCommentsOpen]); // Re-fetch when comments close/open to update counts? Ideally explicit trigger.

  const handleLike = async () => {
    if (!user || !session) return alert("Please login to like!");

    const oldLiked = isLiked;
    setIsLiked(!oldLiked);
    setCounts(prev => ({ ...prev, likes: oldLiked ? prev.likes - 1 : prev.likes + 1 }));

    try {
        await fetch('/api/interactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                type: 'like',
                article_url: article.content_urls.mobile.page,
                article_title: article.title,
                article_image: article.originalimage?.source || ""
            })
        });
    } catch (e) {
        setIsLiked(oldLiked); // Revert
    }
  };

  const handleBookmark = async () => {
    if (!user || !session) return alert("Please login to save!");

    const oldBookmarked = isBookmarked;
    setIsBookmarked(!oldBookmarked);
    setCounts(prev => ({ ...prev, bookmarks: oldBookmarked ? prev.bookmarks - 1 : prev.bookmarks + 1 }));

    await fetch('/api/interactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
            type: 'bookmark',
            article_url: article.content_urls.mobile.page,
            payload: {
                article_title: article.title,
                article_summary: article.extract,
                article_image: article.originalimage?.source || ""
            }
        })
    });
  };

  const handleShare = async () => {
        const shareUrl = `https://${article.lang || 'en'}.wikipedia.org/wiki/${encodeURIComponent(article.title.replace(/ /g, '_'))}`;
        const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

        // Optimistic update
        setCounts(prev => ({ ...prev, shares: prev.shares + 1 }));

        // Persist Share
        fetch('/api/interactions', {
            method: 'POST',
            headers: {
                 'Content-Type': 'application/json',
                 // Optional auth for share
                 ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
            },
            body: JSON.stringify({
                type: 'share',
                article_url: article.content_urls.mobile.page,
                payload: { platform: isDesktop ? 'clipboard' : 'native' }
            })
        }).catch(() => {});

        if (navigator.share && !isDesktop) {
            navigator.share({
                title: article.title,
                text: article.extract,
                url: shareUrl
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
        }
    };

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
                    <div className="absolute inset-0 bg-cover bg-center blur-xl scale-110" style={{ backgroundImage: `url(${thumbnailUrl || bgImage})` }} />
                )}
                <Image
                    src={bgImage}
                    alt={article.title}
                    fill
                    className={`object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    priority={priority}
                    quality={60}
                    sizes="100vw"
                    unoptimized={true}
                    onLoad={() => setImageLoaded(true)}
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

        {/* Right Side: Action Bar (TikTok Style) */}
        <div data-capture-hide className="flex flex-col items-center gap-6 pointer-events-auto w-[60px] pb-4">


            <ActionButton
                onClick={handleLike}
                icon={<Heart size={28} className={`transition-all ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-white'}`} />}
                label={counts.likes > 0 ? `${counts.likes}` : "Like"}
                active={isLiked}
            />

            <ActionButton
                onClick={() => setIsCommentsOpen(true)}
                icon={<MessageCircle size={26} className="text-white" />}
                label={counts.comments > 0 ? `${counts.comments}` : "Comment"}
            />



            <ActionButton
                onClick={handleBookmark}
                icon={<Bookmark size={26} className={isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-white'} />}
                label={counts.bookmarks > 0 ? `${counts.bookmarks}` : "Save"}
                active={isBookmarked}
            />

            <ActionButton
                onClick={handleShare}
                icon={<Share2 size={26} className="text-white" />}
                label="Share"
            />


        </div>
      </div>

      <CommentSheet
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        articleUrl={article.content_urls.mobile.page}
        articleTitle={article.title}
        articleImage={article.originalimage?.source}
      />

    </motion.div>
  );
});

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    href?: string;
    active?: boolean;
}

function ActionButton({ icon, label, onClick, href, active }: ActionButtonProps) {
    const baseStyles = "flex flex-col items-center justify-center gap-1 transition-all active:scale-90 select-none touch-manipulation cursor-pointer filter hover:brightness-110";

    const content = (
        <div className="flex flex-col items-center text-white drop-shadow-md">
            <div className="p-2">
                {icon}
            </div>
            <span className="text-[12px] font-semibold tracking-wide shadow-black drop-shadow-md">{label}</span>
        </div>
    );

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={baseStyles} style={{ textDecoration: 'none' }}>
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={baseStyles}>
            {content}
        </button>
    );
}

function SideAction({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
    return (
        <button onClick={onClick} className="flex flex-col items-center gap-1.5 group select-none touch-manipulation">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 transition-all group-hover:bg-blue-600/20 group-hover:text-blue-400 group-active:scale-90 text-white shadow-lg">
                {icon}
            </div>
            {label && <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none drop-shadow-md">{label}</span>}
        </button>
    )
}
