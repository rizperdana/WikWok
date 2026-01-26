'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ExternalLink } from 'lucide-react';
import { getWikiPageHtml } from '@/lib/services/wikipedia';

interface ArticleReaderProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  lang?: string;
}

export function ArticleReader({ isOpen, onClose, title, lang = 'en' }: ArticleReaderProps) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && title) {
      setLoading(true);
      getWikiPageHtml(title, lang)
        .then((html) => {
            // Basic sanitization/adjustment could happen here if needed
            // But usually we trust Wikipedia HTML structure.
            // We might want to fix relative images though.
            if (html) {
                // Fix relative links (href="./Foo") to absolute for functionality or disable them
                // Fix relative images (src="./Foo")
                const fixedHtml = html
                    .replace(/src="\.\//g, `src="https://${lang}.wikipedia.org/wiki/`)
                    .replace(/href="\.\//g, `href="https://${lang}.wikipedia.org/wiki/`)
                    .replace(/src="\/\//g, 'src="https://');

                setHtmlContent(fixedHtml);
            }
        })
        .finally(() => setLoading(false));
    } else {
        setHtmlContent(null);
    }
  }, [isOpen, title, lang]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[2000] bg-oxford-navy-100 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-oxford-navy-200/80 backdrop-blur-md sticky top-0 z-10">
             <h2 className="text-white font-bold truncate pr-4 text-lg">{title}</h2>
             <button
               onClick={onClose}
               className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
             >
               <X size={20} />
             </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {loading ? (
                <div className="h-full flex items-center justify-center text-cerulean-500">
                    <Loader2 className="animate-spin" size={40} />
                </div>
            ) : htmlContent ? (
                <article
                    className="wiki-content prose prose-invert prose-lg max-w-3xl mx-auto"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/50">
                    <p>Failed to load article.</p>
                </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
