import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Mock API responses
export const mockMessages = [
  {
    id: '1',
    from: 'test@example.com',
    subject: 'Test Email 1',
    content: 'Test content 1',
    receivedAt: Date.now(),
    url: 'https://api.improvmx.com/v3/download/1'
  },
  {
    id: '2',
    sender: { address: 'test2@example.com' },
    subject: 'Test Email 2',
    created: Date.now() - 1000,
    url: 'https://api.improvmx.com/v3/download/2'
  }
];

// Setup MSW server
export const server = setupServer(
  http.get('/api', ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    return HttpResponse.json({
      messages: mockMessages,
      count: mockMessages.length,
      debug: {
        email,
        messagesCount: mockMessages.length,
        logsCount: 0,
        combinedCount: mockMessages.length
      }
    });
  }),

  http.post('/api', () => {
    return HttpResponse.json({
      email: 'test@tempfreeemail.com',
      expiresAt: Date.now() + 600000,
      success: true
    });
  })
); 