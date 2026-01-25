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

  // Initial Detection: IP-based Region Detection
  useEffect(() => {
    async function detectRegion() {
        try {
            // Using a public IP API for personalization
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();

            if (data.country_code === 'ID') {
                setLang('id');
            } else if (data.country_code === 'JP') {
                setLang('ja');
            } else if (data.country_code === 'FR') {
                setLang('fr');
            } else if (data.country_code === 'DE') {
                setLang('de');
            }
            // Add more common mappings if needed
        } catch (e) {
            console.warn('IP detection failed, defaulting to EN:', e);
        }
    }
    detectRegion();
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
      const res = await fetch(`/api/feed?page=${pageParam}&lang=${lang}`);
      if (!res.ok) throw new Error('Network error');
      return res.json() as Promise<WikiArticle[]>;
    },
    getNextPageParam: (lastPage, allPages) => allPages.length,
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
    lang,
    setLang,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError
  };
}
