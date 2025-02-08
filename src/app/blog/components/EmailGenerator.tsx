'use client';

import { useState, useEffect } from 'react';
import { Clock, Copy } from 'lucide-react';

interface EmailGeneratorProps {
  onGenerate: (email: string, duration: number) => void;
  currentEmail?: string;
}

export default function EmailGenerator({ onGenerate, currentEmail }: EmailGeneratorProps) {
  const [duration, setDuration] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate default email on first visit
  useEffect(() => {
    if (!currentEmail && !localStorage.getItem('visited')) {
      handleGenerate();
      localStorage.setItem('visited', 'true');
    }
  }, [currentEmail]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expireTime: duration })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      onGenerate(data.email, duration);
    } catch (err: any) {
      setError(err.message || 'Failed to generate email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (currentEmail) {
      await navigator.clipboard.writeText(currentEmail);
      // Show toast notification
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temporary Email Address
          </label>
          <div className="relative">
            <input
              type="text"
              value={currentEmail || ''}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              placeholder="Your temporary email will appear here"
            />
            {currentEmail && (
              <button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg bg-white"
          >
            <option value={10}>10 minutes</option>
            <option value={20}>20 minutes</option>
            <option value={30}>30 minutes</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}