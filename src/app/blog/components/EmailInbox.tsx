import { useState, useEffect, useCallback, useRef } from 'react';
import CountdownTimer from './CountdownTimer';
import { Mail, RefreshCw } from 'lucide-react';

interface Email {
  id: string;
  from: string;
  subject: string;
  content: string;
  receivedAt: number;
}

interface EmailInboxProps {
  email: string;
  expiryTime: number;
  onExpire: () => void;
}

export default function EmailInbox({ email, expiryTime, onExpire }: EmailInboxProps) {
  const [messages, setMessages] = useState<Email[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchEmails = useCallback(async () => {
    if (!email) return;
    try {
      setIsRefreshing(true);
      setError(null);
      
      const response = await fetch(`/api?email=${email}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch emails');
      }

      if (data.expired) {
        onExpire();
        return;
      }

      if (data.warning) {
        setError(data.warning);
      }

      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch emails');
    } finally {
      setIsRefreshing(false);
    }
  }, [email, onExpire]);

  useEffect(() => {
    if (!email) return;
    
    fetchEmails();
    intervalRef.current = setInterval(fetchEmails, 10000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchEmails, email]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg mt-8">
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Inbox</h2>
        <div className="flex items-center gap-3">
          <CountdownTimer expiryTime={expiryTime} onExpire={onExpire} />
          <button
            onClick={() => fetchEmails()}
            disabled={isRefreshing}
            className={`p-2 rounded-full hover:bg-gray-100 transition-all ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            title="Refresh inbox"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-100">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      <div className="p-8">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Your inbox is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{msg.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">From: {msg.from}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTime(msg.receivedAt)}
                  </span>
                </div>
                <div
                  className="mt-3 text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 