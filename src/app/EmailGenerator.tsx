import { useState } from 'react';
import { Copy, RefreshCw, Clock } from 'lucide-react';

interface EmailGeneratorProps {
  onGenerate: (email: string, duration: number) => void;
}

export default function EmailGenerator({ onGenerate }: EmailGeneratorProps) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [duration, setDuration] = useState(20); // Default 20 minutes

  const durationOptions = [
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 20, label: '20 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
  ];

  const generateEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    const domains = ['ahaks.com', 'tempmail.org', 'disposable.com'];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const newEmail = `${randomString}@${randomDomain}`;
    setEmail(newEmail);
    onGenerate(newEmail, duration);
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
            className={`p-4 rounded-lg transition-all duration-300 ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Copy to clipboard"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={generateEmail}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate
          </button>
        </div>
      </div>
      {copied && (
        <p className="text-sm text-green-600 mt-2">
          Copied to clipboard!
        </p>
      )}
    </div>
  );
}