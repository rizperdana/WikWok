export interface WikiArticle {
  title: string;
  extract: string;
  originalimage?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls: {
    desktop: {
      page: string;
    };
    mobile: {
      page: string;
    };
  };
  lang?: string;
  pageid?: number;
  ns?: number;
  // Store the page URL directly for article reader
  page_url?: string;
}

export type FeedItem =
  | { type: 'article'; data: WikiArticle; id: string }
  | { type: 'ad'; id: string };

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}
