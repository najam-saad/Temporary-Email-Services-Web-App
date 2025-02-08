import axios from 'axios';
import * as dotenv from 'dotenv';
import { setTimeout } from 'timers/promises';
dotenv.config({ path: '.env.local' });

const DEPLOYED_URL = 'https://67a6d435bcc6fc625fe4af83--deluxe-gumdrop-48056b.netlify.app';

async function testDeployed() {
  try {
    // 1. Generate email
    console.log('Generating email...');
    const response = await axios.post(`${DEPLOYED_URL}/api`, {
      expireTime: 10
    });
    const { email } = response.data;
    console.log('Generated email:', email);

    // 2. Wait for email
    console.log('\nPlease send a test email to:', email);
    console.log('Waiting 30 seconds...');
    await setTimeout(30000);

    // 3. Check ImprovMX directly
    const authHeader = Buffer.from(`api:${process.env.IMPROVMX_API_KEY}`).toString('base64');
    const improvmxResponse = await axios.get(
      `https://api.improvmx.com/v3/domains/${process.env.DOMAIN}/emails`,
      {
        headers: { 'Authorization': `Basic ${authHeader}` },
        params: { to: email }
      }
    );
    console.log('\nImprovMX emails:', improvmxResponse.data);

    // 4. Check deployed inbox
    const inboxResponse = await axios.get(`${DEPLOYED_URL}/api?email=${email}`);
    console.log('\nDeployed inbox response:', inboxResponse.data);

  } catch (error: any) {
    console.error('Test failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

testDeployed(); 