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
  lang?: string; // added for checking which wiki it came from
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
