import { Feed } from "@/components/feed/Feed";
import { getFeedArticles } from "@/lib/api/feed";
import { DEFAULT_LANG } from "@/lib/constants/languages";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const initialArticles = await getFeedArticles(DEFAULT_LANG, 3);

  return (
    <Feed initialArticles={initialArticles} />
  );
}
