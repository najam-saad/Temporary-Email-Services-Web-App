'use client';

interface PlaceholderAdProps {
  type: 'sidebar' | 'banner' | 'inline';
}

export default function PlaceholderAd({ type }: PlaceholderAdProps) {
  // Dimensions matching standard ad sizes
  const dimensions = {
    sidebar: 'w-[300px] h-[600px]',
    banner: 'w-full h-[90px]',
    inline: 'w-[300px] h-[250px]'
  };

  return (
    <div className={`bg-gray-50 rounded-lg ${dimensions[type]} flex items-center justify-center`}>
      {/* You can put your own promotional content here */}
      <div className="text-center p-4">
        <h3 className="text-lg font-medium text-gray-600">Support Our Service</h3>
        <p className="text-sm text-gray-500">Share with friends to help us grow</p>
      </div>
    </div>
  );
} 