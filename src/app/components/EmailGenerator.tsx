import { useState } from 'react';
import { Copy, Clock } from 'lucide-react';

interface EmailGeneratorProps {
  onGenerate: (email: string, duration: number) => void;
}

export default function EmailGenerator({ onGenerate }: EmailGeneratorProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(20); // Default 20 minutes

  const generateEmail = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Log the request
      console.log('Generating email with duration:', duration);
      
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `${Math.random().toString(36).substring(2, 8)}@tempmail.org`,
          expireTime: duration
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to generate email');
      }

      const data = await response.json();
      setEmail(data.email);
      onGenerate(data.email, duration);
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of your component code...
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col gap-4">
        {/* Duration Selector */}
        <div className="flex items-center gap-3 text-gray-600">
          <Clock className="w-5 h-5" />
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm"
            disabled={isLoading}
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={20}>20 minutes</option>
            <option value={30}>30 minutes</option>
          </select>
        </div>

        {/* Email Display and Controls */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            readOnly
            value={email}
            placeholder="Click generate to create email"
            className="flex-grow p-4 bg-gray-50 rounded-lg"
          />
          <button
            onClick={generateEmail}
            disabled={isLoading}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>
    </div>
  );
} 