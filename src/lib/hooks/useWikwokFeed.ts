import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { WikiArticle, FeedItem } from '@/types';
import { FeedManager, FeedState } from '@/lib/feed-manager';
import { useEffect, useState, useRef } from 'react';
import { getRandomInt } from '@/lib/utils';
import { DEFAULT_LANG } from '../constants/languages';
import { 
  detectUserLanguage, 
  getStoredLanguage, 
  storeLanguagePreference, 
  hasManualLanguageOverride,
  GeolocationResult 
} from '@/lib/utils/geolocation';

function generateInitialId(article: WikiArticle) {
  const slug = article.title.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');
  return `wiki-${slug}-${article.lang}`;
}

export function useWikwokFeed(initialArticles: WikiArticle[] = []) {
  const queryClient = useQueryClient();
  const [lang, setLang] = useState<string>(DEFAULT_LANG);
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(false);
  const [detectionResult, setDetectionResult] = useState<GeolocationResult | null>(null);
  
  // Track if we've processed initial articles
  const initialProcessed = useRef(false);

  // Initialize with passed articles using deterministic IDs
  const [feedState, setFeedState] = useState<FeedState>(() => {
    if (initialArticles.length > 0) {
      const items: FeedItem[] = initialArticles.map(article => ({
        type: 'article',
        data: article,
        id: generateInitialId(article)
      }));
      return {
        items,
        itemsSinceLastAd: 0,
        nextAdGap: getRandomInt(5, 10),
      };
    }
    return {
      items: [],
      itemsSinceLastAd: 0,
      nextAdGap: getRandomInt(5, 10),
    };
  });

  const processedPagesRef = useRef(0);

  // Enhanced language detection with geolocation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initializeLanguage = async () => {
        try {
          setIsDetectingLanguage(true);
          
          const storedLang = getStoredLanguage();
          if (storedLang) {
            console.log('Using stored language preference:', storedLang);
            setLang(storedLang);
            return;
          }

          const result = await detectUserLanguage();
          setDetectionResult(result);
          
          console.log('Detected language:', result.detectedLang, 'via:', result.method);
          
          if (result.detectedLang !== DEFAULT_LANG) {
            setLang(result.detectedLang);
          }
          
        } catch (error) {
          console.error('Language detection failed:', error);
          setLang(DEFAULT_LANG);
        } finally {
          setIsDetectingLanguage(false);
        }
      };

      initializeLanguage();
    }
  }, []);

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang);
    storeLanguagePreference(newLang);
    console.log('Language changed to:', newLang, '(manual override)');
  };

  // UseInfiniteQuery with lang dependency
  const { data, fetchNextPage, hasNextPage, isFetching, isError } = useInfiniteQuery({
    queryKey: ['wikwok-feed', lang],
    queryFn: async ({ pageParam = 0 }) => {
      const limit = 8;
      const res = await fetch(`/api/feed?page=${pageParam}&lang=${lang}&limit=${limit}`);
      if (!res.ok) throw new Error('Network error');
      const articles = await res.json() as WikiArticle[];
      // Return empty if no articles to stop pagination
      return articles.length > 0 ? articles : [];
    },
    getNextPageParam: (lastPage, allPages) => {
      // Only return next page if we got articles
      if (lastPage.length === 0) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Reset feed state when lang changes
  useEffect(() => {
    setFeedState({
      items: [],
      itemsSinceLastAd: 0,
      nextAdGap: getRandomInt(5, 10)
    });
    processedPagesRef.current = 0;
    initialProcessed.current = false;
    queryClient.resetQueries({ queryKey: ['wikwok-feed', lang] });
  }, [lang, queryClient]);

  // Process new pages from React Query
  useEffect(() => {
    if (!data?.pages || data.pages.length === 0) return;
    
    const totalPages = data.pages.length;
    
    // Skip if already processed
    if (totalPages <= processedPagesRef.current) return;
    
    // Get only new pages
    const newPageIndex = processedPagesRef.current;
    if (newPageIndex >= data.pages.length) return;
    
    const newArticles = data.pages[newPageIndex];
    
    if (!newArticles || newArticles.length === 0) {
      // No more articles, stop here
      processedPagesRef.current = totalPages;
      return;
    }
    
    console.log(`Processing ${newArticles.length} articles from page ${newPageIndex + 1}`);
    
    setFeedState((prevState) => {
      return FeedManager.processBatch(
        newArticles,
        prevState.items,
        prevState.itemsSinceLastAd,
        prevState.nextAdGap
      );
    });
    
    processedPagesRef.current = totalPages;
  }, [data]);

  return {
    items: feedState.items,
    lang,
    setLang: handleLanguageChange,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    isDetectingLanguage,
    detectionResult,
    hasManualOverride: hasManualLanguageOverride()
  };
}
