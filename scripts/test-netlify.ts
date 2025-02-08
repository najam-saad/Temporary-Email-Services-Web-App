import axios from 'axios';
import * as dotenv from 'dotenv';
import { setTimeout } from 'timers/promises';
dotenv.config({ path: '.env.local' });

const BASE_URL = 'https://67a6e15d2e8776830d7e9a3c--deluxe-gumdrop-48056b.netlify.app';
const API_URL = `${BASE_URL}/api`;
const API_KEY = process.env.IMPROVMX_API_KEY;
const DOMAIN = process.env.DOMAIN || 'tempfreeemail.com';

// Fix authorization header
const authHeader = Buffer.from(`api:${API_KEY}`).toString('base64');

async function testNetlifyDeployment(): Promise<void> {
  try {
    console.log('\n🔍 Testing deployment...');
    console.log('URL:', API_URL);
    
    // Test API endpoint first
    try {
      const healthCheck = await axios.get(API_URL);
      console.log('API endpoint check:', healthCheck.status === 200 ? '✅ OK' : '❌ Failed');
      console.log('Health check response:', healthCheck.data);
    } catch (error: any) {
      console.log('❌ API endpoint not accessible:', error.message);
      if (error.response) {
        console.log('Response:', error.response.data);
      }
      return;
    }

    // Generate email
    console.log('\n📧 Generating temporary email...');
    try {
      console.log('Making POST request to:', API_URL);
      const createResponse = await axios.post(API_URL, {
        expireTime: 10
      });

      console.log('Create response:', {
        status: createResponse.status,
        data: createResponse.data
      });

      if (!createResponse.data?.email) {
        console.error('Invalid response:', createResponse.data);
        throw new Error('No email address in response');
      }

      const email = createResponse.data.email;
      console.log('Generated email:', email);

      // Test ImprovMX setup
      console.log('\n🔄 Testing ImprovMX setup...');
      const alias = email.split('@')[0];
      
      const aliasResponse = await axios.get(
        `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases/${alias}`,
        {
          headers: { 'Authorization': `Basic ${authHeader}` }
        }
      );

      console.log('Alias exists:', aliasResponse.data);

      // Wait for emails
      console.log('\n📨 Please send a test email to:', email);
      console.log('Waiting 45 seconds for email delivery...');
      await setTimeout(45000);

      // Check emails
      console.log('\n📬 Checking emails...');
      try {
        const emailsResponse = await axios.get(
          `https://api.improvmx.com/v3/domains/${DOMAIN}/logs`,
          {
            headers: { 'Authorization': `Basic ${authHeader}` },
            params: {
              recipient: email,
              limit: 10
            }
          }
        );

        console.log('API Response:', {
          success: emailsResponse.data.success,
          totalLogs: emailsResponse.data.logs?.length,
          firstLogRecipient: emailsResponse.data.logs?.[0]?.recipient
        });

        if (emailsResponse.data.logs?.length > 0) {
          console.log('✅ Emails found:', emailsResponse.data.logs.length);
          emailsResponse.data.logs.forEach((log: any) => {
            console.log(`
              From: ${log.sender?.address || 'Unknown'}
              To: ${log.recipient?.address || 'Unknown'}
              Subject: ${log.subject || '(No Subject)'}
              Date: ${new Date(log.created).toLocaleString()}
              Message ID: ${log.messageId}
              ${log.url ? `Download URL: ${log.url}` : ''}
              Recipient matches: ${(log.recipient?.address || '').toLowerCase() === email.toLowerCase()}
            `);
          });
        } else {
          console.log('ℹ️ No emails found yet');
        }

        // Check website inbox
        console.log('\n🌐 Checking website inbox...');
        const inboxResponse = await axios.get(API_URL, {
          params: { email }
        });
        
        console.log('Website inbox response:', {
          messages: inboxResponse.data.messages,
          count: inboxResponse.data.count,
          debug: inboxResponse.data.debug,
          requestedEmail: email
        });

      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error checking emails:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
          });
        } else {
          throw error;
        }
      }

    } catch (error: any) {
      console.error('Error generating email:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      throw error;
    }

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('\n❌ Test failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
    } else {
      console.error('\n❌ Test failed:', error);
    }
  }
}

// Add environment check
console.log('Environment check:', {
  API_KEY: !!process.env.IMPROVMX_API_KEY,
  DOMAIN: process.env.DOMAIN,
  EMAIL_USER: !!process.env.EMAIL_USER
});

testNetlifyDeployment().catch(console.error); 