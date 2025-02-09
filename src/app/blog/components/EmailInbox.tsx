'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Mail, RefreshCw, Search, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

interface EmailMessage {
  id: string;
  from: string;
  to: string;
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
  const [copied, setCopied] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!email) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`/api/messages/${encodeURIComponent(email)}`);
      
      if (!response.data || !Array.isArray(response.data.messages)) {
        setMessages([]);
        setFilteredMessages([]);
        return;
      }

      const sortedMessages = response.data.messages
        .filter((msg: EmailMessage) => msg.to === email)
        .sort((a: EmailMessage, b: EmailMessage) => b.receivedAt - a.receivedAt);

      setMessages(sortedMessages);
      setFilteredMessages(sortedMessages);
      setLastChecked(new Date());
    } catch (err: any) {
      console.error('Failed to fetch messages:', err);
      setError(err.response?.data?.error || 'Failed to fetch messages');
      setMessages([]);
      setFilteredMessages([]);
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

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 bg-white rounded-lg shadow p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="w-full sm:w-auto">
          <h2 className="text-base font-semibold">Inbox for</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600 break-all">{email}</p>
            <button
              onClick={() => handleCopy(email)}
              className={`p-1 rounded-md transition-colors ${
                copied ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <CountdownTimer expiryTime={expiresAt} onExpire={onExpire} />
          <button
            onClick={fetchMessages}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 active:bg-blue-200 transition-colors w-full sm:w-auto justify-center text-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border rounded-lg text-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      {paginatedMessages.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          {searchTerm ? 'No messages match your search.' : 'No messages yet. They will appear here automatically.'}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedMessages.map((message) => (
              <div key={message.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <p className="text-sm font-medium">{message.from || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.receivedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium">{message.subject || '(No subject)'}</p>
                {message.content && (
                  <div className="mt-1.5 text-sm text-gray-600">{message.content}</div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border rounded-md disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border rounded-md disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 