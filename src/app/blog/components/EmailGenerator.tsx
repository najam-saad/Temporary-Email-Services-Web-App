'use client';

import { useState, useEffect } from 'react';
import { Clock, Copy, Check } from 'lucide-react';

interface EmailGeneratorProps {
  onGenerate: (email: string, duration: number) => void;
  currentEmail?: string;
}

export default function EmailGenerator({ onGenerate, currentEmail }: EmailGeneratorProps) {
  const [duration, setDuration] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col gap-4">
        {/* Duration selector */}
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={10}>10 minutes</option>
            <option value={20}>20 minutes</option>
            <option value={30}>30 minutes</option>
          </select>
        </div>

        {/* Email input and copy button */}
        <div className="relative">
          <input
            type="text"
            value={currentEmail || ''}
            readOnly
            placeholder="Click generate to create email"
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {currentEmail && (
            <button
              onClick={handleCopy}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md transition-colors ${
                copied 
                  ? 'bg-green-100 text-green-600' 
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}