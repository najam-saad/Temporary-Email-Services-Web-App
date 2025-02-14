import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { simpleParser, AddressObject } from 'mailparser';
import { PrismaClient } from '@prisma/client';
import { EmailService } from './services/emailService';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('subscribe', async (email: string) => {
    // Join room based on email
    socket.join(email);
    console.log(`Client subscribed to ${email}`);

    // Send initial messages
    try {
      const messages = await EmailService.getMessages(email);
      socket.emit('messages', messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
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

// Email receiving endpoint for Mailcow
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

    // Store email in database
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

    // Emit to subscribed clients
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
}, 60000); // Run every minute

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 