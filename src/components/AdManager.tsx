'use client';

import GoogleAdsense from './GoogleAdsense';
import MediaNet from './MediaNet';
import CarbonAds from './CarbonAds';
import BuySellAds from './BuySellAds';

interface AdManagerProps {
  position: 'top' | 'sidebar' | 'content' | 'footer';
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
}

export default function AdManager({ position, format = 'auto' }: AdManagerProps) {
  // Rotate between different ad networks
  const getAdComponent = () => {
    // Simple rotation logic - you can make this more sophisticated
    const random = Math.random();
    
    if (random < 0.4) {
      return <GoogleAdsense slot={`${position}-slot`} format={format} />;
    } else if (random < 0.7) {
      return <MediaNet zone={`${position}-zone`} />;
    } else if (random < 0.9) {
      return <CarbonAds />;
    } else {
      return <BuySellAds zone={`${position}-zone`} />;
    }
  };

  return (
    <div className={`ad-manager ${position}`}>
      {getAdComponent()}
    </div>
  );
} 