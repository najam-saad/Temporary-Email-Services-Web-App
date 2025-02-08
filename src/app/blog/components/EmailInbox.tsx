'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, RefreshCw } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  content: string;
  receivedAt: number;
  url?: string;
}

interface EmailInboxProps {
  email: string;
  expiresAt: number;
  onExpire?: () => void;
}

export default function EmailInbox({ email, expiresAt, onExpire }: EmailInboxProps) {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkInbox = async () => {
    if (!email) return; // Don't check if no email

    try {
      setLoading(true);
      console.log('Checking inbox for:', email);

      const response = await axios.get('/api', {
        params: { email }
      });

      // Ensure messages is always an array
      const receivedMessages = response.data.messages || [];
      console.log('Received messages:', receivedMessages);

      setMessages(receivedMessages);
      setLastCheck(new Date());
      setError(null);
    } catch (error: any) {
      console.error('Inbox check failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startChecking = async () => {
      await checkInbox(); // Initial check

      interval = setInterval(() => {
        const now = Date.now();
        if (now < expiresAt) {
          checkInbox();
        } else {
          clearInterval(interval);
          onExpire?.();
        }
      }, 10000);
    };

    startChecking();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [email, expiresAt, onExpire]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <h3 className="font-bold">Error checking inbox</h3>
        <p>{error}</p>
        <button 
          onClick={checkInbox}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Inbox for {email}</h2>
        {lastCheck && (
          <p className="text-sm text-gray-500">
            Last checked: {lastCheck.toLocaleTimeString()}
          </p>
        )}
      </div>

      {loading ? (
        <div className="p-4 text-center">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No messages yet. They will appear here automatically.
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((message) => (
            <div key={message.id} className="p-4 border rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">{message.from}</span>
                <span className="text-sm text-gray-500">
                  {new Date(message.receivedAt).toLocaleString()}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{message.subject}</h3>
              {message.content && (
                <div className="mt-2 text-gray-700">{message.content}</div>
              )}
              {message.url && (
                <a 
                  href={message.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-blue-600 hover:underline"
                >
                  View full message
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 