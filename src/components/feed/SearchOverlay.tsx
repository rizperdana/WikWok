'use client';

import { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchWikipedia } from '@/lib/services/wikipedia';
import { WikiArticle } from '@/types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onResults: (results: WikiArticle[]) => void;
  currentLang: string;
}

export function SearchOverlay({ isOpen, onClose, onResults, currentLang }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchWikipedia(query, currentLang);
      onResults(results);
      onClose();
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative w-full max-w-2xl"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Wikipedia..."
                className="w-full bg-oxford-navy-200/90 border border-white/20 text-white text-xl placeholder:text-white/30 rounded-full py-4 pl-14 pr-14 shadow-2xl focus:outline-none focus:border-frosted-blue-500 transition-colors"
                autoFocus
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50" size={24} />

              {loading ? (
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <Loader2 className="animate-spin text-frosted-blue-500" size={24} />
                </div>
              ) : (
                query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                )
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
