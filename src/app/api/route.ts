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

interface MessagesResponse {
  messages: Array<{
    id: string;
    from?: string;
    sender?: { address: string };
    subject?: string;
    content?: string;
    created?: number;
    date?: string;
    messageId?: string;
    url?: string;
  }>;
}

interface LogsResponse {
  logs: Array<{
    id: string;
    from?: string;
    sender?: { address: string };
    subject?: string;
    content?: string;
    created?: number;
    date?: string;
    messageId?: string;
    url?: string;
  }>;
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
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    // Handle root endpoint
    if (!email) {
      return NextResponse.json({ 
        status: 'ok',
        messages: [],
        count: 0
      }, { headers });
    }

    console.log('Fetching emails for:', email);
    console.log('Using ImprovMX API Key:', API_KEY ? 'Present' : 'Missing');
    console.log('Domain:', DOMAIN);

    console.log('API Request:', {
      email,
      timestamp: new Date().toISOString(),
      headers: Object.fromEntries(request.headers),
      url: request.url
    });

    console.log('Making ImprovMX API requests for:', email);
    
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
            to: email,
            limit: 50,
            order: 'desc'
          }
        }
      ).catch(error => ({ 
        data: { messages: [] }, 
        error 
      } as APIResponse<MessagesResponse>)),

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
      } as APIResponse<LogsResponse>))
    ]);

    console.log('API Responses:', {
      messages: {
        count: messagesResponse.data.messages?.length,
        error: (messagesResponse as APIResponse<MessagesResponse>).error?.message
      },
      logs: {
        count: logsResponse.data.logs?.length,
        error: (logsResponse as APIResponse<LogsResponse>).error?.message
      }
    });

    // Combine and deduplicate messages
    const allMessages = [
      ...(messagesResponse.data.messages || []),
      ...(logsResponse.data.logs || [])
    ].filter((msg, index, self) => 
      index === self.findIndex(m => m.id === msg.id)
    );

    const messages = allMessages
      .map(msg => ({
        id: msg.id,
        from: msg.sender?.address || msg.from || 'Unknown',
        subject: msg.subject || '(No Subject)',
        content: msg.content || '',
        receivedAt: msg.created || new Date(msg.date || '').getTime(),
        messageId: msg.messageId,
        url: msg.url
      }))
      .sort((a, b) => b.receivedAt - a.receivedAt);

    return NextResponse.json({
      messages: messages || [], // Ensure we always return an array
      count: messages?.length || 0,
      debug: {
        email,
        messagesCount: messagesResponse.data.messages?.length || 0,
        logsCount: logsResponse.data.logs?.length || 0,
        combinedCount: messages?.length || 0
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