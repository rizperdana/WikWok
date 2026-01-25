'use client';


export function GoogleAdSense() {
  const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  if (!pId) return null;

  return (
    <>
      <meta name="google-adsense-account" content={`ca-pub-${pId.replace('pub-', '')}`} />
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId.replace('pub-', '')}`}
        crossOrigin="anonymous"
      />
    </>
  );
}
