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
    return `wiki-${article.title.replace(/\s+/g, '-').toLowerCase()}-${crypto.randomUUID()}`;
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

    newArticles.forEach((article) => {
      mixedItems.push({
        type: 'article',
        data: article,
        id: this.generateArticleId(article)
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
