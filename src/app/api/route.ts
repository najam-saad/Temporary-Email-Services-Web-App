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

// Fix the authorization header format
const authHeader = Buffer.from(`api:${API_KEY}`).toString('base64');

interface ImprovMXResponse {
  emails: ImprovMXEmail[];
}

export async function POST(request: Request) {
  console.log('Starting email generation...');
  console.log('Config:', { DOMAIN, EMAIL_USER: EMAIL_USER ? 'set' : 'not set', API_KEY: API_KEY ? 'set' : 'not set' });

  if (!API_KEY || !EMAIL_USER) {
    console.error('Missing configuration:', { hasApiKey: !!API_KEY, hasEmailUser: !!EMAIL_USER });
    return NextResponse.json(
      { error: "Missing API key or email configuration" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { email, expireTime } = body;
    
    console.log('Received request:', { email, expireTime });
    
    if (!email || !expireTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      console.log('Setting up ImprovMX forwarding...');
      const alias = email.split('@')[0];
      
      const improvmxResponse = await axios.post(
        `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases`,
        {
          alias,
          forward: EMAIL_USER
        },
        {
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/json'
          },
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
      console.error('ImprovMX Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Return a more user-friendly error
      const errorMessage = error.response?.status === 401 
        ? "Email service authentication failed" 
        : "Failed to set up email forwarding";
        
      return NextResponse.json(
        { error: errorMessage },
        { status: error.response?.status || 500 }
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