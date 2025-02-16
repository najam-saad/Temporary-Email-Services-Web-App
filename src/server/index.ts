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
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  allowEIO3: true,
  path: '/socket.io',
  cookie: false
});

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn', 'info']
});

// Add raw body parsing for emails
app.use('/api/incoming-email', express.raw({ type: 'message/rfc822', limit: '10mb' }));
app.use(express.json());

// Enable CORS for Express
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
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

// Health check endpoint with detailed diagnostics
app.get('/health', async (req, res) => {
  const startTime = Date.now();
  console.log(`Health check requested at ${new Date().toISOString()}`);
  
  try {
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      DIRECT_URL: process.env.DIRECT_URL ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_HOST: process.env.DATABASE_URL?.includes('postgres.railway.internal') ? 'Internal' : 'External'
    };
    console.log('Environment status:', envCheck);
    
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    const responseTime = Date.now() - startTime;
    
    res.status(200).json({ 
      status: 'healthy',
      message: 'Service is running',
      database: 'connected',
      environment: envCheck,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      message: 'Service is not healthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('subscribe', async (email: string) => {
    console.log(`Client ${socket.id} subscribed to email: ${email}`);
    socket.join(email);
    
    try {
      const messages = await EmailService.getMessages(email);
      socket.emit('messages', messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      socket.emit('error', { message: 'Failed to fetch messages' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Email receiving endpoint
app.post('/api/incoming-email', async (req, res) => {
  try {
    if (!req.body || req.body.length === 0) {
      console.error('No email data received');
      return res.status(400).json({ error: 'No email data received' });
    }

    console.log('Received raw email data, length:', req.body.length);
    const rawEmail = req.body.toString();
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

    console.log('Parsed email:', { to, from, subject });

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

    console.log('Stored message:', message.id);
    io.to(to).emit('new-message', message);
    res.status(200).json({ success: true, messageId: message.id });
  } catch (error: any) {
    console.error('Failed to process email:', error);
    res.status(500).json({ error: 'Failed to process email', details: error.message });
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

// Retry configuration
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function connectWithRetry(attempt = 1): Promise<void> {
  try {
    console.log(`Database connection attempt ${attempt} of ${MAX_RETRIES}...`);
    await prisma.$connect();
    console.log('✓ Database connection established');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('✓ Database query successful:', result);
  } catch (error) {
    console.error(`Connection attempt ${attempt} failed:`, error);
    
    if (attempt < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectWithRetry(attempt + 1);
    }
    
    throw error;
  }
}

// Initialize database connection before starting server
async function startServer() {
  console.log('=== Server Startup ===');
  console.log('Time:', new Date().toISOString());
  console.log('Environment Variables:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- PORT:', PORT);
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  console.log('- DIRECT_URL:', process.env.DIRECT_URL ? 'Set' : 'Not set');
  
  // Log database connection details (sanitized)
  const dbUrl = process.env.DATABASE_URL || '';
  console.log('Database Connection Details:');
  console.log('- Host:', dbUrl.includes('@') ? dbUrl.split('@')[1].split(':')[0] : 'Not found');
  console.log('- Database:', dbUrl.split('/').pop() || 'Not found');
  console.log('- SSL:', dbUrl.includes('sslmode=') ? 'Enabled' : 'Not specified');
  
  try {
    await connectWithRetry();
    
    httpServer.listen(PORT, () => {
      console.log(`\n✓ Server running on port ${PORT}`);
      console.log('✓ Server startup complete\n');
    });
  } catch (error) {
    console.error('\n❌ Failed to start server after maximum retries');
    console.error('Final error details:');
    if (error instanceof Error) {
      console.error('- Name:', error.name);
      console.error('- Message:', error.message);
      console.error('- Stack:', error.stack);
    }
    
    // Exit with error after ensuring logs are written
    process.stdout.write('', () => {
      process.exit(1);
    });
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unhandled rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('\n❌ Uncaught exception:', error);
});

// Start server
console.log('\nStarting server...');
startServer(); 