import axios from 'axios';
import * as dotenv from 'dotenv';
import { setTimeout } from 'timers/promises';
dotenv.config({ path: '.env.local' });

const NETLIFY_URL = 'https://deluxe-gumdrop-48056b.netlify.app';

async function testNetlifyDeployment() {
  try {
    // 1. Test environment
    console.log('\n🔍 Testing Netlify deployment...');
    console.log('URL:', NETLIFY_URL);
    
    // 2. Generate email
    console.log('\n📧 Generating temporary email...');
    const createResponse = await axios.post(`${NETLIFY_URL}/api`, {
      expireTime: 10
    });
    
    const { email } = createResponse.data;
    console.log('Generated email:', email);
    console.log('Response:', createResponse.data);

    // 3. Test ImprovMX setup
    console.log('\n🔄 Testing ImprovMX setup...');
    const authHeader = Buffer.from(`api:${process.env.IMPROVMX_API_KEY}`).toString('base64');
    const aliasResponse = await axios.get(
      `https://api.improvmx.com/v3/domains/${process.env.DOMAIN}/aliases/${email.split('@')[0]}`,
      {
        headers: { 'Authorization': `Basic ${authHeader}` }
      }
    );
    console.log('Alias setup:', aliasResponse.data);

    // 4. Check inbox (initial)
    console.log('\n📥 Checking initial inbox state...');
    const initialInbox = await axios.get(`${NETLIFY_URL}/api?email=${email}`);
    console.log('Initial inbox:', initialInbox.data);

    // 5. Wait for manual email
    console.log('\n⏳ Please send a test email to:', email);
    console.log('Waiting 45 seconds for email delivery...');
    await setTimeout(45000);

    // 6. Check ImprovMX emails
    console.log('\n📨 Checking ImprovMX emails...');
    const emailsResponse = await axios.get(
      `https://api.improvmx.com/v3/domains/${process.env.DOMAIN}/emails`,
      {
        headers: { 'Authorization': `Basic ${authHeader}` },
        params: { to: email }
      }
    );
    console.log('ImprovMX emails:', emailsResponse.data);

    // 7. Check inbox (final)
    console.log('\n📬 Checking final inbox state...');
    const finalInbox = await axios.get(`${NETLIFY_URL}/api?email=${email}`);
    console.log('Final inbox:', finalInbox.data);

  } catch (error: any) {
    console.error('\n❌ Test failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
  }
}

testNetlifyDeployment(); 