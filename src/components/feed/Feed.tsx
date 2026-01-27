'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWikwokFeed } from '@/lib/hooks/useWikwokFeed';
import { AuthButton } from '@/components/auth/AuthButton';
import { WikiCard } from './WikiCard';
import { AdCard } from './AdCard';
import { SearchOverlay } from './SearchOverlay';
import { SearchResultsGrid } from './SearchResultsGrid';
import { useEffect, useRef, useState } from 'react';
import { Loader2, ChevronDown, Check, Search, ArrowLeft } from 'lucide-react';
import { LANGUAGES } from '@/lib/constants/languages';
import { WikiArticle, FeedItem } from '@/types';
import { getTrendingTopics, TrendingTopic } from '@/lib/services/wikipedia';
import { ArticleReader } from './ArticleReader';

export function Feed() {
  const { items: feedItems, lang, setLang, fetchNextPage, hasNextPage, isFetching } = useWikwokFeed();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const [searchViewMode, setSearchViewMode] = useState<'grid' | 'feed'>('grid');
  const [activeBg, setActiveBg] = useState<string | null>(null);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<FeedItem[] | null>(null);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [readingArticle, setReadingArticle] = useState<WikiArticle | null>(null);

  // Fetch trending topics when language changes
  useEffect(() => {
    getTrendingTopics(lang).then(setTrendingTopics);
  }, [lang]);

  // Scroll to Top when search state changes
  useEffect(() => {
    if (mainRef.current) {
        mainRef.current.scrollTo(0, 0);
    }
  }, [searchResults]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching && !searchResults) {
          fetchNextPage();
        }
      },
      { rootMargin: '400px', threshold: 0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetching, fetchNextPage, searchResults]);

  if (feedItems.length === 0 && isFetching && !searchResults) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-[#060606] text-white gap-6">
              <div className="w-12 h-12 border-4 border-cerulean-500/20 border-t-cerulean-500 rounded-full animate-spin-custom shadow-[0_0_20px_rgba(69,123,157,0.2)]"></div>
              <div className="text-center">
                  <p className="text-lg font-bold text-white/80">Discovering knowledge...</p>
                  <p className="text-sm text-white/50 mt-1">Loading random articles for you</p>
              </div>
          </div>
      );
  }

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const displayItems = searchResults || feedItems;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#060606] flex justify-center">
      {/* Top Controls Container (Auto-hide) */}
      {/* Top Controls Container */}
      <motion.div
        className="fixed top-0 left-0 w-full z-[999] pointer-events-none"
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-full h-[100px] pointer-events-auto">
            {/* Fixed Region Selector */}
            <div
                data-capture-hide
                className="absolute top-4 left-4 lg:top-6 lg:left-6"
            >
                <div className="relative">
                    {searchResults ? (
                        <button
                            onClick={() => {
                                if (searchViewMode === 'feed') {
                                    setSearchViewMode('grid');
                                } else {
                                    setSearchResults(null);
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-4 bg-punch-red-500 text-white rounded-full font-bold shadow-xl transition-all active:scale-95 z-50 pointer-events-auto"
                        >
                            <ArrowLeft size={16} className="lg:w-[18px] lg:h-[18px]" />
                            <span className="text-xs lg:text-base">{searchViewMode === 'feed' ? 'Results' : 'Back'}</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsRegionOpen(!isRegionOpen)}
                            className="flex items-center gap-2 lg:gap-3 px-4 py-2 lg:px-6 lg:py-4 bg-black/60 backdrop-blur-2xl border border-white/20 rounded-full text-white text-xs lg:text-sm font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] hover:bg-white/20 transition-all active:scale-95 group focus:outline-none pointer-events-auto"
                        >
                            <span className="text-lg lg:text-2xl leading-none drop-shadow-sm">{currentLang.flag}</span>
                            <span className="drop-shadow-md">{currentLang.code}</span>
                            <ChevronDown size={14} className={`lg:w-[18px] lg:h-[18px] transition-transform duration-300 ${isRegionOpen ? 'rotate-180' : ''}`} />
                        </button>
                    )}

                    <AnimatePresence>
                        {isRegionOpen && !searchResults && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute top-full left-0 mt-4 w-64 bg-[#111111]/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden z-[101]"
                            >
                                <div className="p-3 max-h-[70vh] overflow-y-auto no-scrollbar">
                                    {LANGUAGES.map((l) => (
                                        <button
                                            key={l.code}
                                            onClick={() => {
                                                setLang(l.code);
                                                setIsRegionOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all mb-1 ${lang === l.code ? 'bg-cerulean-600 text-white shadow-lg shadow-cerulean-500/20' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-xl leading-none">{l.flag}</span>
                                                <span className="text-[11px] font-black uppercase tracking-widest">{l.name}</span>
                                            </div>
                                            {lang === l.code && <Check size={14} className="stroke-[3px]" />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Top Right Controls */}
            <div className="absolute top-4 right-4 lg:top-6 lg:right-6 flex items-center gap-3 lg:gap-4 pointer-events-auto">
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center justify-center w-9 h-9 lg:w-[50px] lg:h-[50px] rounded-full bg-black/60 backdrop-blur-2xl border border-white/20 text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] hover:bg-white/20 transition-all active:scale-95 group focus:outline-none lg:hidden"
                >
                    <Search size={16} className="lg:w-[20px] lg:h-[20px]" />
                </button>
                <AuthButton />
            </div>
        </div>
      </motion.div>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currentLang={lang}
        onResults={(results) => {
            const items: FeedItem[] = results.map(r => ({
                type: 'article',
                data: r,
                id: crypto.randomUUID()
            }));
            setSearchResults(items);
            setSearchViewMode('grid');
        }}
      />

      {/* Screen-wide Dismiss Area for Dropdown */}
      {isRegionOpen && (
          <div
            className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[2px]"
            onClick={() => setIsRegionOpen(false)}
          />
      )}

      {/* Background Layer: Current Article Visual (Desktop only) */}
      <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {activeBg && (
              <motion.img
                key={activeBg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 0.8 }}
                src={activeBg}
                className="absolute inset-0 h-full w-full object-cover blur-3xl scale-110"
                alt=""
              />
          )}
          <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* Desktop Left Sidebar: Trending/Nav */}
      <aside className="hidden lg:flex w-80 h-full flex-col p-6 z-20 relative">
          <div className="mb-10 mt-16 px-2">
              <div className="relative w-32 h-32">
                 <img src="/icon.png" alt="WIKWOK" className="w-full h-full object-contain" />
              </div>
              <p className="text-xs text-cerulean-500 font-bold uppercase tracking-widest mt-2 pl-2">Discovery Engine</p>
          </div>

          <nav className="flex flex-col gap-2">
              <SidebarItem label="Home" active={!searchResults} onClick={() => setSearchResults(null)} />
              <SidebarItem label="Explore" active={!!searchResults} onClick={() => setIsSearchOpen(true)} />
              <SidebarItem label="Notifications" />
              <SidebarItem label="Messages" />
              <SidebarItem label="Profile" />
          </nav>

          <div className="mt-auto pt-6">
              <p className="text-[10px] text-white/20 leading-relaxed uppercase tracking-widest font-bold">
                  2026 Wikwok
              </p>
          </div>
      </aside>

      {/* Main Feed: 9:16 constraint on desktop */}
      {/* Main Feed or Grid View */}
      {searchResults && searchViewMode === 'grid' ? (
        <main className="relative h-[100dvh] w-full lg:w-[450px] xl:w-[500px] bg-[#060606] lg:bg-transparent z-20 shadow-2xl overflow-hidden">
            <SearchResultsGrid
                results={searchResults.filter(item => item.type === 'article').map(item => (item as Extract<FeedItem, { type: 'article' }>).data)}
                onSelect={(index) => {
                    setSearchViewMode('feed');
                    // Small timeout to allow render, then scroll
                    setTimeout(() => {
                        const element = document.getElementById(`card-${index}`);
                        element?.scrollIntoView();
                    }, 50);
                }}
            />
        </main>
      ) : (
      <main
        ref={mainRef}
        className="relative h-[100dvh] w-full lg:w-[450px] xl:w-[500px] snap-y snap-mandatory overflow-y-scroll overflow-x-hidden bg-[#060606] lg:bg-transparent touch-pan-y no-scrollbar !overflow-anchor-none z-20 shadow-2xl"
      >
        {displayItems.length > 0 ? (
            displayItems.map((item, index) => (
            <div key={`${lang}-${item.id}`} id={searchResults ? `card-${index}` : undefined} className="h-[100dvh] w-full snap-start">
                 {item.type === 'article' ? (
                    <WikiCard
                      article={item.data}
                      priority={index < 2}
                      onInView={setActiveBg}
                      onRead={setReadingArticle}
                    />
                 ) : (
                    <AdCard />
                 )}
            </div>
          ))
        ) : (
             <div className="h-full w-full flex flex-col items-center justify-center text-white p-8 opacity-50">
                <Search size={48} className="mb-4" />
                <p>No results found</p>
            </div>
        )}

        {/* Loading Indicator / Intersection Target - Only show if not searching */}
        {!searchResults && (
            <div
            ref={loadMoreRef}
            className="h-32 w-full flex flex-col items-center justify-center snap-start bg-transparent text-white gap-2"
            >
            {isFetching && (
                <>
                    <div className="w-6 h-6 border-2 border-cerulean-500/20 border-t-cerulean-500 rounded-full animate-spin-custom"></div>
                    <span className="text-xs text-white/50 font-medium tracking-widest uppercase">Fetching more...</span>
                </>
            )}
            {!hasNextPage && feedItems.length > 0 && <span className="text-sm text-white/30 font-bold tracking-widest uppercase">The End</span>}
            </div>
        )}
      </main>
      )}

      {/* Desktop Right Sidebar: Post Info/Social */}
      <aside className="hidden xl:flex w-96 h-full flex-col p-6 z-20">
          <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
              <div>
                  <h3 className="font-bold">Guest Navigator</h3>
                  <p className="text-sm text-white/50">Level 1 Knowledge Seeker</p>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Trending Now</h4>
              <div className="space-y-4">
                  {trendingTopics.length > 0 ? (
                      trendingTopics.map((topic, i) => (
                          <PulseItem
                            key={i}
                            label={topic.title}
                            count={topic.views}
                            onClick={() => setReadingArticle({
                                title: topic.title,
                                lang: lang,
                                pageid: 0,
                                ns: 0,
                                extract: '',
                                thumbnail: undefined
                            } as any)}
                          />
                      ))
                  ) : (
                      <p className="text-xs text-white/30">Loading trends...</p>
                  )}
              </div>
          </div>
      </aside>

      <ArticleReader
        isOpen={!!readingArticle}
        onClose={() => setReadingArticle(null)}
        title={readingArticle?.title || ''}
        lang={readingArticle?.lang}
      />
    </div>
  );
}

function SidebarItem({ label, active = false, onClick }: { label: string, active?: boolean, onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`px-4 py-3 rounded-xl flex items-center gap-4 cursor-pointer transition-colors ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
        >
            <span className="font-bold">{label}</span>
        </div>
    )
}

function PulseItem({ label, count, onClick }: { label: string, count: string, onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className="p-4 rounded-xl bg-white/5 flex justify-between items-center transition-all hover:bg-white/10 group cursor-pointer"
        >
            <span className="text-sm border-b border-transparent group-hover:border-white transition-all truncate mr-2">{label}</span>
            <span className="text-xs font-mono text-indigo-400">{count}</span>
        </div>
    )
}
