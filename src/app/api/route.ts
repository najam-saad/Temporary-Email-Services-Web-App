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

// Create base64 authorization header once
const authHeader = `Basic ${Buffer.from(API_KEY).toString('base64')}`;

interface ImprovMXResponse {
  emails: ImprovMXEmail[];
}

export async function POST(request: Request) {
  if (!API_KEY || !EMAIL_USER) {
    return NextResponse.json(
      { error: "Missing configuration" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { email, expireTime } = body;
    
    if (!email || !expireTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Set up email forwarding
    try {
      await axios.post(
        `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases`,
        {
          alias: email.split('@')[0],
          forward: EMAIL_USER
        },
        {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
        }
      );

      // Store in memory
      const expiration = Date.now() + (expireTime * 60 * 1000);
      emailStore[email] = { messages: [], expiresAt: expiration };

      return NextResponse.json({
        email,
        expiresAt: expiration,
        success: true
      });
    } catch (error: any) {
      console.error('ImprovMX Error:', error.response?.data || error);
      return NextResponse.json(
        { error: "Failed to set up email forwarding" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  try {
    if (!emailStore[email]) {
      emailStore[email] = {
        messages: [],
        expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
      };
    }

    const response = await axios.get<ImprovMXResponse>(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/emails`,
      {
        headers: {
          'Authorization': authHeader,
        },
        params: { to: email }
      }
    );

    if (response.data.emails) {
      const messages: EmailMessage[] = response.data.emails.map((mail) => ({
        id: mail.id,
        from: mail.from,
        subject: mail.subject,
        content: mail.html || mail.text || '',
        receivedAt: new Date(mail.date).getTime()
      }));
      
      emailStore[email].messages = messages;
    }

    return NextResponse.json({
      messages: emailStore[email].messages
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
} 