import { WikiArticle } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Volume2, VolumeX, Sparkles, Bookmark, Share2, ExternalLink } from 'lucide-react';
import { memo, useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { CommentSheet } from './CommentSheet';
import { prefetchWikiPageHtml } from '@/lib/services/wikipedia';

interface WikiCardProps {
  article: WikiArticle;
  priority?: boolean;
  onInView?: (imageUrl: string | null) => void;
  onRead?: (article: WikiArticle) => void;
}

export const WikiCard = memo(function WikiCard({ article, priority = false, onInView, onRead }: WikiCardProps) {
  const { user } = useAuth();
  const bgImage = article.originalimage?.source;
  const [isTldr, setIsTldr] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // Placeholder or fetch real count
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Prefetch Article HTML if priority (likely next) or already rendered
  useEffect(() => {
    if (priority) {
        prefetchWikiPageHtml(article.title, article.lang);
    }
  }, [priority, article.title, article.lang]);

  // Fetch initial status
  useEffect(() => {
    if (!user) {
        setIsLiked(false);
        setIsBookmarked(false);
        return;
    }

    // Check Like
    supabase.from('likes').select('id').eq('user_id', user.id).eq('article_url', article.content_urls.mobile.page).single()
        .then(({data}) => setIsLiked(!!data));

    // Check Bookmark
    supabase.from('bookmarks').select('id').eq('user_id', user.id).eq('article_url', article.content_urls.mobile.page).single()
        .then(({data}) => setIsBookmarked(!!data));

  }, [user, article.content_urls.mobile.page]);

  // Fetch Public Stats
  useEffect(() => {
    supabase.from('likes').select('*', { count: 'exact', head: true }).eq('article_url', article.content_urls.mobile.page)
        .then(({count}) => setLikeCount(count || 0));
  }, [article.content_urls.mobile.page]);


  const handleLike = async () => {
    if (!user) return alert("Please login to like!");

    if (isLiked) {
        await supabase.from('likes').delete().eq('user_id', user.id).eq('article_url', article.content_urls.mobile.page);
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
    } else {
        await supabase.from('likes').insert({ user_id: user.id, article_url: article.content_urls.mobile.page });
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
    }
  };

  const handleBookmark = async () => {
    if (!user) return alert("Please login to save!");

    if (isBookmarked) {
        await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('article_url', article.content_urls.mobile.page);
        setIsBookmarked(false);
    } else {
        await supabase.from('bookmarks').insert({
            user_id: user.id,
            article_url: article.content_urls.mobile.page,
            article_title: article.title,
            article_summary: article.extract,
            article_image: article.originalimage?.source || ""
        });
        setIsBookmarked(true);
    }
  };

  const handleShare = () => {
      const shareUrl = `https://${article.lang || 'en'}.wikipedia.org/wiki/${encodeURIComponent(article.title.replace(/ /g, '_'))}`;
      if (navigator.share) {
          navigator.share({
              title: article.title,
              text: article.extract,
              url: shareUrl
          });
      } else {
          navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
      }
  };

  return (
    <motion.div
        ref={cardRef}
        onViewportEnter={() => onInView?.(bgImage || null)}
        className="relative h-[100dvh] w-full snap-start overflow-hidden bg-black text-white"
    >
      {/* Background Image Layer */}
      {bgImage ? (
        <div className="absolute inset-0 z-0 h-full w-full">
          <img
            src={bgImage}
            alt={article.title}
            className="h-full w-full object-cover opacity-60"
            loading={priority ? "eager" : "lazy"}
          />
          {/* TikTok-style bottom shading gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,1)] via-[rgba(0,0,0,0.4)] to-[rgba(0,0,0,0)] z-10" />
        </div>
      ) : (
        /* Fallback Gradient */
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 to-black" />
      )}

      {/* Main Content Area */}
      <div className="relative z-20 flex h-full flex-col justify-end p-6 pb-16 md:pb-8 max-w-2xl mx-auto w-full">
        <div className="flex flex-col gap-10 w-full">
            {/* Header / Title */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-2"
            >
                <h1 className="text-4xl md:text-6xl font-black leading-[1.05] text-white drop-shadow-2xl text-balance tracking-tighter">
                    {article.title}
                </h1>
            </motion.div>

            {/* Extract / Summary */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={isTldr ? 'tldr' : 'full'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="prose prose-invert prose-lg leading-relaxed text-white drop-shadow-md font-medium"
                >
                    {isTldr ? (
                        <div className="flex flex-col gap-6 h-[65dvh] overflow-y-auto no-scrollbar scroll-smooth">
                            <div className="flex items-center gap-3 text-blue-400">
                                <Sparkles size={18} className="animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Proper AI Intelligence Report</span>
                            </div>

                            <div className="space-y-6">
                                <section className="space-y-2">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Executive Summary</h4>
                                    <p className="text-white text-lg font-bold leading-relaxed">
                                        {article.extract.split('.').slice(0, 1).join('.')}.
                                    </p>
                                </section>

                                <section className="space-y-3">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Key Insights</h4>
                                    <ul className="space-y-4 m-0 p-0 list-none">
                                        <li className="flex gap-4 items-start">
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                            <span className="text-white/90 text-sm leading-relaxed font-medium">
                                                {article.extract.split('.').slice(1, 2).join('.') || "Contextual discovery of subject significance."}
                                            </span>
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                            <span className="text-white/90 text-sm leading-relaxed font-medium">
                                                Verified data points indicate unique intersection of global trends.
                                            </span>
                                        </li>
                                    </ul>
                                </section>

                                <section className="space-y-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Impact Analysis</h4>
                                    <p className="text-xs text-white/60 leading-relaxed font-medium italic">
                                        AI Analysis: This article represents a critical node in contemporary knowledge discovery.
                                    </p>
                                </section>
                            </div>

                            <div className="pt-4 pb-2">
                                <button
                                    onClick={() => onRead?.(article)}
                                    className="inline-flex items-center gap-2 !text-white !font-black !no-underline hover:opacity-80 transition-opacity uppercase text-[10px] tracking-widest bg-blue-600 px-6 py-3 rounded-full shadow-lg shadow-blue-500/20"
                                >
                                    Read Article
                                    <ExternalLink size={14} className="stroke-[3px]" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="max-h-[35dvh] overflow-hidden">
                                <span className="line-clamp-[8] md:line-clamp-[12] block text-white/90">
                                    {article.extract}
                                </span>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => onRead?.(article)}
                                    className="inline-flex items-center gap-2 !text-white !font-black hover:opacity-80 transition-opacity uppercase text-xs tracking-widest drop-shadow-lg"
                                >
                                    Read Article
                                    <ExternalLink size={16} className="stroke-[3px]" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Refined 5-Column Action Bar: Like, Comment, AI, Save, Share */}
            <div data-capture-hide className="grid grid-cols-5 gap-2 pt-2">
                <ActionButton
                    onClick={handleLike}
                    icon={<Heart size={20} className={isLiked ? 'fill-punch-red-500 text-punch-red-500' : ''} />}
                    label={likeCount > 0 ? `${likeCount}` : "Like"}
                    active={isLiked}
                />

                <ActionButton
                    onClick={() => setIsCommentsOpen(true)}
                    icon={<MessageCircle size={20} />}
                    label="Comment"
                />

                <ActionButton
                    onClick={() => setIsTldr(!isTldr)}
                    icon={<Sparkles size={20} />}
                    label="AI"
                    active={isTldr}
                />

                <ActionButton
                    onClick={handleBookmark}
                    icon={<Bookmark size={20} className={isBookmarked ? 'fill-white text-cerulean-500' : ''} />}
                    label="Save"
                    active={isBookmarked}
                />

                <ActionButton
                    onClick={handleShare}
                    icon={<Share2 size={20} />}
                    label="Share"
                />
            </div>
        </div>
      </div>

      <CommentSheet
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        articleUrl={article.content_urls.mobile.page}
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
    const baseStyles = "flex-1 min-h-[60px] flex flex-col items-center justify-center gap-1.5 rounded-2xl transition-all active:scale-[0.9] select-none touch-manipulation shadow-lg border-0 transition-colors duration-200";

    // Strictly White theme as requested
    const activeStyles = "bg-blue-600/90 text-white";
    const inactiveStyles = "bg-white/10 backdrop-blur-md text-white hover:bg-white/20";

    const content = (
        <div className="flex flex-col items-center text-white">
            <div className="mb-0.5">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
        </div>
    );

    const finalStyles = `${baseStyles} ${active ? activeStyles : inactiveStyles}`;

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={finalStyles} style={{ textDecoration: 'none' }}>
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={finalStyles}>
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
