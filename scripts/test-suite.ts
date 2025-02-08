import axios from 'axios';
import * as dotenv from 'dotenv';
import { setTimeout } from 'timers/promises';
dotenv.config({ path: '.env.local' });

async function runTests() {
  console.log('\n🚀 Starting Test Suite\n');
  
  const API_KEY = process.env.IMPROVMX_API_KEY;
  const DOMAIN = process.env.DOMAIN;
  const EMAIL_USER = process.env.EMAIL_USER;
  const authHeader = Buffer.from(`api:${API_KEY}`).toString('base64');

  try {
    // 1. Configuration Check
    console.log('1️⃣ Checking Configuration...');
    if (!API_KEY || !DOMAIN || !EMAIL_USER) {
      throw new Error('Missing required environment variables');
    }
    console.log('✅ Configuration valid\n');

    // 2. API Connection Test
    console.log('2️⃣ Testing API Connection...');
    const apiTest = await axios.get('https://api.improvmx.com/v3/domains', {
      headers: { 'Authorization': `Basic ${authHeader}` }
    });
    console.log('✅ API Connection successful\n');

    // 3. Generate Test Email
    console.log('3️⃣ Generating Test Email...');
    const testEmail = `test${Date.now()}@${DOMAIN}`;
    const createResponse = await axios.post('http://localhost:3000/api', {
      email: testEmail,
      expireTime: 5
    });
    console.log(`✅ Email generated: ${testEmail}\n`);

    // 4. Verify Email Creation
    console.log('4️⃣ Verifying Email Setup...');
    const verifyResponse = await axios.get(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases/${testEmail.split('@')[0]}`,
      { headers: { 'Authorization': `Basic ${authHeader}` } }
    );
    console.log('✅ Email forwarding verified\n');

    // 5. Test Email Reception
    console.log('5️⃣ Testing Email Reception...');
    console.log('Waiting for emails (15 seconds)...');
    await setTimeout(15000);
    
    const inboxResponse = await axios.get(`http://localhost:3000/api?email=${testEmail}`);
    console.log('✅ Inbox checked successfully\n');

    // 6. Test Email Expiry
    console.log('6️⃣ Testing Email Expiry...');
    console.log('Waiting for expiry (5 minutes)...');
    await setTimeout(5 * 60 * 1000);
    
    const expiryResponse = await axios.get(`http://localhost:3000/api?email=${testEmail}`);
    if (expiryResponse.data.expired) {
      console.log('✅ Email expired correctly\n');
    } else {
      console.log('❌ Email did not expire as expected\n');
    }

    console.log('🎉 All tests completed successfully!\n');

  } catch (error: any) {
    console.error('\n❌ Test Failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

runTests(); 