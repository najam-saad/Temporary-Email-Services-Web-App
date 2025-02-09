'use client';

import { useEffect } from 'react';

export default function CarbonAds() {
  useEffect(() => {
    // Load Carbon Ads script
    const script = document.createElement('script');
    script.async = true;
    script.id = '_carbonads_js';
    script.src = '//cdn.carbonads.com/carbon.js?serve=YOUR_CARBON_ZONE_ID'; // Replace with your Carbon zone ID
    
    const carbonContainer = document.getElementById('carbon-container');
    if (carbonContainer) {
      carbonContainer.appendChild(script);
    }

    return () => {
      if (carbonContainer && script) {
        carbonContainer.removeChild(script);
      }
    };
  }, []);

  return <div id="carbon-container" className="carbon-ads" />;
} 