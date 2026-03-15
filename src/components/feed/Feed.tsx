'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWikwokFeed } from '@/lib/hooks/useWikwokFeed';

import { getTrendingTopics, TrendingTopic, searchWikipedia } from '@/lib/services/wikipedia';
import { useEffect, useRef, useState } from 'react';
import { Loader2, ChevronDown, Check, Search, ArrowLeft, House, Menu, Info, FileText, Shield, Mail, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { LANGUAGES } from '@/lib/constants/languages';
import { WikiArticle, FeedItem } from '@/types';
import dynamic from 'next/dynamic';

const WikiCard = dynamic(() => import('./WikiCard').then(mod => mod.WikiCard), {
    loading: () => <div className="h-[100dvh] w-full bg-[#060606] animate-pulse" />
});
const AdCard = dynamic(() => import('./AdCard').then(mod => mod.AdCard));
const SearchOverlay = dynamic(() => import('./SearchOverlay').then(mod => mod.SearchOverlay), { ssr: false });
const SearchResultsGrid = dynamic(() => import('./SearchResultsGrid').then(mod => mod.SearchResultsGrid));
const ArticleReader = dynamic(() => import('./ArticleReader').then(mod => mod.ArticleReader), { ssr: false });




interface FeedProps {
  initialArticles?: WikiArticle[];
}

export function Feed({ initialArticles = [] }: FeedProps) {
  const { 
    items: feedItems, 
    lang, 
    setLang, 
    fetchNextPage, 
    hasNextPage, 
    isFetching, 
    isDetectingLanguage,
    detectionResult,
    hasManualOverride 
  } = useWikwokFeed(initialArticles);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const prevItemsLengthRef = useRef(0);
  const userScrolledRef = useRef(false);

  const [searchViewMode, setSearchViewMode] = useState<'grid' | 'feed'>('grid');
  const [activeBg, setActiveBg] = useState<string | null>(null);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<FeedItem[] | null>(null);
  const [regionSearch, setRegionSearch] = useState('');
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [readingArticle, setReadingArticle] = useState<WikiArticle | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTrending, setShowTrending] = useState(false);

  // Track user scroll to prevent auto-scroll when new items load
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
      // Check if user has scrolled down from top
      if (mainEl.scrollTop > 10) {
        userScrolledRef.current = true;
      }
    };

    mainEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll jumping when new items are added
  useEffect(() => {
    if (!mainRef.current) return;
    
    const currentLength = feedItems.length;
    const prevLength = prevItemsLengthRef.current;
    
    // Only prevent scroll if user has scrolled down and new items were added
    if (userScrolledRef.current && currentLength > prevLength) {
      // Keep current scroll position when new items are added
      const scrollHeight = mainRef.current.scrollHeight;
      const clientHeight = mainRef.current.clientHeight;
      const currentScroll = mainRef.current.scrollTop;
      
      // Calculate the height of newly added items
      const newItemsHeight = scrollHeight - (prevLength > 0 ? (scrollHeight / currentLength) * (currentLength - prevLength) : 0);
      
      // Adjust scroll to account for new content, but only if we're near the bottom
      if (scrollHeight - currentScroll - clientHeight < 200) {
        // User was near bottom, maintain relative position
        mainRef.current.scrollTop = currentScroll;
      }
    }
    
    prevItemsLengthRef.current = currentLength;
  }, [feedItems.length]);

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

  // Prefetch observer - load more when near bottom
  useEffect(() => {
    // Don't fetch if we have search results or are already fetching or no more pages
    if (searchResults || isFetching || hasNextPage === false) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !searchResults && hasNextPage && !isFetching) {
          console.log('Loading more pages...');
          fetchNextPage();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, searchResults, isFetching]);

  if (feedItems.length === 0 && (isFetching || isDetectingLanguage) && !searchResults) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-[#060606] text-white gap-6">
              <div className="w-12 h-12 border-4 border-cerulean-500/20 border-t-cerulean-500 rounded-full animate-spin-custom shadow-[0_0_20px_rgba(69,123,157,0.2)]"></div>
              <div className="text-center">
                  <p className="text-lg font-bold text-white/80">
                    {isDetectingLanguage ? 'Detecting your location...' : 'Discovering knowledge...'}
                  </p>
                  <p className="text-sm text-white/50 mt-1">
                    {isDetectingLanguage ? 'Setting up the right language for you' : 'Loading random articles for you'}
                  </p>
                  {detectionResult && (
                    <p className="text-xs text-white/30 mt-2">
                      Detected via: {detectionResult.method}
                      {detectionResult.location && ` • ${detectionResult.location.country}`}
                    </p>
                  )}
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
                            {!hasManualOverride && detectionResult && (
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Auto-detected location" />
                            )}
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
                                <div className="p-3">
                                    {/* Detection Info Header */}
                                    {detectionResult && (
                                        <div className="mb-3 p-2 bg-white/5 rounded-lg">
                                            <div className="flex items-center justify-between text-xs text-white/60">
                                                <span className="font-medium">
                                                    {hasManualOverride ? 'Manual selection' : 'Auto-detected'}
                                                </span>
                                                <span className="text-white/40">
                                                    {detectionResult.method}
                                                </span>
                                            </div>
                                            {detectionResult.location && !hasManualOverride && (
                                                <div className="text-xs text-white/40 mt-1">
                                                    {detectionResult.location.city && `${detectionResult.location.city}, `}
                                                    {detectionResult.location.country}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="mb-2 relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                        <input
                                            type="text"
                                            placeholder="Search language..."
                                            value={regionSearch}
                                            onChange={(e) => setRegionSearch(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                                        {LANGUAGES.filter(l => l.name.toLowerCase().includes(regionSearch.toLowerCase()) || l.code.includes(regionSearch.toLowerCase())).map((l) => (
                                            <button
                                                key={l.code}
                                                onClick={() => {
                                                    setLang(l.code);
                                                    setIsRegionOpen(false);
                                                    setRegionSearch('');
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
                                        {LANGUAGES.filter(l => l.name.toLowerCase().includes(regionSearch.toLowerCase()) || l.code.includes(regionSearch.toLowerCase())).length === 0 && (
                                            <div className="py-4 text-center text-white/30 text-xs">
                                                No languages found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
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
              <h1 className="text-2xl font-bold text-white">Wikwok</h1>
              <p className="text-xs text-cerulean-500 font-bold uppercase tracking-widest mt-2">Discovery Engine</p>
          </div>

          <nav className="flex flex-col gap-2">
              <SidebarItem label="Home" active={!searchResults} onClick={() => setSearchResults(null)} />
              <SidebarItem label="Explore" active={!!searchResults} onClick={() => setIsSearchOpen(true)} />
              <SidebarItem label="Trending" onClick={() => setShowTrending(true)} icon={<TrendingUp size={16} />} />

              {/* Legal & Info Links */}
              <div className="pt-4 mt-2 border-t border-white/10">
                <p className="px-4 mb-2 text-[10px] text-white/30 uppercase tracking-widest font-bold">Legal & Info</p>
                <SidebarLink href="/about" label="About" icon={<Info size={16} />} />
                <SidebarLink href="/contact" label="Contact" icon={<Mail size={16} />} />
                <SidebarLink href="/privacy" label="Privacy" icon={<Shield size={16} />} />
                <SidebarLink href="/terms" label="Terms" icon={<FileText size={16} />} />
              </div>
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
            <div
                key={`${lang}-${item.id}`}
                id={searchResults ? `card-${index}` : undefined}
                data-card-index={index}
                className="h-[100dvh] w-full snap-start"
            >
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
            className="h-20 w-full flex flex-col items-center justify-center bg-transparent text-white gap-2 pointer-events-none"
            >
            {isFetching && feedItems.length > 0 && (
                <div className="w-full flex flex-col items-center justify-center p-4 gap-2">
                     <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
            {!hasNextPage && feedItems.length > 0 && <span className="text-xs text-white/30 font-bold tracking-widest uppercase">The End</span>}
            </div>
        )}
      </main>
      )}



      <ArticleReader
        isOpen={!!readingArticle}
        onClose={() => setReadingArticle(null)}
        title={readingArticle?.title || ''}
        lang={readingArticle?.lang}
        pageUrl={readingArticle?.page_url}
      />



      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-[#060606]/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center h-[70px] pb-4 md:hidden safe-area-bottom">
          <button
            onClick={() => {
                if(searchResults) setSearchResults(null);
                mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 p-2 ${!searchResults ? 'text-white' : 'text-white/40'}`}
          >
              <House size={24} className={!searchResults ? "fill-white" : ""} strokeWidth={!searchResults ? 0 : 2} />
              <span className="text-[10px] font-medium">Home</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center gap-1 p-2 text-white/40 active:text-white transition-colors"
          >
              <Search size={24} />
              <span className="text-[10px] font-medium">Search</span>
          </button>

          <button
            onClick={() => setShowTrending(true)}
            className="flex flex-col items-center gap-1 p-2 text-white/40 active:text-white transition-colors pointer-events-auto"
          >
              <TrendingUp size={24} />
              <span className="text-[10px] font-medium">Trending</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 p-2 text-white/40 active:text-white transition-colors"
          >
              <Menu size={24} />
              <span className="text-[10px] font-medium">More</span>
          </button>
      </div>

      {/* Mobile Menu Sheet */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-[#111111] rounded-t-3xl p-6 md:hidden safe-area-bottom"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
              <h2 className="text-white font-bold text-xl mb-6">More Options</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <MobileMenuLink href="/about" icon={<Info size={20} />} label="About" onClose={() => setIsMobileMenuOpen(false)} />
                <MobileMenuLink href="/contact" icon={<Mail size={20} />} label="Contact" onClose={() => setIsMobileMenuOpen(false)} />
                <MobileMenuLink href="/privacy" icon={<Shield size={20} />} label="Privacy" onClose={() => setIsMobileMenuOpen(false)} />
                <MobileMenuLink href="/terms" icon={<FileText size={20} />} label="Terms" onClose={() => setIsMobileMenuOpen(false)} />
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-4 bg-white/10 rounded-xl text-white font-bold transition-colors hover:bg-white/20"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Trending Sheet */}
      <AnimatePresence>
        {showTrending && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
              onClick={() => setShowTrending(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-[#111111] rounded-t-3xl p-6 md:hidden safe-area-bottom max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <TrendingUp size={20} className="text-cerulean-500" />
                  Trending Now
                </h2>
                <button
                  onClick={() => setShowTrending(false)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1">
                {trendingTopics.length > 0 ? (
                  <div className="space-y-2">
                    {trendingTopics.slice(0, 10).map((topic, index) => (
                      <button
                        key={topic.title}
                        onClick={async () => {
                          setShowTrending(false);
                          // Search for the trending topic and open the first result
                          const results = await searchWikipedia(topic.title, lang);
                          if (results && results.length > 0) {
                            setSearchResults(results.map(r => ({
                              type: 'article' as const,
                              data: r,
                              id: r.title
                            })));
                            setSearchViewMode('grid');
                          }
                        }}
                        className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left"
                      >
                        <span className="text-cerulean-500 font-bold text-sm w-6">{index + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{topic.title}</p>
                          <p className="text-white/40 text-xs">{topic.views} views</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-white/40 py-8">
                    <TrendingUp size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No trending topics available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({ label, active = false, onClick, icon }: { label: string, active?: boolean, onClick?: () => void, icon?: React.ReactNode }) {
    return (
        <div
            onClick={onClick}
            className={`px-4 py-3 rounded-xl flex items-center gap-4 cursor-pointer transition-colors ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
        >
            {icon}
            <span className="font-bold">{label}</span>
        </div>
    )
}

function SidebarLink({ href, label, icon }: { href: string, label: string, icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="px-4 py-3 rounded-xl flex items-center gap-4 cursor-pointer transition-colors text-white/60 hover:bg-white/5 hover:text-white"
        >
            {icon}
            <span className="font-bold">{label}</span>
        </Link>
    )
}

function MobileMenuLink({ href, icon, label, onClose }: { href: string, icon: React.ReactNode, label: string, onClose: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClose}
            className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-colors"
        >
            <div className="p-3 bg-cerulean-500/20 rounded-full text-cerulean-400">
                {icon}
            </div>
            <span className="text-sm font-bold">{label}</span>
        </Link>
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
