import { WikiArticle } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Share2, Heart, MessageCircle, BookOpen, Volume2, VolumeX, Sparkles, Trophy, Bookmark, Camera, Link2, Check } from 'lucide-react';
import { memo, useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

interface WikiCardProps {
  article: WikiArticle;
  priority?: boolean;
  onInView?: (imageUrl: string | null) => void;
}

export const WikiCard = memo(function WikiCard({ article, priority = false, onInView }: WikiCardProps) {
  const bgImage = article.originalimage?.source;
  const [isTldr, setIsTldr] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isListening) {
      const utterance = new SpeechSynthesisUtterance(isTldr ? `Key points for ${article.title}: ${article.extract.split('.').slice(0, 2).join('.')}` : article.extract);
      utterance.onend = () => setIsListening(false);
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
    return () => window.speechSynthesis.cancel();
  }, [isListening, article.extract, isTldr, article.title]);

  const handleDownloadFrame = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: '#060606',
        scale: 2 // Higher quality
      });
      const link = document.createElement('a');
      link.download = `wikwok-${article.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    } catch (err) {
      console.error('Failed to capture frame:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.content_urls.mobile.page);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
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
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>
      ) : (
        /* Fallback Gradient */
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 to-black" />
      )}

      {/* Main Content Area */}
      <div className="relative z-20 flex h-full flex-col justify-end p-6 pb-32 md:pb-8 max-w-2xl mx-auto w-full">
        <div ref={cardRef} className="flex flex-col gap-6 w-full">
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
                        <div className="space-y-4">
                            <ul className="space-y-3 m-0 p-0 list-none">
                                <li className="flex gap-4 items-start">
                                    <span className="h-2 w-2 rounded-full bg-blue-500 mt-2.5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                    <span>{article.extract.split('.').slice(0, 1).join('.')}...</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="h-2 w-2 rounded-full bg-blue-500 mt-2.5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                    <span>{article.extract.split('.').slice(1, 2).join('.')}...</span>
                                </li>
                            </ul>
                            <a
                                href={article.content_urls.mobile.page}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-blue-400 font-bold hover:text-blue-300 no-underline transition-colors mt-2"
                            >
                                Read More
                            </a>
                        </div>
                    ) : (
                        <div className="relative">
                            <span className="line-clamp-5 md:line-clamp-8 block">
                                {article.extract}
                            </span>
                            <a
                                href={article.content_urls.mobile.page}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-blue-400 font-bold hover:text-blue-300 no-underline transition-colors mt-1"
                            >
                                Read More
                            </a>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Refined 5-Column Action Bar */}
            <div className="grid grid-cols-5 gap-2 pt-2">
                <ActionButton
                    onClick={() => setIsTldr(!isTldr)}
                    icon={<Sparkles size={20} />}
                    label="AI"
                    active={isTldr}
                />

                <ActionButton
                    onClick={() => setIsListening(!isListening)}
                    icon={isListening ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    label="Voice"
                    active={isListening}
                />

                <ActionButton
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    icon={<Bookmark size={20} className={isBookmarked ? 'fill-white' : ''} />}
                    label="Save"
                    active={isBookmarked}
                />

                <ActionButton
                    onClick={handleDownloadFrame}
                    icon={<Camera size={20} />}
                    label="Shot"
                />

                <ActionButton
                    onClick={handleCopyLink}
                    icon={isCopied ? <Check size={20} /> : <Link2 size={20} />}
                    label={isCopied ? "Done" : "Copy"}
                />
            </div>
        </div>
      </div>

      {/* Side Actions (Like TikTok) */}
      <div className="absolute right-4 bottom-28 z-30 flex flex-col items-center gap-6 md:right-8 lg:right-4">
        <SideAction icon={<Heart size={28} />} label="12.4K" />
        <SideAction icon={<MessageCircle size={28} />} label="845" />
        <SideAction icon={<Share2 size={28} />} label="Share" />
      </div>
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

function SideAction({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="flex flex-col items-center gap-1.5 group select-none touch-manipulation">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 transition-all group-hover:bg-blue-600/20 group-hover:text-blue-400 group-active:scale-90 text-white shadow-lg">
                {icon}
            </div>
            {label && <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none drop-shadow-md">{label}</span>}
        </button>
    )
}
