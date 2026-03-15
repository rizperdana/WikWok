
'use client';

import { useEffect, useState } from 'react';

export function GoogleAdSense() {
  const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  const [showSaweria, setShowSaweria] = useState(false);

  useEffect(() => {
    if (!pId) {
      setShowSaweria(true);
      return;
    }

    // Load Google AdSense
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId.replace('pub-', '')}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onerror = () => {
      console.warn('Google AdSense failed to load, showing Saweria fallback');
      setShowSaweria(true);
    };
    document.head.appendChild(script);

    // Fallback check after 3 seconds
    const timeout = setTimeout(() => {
      // @ts-ignore - adsbygoogle is loaded from external script
      if (!window.adsbygoogle) {
        setShowSaweria(true);
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [pId]);

  useEffect(() => {
    if (showSaweria) {
      const saweriaScript = document.createElement('script');
      saweriaScript.src = 'https://s.id/saweria';
      saweriaScript.async = true;
      saweriaScript.defer = true;
      document.head.appendChild(saweriaScript);
    }
  }, [showSaweria]);

  return null;
}
