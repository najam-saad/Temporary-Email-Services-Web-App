'use client';

import { useEffect, useState, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';
import { Search, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  html?: string;
  receivedAt: number;
}

interface EmailInboxProps {
  email: string;
  expiresAt: number;
  onExpire: () => void;
}

const MESSAGES_PER_PAGE = 5;
let socket: Socket | null = null;

export default function EmailInbox({ email, expiresAt, onExpire }: EmailInboxProps) {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<EmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  // Initialize Socket.io connection
  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
        withCredentials: true,
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      
      socket.on('connect', () => {
        console.log('Connected to Socket.io server');
        setError('');
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setError('Failed to connect to message server');
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  // Subscribe to email updates
  useEffect(() => {
    if (socket && email) {
      socket.emit('subscribe', email);

      socket.on('messages', (initialMessages: EmailMessage[]) => {
        setMessages(initialMessages);
        setFilteredMessages(initialMessages);
        setLastChecked(new Date());
      });

      socket.on('new-message', (newMessage: EmailMessage) => {
        setMessages(prev => {
          const updated = [newMessage, ...prev];
          setFilteredMessages(
            updated.filter(message =>
              message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
              message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
              message.content.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
          return updated;
        });
        setLastChecked(new Date());
      });

      return () => {
        socket?.emit('unsubscribe', email);
        socket?.off('messages');
        socket?.off('new-message');
      };
    }
  }, [email, searchTerm]);

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

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPages = Math.ceil(filteredMessages.length / MESSAGES_PER_PAGE);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * MESSAGES_PER_PAGE,
    currentPage * MESSAGES_PER_PAGE
  );

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
                  <div 
                    className="mt-1.5 text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ 
                      __html: message.html || message.content 
                    }}
                  />
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