import { NextResponse } from 'next/server';

interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  receivedAt: number;
}

// In-memory storage for messages (replace with your database in production)
const messageStore: Record<string, EmailMessage[]> = {};

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email);
    
    // Get messages for this email address
    const messages = messageStore[email] || [];

    return NextResponse.json({
      messages,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// Helper function to add a new message (you'll need to expose this via another endpoint)
export async function POST(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email);
    const body = await request.json();
    const { from, subject, content } = body;

    if (!from || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newMessage: EmailMessage = {
      id: Math.random().toString(36).substring(2),
      from,
      to: email,
      subject,
      content,
      receivedAt: Date.now()
    };

    // Initialize array if it doesn't exist
    if (!messageStore[email]) {
      messageStore[email] = [];
    }

    // Add new message
    messageStore[email].push(newMessage);

    return NextResponse.json({
      message: 'Message received successfully',
      id: newMessage.id
    });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
} 