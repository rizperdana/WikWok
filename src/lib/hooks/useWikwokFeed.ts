import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { WikiArticle, FeedItem } from '@/types';
import { FeedManager, FeedState } from '@/lib/feed-manager';
import { useEffect, useState, useRef } from 'react';
import { getRandomInt } from '@/lib/utils';
import { DEFAULT_LANG } from '../constants/languages';

export function useWikwokFeed(initialArticles: WikiArticle[] = []) {
  const queryClient = useQueryClient();
  const [lang, setLang] = useState<string>(DEFAULT_LANG);

  // Initialize with passed articles if available
  const [feedState, setFeedState] = useState<FeedState>({
    items: initialArticles.length > 0 ? initialArticles.map(article => ({
        type: 'article',
        data: article,
        id: article.title
    } as FeedItem)) : [],
    itemsSinceLastAd: initialArticles.length,
    nextAdGap: initialArticles.length > 0 ? getRandomInt(5, 10) : 0,
  });

  const initializedRef = useRef(false);
  const processedPagesRef = useRef(0);

  // Instant Local Detection
  useEffect(() => {
    if (typeof window !== 'undefined' && !initializedRef.current) {
        // Only run auto-detect if we didn't receive initial articles (which implies we pre-fetched for default lang)
        // OR if we want to switch lang dynamically?
        // For SSR, we usually stick to default or detected on server.
        // Let's keep it simple: if specific logic needed, add here.
        const browserLang = navigator.language.split('-')[0];
        if (browserLang && browserLang !== DEFAULT_LANG) {
             // If browser lang differs from default, we might want to switch?
             // But we already rendered initial articles in default lang.
             // Changing this triggers a refetch which might be jarring but correct.
             console.log('Detected browser lang:', browserLang);
             setLang(browserLang);
        }
    }
  }, []);

  // Initialize random gap (only if empty)
  useEffect(() => {
    if (!initializedRef.current && initialArticles.length === 0) {
        setFeedState(prev => ({
            ...prev,
            nextAdGap: getRandomInt(5, 10)
        }));
        initializedRef.current = true;
    } else if (initialArticles.length > 0 && !initializedRef.current) {
        // If we have initial articles, mark initialized
         initializedRef.current = true;
         // processedPagesRef.current should be 1 if we pass initialData to query
         processedPagesRef.current = 1;
    }
  }, []);

  // UseInfiniteQuery with lang dependency
  const { data, fetchNextPage, hasNextPage, isFetching, isError } = useInfiniteQuery({
    queryKey: ['wikwok-feed', lang],
    queryFn: async ({ pageParam = 0 }) => {
      // Initial load: 6 items (fast start). Subsequent: 8 items (larger batches)
      const limit = pageParam === 0 ? 6 : 8;
      const res = await fetch(`/api/feed?page=${pageParam}&lang=${lang}&limit=${limit}`);
      if (!res.ok) throw new Error('Network error');
      return res.json() as Promise<WikiArticle[]>;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 0 ? undefined : allPages.length;
    },
    initialPageParam: 0,
    // Only use initialData if we are on the default lang matching the SSR fetch
    initialData: (initialArticles.length > 0 && lang === DEFAULT_LANG) ? {
        pages: [initialArticles],
        pageParams: [0]
    } : undefined,
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
