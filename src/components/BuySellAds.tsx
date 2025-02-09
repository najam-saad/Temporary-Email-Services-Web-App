'use client';

import { useEffect } from 'react';

interface BSAProps {
  zone: string;
  format?: string;
}

export default function BuySellAds({ zone, format = 'flexbar' }: BSAProps) {
  useEffect(() => {
    // Load BSA script
    const script = document.createElement('script');
    script.src = '//m.servedby-buysellads.com/monetization.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Initialize BSA
      if (typeof window._bsa !== 'undefined') {
        window._bsa.init('default', zone, 'placement:demo', {
          target: `#bsa-${zone}`,
          format,
        });
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [zone, format]);

  return <div id={`bsa-${zone}`} className="bsa-ads" />;
} 