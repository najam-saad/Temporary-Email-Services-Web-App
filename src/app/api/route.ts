import { NextResponse } from 'next/server';
import axios from 'axios';
import { emailStore } from '@/utils/email';

if (!process.env.IMPROVMX_API_KEY) {
  throw new Error('IMPROVMX_API_KEY is not defined in environment variables');
}

export async function POST(request: Request) {
  const body = await request.json();
  const { email, expireTime } = body;
  
  if (!email || !expireTime) {
    return NextResponse.json({ error: "Missing email or expireTime" }, { status: 400 });
  }
  
  const expiration = Date.now() + expireTime * 60000;
  emailStore[email] = { messages: [], expiresAt: expiration };

  return NextResponse.json({ email, expiresAt: expiration });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.IMPROVMX_API_KEY;
    const response = await axios.get(`https://api.improvmx.com/v3/emails/${email}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching emails: ", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
} 