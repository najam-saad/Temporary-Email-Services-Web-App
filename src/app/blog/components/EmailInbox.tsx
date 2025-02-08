import { useState, useEffect, useCallback } from 'react';
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

  const fetchEmails = async () => {
    if (!email) return;
    try {
      setIsRefreshing(true);
      const response = await fetch(`/api?email=${email}`);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 10000);
    return () => clearInterval(interval);
  }, [email, fetchEmails]);

  const handleRefresh = useCallback(() => {
    fetchEmails();
  }, [fetchEmails]);

  return (
    <div className="bg-white rounded-xl shadow-lg mt-8">
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Inbox</h2>
        <div className="flex items-center gap-3">
          <CountdownTimer expiryTime={expiryTime} onExpire={onExpire} />
          <button
            onClick={handleRefresh}
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
                    {new Date(msg.receivedAt).toLocaleTimeString()}
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