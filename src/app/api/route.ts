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

export async function POST(request: Request) {
  console.log('Starting email generation...');
  
  // Verify configuration
  if (!API_KEY || !EMAIL_USER || !DOMAIN) {
    console.error('Missing configuration:', {
      hasApiKey: !!API_KEY,
      hasEmailUser: !!EMAIL_USER,
      hasDomain: !!DOMAIN
    });
    return NextResponse.json(
      { error: "Missing configuration" },
      { status: 500 }
    );
  }

  try {
    // Generate random email
    const randomString = Math.random().toString(36).substring(2, 8);
    const email = `${randomString}@${DOMAIN}`;
    const { expireTime } = await request.json();

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

    // Store in memory
    const expiration = Date.now() + (expireTime * 60 * 1000);
    emailStore[email] = { messages: [], expiresAt: expiration };

    return NextResponse.json({
      email,
      expiresAt: expiration,
      success: true
    });
  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return NextResponse.json(
      { error: error.response?.data?.error || "Failed to create email" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function GET(request: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  // Handle root endpoint
  if (!email) {
    return NextResponse.json({ status: 'ok' }, { headers });
  }

  try {
    const response = await axios.get(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/logs`,
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
    );

    const messages = response.data.logs
      ?.filter((log: ImprovMXLog) => log.recipient.address === email)
      ?.map((log: ImprovMXLog) => ({
        id: log.id,
        from: log.sender.address,
        subject: log.subject || '(No Subject)',
        content: '',  // Content needs to be fetched separately if needed
        receivedAt: log.created,
        messageId: log.messageId,
        url: log.url
      })) || [];

    return NextResponse.json({
      messages,
      count: messages.length
    }, { headers });

  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    return NextResponse.json({
      error: "Could not fetch messages",
      details: error.response?.data?.error || error.message
    }, { 
      status: error.response?.status || 500,
      headers 
    });
  }
} 