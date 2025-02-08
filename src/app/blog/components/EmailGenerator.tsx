import { useState } from 'react';
import { Clock, Copy } from 'lucide-react';

interface EmailGeneratorProps {
  onGenerate: (email: string, duration: number) => void;
}

export default function EmailGenerator({ onGenerate }: EmailGeneratorProps) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [duration, setDuration] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const durationOptions = [
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 20, label: '20 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
  ];

  const generateEmail = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Generating email with duration:', duration);
      
      const randomString = Math.random().toString(36).substring(2, 8);
      const tempEmail = `${randomString}@tempfreeemail.com`;

      console.log('Requesting email generation:', tempEmail);

      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: tempEmail,
          expireTime: duration
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error Response:', data);
        throw new Error(data.error || 'Failed to generate email');
      }

      console.log('Email generated successfully:', data);
      setEmail(tempEmail);
      onGenerate(tempEmail, duration);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col gap-4">
        {/* Duration Selector */}
        <div className="flex items-center gap-3 text-gray-600">
          <Clock className="w-5 h-5" />
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {durationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Email Generator */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            readOnly
            value={email}
            placeholder="Click generate to create email"
            className="flex-grow p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium"
          />
          <button
            onClick={copyToClipboard}
            disabled={!email || isLoading}
            className={`p-4 rounded-lg transition-all duration-300 ${
              copied 
                ? 'bg-green-500 text-white' 
                : email 
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title="Copy to clipboard"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={generateEmail}
            disabled={isLoading}
            className={`p-4 bg-blue-600 text-white rounded-lg transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
      {copied && (
        <p className="text-sm text-green-600 mt-2">
          Copied to clipboard!
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}