'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { getWikiPageHtml } from '@/lib/services/wikipedia';

interface ArticleReaderProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  lang?: string;
}

export function ArticleReader({ isOpen, onClose, title, lang }: ArticleReaderProps) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure we have valid lang
  const wikiLang = lang || 'en';

  useEffect(() => {
    if (isOpen && title) {
      console.log('Loading article:', title, 'lang:', wikiLang);
      setLoading(true);
      setError(null);
      setHtmlContent(null);
      
      getWikiPageHtml(title, wikiLang)
        .then((html) => {
            if (html) {
                const fixedHtml = html
                    .replace(/src="\.\//g, `src="https://${wikiLang}.wikipedia.org/wiki/`)
                    .replace(/href="\.\//g, `href="https://${wikiLang}.wikipedia.org/wiki/`)
                    .replace(/src="\/\//g, 'src="https://');

                setHtmlContent(fixedHtml);
            } else {
                setError('Article not found');
            }
        })
        .catch((err) => {
            console.error('Failed to load article:', err);
            setError('Failed to load article');
        })
        .finally(() => setLoading(false));
    } else {
        setHtmlContent(null);
        setError(null);
    }
  }, [isOpen, title, wikiLang]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[2000] bg-white flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-10">
             <h2 className="text-black font-bold truncate pr-4 text-lg">{title}</h2>
             <button
               onClick={onClose}
               className="p-2 bg-black/5 rounded-full hover:bg-black/10 text-black transition-colors"
             >
               <X size={20} />
             </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {loading ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                    <Loader2 className="animate-spin" size={40} />
                </div>
            ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <p>{error}</p>
                </div>
            ) : htmlContent ? (
                <>
                    <style>
                        {`
                            .wiki-content { color: #1e293b; }
                            .wiki-content h1, .wiki-content h2, .wiki-content h3, .wiki-content h4, .wiki-content h5, .wiki-content h6 { color: #000 !important; }
                            .wiki-content a { color: #2563eb !important; }
                            .wiki-content * { background-color: transparent !important; color: inherit; }
                            .wiki-content table, .wiki-content th, .wiki-content td { border-color: rgba(0,0,0,0.1) !important; }
                            .wiki-content .infobox { background: rgba(0,0,0,0.02) !important; border: 1px solid rgba(0,0,0,0.05) !important; padding: 1rem; border-radius: 0.5rem; }
                            .wiki-content .thumbcaption { color: #64748b !important; }
                        `}
                    </style>
                    <article
                        className="wiki-content prose prose-lg max-w-3xl mx-auto"
                        dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
                    />
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <p>Loading...</p>
                </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
