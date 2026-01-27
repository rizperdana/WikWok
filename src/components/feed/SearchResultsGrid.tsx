'use client';

import { WikiArticle } from '@/types';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon } from 'lucide-react';

interface SearchResultsGridProps {
  results: WikiArticle[];
  onSelect: (index: number) => void;
}

export function SearchResultsGrid({ results, onSelect }: SearchResultsGridProps) {
  return (
    <div className="w-full h-full bg-[#060606] pt-24 pb-20 px-4 overflow-y-auto">
      <h2 className="text-white text-xl font-bold mb-6 px-2">Top Results</h2>
      <div className="grid grid-cols-2 gap-4">
        {results.map((result, index) => (
          <motion.div
            key={`${result.pageid}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(index)}
            className="aspect-[3/4] relative rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors group"
          >
            {result.originalimage ? (
              <img
                src={result.originalimage.source}
                alt={result.title}
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('fallback-icon');
                }}
                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                <FileText size={48} />
              </div>
            )}

            {/* Fallback Icon Container - visible if image fails or is missing */}
            <div className="hidden fallback-icon:flex absolute inset-0 items-center justify-center text-white/20">
                 <FileText size={48} />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">
                {result.title}
              </h3>
              <p className="text-xs text-white/60 line-clamp-2">
                {result.extract}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {results.length === 0 && (
         <div className="flex flex-col items-center justify-center py-20 text-white/40">
            <p>No results found</p>
         </div>
      )}
    </div>
  );
}
