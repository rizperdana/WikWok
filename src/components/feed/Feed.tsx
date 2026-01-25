'use client';

import { useWikwokFeed } from '@/lib/hooks/useWikwokFeed';
import { WikiCard } from './WikiCard';
import { AdCard } from './AdCard';
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

export function Feed() {
  const { items, fetchNextPage, hasNextPage, isFetching } = useWikwokFeed();
  const loadMoreRef = useRef<HTMLDivElement>(null);

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
          <div className="h-screen w-full flex items-center justify-center bg-black text-white">
              <Loader2 className="animate-spin" size={48} />
          </div>
      );
  }

  return (
    <main className="h-[100dvh] w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-black">
      {items.map((item) => (
        <div key={item.id} className="h-[100dvh] w-full snap-start">
             {item.type === 'article' ? (
                 <WikiCard article={item.data} />
             ) : (
                 <AdCard />
             )}
        </div>
      ))}

      {/* Loading Indicator / Intersection Target */}
      <div
        ref={loadMoreRef}
        className="h-20 w-full flex items-center justify-center snap-start bg-black text-white"
      >
         {isFetching && <Loader2 className="animate-spin" />}
         {!hasNextPage && items.length > 0 && <span className="text-sm text-gray-500">No more articles</span>}
      </div>
    </main>
  );
}
