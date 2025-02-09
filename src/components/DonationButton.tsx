'use client';

export default function DonationButton() {
  return (
    <div className="my-4 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Support Temp-emails</h3>
      <p className="text-sm text-gray-600 mb-3">
        Help us keep this service free and ad-free
      </p>
      <a 
        href="https://ko-fi.com/YOUR_USERNAME" // or other donation platforms
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        Buy us a coffee
      </a>
    </div>
  );
} 