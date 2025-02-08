import { NextResponse } from 'next/server';
import axios from 'axios';
import { emailStore } from '@/utils/email';

// Add this interface at the top of the file
interface ImprovMXEmail {
  id: string;
  from: string;
  subject: string;
  html?: string;
  text?: string;
  date: string;
}

if (!process.env.IMPROVMX_API_KEY) {
  throw new Error('IMPROVMX_API_KEY is not defined in environment variables');
}

const API_KEY = process.env.IMPROVMX_API_KEY;
const DOMAIN = 'tempmail.org'; // Replace with your actual domain

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, expireTime } = body;
    
    console.log('Received request:', { email, expireTime });
    
    if (!email || !expireTime) {
      return NextResponse.json(
        { error: "Missing email or expireTime" },
        { status: 400 }
      );
    }
    
    const expiration = Date.now() + expireTime * 60000;
    emailStore[email] = { messages: [], expiresAt: expiration };

    // Set up email forwarding with ImprovMX
    try {
      await axios.post(
        `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases`,
        {
          alias: email.split('@')[0],
          forward: process.env.EMAIL_USER
        },
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(API_KEY).toString('base64')}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to set up email forwarding:', error);
    }

    return NextResponse.json({ 
      email,
      expiresAt: expiration,
      success: true 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  try {
    // Check emailStore first
    if (emailStore[email]) {
      return NextResponse.json({
        messages: emailStore[email].messages
      });
    }

    // Then check ImprovMX
    const response = await axios.get(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/emails`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`,
        },
        params: {
          to: email
        }
      }
    );

    // Store emails in our local store
    if (response.data.emails) {
      emailStore[email].messages = response.data.emails.map((email: ImprovMXEmail) => ({
        id: email.id,
        from: email.from,
        subject: email.subject,
        content: email.html || email.text || '',
        receivedAt: new Date(email.date).getTime()
      }));
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