import { PrismaClient, TempEmail } from '@prisma/client';
import { createHash } from 'crypto';
import { parse as parseEmail } from 'email-address';
import crypto from 'crypto';

const prisma = new PrismaClient();

const EMAIL_EXPIRY_MINUTES = 20;
const MAX_REQUESTS_PER_HOUR = 20;
const BLOCKED_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
const ALLOWED_DOMAIN = 'tempfreeemail.com';

export class EmailService {
  private static validateEmail(email: string): boolean {
    try {
      const [localPart, domain] = email.split('@');
      
      // Check local part length and characters
      if (!localPart || localPart.length < 3 || localPart.length > 64) {
        console.log('Local part validation failed:', localPart);
        return false;
      }

      // Validate local part characters
      const localPartRegex = /^[a-f0-9]+$/;
      if (!localPartRegex.test(localPart)) {
        console.log('Local part character validation failed:', localPart);
        return false;
      }

      // Validate domain
      if (domain !== 'tempfreeemail.com') {
        console.log('Domain validation failed:', domain);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email validation error:', error);
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

  static async createTempEmail(ipAddress: string, userAgent?: string, duration: number = 20): Promise<{ email: string; expiresAt: Date }> {
    try {
      // Check rate limit
      const canProceed = await this.checkRateLimit(ipAddress);
      if (!canProceed) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Generate random email
      const randomBytes = crypto.randomBytes(5).toString('hex');
      const email = `${randomBytes}@${ALLOWED_DOMAIN}`;
      console.log('Generated email:', email);

      // Validate email
      if (!this.validateEmail(email)) {
        console.error('Email validation failed:', email);
        throw new Error('Invalid email generated');
      }

      // Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + duration);
      console.log('Email will expire at:', expiresAt);

      const tempEmail = await prisma.tempEmail.create({
        data: {
          email,
          expiresAt,
          ipAddress,
          userAgent
        }
      });

      console.log('Email created in database:', tempEmail.email);
      return {
        email: tempEmail.email,
        expiresAt: tempEmail.expiresAt
      };
    } catch (error) {
      console.error('Error creating temp email:', error);
      throw error;
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