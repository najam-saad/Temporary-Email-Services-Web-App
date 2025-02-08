import { NextResponse } from 'next/server';
import { transporter } from '@/utils/email';

export async function POST(request: Request) {
  try {
    const { email, expireTime } = await request.json();

    if (!email || !expireTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const generatedEmail = `${Math.random().toString(36).substring(2, 8)}@yourdomain.com`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Temporary Email is Ready',
        text: `Your temporary email: ${generatedEmail} will expire in ${expireTime} minutes.`,
        html: `
          <h1>Your Temporary Email is Ready</h1>
          <p>Email: <strong>${generatedEmail}</strong></p>
          <p>Expires in: ${expireTime} minutes</p>
        `
      });

      return NextResponse.json({ 
        email: generatedEmail,
        expiresAt: Date.now() + (expireTime * 60 * 1000),
        success: true 
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      return NextResponse.json(
        { error: "Failed to send email" },
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