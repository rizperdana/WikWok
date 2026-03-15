import { WikiArticle, FeedItem } from '@/types';
import { getRandomInt } from '@/lib/utils';

export interface FeedState {
  items: FeedItem[];
  itemsSinceLastAd: number;
  nextAdGap: number;
}

export class FeedManager {
  private static generateAdId() {
    return `ad-${crypto.randomUUID()}`;
  }

  private static generateArticleId(article: WikiArticle) {
    // Use deterministic ID based on title to detect duplicates
    const slug = article.title.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');
    return `wiki-${slug}-${article.lang}`;
  }

  static processBatch(
    newArticles: WikiArticle[],
    currentItems: FeedItem[],
    lastAdGapCounter: number,
    nextAdGap: number
  ): FeedState {
    const mixedItems: FeedItem[] = [];
    let gapCounter = lastAdGapCounter;
    let currentGapTarget = nextAdGap;

    // Get existing article IDs for deduplication
    const existingIds = new Set(currentItems.map(item => item.id));

    newArticles.forEach((article) => {
      // Generate ID first to check for duplicates
      const articleId = this.generateArticleId(article);
      
      // Skip if already exists
      if (existingIds.has(articleId)) {
        console.log('Skipping duplicate:', article.title);
        return;
      }
      
      existingIds.add(articleId);
      
      mixedItems.push({
        type: 'article',
        data: article,
        id: articleId
      });
      gapCounter++;

      if (gapCounter >= currentGapTarget) {
        mixedItems.push({
          type: 'ad',
          id: this.generateAdId()
        });
        gapCounter = 0;
        currentGapTarget = getRandomInt(5, 10);
      }
    });

    return {
      items: [...currentItems, ...mixedItems],
      itemsSinceLastAd: gapCounter,
      nextAdGap: currentGapTarget
    };
  }
}
