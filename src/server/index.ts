import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { simpleParser } from 'mailparser';
import { PrismaClient } from '@prisma/client';
import { EmailService } from './services/emailService';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
});

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Basic root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  console.log('Health check requested');
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
    
    // Send success response
    res.status(200).json({ 
      status: 'healthy',
      message: 'Service is running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
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
    
    res.status(500).json({ 
      status: 'unhealthy',
      message: 'Service is not healthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('subscribe', async (email: string) => {
    socket.join(email);
    console.log(`Client subscribed to ${email}`);

    try {
      const messages = await EmailService.getMessages(email);
      socket.emit('messages', messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      socket.emit('error', { message: 'Failed to fetch messages' });
    }
  });

  socket.on('unsubscribe', (email: string) => {
    socket.leave(email);
    console.log(`Client unsubscribed from ${email}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Email receiving endpoint
app.post('/api/incoming-email', async (req, res) => {
  try {
    const rawEmail = req.body;
    const parsed = await simpleParser(rawEmail);
    
    const to = Array.isArray(parsed.to) 
      ? parsed.to[0]?.text || ''
      : parsed.to?.text || '';
    const from = Array.isArray(parsed.from)
      ? parsed.from[0]?.text || ''
      : parsed.from?.text || '';
    const subject = parsed.subject || '';
    const content = parsed.text || '';
    const html = parsed.html || '';

    const message = await prisma.message.create({
      data: {
        from,
        subject,
        content,
        html,
        tempEmail: {
          connect: {
            email: to
          }
        },
        headers: parsed.headers as any
      }
    });

    io.to(to).emit('new-message', message);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing incoming email:', error);
    res.status(500).json({ error: 'Failed to process email' });
  }
});

// Cleanup expired emails periodically
setInterval(async () => {
  try {
    await EmailService.cleanupExpiredEmails();
  } catch (error) {
    console.error('Error cleaning up expired emails:', error);
  }
}, 60000);

const PORT = process.env.PORT || 3001;

// Initialize database connection before starting server
async function startServer() {
  console.log('=== Server Startup ===');
  console.log('Time:', new Date().toISOString());
  console.log('Environment Variables:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- PORT:', PORT);
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  console.log('- DIRECT_URL:', process.env.DIRECT_URL ? 'Set' : 'Not set');
  
  // Flush stdout to ensure logs are visible
  process.stdout.write('');

  try {
    console.log('\nAttempting initial database connection...');
    await prisma.$connect();
    console.log('✓ Database connection established');

    // Test query to verify connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('✓ Database query successful:', result);

    httpServer.listen(PORT, () => {
      console.log(`\n✓ Server running on port ${PORT}`);
      console.log('✓ Server startup complete\n');
      
      // Flush stdout again after startup
      process.stdout.write('');
    });
  } catch (error) {
    console.error('\n❌ Failed to start server:', error);
    if (error instanceof Error) {
      console.error('Error details:');
      console.error('- Message:', error.message);
      console.error('- Name:', error.name);
      console.error('- Stack:', error.stack);
    }
    
    // Ensure error logs are visible before exiting
    process.stdout.write('');
    
    // Exit with error after a short delay to ensure logs are written
    setTimeout(() => process.exit(1), 1000);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unhandled rejection:', error);
  // Ensure logs are written
  process.stdout.write('');
});

process.on('uncaughtException', (error) => {
  console.error('\n❌ Uncaught exception:', error);
  // Ensure logs are written
  process.stdout.write('');
});

// Start server
console.log('\nStarting server...');
startServer(); 