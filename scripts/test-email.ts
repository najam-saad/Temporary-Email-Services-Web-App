import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testEmailService() {
  try {
    console.log('Testing with configuration:');
    console.log('DOMAIN:', process.env.DOMAIN);
    console.log('Has API Key:', !!process.env.IMPROVMX_API_KEY);
    console.log('Has Email User:', !!process.env.EMAIL_USER);

    // Generate email
    console.log('\nGenerating email...');
    const response = await axios.post('http://localhost:3000/api', {
      email: `test${Date.now()}@${process.env.DOMAIN}`,
      expireTime: 5
    });
    
    console.log('Response:', response.data);
    const { email } = response.data;

    if (!email) {
      throw new Error('No email generated');
    }

    console.log('\nGenerated email:', email);
    console.log('Waiting 5 seconds before checking inbox...');
    
    // Wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check inbox
    console.log('\nChecking inbox...');
    const inboxResponse = await axios.get(`http://localhost:3000/api?email=${email}`);
    console.log('Inbox response:', inboxResponse.data);

    // Test sending email
    console.log('\nTesting email forwarding...');
    const testResponse = await axios.get(
      `https://api.improvmx.com/v3/domains/${process.env.DOMAIN}/aliases/${email.split('@')[0]}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.IMPROVMX_API_KEY}`).toString('base64')}`,
        }
      }
    );
    console.log('Forwarding test response:', testResponse.data);

  } catch (error: any) {
    console.error('\nTest failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

testEmailService(); 