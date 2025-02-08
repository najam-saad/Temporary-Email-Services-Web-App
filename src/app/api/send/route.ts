import { NextResponse } from 'next/server';
import { transporter } from '@/utils/email';

export async function POST(request: Request) {
  try {
    const { to, subject, content } = await request.json();

    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: content,
      html: content
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
} 