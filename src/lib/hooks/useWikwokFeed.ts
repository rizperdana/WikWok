import { useInfiniteQuery } from '@tanstack/react-query';
import { WikiArticle, FeedItem } from '@/types';
import { FeedManager, FeedState } from '@/lib/feed-manager';
import { useEffect, useState, useRef } from 'react';
import { getRandomInt } from '@/lib/utils';

export function useWikwokFeed() {
  const [feedState, setFeedState] = useState<FeedState>({
    items: [],
    itemsSinceLastAd: 0,
    nextAdGap: 0, // Will initialize on mount
  });

  const initialized = useRef(false);

  // Initialize random gap on client side only to avoid hydration mismatch
  useEffect(() => {
    if (!initialized.current) {
        setFeedState(prev => ({
            ...prev,
            nextAdGap: getRandomInt(5, 10)
        }));
        initialized.current = true;
    }
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetching, isError } = useInfiniteQuery({
    queryKey: ['wikwok-feed'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/feed?page=${pageParam}`);
      if (!res.ok) throw new Error('Network error');
      return res.json() as Promise<WikiArticle[]>;
    },
    getNextPageParam: (lastPage, allPages) => allPages.length,
    initialPageParam: 0,
    staleTime: Infinity, // Keep data fresh essentially forever for this session
    refetchOnWindowFocus: false,
  });

  // Sync effect: When new data arrives, process ONLY the new pages
  // We use a Ref to track processed count synchronously to avoid Strict Mode double-invocation issues
  const processedPagesRef = useRef(0);

  useEffect(() => {
    if (data?.pages && data.pages.length > processedPagesRef.current) {
      // Get the new batch (assuming we only fetch one page at a time mostly)
      const newBatch = data.pages.slice(processedPagesRef.current).flat();

      if (newBatch.length > 0) {
        setFeedState((prevState) => {
             return FeedManager.processBatch(
                newBatch,
                prevState.items,
                prevState.itemsSinceLastAd,
                prevState.nextAdGap
            );
        });
      }

      processedPagesRef.current = data.pages.length;
    }
  }, [data]);

  return {
    items: feedState.items,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError
  };
}
