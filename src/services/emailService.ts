import { transporter } from '@/utils/email';

export async function sendConfirmationEmail(email: string, expireTime: number) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Temporary Email is Ready',
      text: `Your temporary email will expire in ${expireTime} minutes.`,
      html: `
        <h1>Your Temporary Email is Ready</h1>
        <p>Your email address: <strong>${email}</strong></p>
        <p>This email will expire in ${expireTime} minutes.</p>
      `
    });
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
} 