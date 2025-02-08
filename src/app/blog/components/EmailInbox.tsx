'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Mail, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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

const MESSAGES_PER_PAGE = 5;

export default function EmailInbox({ email, expiresAt, onExpire }: EmailInboxProps) {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<EmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
      setFilteredMessages(sortedMessages);
      setLastChecked(new Date());
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  // Filter messages when search term changes
  useEffect(() => {
    const filtered = messages.filter(message => 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMessages(filtered);
    setCurrentPage(1);
  }, [searchTerm, messages]);

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const totalPages = Math.ceil(filteredMessages.length / MESSAGES_PER_PAGE);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * MESSAGES_PER_PAGE,
    currentPage * MESSAGES_PER_PAGE
  );

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
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

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {paginatedMessages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No messages match your search.' : 'No messages yet. They will appear here automatically.'}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedMessages.map((message) => (
              <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
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

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 