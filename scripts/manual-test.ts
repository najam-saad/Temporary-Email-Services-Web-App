import axios from 'axios';
import * as dotenv from 'dotenv';
import { setTimeout } from 'timers/promises';
dotenv.config({ path: '.env.local' });

async function manualTest() {
  try {
    // Generate email with test flag
    const response = await axios.post('http://localhost:3000/api', {
      expireTime: 5,
      test: true // This will trigger a test email
    });

    const { email } = response.data;
    console.log('\n📧 Test email address:', email);
    console.log('⏳ Waiting 10 seconds for email delivery...\n');
    
    await setTimeout(10000);

    // Check inbox
    const inboxResponse = await axios.get(`http://localhost:3000/api?email=${email}`);
    console.log('📥 Inbox contents:', JSON.stringify(inboxResponse.data, null, 2));

  } catch (error: any) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

manualTest(); 