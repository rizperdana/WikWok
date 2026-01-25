import { WikiArticle } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Share2, Heart, MessageCircle, BookOpen, Volume2, VolumeX, Sparkles, Trophy } from 'lucide-react';
import { memo, useState, useEffect } from 'react';

interface WikiCardProps {
  article: WikiArticle;
  priority?: boolean;
  onInView?: (imageUrl: string | null) => void;
}

export const WikiCard = memo(function WikiCard({ article, priority = false, onInView }: WikiCardProps) {
  const bgImage = article.originalimage?.source;
  const [isTldr, setIsTldr] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [streak, setStreak] = useState(7); // Mock streak

  useEffect(() => {
    if (isListening) {
      const utterance = new SpeechSynthesisUtterance(article.extract);
      utterance.onend = () => setIsListening(false);
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
    return () => window.speechSynthesis.cancel();
  }, [isListening, article.extract]);

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
            className="h-full w-full object-cover opacity-60 blur-sm scale-105"
            loading={priority ? "eager" : "lazy"}
          />
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/95" />
        </div>
      ) : (
        /* Fallback Gradient */
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 to-black" />
      )}

      {/* Daily Goal / Streak Tracker (Top Right) */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
          <Trophy size={16} className="text-yellow-400" />
          <span className="text-xs font-bold tracking-tight">{streak} Day Streak</span>
          <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 w-3/5" />
          </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6 pb-24 md:justify-center md:pb-6 max-w-2xl mx-auto">
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
                <h1 className="text-4xl font-extrabold leading-tight text-white drop-shadow-xl text-balance">
                    {article.title}
                </h1>
            </motion.div>

            {/* Extract / Summary with AI Toggle Transition */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={isTldr ? 'tldr' : 'full'}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="prose prose-invert prose-lg leading-relaxed text-gray-100 drop-shadow-md line-clamp-[10]"
                >
                    {isTldr ? (
                        <ul className="space-y-2">
                            <li className="flex gap-2 items-start">
                                <span className="text-indigo-400 font-bold">•</span>
                                <span>{article.extract.split('.').slice(0, 1).join('.')}...</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <span className="text-indigo-400 font-bold">•</span>
                                <span>{article.extract.split('.').slice(1, 2).join('.')}...</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <span className="text-indigo-400 font-bold">•</span>
                                <span>Core details of {article.title} condensed by AI.</span>
                            </li>
                        </ul>
                    ) : (
                        article.extract
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Action Buttons Row */}
            <motion.div
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="flex flex-wrap gap-3 pt-2"
            >
                <a
                    href={article.content_urls.mobile.page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-base font-semibold backdrop-blur-md hover:bg-white/30 transition-all hover:scale-105 active:scale-95"
                >
                    <BookOpen size={20} />
                    Read
                </a>

                {/* AI TL;DR Toggle */}
                <button
                    onClick={() => setIsTldr(!isTldr)}
                    className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${isTldr ? 'bg-indigo-600/60 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                >
                    <Sparkles size={20} className={isTldr ? 'animate-pulse' : ''} />
                    AI TL;DR
                </button>

                {/* TTS Listen Button */}
                <button
                    onClick={() => setIsListening(!isListening)}
                    className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${isListening ? 'bg-green-600/60 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                >
                    {isListening ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    {isListening ? 'Stop' : 'Listen'}
                </button>
            </motion.div>
        </div>
      </div>

      {/* Side Actions (Like TikTok) */}
      <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-6 md:right-8 lg:right-4">
        <ActionButton icon={<User size={28} />} label="" />
        <ActionButton icon={<Heart size={28} />} label="12.4K" />
        <ActionButton icon={<MessageCircle size={28} />} label="845" />
        <ActionButton icon={<Share2 size={28} />} label="Share" />
      </div>
    </motion.div>
  );
});

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
