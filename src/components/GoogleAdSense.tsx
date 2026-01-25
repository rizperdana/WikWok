'use client';

import Script from 'next/script';

interface GoogleAdSenseProps {
  pId: string;
}

export function GoogleAdSense({ pId }: GoogleAdSenseProps) {
  if (!pId) return null;

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
