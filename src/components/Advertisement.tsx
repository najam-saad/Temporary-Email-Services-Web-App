'use client';

import { useEffect, useRef } from 'react';

interface AdvertisementProps {
  slot: string;
  format: 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}

export default function Advertisement({ slot, format, className = '' }: AdvertisementProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle;
      if (adsbygoogle && adRef.current) {
        adsbygoogle.push({});
      }
    } catch (err) {
      console.error('Error initializing AdSense:', err);
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
        style={{
          display: 'block',
          ...(format === 'horizontal' && { width: '728px', height: '90px' }),
          ...(format === 'vertical' && { width: '160px', height: '600px' }),
          ...(format === 'rectangle' && { width: '300px', height: '250px' }),
        }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with your AdSense publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
} 