'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Mail, RefreshCw } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  content: string;
  receivedAt: number;
}

interface EmailInboxProps {
  email: string;
  expiresAt: number;
  onExpire: () => void;
}

export default function EmailInbox({ email, expiresAt, onExpire }: EmailInboxProps) {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [error, setError] = useState('');

  const fetchMessages = useCallback(async () => {
    if (!email) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`/api?email=${email}`);
      const sortedMessages = response.data.messages.sort(
        (a: EmailMessage, b: EmailMessage) => b.receivedAt - a.receivedAt
      );
      setMessages(sortedMessages);
      setLastChecked(new Date());
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Inbox for {email}</h2>
          <p className="text-sm text-gray-500">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CountdownTimer expiryTime={expiresAt} onExpire={onExpire} />
          <button
            onClick={fetchMessages}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {messages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No messages yet. They will appear here automatically.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{message.from || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(message.receivedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="font-medium">{message.subject || '(No subject)'}</p>
              {message.content && (
                <div className="mt-2 text-gray-600">{message.content}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 