import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, duration } = body;

    if (!email || !duration) {
      return NextResponse.json(
        { message: 'Email and duration are required' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Validate the email format
    // 2. Store the email with expiration in your database/cache
    // 3. Set up any necessary email forwarding

    // For now, we'll just return the generated email
    return NextResponse.json({
      email,
      expiresAt: Date.now() + (duration * 60 * 1000), // Convert minutes to milliseconds
      message: 'Email generated successfully'
    });
  } catch (error) {
    console.error('Email generation error:', error);
    return NextResponse.json(
      { message: 'Failed to generate email' },
      { status: 500 }
    );
  }
} 