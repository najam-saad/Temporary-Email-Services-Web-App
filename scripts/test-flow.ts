import axios from 'axios';
import * as dotenv from 'dotenv';
import { setTimeout } from 'timers/promises';
dotenv.config({ path: '.env.local' });

async function testEmailFlow() {
  try {
    // 1. Generate email
    const response = await axios.post('http://localhost:3000/api', {
      expireTime: 10
    });
    const { email } = response.data;
    console.log('\n📧 Test email created:', email);

    // 2. Send test email (manual step)
    console.log('\n⚠️ Please send a test email to:', email);
    console.log('Waiting 30 seconds for email delivery...');
    await setTimeout(30000);

    // 3. Check Gmail
    console.log('\n📥 Check your Gmail (najam.saad99@gmail.com) for the forwarded email');

    // 4. Check ImprovMX
    const authHeader = Buffer.from(`api:${process.env.IMPROVMX_API_KEY}`).toString('base64');
    const improvmxResponse = await axios.get(
      `https://api.improvmx.com/v3/domains/${process.env.DOMAIN}/emails`,
      {
        headers: { 'Authorization': `Basic ${authHeader}` },
        params: { to: email }
      }
    );
    console.log('\n📨 ImprovMX emails:', improvmxResponse.data.emails?.length || 0);

    // 5. Check site inbox
    const inboxResponse = await axios.get(`http://localhost:3000/api?email=${email}`);
    console.log('\n📬 Site inbox:', inboxResponse.data.messages?.length || 0, 'messages');

  } catch (error: any) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testEmailFlow(); 