import nodemailer from 'nodemailer';

// SMTP Configuration
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email store
export const emailStore: {
  [key: string]: {
    messages: Array<{
      from: string;
      subject: string;
      content: string;
      receivedAt: number;
    }>;
    expiresAt: number;
  };
} = {}; 