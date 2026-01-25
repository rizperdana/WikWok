'use client';

import { motion } from 'framer-motion';
import { useWikwokFeed } from '@/lib/hooks/useWikwokFeed';
import { WikiCard } from './WikiCard';
import { AdCard } from './AdCard';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function Feed() {
  const { items, fetchNextPage, hasNextPage, isFetching } = useWikwokFeed();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [activeBg, setActiveBg] = useState<string | null>(null);

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
              <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
      );
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#060606] flex justify-center">
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
          <div className="mb-10">
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
          <div key={item.id} className="h-[100dvh] w-full snap-start">
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
           {isFetching && <Loader2 className="animate-spin text-blue-500" size={32} />}
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
