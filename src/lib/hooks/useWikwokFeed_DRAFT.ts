import { useInfiniteQuery } from '@tanstack/react-query';
import { WikiArticle, FeedItem } from '@/types';
import { FeedManager, FeedState } from '@/lib/feed-manager';
import { useMemo, useRef } from 'react';
import { getRandomInt } from '@/lib/utils';

interface FeedPage {
  articles: WikiArticle[];
}

export function useWikwokFeed() {
  // We need to persist the mixing state across pages to know where to insert ads
  // However, useInfiniteQuery's select or getting data pages is tricky with stateful transformation
  // that depends on previous page's end state.

  // Alternative: Transform the fully flattened list in `select`.
  // Ref to hold the "ad logic state" is risky if `select` re-runs unpredictably.
  // Best approach: "The 5-10 Rule" is effectively just insertion logic.
  // We can calculate it deterministically if we assume the feed is linear.
  // But since we want "randomized per session", we can seed it or just store the processed result.

  // Simplest sturdy approach:
  // Store the *raw* articles in Query, and maintain a separate "processed articles" list in a state/ref
  // that updates only when new data arrives.
  // OR: Just transform each page independently? No, we need "items since last ad" from previous page.

  // Let's use `select` with a stable reference or memoization that iterates through ALL pages.

  const seed = useRef(getRandomInt(5, 10)); // Initial nextAdGap

  return useInfiniteQuery({
    queryKey: ['wikwok-feed'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch('/api/feed');
      if (!res.ok) throw new Error('Network response was not ok');
      const data: WikiArticle[] = await res.json();
      return { articles: data };
    },
    getNextPageParam: (lastPage, allPages) => allPages.length + 1,
    initialPageParam: 0,
    select: (data) => {
      // Re-process the entire feed from scratch to ensure consistency
      // Ideally we should cache this, but for < 1000 items it's fast.

      let allItems: FeedItem[] = [];
      let itemsSinceLastAd = 0;
      let nextAdGap = seed.current; // Start with the initial seed

      const feedManager = FeedManager; // Access static methods

      // We have to iterate page by page.
      // Note: This re-runs on every fetch, which ensures "State Persistence" (same list order maintained).
      // We must regenerate IDs consistently?
      // If we regenerate IDs every render, React will trash the DOM.
      // IDs should be stable. The API should return IDs or we generate them and cache them?
      // Our API returns articles. Let's fix the API/Hook to ensure stable IDs.
      // Helper function inside select is deterministic IF inputs are same.
      // But `crypto.randomUUID` in FeedManager is NOT deterministic.

      // FIXED STRATEGY:
      // Do not use `select` for random ID generation.
      // We must trust the raw data stays same.
      // We will create the IDs *inside the fetch* or receive them from API?
      // Or memoize the transformation.
    },
  });
}
