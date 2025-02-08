import axios from 'axios';
import * as dotenv from 'dotenv';
import { setTimeout } from 'timers/promises';
dotenv.config({ path: '.env.local' });

async function fullTest() {
  console.log('\n🚀 Starting Full Functionality Test\n');
  
  try {
    // 1. Generate temporary email
    console.log('1️⃣ Generating temporary email...');
    const response = await axios.post('http://localhost:3000/api', {
      expireTime: 10 // 10 minutes
    });
    
    const { email } = response.data;
    console.log(`✅ Generated email: ${email}\n`);

    // 2. Send test emails
    console.log('2️⃣ Sending test emails...');
    
    // You can manually send an email to this address now
    console.log(`📧 Please send a test email to: ${email}`);
    console.log('⏳ Waiting 30 seconds for email delivery...\n');
    
    await setTimeout(30000); // Wait 30 seconds

    // 3. Check inbox
    console.log('3️⃣ Checking inbox...');
    const inboxResponse = await axios.get(`http://localhost:3000/api?email=${email}`);
    
    if (inboxResponse.data.messages && inboxResponse.data.messages.length > 0) {
      console.log('✅ Emails received:');
      inboxResponse.data.messages.forEach((msg: any) => {
        console.log(`
          From: ${msg.from}
          Subject: ${msg.subject}
          Received: ${new Date(msg.receivedAt).toLocaleString()}
        `);
      });
    } else {
      console.log('ℹ️ No emails received yet');
    }

    // 4. Verify forwarding
    console.log('\n4️⃣ Verify in Gmail');
    console.log(`Please check ${process.env.EMAIL_USER} for forwarded emails\n`);

    // 5. Test expiry
    console.log('5️⃣ Testing expiry...');
    console.log('Waiting 1 minute to check expiry status...');
    await setTimeout(60000); // Wait 1 minute

    const expiryCheck = await axios.get(`http://localhost:3000/api?email=${email}`);
    if (expiryCheck.data.expired) {
      console.log('❌ Email has expired (not expected yet)');
    } else {
      console.log('✅ Email still active (as expected)');
    }

    console.log('\n🎉 Test completed successfully!');
    console.log(`
Summary:
- Temporary Email: ${email}
- Forwards to: ${process.env.EMAIL_USER}
- Expiry: ${new Date(response.data.expiresAt).toLocaleString()}
- Received Emails: ${inboxResponse.data.messages?.length || 0}
    `);

  } catch (error: any) {
    console.error('Test failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

fullTest(); 