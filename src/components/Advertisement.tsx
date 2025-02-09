'use client';

import { useEffect, useRef } from 'react';

interface AdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export default function Advertisement({ slot, format = 'auto', className = '' }: AdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Check if AdSense is loaded
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  const getAdStyle = (format: string) => {
    switch (format) {
      case 'rectangle':
        return { display: 'block', minHeight: '250px', marginBottom: '1rem' };
      case 'horizontal':
        return { display: 'block', minHeight: '90px', marginBottom: '1rem' };
      case 'vertical':
        return { display: 'block', minHeight: '600px', marginBottom: '1rem' };
      default:
        return { display: 'block', minHeight: '100px', marginBottom: '1rem' };
    }
  };

  return (
    <div ref={adRef} className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={getAdStyle(format)}
        data-ad-client="ca-pub-9262259592522097"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
} 