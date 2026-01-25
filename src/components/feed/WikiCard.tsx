import { WikiArticle } from '@/types';
import { motion } from 'framer-motion';
import { User, Share2, Heart, MessageCircle, BookOpen } from 'lucide-react';
import Image from 'next/image';

interface WikiCardProps {
  article: WikiArticle;
}

export function WikiCard({ article }: WikiCardProps) {
  const bgImage = article.originalimage?.source;

  return (
    <div className="relative h-[100dvh] w-full snap-start overflow-hidden bg-black text-white">
      {/* Background Image Layer */}
      {bgImage ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt={article.title}
            fill
            className="object-cover opacity-60 blur-sm scale-105"
            priority={true}
          />
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />
        </div>
      ) : (
        /* Fallback Gradient */
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 to-black" />
      )}

      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6 pb-20 md:justify-center md:pb-6 max-w-2xl mx-auto">
        <div className="flex flex-col gap-6">
            {/* Header / Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-2"
            >
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60 bg-white/10 px-2 py-1 rounded">
                        Wikipedia
                    </span>
                    {article.lang && (
                        <span className="text-xs font-bold uppercase tracking-widest text-white/60 bg-white/10 px-2 py-1 rounded">
                            {article.lang.toUpperCase()}
                        </span>
                    )}
                </div>
                <h1 className="text-4xl font-extrabold leading-tight text-white drop-shadow-lg text-balance">
                    {article.title}
                </h1>
            </motion.div>

            {/* Extract / Summary */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="prose prose-invert prose-lg leading-relaxed text-gray-100 drop-shadow-md line-clamp-[12]"
            >
                {article.extract}
            </motion.div>

            {/* Read More Button */}
            <motion.div
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="pt-2"
            >
                <a
                    href={article.content_urls.mobile.page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-base font-semibold backdrop-blur-md hover:bg-white/30 transition-all hover:scale-105 active:scale-95"
                >
                    <BookOpen size={20} />
                    Read Full Article
                </a>
            </motion.div>
        </div>
      </div>

      {/* Side Actions (Like TikTok) */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-6 md:right-8 md:bottom-1/2 md:translate-y-1/2">
        <ActionButton icon={<User size={28} />} label="" />
        <ActionButton icon={<Heart size={28} />} label="12.4K" />
        <ActionButton icon={<MessageCircle size={28} />} label="845" />
        <ActionButton icon={<Share2 size={28} />} label="Share" />
      </div>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="flex flex-col items-center gap-1 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-lg transition-transform group-hover:scale-110 group-active:scale-95">
                {icon}
            </div>
            {label && <span className="text-xs font-medium shadow-black drop-shadow-md">{label}</span>}
        </button>
    )
}
