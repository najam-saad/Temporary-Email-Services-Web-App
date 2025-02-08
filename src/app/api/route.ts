import { NextResponse } from 'next/server';
import axios from 'axios';

interface ImprovMXEmail {
  id: string;
  from: string;
  subject: string;
  html?: string;
  text?: string;
  date: string;
}

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  content: string;
  receivedAt: number;
}

interface EmailStore {
  [key: string]: {
    messages: EmailMessage[];
    expiresAt: number;
  };
}

const emailStore: EmailStore = {};
const DOMAIN = process.env.DOMAIN || 'tempfreeemail.com';
const API_KEY = process.env.IMPROVMX_API_KEY || '';
const EMAIL_USER = process.env.EMAIL_USER || '';

// Fix authorization header
const authHeader = Buffer.from(`api:${API_KEY}`).toString('base64');

interface ImprovMXResponse {
  emails: ImprovMXEmail[];
}

interface ImprovMXLog {
  id: string;
  created: number;
  subject: string;
  sender: {
    address: string;
    name?: string;
  };
  recipient: {
    address: string;
    name?: string;
  };
  forward: {
    address: string;
    name?: string;
  };
  messageId: string;
  url?: string;
}

interface APIResponse<T> {
  data: T;
  error?: any;
}

interface ImprovMXMessage {
  id: string;
  sender?: {
    address: string;
  };
  recipient?: {
    address: string;
  } | string;
  from?: string;
  to?: string;
  subject?: string;
  content?: string;
  text?: string;
  date?: string;
  created?: number;
  messageId?: string;
  url?: string;
}

interface MessagesResponse {
  messages: ImprovMXMessage[];
}

interface LogsResponse {
  logs: ImprovMXMessage[];
}

export async function POST(request: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  console.log('Starting email generation...');
  
  try {
    // Verify configuration
    if (!API_KEY || !EMAIL_USER || !DOMAIN) {
      console.error('Missing configuration:', {
        hasApiKey: !!API_KEY,
        hasEmailUser: !!EMAIL_USER,
        hasDomain: !!DOMAIN
      });
      return NextResponse.json(
        { error: "Missing configuration" },
        { status: 500, headers }
      );
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const expireTime = body.expireTime || 10; // Default to 10 minutes

    // Generate random email
    const randomString = Math.random().toString(36).substring(2, 8);
    const email = `${randomString}@${DOMAIN}`;

    console.log('Creating alias:', {
      email,
      expireTime,
      forward: EMAIL_USER
    });

    // Create alias in ImprovMX
    const improvmxResponse = await axios.post(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases`,
      {
        alias: email.split('@')[0],
        forward: EMAIL_USER
      },
      {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('ImprovMX response:', improvmxResponse.data);

    // Calculate expiration
    const expiration = Date.now() + (expireTime * 60 * 1000);

    return NextResponse.json({
      email,
      expiresAt: expiration,
      success: true
    }, { headers });

  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: error.response?.data?.error || "Failed to create email" },
      { status: error.response?.status || 500, headers }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    console.log('Fetching emails for:', email);
    
    // Try both messages and logs endpoints
    const [messagesResponse, logsResponse] = await Promise.all([
      axios.get<MessagesResponse>(
        `https://api.improvmx.com/v3/domains/${DOMAIN}/messages`,
        {
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/json'
          },
          params: { 
            recipient: email,
            limit: 50,
            order: 'desc'
          }
        }
      ).catch(error => ({ 
        data: { messages: [] }, 
        error 
      })),

      axios.get<LogsResponse>(
        `https://api.improvmx.com/v3/domains/${DOMAIN}/logs`,
        {
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/json'
          },
          params: { 
            recipient: email,
            limit: 50,
            order: 'desc'
          }
        }
      ).catch(error => ({ 
        data: { logs: [] }, 
        error 
      }))
    ]);

    // Combine and deduplicate messages
    const allMessages = [
      ...(messagesResponse.data.messages || []),
      ...(logsResponse.data.logs || [])
    ].filter((msg, index, self) => 
      index === self.findIndex(m => m.id === msg.id)
    );

    const messages = allMessages
      .map(msg => {
        // Helper function to get recipient
        const getRecipient = (msg: ImprovMXMessage) => {
          if (typeof msg.recipient === 'string') return msg.recipient;
          if (msg.recipient?.address) return msg.recipient.address;
          return msg.to || email;
        };

        return {
          id: msg.id,
          from: msg.sender?.address || msg.from || 'Unknown',
          to: getRecipient(msg),
          subject: msg.subject || '(No Subject)',
          content: msg.content || msg.text || '',
          receivedAt: msg.created || new Date(msg.date || '').getTime(),
          messageId: msg.messageId,
          url: msg.url
        };
      })
      .sort((a, b) => b.receivedAt - a.receivedAt);

    console.log('Messages found:', messages.length);

    return NextResponse.json({
      messages,
      count: messages.length,
      debug: {
        email,
        messagesCount: messagesResponse.data.messages?.length || 0,
        logsCount: logsResponse.data.logs?.length || 0
      }
    }, { headers });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({
      messages: [],
      count: 0,
      error: error.message || 'Failed to fetch messages'
    }, { 
      status: error.response?.status || 500,
      headers 
    });
  }
} 