import { NextResponse } from 'next/server';
import axios from 'axios';
import { emailStore } from '@/utils/email';

if (!process.env.IMPROVMX_API_KEY) {
  throw new Error('IMPROVMX_API_KEY is not defined in environment variables');
}

const API_KEY = process.env.IMPROVMX_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, expireTime } = body;
    
    console.log('Received request:', { email, expireTime }); // Debug log
    
    if (!email || !expireTime) {
      return NextResponse.json(
        { error: "Missing email or expireTime" },
        { status: 400 }
      );
    }
    
    const expiration = Date.now() + expireTime * 60000;
    emailStore[email] = { messages: [], expiresAt: expiration };

    // Verify ImprovMX setup
    try {
      await axios.get(`https://api.improvmx.com/v3/domains`, {
        headers: {
          Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`,
        },
      });
    } catch (error) {
      console.error('ImprovMX Error:', error);
      return NextResponse.json(
        { error: "Email service configuration error" },
        { status: 500 }
      );
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
    const response = await axios.get(`https://api.improvmx.com/v3/emails/${email}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching emails: ", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
} 