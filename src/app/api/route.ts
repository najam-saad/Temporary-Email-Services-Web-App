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
  console.log('GET request received');
  
  if (!API_KEY) {
    console.error('API key missing');
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
    // Initialize store if needed
    if (!emailStore[email]) {
      emailStore[email] = {
        messages: [],
        expiresAt: Date.now() + (60 * 60 * 1000)
      };
    }

    // Check if email has expired
    if (emailStore[email].expiresAt < Date.now()) {
      return NextResponse.json({
        messages: [],
        expired: true
      });
    }

    try {
      const response = await axios.get<ImprovMXResponse>(
        `https://api.improvmx.com/v3/domains/${DOMAIN}/emails`,
        {
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/json'
          },
          params: { to: email }
        }
      );

      console.log('ImprovMX response:', response.data);

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
    } catch (error: any) {
      console.error('ImprovMX Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Return stored messages if ImprovMX fails
      return NextResponse.json({
        messages: emailStore[email].messages,
        warning: "Could not fetch new messages"
      });
    }
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
} 