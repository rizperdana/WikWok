'use client';

import Script from 'next/script';

export function GoogleAdSense() {
  const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  if (!pId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId.replace('pub-', '')}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
