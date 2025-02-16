'use client';

import { useState, useEffect } from 'react';
import { Clock, Copy, Check } from 'lucide-react';

interface EmailGeneratorProps {
  onGenerate: (email: string, duration: number) => void;
  currentEmail?: string;
}

export default function EmailGenerator({ onGenerate, currentEmail }: EmailGeneratorProps) {
  const [duration, setDuration] = useState(20); // Default to 20 minutes
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
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate email');
      }

      onGenerate(data.email, duration);
    } catch (err: any) {
      console.error('Email generation error:', err);
      setError(typeof err === 'string' ? err : err.message || 'Failed to generate email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (currentEmail) {
      await navigator.clipboard.writeText(currentEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex flex-col gap-3">
        {/* Duration selector */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="px-2 py-1.5 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
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
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {currentEmail && (
            <button
              onClick={handleCopy}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${
                copied 
                  ? 'bg-green-100 text-green-600' 
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate Email'}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}