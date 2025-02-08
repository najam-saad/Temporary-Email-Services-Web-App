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

const NETLIFY_URL = 'https://deluxe-gumdrop-48056b.netlify.app';

async function testNetlifyDeployment(): Promise<void> {
  try {
    // 1. Test environment
    console.log('\n🔍 Testing Netlify deployment...');
    console.log('URL:', NETLIFY_URL);
    console.log('Environment:', {
      hasApiKey: !!process.env.IMPROVMX_API_KEY,
      hasDomain: !!process.env.DOMAIN,
      hasEmailUser: !!process.env.EMAIL_USER
    });

    // 2. Generate email
    console.log('\n📧 Generating temporary email...');
    const createResponse = await axios.post(`${NETLIFY_URL}/api`, {
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
            to: email,
            limit: 10
          }
        }
      );

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
          `);
        });
      } else {
        console.log('ℹ️ No emails found yet');
      }

      // 6. Check website inbox
      console.log('\n🌐 Checking website inbox...');
      const inboxResponse = await axios.get(`${NETLIFY_URL}/api`, {
        params: { email }
      });
      console.log('Website inbox:', inboxResponse.data);

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