import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import { setTimeout } from 'timers/promises';
dotenv.config({ path: '.env.local' });

// Define interfaces inline
interface ImprovMXEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
  date: string;
}

interface ImprovMXResponse {
  emails: ImprovMXEmail[];
}

interface ImprovMXAlias {
  alias: string;
  forward: string;
  id: number;
  created: number;
}

interface ImprovMXAliasResponse {
  alias: ImprovMXAlias;
  success: boolean;
}

const BASE_URL = 'https://67a6e15d2e8776830d7e9a3c--deluxe-gumdrop-48056b.netlify.app';
const API_URL = `${BASE_URL}/api`;

async function testNetlifyDeployment(): Promise<void> {
  try {
    // 1. Test environment
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

    // 2. Generate email
    console.log('\n📧 Generating temporary email...');
    const createResponse = await axios.post(API_URL, {
      expireTime: 10
    });
    
    const { email } = createResponse.data;
    console.log('Generated email:', email);

    // 3. Test ImprovMX setup
    console.log('\n🔄 Testing ImprovMX setup...');
    const authHeader = Buffer.from(`api:${process.env.IMPROVMX_API_KEY}`).toString('base64');
    
    // Check alias creation
    try {
      const aliasCheck = await axios.get(
        `https://api.improvmx.com/v3/domains/${process.env.DOMAIN}/aliases/${email.split('@')[0]}`,
        {
          headers: { 'Authorization': `Basic ${authHeader}` }
        }
      );
      console.log('Alias exists:', aliasCheck.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log('Alias not found, creating...');
        const createAlias = await axios.post(
          `https://api.improvmx.com/v3/domains/${process.env.DOMAIN}/aliases`,
          {
            alias: email.split('@')[0],
            forward: process.env.EMAIL_USER
          },
          {
            headers: {
              'Authorization': `Basic ${authHeader}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Alias created:', createAlias.data);
      } else {
        throw error;
      }
    }

    // 4. Send test email instructions
    console.log('\n📨 Please send a test email to:', email);
    console.log('Waiting 45 seconds for email delivery...');
    await setTimeout(45000); // Increased wait time

    // 5. Check emails
    console.log('\n📬 Checking emails...');
    try {
      const emailsResponse = await axios.get(
        `https://api.improvmx.com/v3/domains/${process.env.DOMAIN}/logs`,
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

      // 6. Check website inbox
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

      if (inboxResponse.data.debug) {
        console.log('\nDebug information:');
        console.log('Total logs:', inboxResponse.data.debug.totalLogs);
        console.log('Filtered count:', inboxResponse.data.debug.filteredCount);
        console.log('First log:', JSON.stringify(inboxResponse.data.debug.firstLog, null, 2));
        console.log('Search params:', inboxResponse.data.debug.params);
      }

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

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('\n❌ Test failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } else {
      console.error('\n❌ Test failed:', error);
    }
  }
}

testNetlifyDeployment().catch(console.error); 