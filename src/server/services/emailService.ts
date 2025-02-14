import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import { parse as parseEmail } from 'email-address';

const prisma = new PrismaClient();

const EMAIL_EXPIRY_MINUTES = 20;
const MAX_REQUESTS_PER_HOUR = 10;
const BLOCKED_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];

export class EmailService {
  private static validateEmail(email: string): boolean {
    try {
      const parsed = parseEmail(email);
      if (!parsed) return false;
      
      // Check if domain is blocked
      const domain = email.split('@')[1].toLowerCase();
      if (BLOCKED_DOMAINS.includes(domain)) return false;
      
      return true;
    } catch {
      return false;
    }
  }

  private static async checkRateLimit(ipAddress: string): Promise<boolean> {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const rateLimit = await prisma.rateLimit.findUnique({
      where: { key: ipAddress }
    });

    if (!rateLimit) {
      await prisma.rateLimit.create({
        data: {
          key: ipAddress,
          count: 1,
          resetAt: new Date(now.getTime() + 60 * 60 * 1000)
        }
      });
      return true;
    }

    if (rateLimit.resetAt < now) {
      await prisma.rateLimit.update({
        where: { key: ipAddress },
        data: {
          count: 1,
          resetAt: new Date(now.getTime() + 60 * 60 * 1000)
        }
      });
      return true;
    }

    if (rateLimit.count >= MAX_REQUESTS_PER_HOUR) {
      return false;
    }

    await prisma.rateLimit.update({
      where: { key: ipAddress },
      data: { count: rateLimit.count + 1 }
    });

    return true;
  }

  static async createTempEmail(ipAddress: string, userAgent?: string): Promise<{ email: string; expiresAt: Date } | null> {
    // Check rate limit
    const canProceed = await this.checkRateLimit(ipAddress);
    if (!canProceed) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Generate random email
    const timestamp = Date.now();
    const hash = createHash('md5')
      .update(`${timestamp}${ipAddress}${Math.random()}`)
      .digest('hex')
      .slice(0, 10);
    
    const email = `${hash}@tempfreeemail.com`;

    // Validate email
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email generated');
    }

    const expiresAt = new Date(Date.now() + EMAIL_EXPIRY_MINUTES * 60 * 1000);

    try {
      const tempEmail = await prisma.tempEmail.create({
        data: {
          email,
          expiresAt,
          ipAddress,
          userAgent
        }
      });

      return {
        email: tempEmail.email,
        expiresAt: tempEmail.expiresAt
      };
    } catch (error) {
      console.error('Error creating temporary email:', error);
      return null;
    }
  }

  static async getMessages(email: string): Promise<any[]> {
    const tempEmail = await prisma.tempEmail.findUnique({
      where: { email },
      include: {
        messages: {
          where: {
            isSpam: false
          },
          orderBy: {
            receivedAt: 'desc'
          }
        }
      }
    });

    if (!tempEmail || tempEmail.expiresAt < new Date()) {
      throw new Error('Email not found or expired');
    }

    return tempEmail.messages;
  }

  static async cleanupExpiredEmails(): Promise<void> {
    const now = new Date();
    
    try {
      await prisma.tempEmail.deleteMany({
        where: {
          expiresAt: {
            lt: now
          }
        }
      });
    } catch (error) {
      console.error('Error cleaning up expired emails:', error);
    }
  }

  static async isEmailBlocked(email: string): Promise<boolean> {
    const tempEmail = await prisma.tempEmail.findUnique({
      where: { email }
    });

    return !tempEmail || tempEmail.isBlocked || tempEmail.expiresAt < new Date();
  }

  static async blockEmail(email: string, reason?: string): Promise<void> {
    await prisma.tempEmail.update({
      where: { email },
      data: { isBlocked: true }
    });
  }
} 