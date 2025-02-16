import { NextResponse } from 'next/server';
import { EmailService } from '../../../server/services/emailService';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { duration } = body;
    const headersList = headers();
    
    if (!duration || duration < 10 || duration > 30) {
      return NextResponse.json(
        { message: 'Duration must be between 10 and 30 minutes' },
        { status: 400 }
      );
    }

    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown';
    const userAgent = headersList.get('user-agent') || undefined;

    const result = await EmailService.createTempEmail(ipAddress, userAgent, duration);
    
    if (!result) {
      return NextResponse.json(
        { message: 'Failed to generate email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      email: result.email,
      expiresAt: result.expiresAt.getTime(),
      message: 'Email generated successfully'
    });
  } catch (error) {
    console.error('Email generation error:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Failed to generate email',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 