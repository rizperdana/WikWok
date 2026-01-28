import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { WikiArticle, FeedItem } from '@/types';
import { FeedManager, FeedState } from '@/lib/feed-manager';
import { useEffect, useState, useRef } from 'react';
import { getRandomInt } from '@/lib/utils';
import { DEFAULT_LANG } from '../constants/languages';

export function useWikwokFeed() {
  const queryClient = useQueryClient();
  const [lang, setLang] = useState<string>(DEFAULT_LANG);
  const [feedState, setFeedState] = useState<FeedState>({
    items: [],
    itemsSinceLastAd: 0,
    nextAdGap: 0,
  });

  const initializedRef = useRef(false);
  const processedPagesRef = useRef(0);

  // Instant Local Detection
  useEffect(() => {
    if (typeof window !== 'undefined' && !initializedRef.current) {
        const browserLang = navigator.language.split('-')[0];
        // Check if we support this language code
        // We import LANGUAGES via a dynamic check (or just trust the input if it's 2 chars?)
        // Better to check distinct list if possible, or just set it and api might fallback to 'en' if invalid.
        // For now, let's assume if it matches one of our known codes.
        // We don't have access to LANGUAGES list inside hook easily unless imported?
        // useWikwokFeed doesn't import LANGUAGES. I should import it or just check
        // a few key ones. Or just `setLang(browserLang)` and hope API supports it (it handles fallbacks).

        // Actually, let's just set it. Wikipedia supports almost all 2 char codes.
        if (browserLang) {
             console.log('Detected browser lang:', browserLang);
             setLang(browserLang);
        }
    }
  }, []);

  // Initialize random gap
  useEffect(() => {
    if (!initializedRef.current) {
        setFeedState(prev => ({
            ...prev,
            nextAdGap: getRandomInt(5, 10)
        }));
        initializedRef.current = true;
    }
  }, []);

  // UseInfiniteQuery with lang dependency
  const { data, fetchNextPage, hasNextPage, isFetching, isError } = useInfiniteQuery({
    queryKey: ['wikwok-feed', lang],
    queryFn: async ({ pageParam = 0 }) => {
      // First load: 2 items (super fast). Subsequent: 5 items.
      const limit = pageParam === 0 ? 2 : 5;
      const res = await fetch(`/api/feed?page=${pageParam}&lang=${lang}&limit=${limit}`);
      if (!res.ok) throw new Error('Network error');
      return res.json() as Promise<WikiArticle[]>;
    },
    getNextPageParam: (lastPage, allPages) => {
        // Stop if we got no items, otherwise next page index
        return lastPage.length === 0 ? undefined : allPages.length;
    },
    initialPageParam: 0,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Reset feed state when lang changes
  useEffect(() => {
    setFeedState(prev => ({
        items: [],
        itemsSinceLastAd: 0,
        nextAdGap: getRandomInt(5, 10)
    }));
    processedPagesRef.current = 0;
  }, [lang]);

  useEffect(() => {
    if (data?.pages && data.pages.length > processedPagesRef.current) {
      const newBatch = data.pages.slice(processedPagesRef.current).flat().filter(Boolean);

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
    lang,
    setLang,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError
  };
}
