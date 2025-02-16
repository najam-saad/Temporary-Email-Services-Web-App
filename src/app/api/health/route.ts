import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  console.log('Next.js health check requested');
  try {
    console.log('Environment variables check:');
    console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    console.log('- DIRECT_URL:', process.env.DIRECT_URL ? 'Set' : 'Not set');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    // Try to connect to the database
    console.log('Attempting database connection...');
    await prisma.$connect();
    
    // Simple query to verify connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('Database query successful:', result);
    
    return NextResponse.json(
      { 
        status: 'healthy',
        message: 'Service is running',
        database: 'connected',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    
    return NextResponse.json(
      { 
        status: 'unhealthy',
        message: 'Service is not healthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }
} 