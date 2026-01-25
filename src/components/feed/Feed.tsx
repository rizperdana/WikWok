'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWikwokFeed } from '@/lib/hooks/useWikwokFeed';
import { WikiCard } from './WikiCard';
import { AdCard } from './AdCard';
import { useEffect, useRef, useState } from 'react';
import { Loader2, Globe, ChevronDown, Check } from 'lucide-react';
import { LANGUAGES } from '@/lib/constants/languages';

export function Feed() {
  const { items, lang, setLang, fetchNextPage, hasNextPage, isFetching } = useWikwokFeed();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [activeBg, setActiveBg] = useState<string | null>(null);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetching, fetchNextPage]);

  if (items.length === 0 && isFetching) {
      return (
          <div className="h-screen w-full flex items-center justify-center bg-[#060606] text-white">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin-custom shadow-[0_0_20px_rgba(59,130,246,0.2)]"></div>
          </div>
      );
  }

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#060606] flex justify-center">
      {/* Fixed Region Selector (Absolute Top Left) */}
      <div
        data-capture-hide
        className="fixed z-[999]"
        style={{ top: '24px', left: '24px' }}
      >
          <div className="relative">
              <button
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                className="flex items-center gap-3 px-6 py-4 bg-black/60 backdrop-blur-2xl border border-white/20 rounded-full text-white text-sm font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] hover:bg-white/20 transition-all active:scale-95 group focus:outline-none"
              >
                  <span className="text-2xl leading-none drop-shadow-sm">{currentLang.flag}</span>
                  <span className="drop-shadow-md">{currentLang.code}</span>
                  <ChevronDown size={18} className={`transition-transform duration-300 ${isRegionOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                  {isRegionOpen && (
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
                                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all mb-1 ${lang === l.code ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
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
          <div className="mb-10 mt-16"> {/* Added mt-16 to avoid region selector collision */}
              <h1 className="text-2xl font-black tracking-tighter text-white">WIKWOK</h1>
              <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">Discovery Engine</p>
          </div>

          <nav className="flex flex-col gap-2">
              <SidebarItem label="Home" active />
              <SidebarItem label="Explore" />
              <SidebarItem label="Notifications" />
              <SidebarItem label="Messages" />
              <SidebarItem label="Profile" />
          </nav>

          <div className="mt-auto pt-6">
              <p className="text-[10px] text-white/20 leading-relaxed uppercase tracking-widest font-bold">
                  About • Newsroom • Contact • Careers • ByteDance • 2026 Wikwok
              </p>
          </div>
      </aside>

      {/* Main Feed: 9:16 constraint on desktop */}
      <main className="relative h-[100dvh] w-full lg:w-[450px] xl:w-[500px] snap-y snap-mandatory overflow-y-scroll overflow-x-hidden bg-[#060606] lg:bg-transparent touch-pan-y no-scrollbar !overflow-anchor-none z-20 shadow-2xl">
        {items.map((item, index) => (
          <div key={`${lang}-${item.id}`} className="h-[100dvh] w-full snap-start">
               {item.type === 'article' ? (
                   <WikiCard
                     article={item.data}
                     priority={index < 2}
                     onInView={setActiveBg}
                   />
               ) : (
                   <AdCard />
               )}
          </div>
        ))}

        {/* Loading Indicator / Intersection Target */}
        <div
          ref={loadMoreRef}
          className="h-32 w-full flex items-center justify-center snap-start bg-transparent text-white"
        >
           {isFetching && (
               <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin-custom"></div>
           )}
           {!hasNextPage && items.length > 0 && <span className="text-sm text-white/30 font-bold tracking-widest uppercase">The End</span>}
        </div>
      </main>

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
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Reading Pulse</h4>
              <div className="space-y-4">
                  <PulseItem label="Ancient Civilizations" count="1.2k" />
                  <PulseItem label="Quantum Mechanics" count="842" />
                  <PulseItem label="Space Exploration" count="2.1k" />
              </div>
          </div>
      </aside>
    </div>
  );
}

function SidebarItem({ label, active = false }: { label: string, active?: boolean }) {
    return (
        <div className={`px-4 py-3 rounded-xl flex items-center gap-4 cursor-pointer transition-colors ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
            <span className="font-bold">{label}</span>
        </div>
    )
}

function PulseItem({ label, count }: { label: string, count: string }) {
    return (
        <div className="p-4 rounded-xl bg-white/5 flex justify-between items-center transition-all hover:bg-white/10 group cursor-pointer">
            <span className="text-sm border-b border-transparent group-hover:border-white transition-all truncate mr-2">{label}</span>
            <span className="text-xs font-mono text-indigo-400">{count}</span>
        </div>
    )
}
